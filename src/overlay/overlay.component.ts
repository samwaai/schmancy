import { $LitElement } from '@mixins/index'
import { css, html, render as litRender, type TemplateResult } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import { when } from 'lit/directives/when.js'
import {
	filter,
	fromEvent,
	merge,
	Subject,
	take,
	takeUntil,
	tap,
} from 'rxjs'
import type { LazyComponent } from '../area/lazy'
import { surfaceAnimation } from './overlay.animations'
import { swipeToDismiss$ } from './overlay.gestures'
import {
	ANCHOR_FIT_PADDING_PX,
	readViewport,
	resolveLayout,
} from './overlay.layout'
import type {
	Anchor,
	CloseReason,
	Content,
	OverlayLayout,
	ShowOptions,
} from './overlay.types'

const MOUNT_POINT_ID = 'overlay-mount'

/**
 * The single overlay element. Hosts a native `<dialog>` in its shadow
 * root for centered/sheet layouts; for anchored, we stay modeless by
 * using `<dialog>` with .show() (non-modal) + explicit positioning.
 *
 * Public lifecycle: the service calls `open()` to mount content and
 * animate in, `close(reason)` to animate out and dismiss. The element
 * dispatches `overlay-close` when closed; the service listens and
 * resolves the caller's Observable.
 */
