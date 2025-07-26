import { $LitElement } from '@mixins/index'
import { html } from 'lit'
import { customElement, property, query, queryAssignedElements } from 'lit/decorators.js'
import { cache } from 'lit/directives/cache.js'
import { classMap } from 'lit/directives/class-map.js'
import { ifDefined } from 'lit/directives/if-defined.js'
import { live } from 'lit/directives/live.js'
import { ref, createRef } from 'lit/directives/ref.js'
import { when } from 'lit/directives/when.js'
import { fromEvent, merge, of, take, takeUntil, tap } from 'rxjs'
import { on } from './hook'
import style from './sheet.scss?inline'
import {
	SchmancySheetPosition,
	SheetHereMorty,
	SheetWhereAreYouRicky,
	SheetWhereAreYouRickyEvent,
	sheet,
} from './sheet.service'

@customElement('schmancy-sheet')
export default class SchmancySheet extends $LitElement(style) {
	@property({ type: String, reflect: true }) uid!: string
	@property({ type: Boolean, reflect: true }) open = false
	@property({ type: String, reflect: true }) header: 'hidden' | 'visible' = 'visible'
	@property({ type: String, reflect: true }) position: SchmancySheetPosition = SchmancySheetPosition.Side
	@property({ type: Boolean, reflect: true }) persist = false
	@property({ type: Boolean, reflect: true }) lock = false
	@property({ type: Boolean, reflect: true }) handleHistory = true
	@property({ type: String, reflect: true }) title = ''

	// Use ref directive instead of @query
	private sheetRef = createRef<HTMLDivElement>()
	@queryAssignedElements({ flatten: true }) private assignedElements!: HTMLElement[]

	@property() focusAttribute = 'autofocus'
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
		// Handle browser back button - only if handleHistory is true
		const popState$ = this.handleHistory
			? fromEvent<PopStateEvent>(window, 'popstate').pipe(
					tap(e => {
						e.preventDefault()
						this.closeSheet()
					}),
				)
			: of(null).pipe(take(0)) // Empty observable if handleHistory is false

		// Handle ESC key - listen on the sheet element for better event capture
		const keyUp$ = fromEvent<KeyboardEvent>(this, 'keydown').pipe(
			tap(event => {
				if (event.key === 'Escape' && !this.lock && this.open) {
					event.preventDefault()
					event.stopPropagation()
					sheet.dismiss(this.uid)
				}
			}),
		)

		// Handle inter-component communication
		const rickyComm$ = fromEvent<SheetWhereAreYouRickyEvent>(window, SheetWhereAreYouRicky).pipe(
			tap(e => {
				if (e.detail.uid === this.uid) this.announcePresence()
			}),
		)

		merge(popState$, keyUp$, rickyComm$).pipe(takeUntil(this.disconnecting)).subscribe()
	}


	private announcePresence() {
		this.dispatchEvent(
			new CustomEvent(SheetHereMorty, {
				detail: { sheet: this },
				bubbles: true,
				composed: true,
			}),
		)
	}

	private setBackgroundInert(inert: boolean) {
		// Get all sibling elements and make them inert
		const parent = this.parentElement
		if (parent) {
			Array.from(parent.children).forEach(child => {
				if (child !== this && child instanceof HTMLElement) {
					if (inert) {
						child.setAttribute('inert', '')
					} else {
						child.removeAttribute('inert')
					}
				}
			})
		}
		
		// Also handle body's direct children if sheet is attached to body
		if (this.parentElement === document.body) {
			Array.from(document.body.children).forEach(child => {
				if (child !== this && child !== parent && child instanceof HTMLElement) {
					if (inert) {
						child.setAttribute('inert', '')
					} else {
						child.removeAttribute('inert')
					}
				}
			})
		}
	}

	setIsSheetShown(isShown: boolean) {
		this.sheetRef.value?.setAttribute('aria-hidden', String(!isShown))
		this.sheetRef.value?.setAttribute('aria-modal', String(isShown))
	}

	closeSheet() {
		this.open = false
		this.dispatchEvent(new CustomEvent('close'))
	}

	private getFocusElement(): HTMLElement | null {
		const selector = `[${this.focusAttribute}]`
		return (this.assignedElements.find(el => el.matches(selector) || el.querySelector(selector)) as HTMLElement) ?? null
	}

	override focus() {
		// First try native autofocus attribute
		const autofocusElement = this.querySelector('[autofocus]') as HTMLElement
		if (autofocusElement) {
			autofocusElement.focus()
			return
		}
		
		// Fallback to custom focus attribute
		this.getFocusElement()?.focus()
	}

	private handleOverlayClick = (e: Event) => {
		e.stopPropagation()
		if (!this.lock) {
			sheet.dismiss(this.uid)
		}
	}

	private handleHeaderDismiss = (e: CustomEvent) => {
		e.stopPropagation()
		sheet.dismiss(this.uid)
	}

	render() {
		const sheetClasses = {
			'sheet': true,
			'sheet--open': this.open,
			'sheet--locked': this.lock,
		}

		const overlayClasses = {
			'overlay': true,
			'overlay--interactive': !this.lock,
		}

		return html`
			<div 
				class=${classMap(sheetClasses)}
				role="dialog" 
				aria-labelledby=${ifDefined(this.header !== 'hidden' ? 'sheet-title' : undefined)}
				aria-hidden=${!this.open} 
				aria-modal=${this.open}
				tabindex="0"
				${ref(this.sheetRef)}>
				<div
					class=${classMap(overlayClasses)}
					@click=${this.lock ? undefined : this.handleOverlayClick}
				></div>
				<schmancy-grid
					rows=${this.header === 'hidden' ? '1fr' : 'auto 1fr'}
					class="content w-full"
					data-position=${this.position}
				>
					${cache(
						this.header !== 'hidden'
							? html`<schmancy-sheet-header
								class="sticky top-0 z-50 w-full"
								@dismiss=${this.handleHeaderDismiss}
								id="sheet-title"
								title=${ifDefined(this.title || undefined)}
							></schmancy-sheet-header>`
							: ''
					)}

					<schmancy-surface rounded="left" fill="all" id="body" class="overflow-auto" type="surface">
						<schmancy-scroll> <slot></slot></schmancy-scroll>
					</schmancy-surface>
				</schmancy-grid>
			</div>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-sheet': SchmancySheet
	}
}
