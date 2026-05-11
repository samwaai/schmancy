import { SchmancyElement } from '@mixins/index'
import { css, html, render as litRender, type TemplateResult } from 'lit'
import { customElement, property, query, state } from 'lit/decorators.js'
import { when } from 'lit/directives/when.js'
import {
	debounceTime,
	distinctUntilChanged,
	filter,
	fromEvent,
	map,
	merge,
	Subject,
	take,
	takeUntil,
	tap,
} from 'rxjs'
import type { LazyComponent } from '../area/lazy'
import { fromResizeObserver } from '../directives/layout'
import {
	anchorOriginVars,
	flipAnimation,
	surfaceAnimation,
} from './overlay.animations'
import { swipeToDismiss$ } from './overlay.gestures'
import {
	readViewport,
	resolveAnchorRef,
	resolveLayout,
	type ResolvedAnchor,
} from './overlay.layout'
import {
	pickPositioner,
	positionCSSAnchor,
	positionFloatingUI,
	positionPopoverAPI,
} from './overlay.positioning'
import type {
	Anchor,
	CloseReason,
	Content,
	OverlayLayout,
	OverlayTier,
	ShowOptions,
} from './overlay.types'

const MOUNT_POINT_ID = 'overlay-mount'
const RE_RESOLVE_COOLDOWN_MS = 600

/**
 * The single overlay element. Custom `<div>` shell (not a native
 * `<dialog>`) — one backdrop mechanism for all layouts, one focus-trap
 * path, one animation orchestrator. The shell is always rendered; the
 * backdrop only renders when modal. The surface is positioned per tier:
 *
 * - Modal layouts (centered / sheet) → backdrop + surface, focus-trapped,
 *   library-managed z-index.
 * - Anchored 'css-anchor' tier → surface as `popover="auto"` with
 *   CSS Anchor Positioning; native top-layer + light-dismiss.
 * - Anchored 'popover-fui' tier → surface as `popover="auto"` + Floating
 *   UI position math; native top-layer + light-dismiss.
 * - Anchored 'fui-only' tier → surface positioned by Floating UI;
 *   manual click-outside + manual Esc.
 *
 * Public lifecycle: the service calls `open()` to mount content and
 * animate in, `close(reason)` to animate out and dismiss. The element
 * exposes `closed$` (Observable emitting reason + result once) and
 * `tier` / `layout` / `modal` as properties for the stack entry.
 */
@customElement('schmancy-overlay')
export class SchmancyOverlay extends SchmancyElement {
	static styles = [css`
	:host {
		position: fixed;
		inset: 0;
		z-index: var(--schmancy-overlay-z, 10000);
		display: none;
		pointer-events: none;
	}
	:host([active]) {
		display: block;
	}
	.shell {
		position: fixed;
		inset: 0;
		pointer-events: none;
	}
	.backdrop {
		position: fixed;
		inset: 0;
		background: color-mix(in srgb, var(--schmancy-sys-color-surface-container, rgba(12, 12, 16, 0.28)) 60%, transparent);
		backdrop-filter: blur(18px) saturate(150%);
		-webkit-backdrop-filter: blur(18px) saturate(150%);
		pointer-events: auto;
	}
	.surface {
		position: fixed;
		pointer-events: auto;
		max-width: calc(100vw - 2rem);
		max-height: 90dvh;
		overflow: auto;
		border-radius: var(--schmancy-sys-shape-corner-large, 16px);
		background: var(--schmancy-sys-color-surface, #ffffff);
		color: var(--schmancy-sys-color-on-surface, #1a1a1a);
		box-shadow: 0 24px 64px -16px rgba(0, 0, 0, 0.35);
	}
	.surface[data-layout='centered'] {
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
	.surface[data-layout='sheet'] {
		left: 0;
		right: 0;
		bottom: 0;
		max-width: none;
		width: 100%;
		border-radius: var(--schmancy-sys-shape-corner-large, 16px) var(--schmancy-sys-shape-corner-large, 16px) 0 0;
		padding-bottom: env(safe-area-inset-bottom);
	}
	.surface[data-layout='anchored'] {
		max-width: min(480px, calc(100vw - 2rem));
		box-shadow: 0 12px 32px -8px rgba(0, 0, 0, 0.28);
	}
	/* Popover top-layer surfaces escape normal z-index — zero out host
	 * display to avoid two surfaces rendering during transitions. */
	.surface:popover-open {
		margin: 0;
		border: 0;
	}
	@media (prefers-reduced-motion: reduce) {
		.surface {
			box-shadow: var(--schmancy-sys-elevation-2, 0 2px 6px rgba(0, 0, 0, 0.2));
		}
	}
`]