@customElement('schmancy-overlay')
export class SchmancyOverlay extends $LitElement(css`
	:host {
		position: fixed;
		inset: 0;
		z-index: var(--schmancy-overlay-z, 10000);
		display: contents;
		pointer-events: none;
	}
	dialog {
		margin: 0;
		padding: 0;
		border: 0;
		background: transparent;
		overflow: visible;
		max-width: none;
		max-height: none;
		pointer-events: auto;
	}
	dialog::backdrop {
		background: rgba(12, 12, 16, 0.28);
		backdrop-filter: blur(18px) saturate(150%);
		-webkit-backdrop-filter: blur(18px) saturate(150%);
	}
	.surface {
		position: fixed;
		pointer-events: auto;
		max-width: calc(100vw - 2rem);
		max-height: 90dvh;
		overflow: auto;
		border-radius: var(--schmancy-sys-shape-corner-large, 16px);
		background: var(--schmancy-sys-color-surface, #ffffff);
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
		max-height: 90dvh;
		width: 100%;
		border-radius: var(--schmancy-sys-shape-corner-large, 16px) var(--schmancy-sys-shape-corner-large, 16px) 0 0;
		padding-bottom: env(safe-area-inset-bottom);
	}
	.surface[data-layout='anchored'] {
		max-width: min(480px, calc(100vw - 2rem));
		box-shadow: 0 12px 32px -8px rgba(0, 0, 0, 0.28);
	}
	.drag-handle {
		display: flex;
		justify-content: center;
		padding: 8px 0 4px;
		touch-action: none;
		cursor: grab;
	}
	.drag-handle::before {
		content: '';
		width: 40px;
		height: 4px;
		border-radius: 999px;
		background: var(--schmancy-sys-color-outline-variant, #cac4cf);
	}
	@media (prefers-reduced-motion: reduce) {
		.surface { box-shadow: var(--schmancy-sys-elevation-2, 0 2px 6px rgba(0,0,0,0.2)); }
	}
`) {
	@property({ type: String, reflect: true }) layout: OverlayLayout = 'centered'
	@property({ type: Boolean, reflect: true }) dismissable = true
	@property({ type: Boolean, reflect: true }) modal = true

	@query('dialog') private _dialog!: HTMLDialogElement
	@query('.surface') private _surface!: HTMLDivElement

	/** Close trigger for the service; emits the reason + detail payload. */
	private readonly _closed$ = new Subject<{ reason: CloseReason; result?: unknown }>()

	private _mounted = false
	private _closing = false

	/** Service subscribes to this to know when the overlay dismissed. */
	get closed$(): import('rxjs').Observable<{ reason: CloseReason; result?: unknown }> {
		return this._closed$.asObservable()
	}

	/**
	 * Mount content and animate in. Called by the service after the
	 * element is attached to the DOM. Returns a promise that resolves
	 * when the entrance animation completes.
	 */
	async open(content: Content, options: ShowOptions): Promise<void> {
		if (this._mounted) throw new Error('schmancy-overlay: open() called twice on the same element')
		this._mounted = true

		this.dismissable = options.dismissable !== false

		// Resolve Content → HTMLElement and mount into the slot host.
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
		const resolved = resolveLayout({
			anchor: options.anchor,
			content: contentSize,
			viewport,
		})
		this.layout = resolved

		// Modal defaults per layout, with the caller's `modal` as escape hatch.
		const isModal =
			options.modal ?? (resolved === 'centered' || resolved === 'sheet')
		this.modal = isModal

		await this.updateComplete

		// Open the native <dialog>.
		if (isModal) {
			this._dialog.showModal()
		} else {
			this._dialog.show()
		}

		// For anchored mode, compute position from the anchor's rect.
		if (resolved === 'anchored' && options.anchor) {
			this.positionAnchored(options.anchor)
		}

		// Wire close triggers: native 'close' event, structured 'close' from
		// content, backdrop click, swipe gesture. Signal aborts close too.
		this.wireCloseTriggers(options.signal)

		// Play entrance animations.
		await this.playEnterAnimations()
	}

	/** Play exit animations then close the native dialog. */
	async close(reason: CloseReason, result?: unknown): Promise<void> {
		if (this._closing || !this._mounted) return
		this._closing = true
		try {
			await this.playExitAnimations()
		} catch {
			// animation can be cancelled — not an error.
		}
		try {
			this._dialog?.close()
		} catch {
			// Already closed natively — fine.
		}
		this._closed$.next({ reason, result })
		this._closed$.complete()
	}

	/* ---------------- close trigger wiring ------------------------------ */

	private wireCloseTriggers(signal?: AbortSignal): void {
		const disconnecting = this.disconnecting

		// Native 'close' from <dialog>. Runs on Esc, on form[method=dialog]
		// submit, and on our own close() call. returnValue carries the native
		// string result.
		fromEvent(this._dialog, 'close')
			.pipe(
				filter(() => !this._closing),
				tap(() => {
					const rv = this._dialog.returnValue
					if (rv !== '' && rv !== undefined) {
						void this.close('native-submit', rv)
					} else {
						void this.close('escape')
					}
				}),
				takeUntil(disconnecting),
			)
			.subscribe()

		// Structured close — content dispatches CustomEvent('close', { detail }).
		fromEvent<CustomEvent>(this, 'close')
			.pipe(
				// Filter out the native <dialog>.close event (which is a plain Event,
				// no .detail — but it still bubbles into this listener target as 'close').
				filter((e) => e instanceof CustomEvent),
				// Don't re-enter if we're the source.
				filter((e) => e.target !== this._dialog),
				tap((e) => {
					e.stopPropagation()
					void this.close('structured', e.detail)
				}),
				takeUntil(disconnecting),
			)
			.subscribe()

		// Esc keydown — native dialog handles; we only intercept to honor `dismissable: false`.
		fromEvent<KeyboardEvent>(this._dialog, 'cancel')
			.pipe(
				tap((e) => {
					if (!this.dismissable) e.preventDefault()
				}),
				takeUntil(disconnecting),
			)
			.subscribe()

		// Backdrop click — native backdrop clicks bubble to the dialog.
		fromEvent<MouseEvent>(this._dialog, 'click')
			.pipe(
				filter((e) => this.dismissable && e.target === this._dialog),
				tap(() => void this.close('backdrop')),
				takeUntil(disconnecting),
			)
			.subscribe()

		// Swipe-to-dismiss for sheet layout only.
		if (this.layout === 'sheet' && this.dismissable) {
			const dragHandle = this.renderRoot.querySelector<HTMLElement>('.drag-handle')
			swipeToDismiss$({
				surface: this._surface,
				dragHandle,
				until$: merge(disconnecting, this._closed$),
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
						takeUntil(disconnecting),
					)
					.subscribe()
			}
		}
	}

	/* ---------------- anchored positioning ----------------------------- */

	private positionAnchored(anchor: Anchor): void {
		const rect = getAnchorRect(anchor)
		const surfaceRect = this._surface.getBoundingClientRect()
		const viewport = { w: window.innerWidth, h: window.innerHeight }
		const pad = ANCHOR_FIT_PADDING_PX

		// Prefer placing below the anchor; flip above if it doesn't fit.
		let top = rect.bottom + 8
		if (top + surfaceRect.height > viewport.h - pad) {
			const above = rect.top - 8 - surfaceRect.height
			if (above >= pad) top = above
			else top = Math.max(pad, viewport.h - pad - surfaceRect.height)
		}

		// Prefer aligning the surface's left to the anchor's left; shift to keep in viewport.
		let left = rect.left
		if (left + surfaceRect.width > viewport.w - pad) {
			left = viewport.w - pad - surfaceRect.width
		}
		if (left < pad) left = pad

		this._surface.style.top = `${top}px`
		this._surface.style.left = `${left}px`
		this._surface.style.transform = 'none'
	}

	/* ---------------- animations --------------------------------------- */

	private async playEnterAnimations(): Promise<void> {
		const dialogEl = this._dialog
		const surface = this._surface
		if (!dialogEl || !surface) return

		// Backdrop animates on the dialog itself via the ::backdrop pseudo,
		// which WAAPI can't drive; we rely on CSS transition if desired.
		const spec = surfaceAnimation(this.layout, 'in')
		await surface.animate(spec.keyframes, spec.options).finished.catch(() => undefined)
	}

	private async playExitAnimations(): Promise<void> {
		const surface = this._surface
		if (!surface) return
		const spec = surfaceAnimation(this.layout, 'out')
		await surface.animate(spec.keyframes, spec.options).finished.catch(() => undefined)
	}

	/* ---------------- render ------------------------------------------- */

	protected render(): TemplateResult {
		return html`
			<dialog>
				<section
					class="surface"
					data-layout=${this.layout}
					role="dialog"
					aria-modal=${this.modal ? 'true' : 'false'}
				>
					${when(
						this.layout === 'sheet',
						() => html`<div class="drag-handle" role="button" aria-label="Dismiss" tabindex="0"></div>`,
					)}
					<div id=${MOUNT_POINT_ID}></div>
				</section>
			</dialog>
		`
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
	// TemplateResult path — render via lit's `render`.
	if (isTemplateResult(content)) {
		litRender(content, host)
		return host
	}

	// Already-instantiated element: append directly.
	if (content instanceof HTMLElement) {
		if (props) Object.assign(content, props)
		host.appendChild(content)
		return content
	}

	// LazyComponent: await the module, then recurse with the default export.
	if (isLazy(content)) {
		const mod = await content()
		return mountContent(mod.default, host, props)
	}

	// Class constructor — narrowed by exclusion of TemplateResult / HTMLElement /
	// LazyComponent above; isLazy() false means the remaining `function` branch
	// is a CustomElementConstructor.
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

interface Rect {
	top: number
	left: number
	right: number
	bottom: number
	width: number
	height: number
}

function getAnchorRect(anchor: Anchor): Rect {
	if (anchor instanceof Element) {
		const r = anchor.getBoundingClientRect()
		return { top: r.top, left: r.left, right: r.right, bottom: r.bottom, width: r.width, height: r.height }
	}
	if ('clientX' in anchor && 'clientY' in anchor) {
		return {
			top: anchor.clientY,
			left: anchor.clientX,
			right: anchor.clientX,
			bottom: anchor.clientY,
			width: 0,
			height: 0,
		}
	}
	const pt = anchor as { x: number; y: number }
	return { top: pt.y, left: pt.x, right: pt.x, bottom: pt.y, width: 0, height: 0 }
}
