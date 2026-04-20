import { $LitElement } from '@mixins/index'
import { area } from '../area'
import { html, css } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import { fromEvent, merge, takeUntil, tap, filter } from 'rxjs'
import { on } from './hook'
import { SchmancySheetPosition, sheet } from './sheet.service'
import { BLACKBIRD_EASING, DURATION_ENTER, DURATION_EXIT, DURATION_BACKDROP, EASE_OUT, EASE_IN } from '../utils/animation'

@customElement('schmancy-sheet')
export default class SchmancySheet extends $LitElement(css`
	:host {
		position: fixed;
		inset: 0;
		z-index: var(--schmancy-overlay-z, 999);
		display: none;
	}
	:host([open]) {
		display: block;
	}

	/* Luminous edge glow on sheet panel */
	.content {
		box-shadow: -8px 0 40px -8px color-mix(in srgb, var(--schmancy-sys-color-primary-default) 15%, transparent);
	}

	:host([position='bottom']) .content {
		box-shadow: 0 -8px 40px -8px color-mix(in srgb, var(--schmancy-sys-color-primary-default) 15%, transparent);
	}

	@media (prefers-reduced-motion: reduce) {
		.content { box-shadow: var(--schmancy-sys-elevation-3); }
	}
`) {
	// uid is inherited from $LitElement mixin - auto-generated or set via attribute
	@property({ type: Boolean, reflect: true }) open = false
	@property({ type: String, reflect: true }) position: SchmancySheetPosition = SchmancySheetPosition.Side
	@property({ type: Boolean, reflect: true }) persist = false
	@property({ type: Boolean, reflect: true }) lock = false
	@property({ type: Boolean, reflect: true }) handleHistory = true

	private lastFocusedElement: HTMLElement | null = null
	@query('.overlay') private overlayEl!: HTMLDivElement
	@query('.content') private contentEl!: HTMLDivElement

	@on('open')
	onOpenChange(_oldValue: boolean, newValue: boolean) {
		if (newValue) {
			this.lastFocusedElement = document.activeElement as HTMLElement
			this.setBackgroundInert(true)
			this.animateIn()
			this.focus()
		} else {
			this.animateOut()
			this.setBackgroundInert(false)
			this.lastFocusedElement?.focus()
			this.lastFocusedElement = null
		}
	}

	private animateIn() {
		if (!this.overlayEl || !this.contentEl) return

		this.overlayEl.animate([{ opacity: 0 }, { opacity: 1 }], {
			duration: DURATION_BACKDROP,
			easing: EASE_OUT,
			fill: 'forwards',
		})

		const animation =
			this.position === SchmancySheetPosition.Side
				? [
						{ opacity: 0, transform: 'translateX(100%) scale(0.95)' },
						{ opacity: 1, transform: 'translateX(0) scale(1)' },
					]
				: [
						{ opacity: 0, transform: 'translateY(100%) scale(0.95)' },
						{ opacity: 1, transform: 'translateY(0) scale(1)' },
					]

		this.contentEl.animate(animation, {
			duration: DURATION_ENTER,
			easing: BLACKBIRD_EASING,
			fill: 'forwards',
		})
	}

	private animateOut() {
		if (!this.overlayEl || !this.contentEl) return

		this.overlayEl.animate([{ opacity: 1 }, { opacity: 0 }], {
			duration: DURATION_EXIT,
			easing: EASE_OUT,
			fill: 'forwards',
		})

		const animation =
			this.position === SchmancySheetPosition.Side
				? [
						{ opacity: 1, transform: 'translateX(0) scale(1)' },
						{ opacity: 0, transform: 'translateX(100%) scale(0.98)' },
					]
				: [
						{ opacity: 1, transform: 'translateY(0) scale(1)' },
						{ opacity: 0, transform: 'translateY(100%) scale(0.98)' },
					]

		this.contentEl.animate(animation, {
			duration: DURATION_EXIT,
			easing: EASE_IN,
			fill: 'forwards',
		})
	}

	connectedCallback() {
		super.connectedCallback()
		this.setupEventListeners()
	}

	disconnectedCallback() {
		super.disconnectedCallback()
		this.disconnecting.next(true)
	}

	private setupEventListeners() {
		// Handle browser back button
		const popState$ = fromEvent<PopStateEvent>(window, 'popstate').pipe(
			filter(() => this.handleHistory),
			tap(e => {
				e.preventDefault()
				this.closeSheet()
			}),
		)

		// Handle ESC key
		const keyUp$ = fromEvent<KeyboardEvent>(this, 'keydown').pipe(
			tap(event => {
				if (event.key === 'Escape' && !this.lock && this.open) {
					event.preventDefault()
					event.stopPropagation()
					sheet.dismiss(this.uid)
				}
			}),
		)

		// Handle render events from sheet service
		const render$ = fromEvent<CustomEvent>(window, 'schmancy-sheet-render').pipe(
			filter(e => e.detail.uid === this.uid),
			tap(e => {
				area.push({
					area: this.uid,
					component: e.detail.component,
					props: e.detail.props,
					historyStrategy: 'silent',
				})
			}),
		)

		// Handle dismiss events from sheet service
		const dismiss$ = fromEvent<CustomEvent>(window, 'schmancy-sheet-dismiss').pipe(
			filter(e => e.detail.uid === this.uid),
			tap(() => {
				this.closeSheet()
			}),
		)

		merge(popState$, keyUp$, render$, dismiss$).pipe(takeUntil(this.disconnecting)).subscribe()
	}

	private setBackgroundInert(inert: boolean) {
		const parent = this.parentElement
		if (!parent) return

		Array.from(parent.children).forEach(child => {
			if (child !== this && child instanceof HTMLElement) {
				child.toggleAttribute('inert', inert)
			}
		})
	}

	closeSheet() {
		this.open = false
		this.dispatchEvent(new CustomEvent('close'))
	}

	override focus() {
		// delegatesFocus in shadowRootOptions handles automatic focus
		// Just focus first element with autofocus attribute if present
		const element = this.querySelector('[autofocus]')
		if (element instanceof HTMLElement) {
			element.focus()
		}
	}

	private handleOverlayClick = (e: Event) => {
		e.stopPropagation()
		if (!this.lock) {
			sheet.dismiss(this.uid)
		}
	}

	render() {
		const sheetClasses = `absolute inset-0 flex h-full`

		const overlayClasses = `overlay absolute inset-0 bg-surface-container/10 backdrop-blur-lg backdrop-saturate-150 ${this.lock ? '' : 'cursor-pointer'}`

		const contentClasses =
			this.position === SchmancySheetPosition.Side
				? 'content h-full min-w-[320px] max-w-[90vw] w-fit ml-auto z-10'
				: 'content w-full mt-auto rounded-t-2xl max-h-[90vh] z-10'

		const surfaceClasses =
			this.position === SchmancySheetPosition.Side
				? 'h-full overflow-auto'
				: 'max-h-[90vh] overflow-auto'

		return html`
			<div class=${sheetClasses} role="dialog" aria-hidden=${!this.open} aria-modal=${this.open} tabindex="0">
				<div class=${overlayClasses} @click=${this.handleOverlayClick}></div>
				<div class=${contentClasses}>
					<schmancy-surface rounded="left" fill="all" id="body" class=${surfaceClasses} type="solid">
						<schmancy-area class="size-full overflow-auto" name=${this.uid}>
							<slot></slot>
						</schmancy-area>
					</schmancy-surface>
				</div>
			</div>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-sheet': SchmancySheet
	}
}
