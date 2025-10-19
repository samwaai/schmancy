import { $LitElement } from '@mixins/index'
import { area } from '../area'
import { html } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import { fromEvent, merge, takeUntil, tap, filter } from 'rxjs'
import { on } from './hook'
import style from './sheet.scss?inline'
import { SchmancySheetPosition, sheet } from './sheet.service'

@customElement('schmancy-sheet')
export default class SchmancySheet extends $LitElement(style) {
	@property({ type: String, reflect: true }) uid!: string
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

		const timing = {
			duration: 250,
			easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
			fill: 'forwards' as FillMode,
		}

		// Animate overlay
		this.overlayEl.animate([{ opacity: 0 }, { opacity: 0.8 }], timing)

		// Animate content based on position
		const transform =
			this.position === SchmancySheetPosition.Side
				? [{ transform: 'translateX(100%)' }, { transform: 'translateX(0)' }]
				: [{ transform: 'translateY(100%)' }, { transform: 'translateY(0)' }]

		this.contentEl.animate(transform, timing)
	}

	private animateOut() {
		if (!this.overlayEl || !this.contentEl) return

		const timing = {
			duration: 250,
			easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
			fill: 'forwards' as FillMode,
		}

		// Animate overlay
		this.overlayEl.animate([{ opacity: 0.8 }, { opacity: 0 }], timing)

		// Animate content based on position
		const transform =
			this.position === SchmancySheetPosition.Side
				? [{ transform: 'translateX(0)' }, { transform: 'translateX(100%)' }]
				: [{ transform: 'translateY(0)' }, { transform: 'translateY(100%)' }]

		this.contentEl.animate(transform, timing)
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

		merge(popState$, keyUp$, render$).pipe(takeUntil(this.disconnecting)).subscribe()
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
		const sheetClasses = `fixed inset-0 z-[999] flex ${this.open ? '' : 'invisible pointer-events-none'}`

		const overlayClasses = `overlay absolute inset-0 bg-surface-container/10 backdrop-blur-xs ${this.lock ? '' : 'cursor-pointer'}`

		const contentClasses =
			this.position === SchmancySheetPosition.Side
				? 'content h-full min-w-[320px] max-w-[90vw] w-fit ml-auto overflow-hidden z-10'
				: 'content w-fit max-w-full mt-auto rounded-t-2xl max-h-[90vh] overflow-hidden z-10'

		const bodyClasses = this.position === SchmancySheetPosition.Side ? 'max-h-screen' : 'max-h-[90vh]'

		return html`
			<div class=${sheetClasses} role="dialog" aria-hidden=${!this.open} aria-modal=${this.open} tabindex="0">
				<div class=${overlayClasses} @click=${this.handleOverlayClick}></div>
				<div class=${contentClasses}>
					<schmancy-surface rounded="left" fill="all" id="body" class="overflow-auto ${bodyClasses}" type="surface">
						<schmancy-scroll>
							<schmancy-area class="relative inset-0" name=${this.uid}>
								<slot></slot>
							</schmancy-area>
						</schmancy-scroll>
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