	@property({ type: String, reflect: true }) layout: OverlayLayout = 'centered'
	@property({ type: Boolean, reflect: true }) dismissable = true
	@property({ type: Boolean, reflect: true }) modal = true
	@property({ type: String, reflect: true }) tier: OverlayTier = 'modal'

	@state() private _active = false

	@query('.backdrop') private _backdrop?: HTMLDivElement
	@query('.surface') private _surface!: HTMLElement

	/** Close trigger for the service; emits the reason + detail payload. */
	private readonly _closed$ = new Subject<{ reason: CloseReason; result?: unknown }>()

	private _mounted = false
	private _closing = false
	private _resolvedAnchor?: ResolvedAnchor
	private _rawAnchor?: Anchor
	private _anchorOriginAnchor?: Anchor
	private _positionerTeardown?: () => void
	private _lastFocusedElement: HTMLElement | null = null
	private _inertedSiblings: HTMLElement[] = []
	private _lastReResolveAt = 0

	/** Service subscribes to this to know when the overlay dismissed. */
	get closed$(): import('rxjs').Observable<{ reason: CloseReason; result?: unknown }> {
		return this._closed$.asObservable()
	}

	/**
	 * Mount content and animate in. Called by the service after the
	 * element is attached to the DOM. Resolves when the entrance
	 * animation completes.
	 */
	async open(content: Content, options: ShowOptions): Promise<void> {
		if (this._mounted) throw new Error('schmancy-overlay: open() called twice on the same element')
		this._mounted = true

		this.dismissable = options.dismissable !== false
		this._rawAnchor = options.anchor
		this._anchorOriginAnchor = options.anchor
		this._resolvedAnchor = resolveAnchorRef(options.anchor)

		// Ensure the shell is rendered so the mount point exists.
		this._active = true
		this.setAttribute('active', '')
		await this.updateComplete

		const mount = this.renderRoot.querySelector(`#${MOUNT_POINT_ID}`) as HTMLElement | null
		if (!mount) throw new Error('schmancy-overlay: mount point missing')
		await mountContent(content, mount, options.props)

		// Measure content after mount for layout dispatch.
		const viewport = readViewport()
		const contentSize = {
			width: mount.scrollWidth,
			height: mount.scrollHeight,
		}
		this.layout = resolveLayout({
			anchor: options.anchor,
			content: contentSize,
			viewport,
		})

		// Modal defaults per layout, with the caller's `modal` as escape hatch.
		this.modal =
			options.modal ?? (this.layout === 'centered' || this.layout === 'sheet')

		// Pick the positioning tier. Modal layouts always use the 'modal'
		// tier (custom shell + manual backdrop); anchored uses the CAPS-driven
		// ladder. `modal: true` on an anchored layout stays modal.
		this.tier = this.modal
			? 'modal'
			: this._resolvedAnchor
				? pickPositioner(this._resolvedAnchor)
				: 'modal'

		await this.updateComplete

		// Apply tier-specific positioning. For 'modal' the CSS data-layout
		// attribute + :host styles already place the surface; nothing to do.
		// For anchored tiers we delegate to the positioning module.
		if (this.tier === 'css-anchor' && this._resolvedAnchor?.el && this.shadowRoot) {
			this._positionerTeardown = positionCSSAnchor(this._surface, this._resolvedAnchor, this.shadowRoot, {
				id: `ov-${Math.random().toString(36).slice(2, 10)}`,
				placement: options.preferredPlacement ?? 'bottom-start',
			})
			// Pair with Popover API to get native top-layer + light-dismiss.
			const popoverCleanup = positionPopoverAPI(this._surface)
			const prior = this._positionerTeardown
			this._positionerTeardown = () => {
				popoverCleanup()
				prior()
			}
		} else if (this.tier === 'popover-fui' && this._resolvedAnchor) {
			const popoverCleanup = positionPopoverAPI(this._surface)
			const floatSub = positionFloatingUI(this._surface, this._resolvedAnchor, {
				placement: options.preferredPlacement ?? 'bottom-start',
				offsetPx: 8,
				track: options.track !== false,
			})
				.pipe(takeUntil(this.disconnecting))
				.subscribe()
			this._positionerTeardown = () => {
				popoverCleanup()
				floatSub.unsubscribe()
			}
		} else if (this.tier === 'fui-only' && this._resolvedAnchor) {
			const floatSub = positionFloatingUI(this._surface, this._resolvedAnchor, {
				placement: options.preferredPlacement ?? 'bottom-start',
				offsetPx: 8,
				track: options.track !== false,
			})
				.pipe(takeUntil(this.disconnecting))
				.subscribe()
			this._positionerTeardown = () => floatSub.unsubscribe()
		}

		// Set the anchor-origin CSS vars so the entrance animation blooms
		// from the click point. Must happen AFTER positioning so the
		// surface rect is final.
		this.setAnchorOriginVars()

		// Wire close triggers (focus trap, Esc, backdrop click, etc).
		this.wireFocusTrap()
		this.wireCloseTriggers(options.signal)

		// Watch content for mid-session re-resolves (upward-only + cooldown).
		this.wireResizeObserver(mount)

		// Play entrance animations.
		await this.playEnterAnimations()
	}

