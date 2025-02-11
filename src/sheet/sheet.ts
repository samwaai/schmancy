import { $LitElement } from '@mixins/index'
import { html } from 'lit'
import { customElement, property, query, queryAssignedElements } from 'lit/decorators.js'
import { fromEvent, merge, takeUntil, tap } from 'rxjs'
import style from './sheet.scss?inline'
import {
	SchmancySheetPosition,
	SheetHereMorty,
	SheetWhereAreYouRicky,
	SheetWhereAreYouRickyEvent,
	sheet,
} from './sheet.service'
import { on } from './hook'

@customElement('schmancy-sheet')
export default class SchmancySheet extends $LitElement(style) {
	@property({ type: String, reflect: true }) uid!: string
	@property({ type: Boolean, reflect: true }) open = false
	@property({ type: String, reflect: true }) header: 'hidden' | 'visible' = 'visible'
	@property({ type: String, reflect: true }) position: SchmancySheetPosition = SchmancySheetPosition.Side
	@property({ type: Boolean, reflect: true }) persist = false
	@property({ type: Boolean, reflect: true }) allowOverlayDismiss = true
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
		// Handle browser back button
		const popState$ = fromEvent<PopStateEvent>(window, 'popstate').pipe(
			tap(e => {
				e.preventDefault()
				this.closeSheet()
			}),
		)

		// Handle ESC key
		const keyUp$ = fromEvent<KeyboardEvent>(window, 'keyup').pipe(
			tap(event => {
				if (event.key === 'Escape' && !this.sheetContainsFocus()) {
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
						if (this.allowOverlayDismiss) sheet.dismiss(this.uid)
					}}
				></div>
				<section class="content w-full" data-position=${this.position}>
					<schmancy-sheet-header
						class="sticky top-0 z-50 w-full"
						@dismiss=${(e: CustomEvent) => {
							e.stopPropagation()
							sheet.dismiss(this.uid)
						}}
						id="sheet-title"
						.hidden=${this.header === 'hidden'}
						title=${this.title}
					></schmancy-sheet-header>
					<schmancy-surface class="overflow-auto" fill type="surface">
						<slot></slot>
					</schmancy-surface>
				</section>
			</div>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-sheet': SchmancySheet
	}
}
