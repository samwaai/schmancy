import { $LitElement } from '@mixins/index'
import { area } from '../area'
import { html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'
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

	@on('open')
	onOpenChange(_oldValue: boolean, newValue: boolean) {
		if (newValue) {
			this.lastFocusedElement = document.activeElement as HTMLElement
			// Use native inert attribute to prevent focus outside sheet
			this.setBackgroundInert(true)
			this.focus()
		} else {
			this.setBackgroundInert(false)
			this.lastFocusedElement?.focus()
			this.lastFocusedElement = null
		}
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
		const sheetClasses = {
			sheet: true,
			'sheet--open': this.open,
			'sheet--locked': this.lock,
		}

		const overlayClasses = {
			overlay: true,
			'overlay--interactive': !this.lock,
		}

		return html`
			<div
				class=${classMap(sheetClasses)}
				role="dialog"
				aria-hidden=${!this.open}
				aria-modal=${this.open}
				tabindex="0"
			>
				<div class=${classMap(overlayClasses)} @click=${this.handleOverlayClick}></div>
				<div class="content w-full" data-position=${this.position}>
					<schmancy-surface rounded="left" fill="all" id="body" class="overflow-auto" type="surface">
						<schmancy-scroll>
							<schmancy-area name=${this.uid}>
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