	/** Play exit animations then dismiss. */
	async close(reason: CloseReason, result?: unknown): Promise<void> {
		if (this._closing || !this._mounted) return
		this._closing = true
		try {
			await this.playExitAnimations()
		} catch {
			// animation cancelled mid-flight — not an error.
		}
		this.releaseFocusTrap()
		if (this._positionerTeardown) {
			try {
				this._positionerTeardown()
			} catch {
				// cleanup shouldn't throw; ignore anything that does.
			}
			this._positionerTeardown = undefined
		}
		this._active = false
		this.removeAttribute('active')
		this._closed$.next({ reason, result })
		this._closed$.complete()
	}

	/* ---------------- render ------------------------------------------- */

	protected render(): TemplateResult {
		if (!this._active) return html``
		return html`
			<div class="shell" part="shell">
				${when(
					this.modal,
					() => html`<div class="backdrop" part="backdrop" @click=${this.onBackdropClick}></div>`,
				)}
				<section
					class="surface"
					part="surface"
					data-layout=${this.layout}
					data-tier=${this.tier}
					role=${this.modal ? 'dialog' : 'region'}
					aria-modal=${this.modal ? 'true' : 'false'}
					tabindex="-1"
				>
					<div id=${MOUNT_POINT_ID}></div>
				</section>
			</div>
		`
	}

	private onBackdropClick = (): void => {
		if (this.dismissable) void this.close('backdrop')
	}

	/* ---------------- anchor-origin bloom ------------------------------ */

	private setAnchorOriginVars(): void {
		const surface = this._surface
		if (!surface) return
		const rect = surface.getBoundingClientRect()
		const vars =
			this.layout === 'centered' && !this._anchorOriginAnchor
				? { '--schmancy-overlay-origin-x': '50%', '--schmancy-overlay-origin-y': '50%' }
				: this.layout === 'sheet' && !this._anchorOriginAnchor
					? { '--schmancy-overlay-origin-x': '50%', '--schmancy-overlay-origin-y': '100%' }
					: anchorOriginVars(this._anchorOriginAnchor, rect)
		for (const [k, v] of Object.entries(vars)) {
			surface.style.setProperty(k, v)
		}
	}

	/* ---------------- focus trap --------------------------------------- */

	private wireFocusTrap(): void {
		if (!this.modal) return
		this._lastFocusedElement = (document.activeElement as HTMLElement) ?? null
		const parent = this.parentElement
		if (parent) {
			this._inertedSiblings = []
			for (const child of Array.from(parent.children)) {
				if (child !== this && child instanceof HTMLElement && !child.inert) {
					child.inert = true
					this._inertedSiblings.push(child)
				}
			}
		}
		// Focus the surface or the first [autofocus] child.
		queueMicrotask(() => {
			const auto = this._surface?.querySelector<HTMLElement>('[autofocus]')
			;(auto ?? this._surface)?.focus()
		})
	}

	private releaseFocusTrap(): void {
		for (const el of this._inertedSiblings) {
			el.inert = false
		}
		this._inertedSiblings = []
		try {
			this._lastFocusedElement?.focus?.()
		} catch {
			// trigger may be detached now; no-op.
		}
		this._lastFocusedElement = null
	}

