import { $LitElement } from '@mixins/index'
import { html } from 'lit'
import { customElement, property, query, queryAssignedElements } from 'lit/decorators.js'
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

	@query('.sheet') private sheet!: HTMLElement
	@queryAssignedElements({ flatten: true }) private assignedElements!: HTMLElement[]

	@property() focusAttribute = 'autofocus'
	private lastFocusedElement: HTMLElement | null = null

	@on('open')
	onOpenChange(_oldValue: boolean, newValue: boolean) {
		if (newValue) {
			this.lastFocusedElement = document.activeElement as HTMLElement
			this.addFocusTrap()
			this.focus()
		} else {
			this.removeFocusTrap()
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

		// Handle ESC key - respect allowOverlayDismiss
		const keyUp$ = fromEvent<KeyboardEvent>(window, 'keyup').pipe(
			tap(event => {
				// Only handle ESC key dismissal if allowOverlayDismiss is true
				if (event.key === 'Escape' && !this.sheetContainsFocus() && !this.lock) {
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

	private sheetContainsFocus(): boolean {
		return this.sheet?.contains(document.activeElement) ?? false
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

	private addFocusTrap() {
		document.addEventListener('focusin', this.handleFocusIn)
	}

	private removeFocusTrap() {
		document.removeEventListener('focusin', this.handleFocusIn)
	}

	private handleFocusIn = (e: Event) => {
		if (!this.sheet?.contains(e.target as Node)) {
			this.focus()
		}
	}

	setIsSheetShown(isShown: boolean) {
		this.sheet?.setAttribute('aria-hidden', String(!isShown))
		this.sheet?.setAttribute('aria-modal', String(isShown))
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
		this.getFocusElement()?.focus()
	}

	render() {
		return html`
			<div class="sheet" role="dialog" aria-labelledby="sheet-title" aria-hidden=${!this.open} aria-modal=${this.open}>
				<div
					class="overlay"
					@click=${(e: Event) => {
						e.stopPropagation()
						if (!this.lock) {
							sheet.dismiss(this.uid)
						}
					}}
				></div>
				<schmancy-grid
					rows=${this.header === 'hidden' ? '1fr' : 'auto 1fr'}
					class="content w-full"
					data-position=${this.position}
				>
					${when(
						this.header !== 'hidden',
						() =>
							html`<schmancy-sheet-header
								class="sticky top-0 z-50 w-full"
								@dismiss=${(e: CustomEvent) => {
									e.stopPropagation()
									sheet.dismiss(this.uid)
								}}
								id="sheet-title"
								title=${this.title}
							></schmancy-sheet-header>`,
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