	/* ---------------- close triggers ----------------------------------- */

	private wireCloseTriggers(signal?: AbortSignal): void {
		const until = this.disconnecting

		// Structured close — content dispatches CustomEvent('close', { detail }).
		fromEvent<CustomEvent>(this, 'close')
			.pipe(
				filter((e) => e instanceof CustomEvent),
				tap((e) => {
					e.stopPropagation()
					void this.close('structured', e.detail)
				}),
				takeUntil(until),
			)
			.subscribe()

		// Native <form method="dialog"> submission bubbles up as a regular
		// submit event with `submitter.value` (returnValue proxy for our
		// custom shell). Capture it and resolve with the string value.
		fromEvent<SubmitEvent>(this, 'submit')
			.pipe(
				filter((e) => {
					const form = e.target as HTMLFormElement | null
					return !!form && form.method === 'dialog'
				}),
				tap((e) => {
					e.preventDefault()
					const submitter = (e as SubmitEvent & { submitter?: HTMLButtonElement | HTMLInputElement })
						.submitter
					const value = submitter?.value ?? ''
					void this.close('native-submit', value)
				}),
				takeUntil(until),
			)
			.subscribe()

		// Manual Esc — all tiers. Modal has no native dismiss; anchored
		// tiers use `popover="manual"` so the browser doesn't auto-Esc them
		// either (the auto popover-stack would close ancestor overlays when
		// a nested overlay opens — see positionPopoverAPI's comment).
		fromEvent<KeyboardEvent>(document, 'keydown')
			.pipe(
				filter((e) => e.key === 'Escape'),
				tap((e) => {
					if (!this.dismissable) {
						e.preventDefault()
						return
					}
					e.preventDefault()
					void this.close('escape')
				}),
				takeUntil(until),
			)
			.subscribe()

		// Manual outside-click — all anchored tiers. Modal layouts have a
		// backdrop that catches outside clicks via `onBackdropClick`; the
		// anchored tiers (no backdrop) need a document-level pointerdown
		// listener that ignores clicks whose composedPath includes the
		// surface or anchor. Use composedPath membership (not
		// `Node.contains`) so clicks on elements inside slotted /
		// shadow-DOM descendants of the surface are correctly classified
		// as "inside".
		if (this.tier !== 'modal') {
			fromEvent<PointerEvent>(document, 'pointerdown', { capture: true })
				.pipe(
					filter((e) => {
						if (!this.dismissable) return false
						const path = e.composedPath()
						if (this._surface && path.includes(this._surface)) return false
						if (this._resolvedAnchor?.el && path.includes(this._resolvedAnchor.el)) return false
						return true
					}),
					take(1),
					tap(() => void this.close('backdrop')),
					takeUntil(until),
				)
				.subscribe()
		}

		// Swipe-to-dismiss for sheet layout only. No visual drag handle —
		// the gesture starts from the top 40px of the surface (see
		// DRAG_START_TOP_PX in overlay.gestures). Escape + backdrop click
		// cover the other dismiss paths via the modal-tier listeners above.
		if (this.layout === 'sheet' && this.dismissable) {
			swipeToDismiss$({
				surface: this._surface,
				until$: merge(until, this._closed$),
			})
				.pipe(take(1))
				.subscribe(() => void this.close('swipe'))
		}

		// AbortSignal — standard cancellation input.
		if (signal) {
			if (signal.aborted) {
				queueMicrotask(() => void this.close('abort'))
			} else {
				fromEvent(signal, 'abort')
					.pipe(
						take(1),
						tap(() => void this.close('abort')),
						takeUntil(until),
					)
					.subscribe()
			}
		}
	}

	/* ---------------- ResizeObserver FLIP re-resolve ------------------- */

	private wireResizeObserver(mount: HTMLElement): void {
		fromResizeObserver(mount)
			.pipe(
				map((entries) => {
					const entry = entries[0]
					if (!entry) return null
					const box = entry.contentRect
					return { w: box.width, h: box.height }
				}),
				filter((v): v is { w: number; h: number } => v !== null),
				distinctUntilChanged((a, b) => a.w === b.w && a.h === b.h),
				debounceTime(80),
				takeUntil(merge(this.disconnecting, this._closed$)),
			)
			.subscribe((size) => this.maybeReResolve(size))
	}

	private async maybeReResolve(size: { w: number; h: number }): Promise<void> {
		if (this._closing) return
		const viewport = readViewport()
		const next = resolveLayout({
			anchor: this._rawAnchor,
			content: { width: size.w, height: size.h },
			viewport,
		})
		if (next === this.layout) return
		// Cooldown: prevent churn-driven bouncing.
		const now = performance.now()
		if (now - this._lastReResolveAt < RE_RESOLVE_COOLDOWN_MS) return
		// Upward-only ratchet: centered → sheet on content-grow is OK,
		// sheet → centered on content-shrink is ignored.
		if (!isUpwardTransition(this.layout, next)) return

		// FLIP: capture `before` rect, apply new layout, capture `after`,
		// animate the inverse transform.
		const surface = this._surface
		const before = surface.getBoundingClientRect()
		this.layout = next
		await this.updateComplete
		const after = surface.getBoundingClientRect()
		const spec = flipAnimation(before, after)
		try {
			await surface.animate(spec.keyframes, spec.options).finished
		} catch {
			// cancelled — not an error.
		}
		this._lastReResolveAt = performance.now()
	}

	/* ---------------- animations --------------------------------------- */

	private async playEnterAnimations(): Promise<void> {
		const surface = this._surface
		if (!surface) return
		const spec = surfaceAnimation(this.layout, 'in')
		const tasks: Promise<unknown>[] = [
			surface.animate(spec.keyframes, spec.options).finished.catch(() => undefined),
		]
		const backdrop = this._backdrop
		if (this.modal && backdrop) {
			tasks.push(
				backdrop
					.animate(
						[{ opacity: 0 }, { opacity: 1 }],
						{ duration: spec.options.duration, easing: 'ease-out', fill: 'forwards' },
					)
					.finished.catch(() => undefined),
			)
		}
		await Promise.all(tasks)
	}

	private async playExitAnimations(): Promise<void> {
		const surface = this._surface
		if (!surface) return
		const spec = surfaceAnimation(this.layout, 'out')
		const tasks: Promise<unknown>[] = [
			surface.animate(spec.keyframes, spec.options).finished.catch(() => undefined),
		]
		const backdrop = this._backdrop
		if (this.modal && backdrop) {
			tasks.push(
				backdrop
					.animate(
						[{ opacity: 1 }, { opacity: 0 }],
						{ duration: spec.options.duration, easing: 'ease-in', fill: 'forwards' },
					)
					.finished.catch(() => undefined),
			)
		}
		await Promise.all(tasks)
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-overlay': SchmancyOverlay
	}
}

/* ======================================================================= *
 *                         content mounting helpers                         *
 * ======================================================================= */

async function mountContent(
	content: Content,
	host: HTMLElement,
	props?: Record<string, unknown>,
): Promise<HTMLElement> {
	// TemplateResult — render via lit's `render`.
	if (isTemplateResult(content)) {
		litRender(content, host)
		return host
	}

	// Already-instantiated element — append directly.
	if (content instanceof HTMLElement) {
		if (props) Object.assign(content, props)
		host.appendChild(content)
		return content
	}

	// LazyComponent — await the module, recurse with the default export.
	if (isLazy(content)) {
		const mod = await content()
		return mountContent(mod.default, host, props)
	}

	// Class constructor.
	if (typeof content === 'function') {
		const Ctor = content as unknown as { new (): HTMLElement }
		const el = new Ctor()
		if (props) Object.assign(el, props)
		host.appendChild(el)
		return el
	}

	// Tag name.
	if (typeof content === 'string') {
		const el = document.createElement(content)
		if (props) Object.assign(el, props)
		host.appendChild(el)
		return el
	}

	throw new Error('schmancy-overlay: unsupported content type')
}

function isTemplateResult(x: unknown): x is TemplateResult {
	return typeof x === 'object' && x !== null && '_$litType$' in x
}

function isLazy(x: unknown): x is LazyComponent {
	return typeof x === 'function' && ('preload' in (x as object) || '_promise' in (x as object))
}

function isUpwardTransition(from: OverlayLayout, to: OverlayLayout): boolean {
	// Upward ladder: centered < sheet. anchored → sheet is also upward
	// (overflow went past threshold). anchored → centered is NOT upward.
	if (from === 'centered' && to === 'sheet') return true
	if (from === 'anchored' && to === 'sheet') return true
	return false
}
