import TailwindElement from '@schmancy/mixin/tailwind/tailwind.mixin'
import { html } from 'lit'
import { customElement, property, query, queryAssignedElements, queryAsync } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'
import { fromEvent, merge, takeUntil, tap } from 'rxjs'
import { hook } from './hook'
import style from './sheet.scss?inline'
import bottomsheetService, {
	HereMorty,
	SchmancySheetPosition,
	WhereAreYouRicky,
	WhereAreYouRickyEvent,
} from './sheet.service'

@customElement('schmancy-sheet')
export default class SchmancySheet extends TailwindElement(style) {
	@property({ type: String, reflect: true }) uid!: string
	@property({ type: Boolean }) open = false
	@property({ type: String }) position: SchmancySheetPosition = SchmancySheetPosition.BottomCenter
	@property({ type: Boolean }) persist = false
	@property({ type: Boolean }) closeButton = true
	@property({ type: Boolean }) allowOverlyDismiss = true

	@query('.sheet') sheet!: HTMLElement | undefined
	@queryAsync('.sheet') sheetAsync!: Promise<HTMLElement> | undefined
	@query('.contents') sheetContents: HTMLElement | undefined
	@queryAssignedElements({ flatten: true }) assignedElements!: HTMLElement[]

	@property() focusAttribute = 'autofocus'

	sheetHeight = 0
	sheetWidth = 0
	dragPosition: number | undefined

	@hook('open')
	onOpenChange(_old_value: boolean, new_value: boolean) {
		if (new_value) {
			this.setIsSheetShown(true)
		} else {
			this.setIsSheetShown(false)
		}
	}

	async connectedCallback() {
		super.connectedCallback()
		this.focus()
		merge(
			fromEvent<PopStateEvent>(window, 'popstate').pipe(
				tap(e => {
					e.stopPropagation()
					e.preventDefault()
					this.closeSheet()
				}),
			),
			fromEvent<KeyboardEvent>(window, 'keyup').pipe(
				// ESC key to close bottom sheet
				tap(event => {
					// only close the currently open sheet
					const isSheetElementFocused =
						this.sheet?.contains(event.target as Node) && document.activeElement === event.target
					if (event.key === 'Escape' && !isSheetElementFocused) {
						bottomsheetService.dismiss(this.uid)
					}
				}),
			),
		)
			.pipe(takeUntil(this.disconnecting))
			.subscribe()

		// Handshaking communication between Ricky and Morty
		fromEvent<WhereAreYouRickyEvent>(window, WhereAreYouRicky)
			.pipe(takeUntil(this.disconnecting))
			.subscribe(e => {
				if (e.detail.uid === this.uid) {
					this.dispatchEvent(
						new CustomEvent(HereMorty, {
							detail: {
								sheet: this,
							},
							bubbles: true,
							composed: true,
						}),
					)
				}
			})

		fromEvent(this, 'bottomSheetCloseRequested')
			.pipe(takeUntil(this.disconnecting))
			.subscribe(e => {
				e.preventDefault()
				e.stopPropagation()
				this.closeSheet()
			})
	}

	pxToVw(pxValue: number) {
		const vwValue = (pxValue / document.documentElement.clientWidth) * 100
		return vwValue
	}

	pxToVh(pxValue: number) {
		const vhValue = (pxValue / document.documentElement.clientHeight) * 100
		return vhValue
	}

	async firstUpdated() {
		const sheet = await this.sheetAsync
		if (!sheet) return
	}

	disconnectedCallback() {
		super.disconnectedCallback()
		this.disconnecting.next(true)
	}

	setIsSheetShown(isShown: boolean) {
		this.sheet?.setAttribute('aria-hidden', String(!isShown))
	}

	closeSheet() {
		this.open = false
		this.setIsSheetShown(false)
		this.dispatchEvent(new CustomEvent('close'))
	}

	private getFocusElement(): HTMLElement | null {
		const selector = `[${this.focusAttribute}]`
		const slotted = this.assignedElements
		for (const el of slotted) {
			const focusEl = el?.matches(selector) ? el : el?.querySelector(selector)
			if (focusEl) {
				return focusEl as HTMLElement
			}
		}
		return null
	}

	override focus() {
		this.getFocusElement()?.focus()
	}

	override blur() {
		this.getFocusElement()?.blur()
	}

	render() {
		const classes = {
			'items-center justify-end': this.position === SchmancySheetPosition.BottomCenter,
			'bottom-0 mx-auto': this.position === SchmancySheetPosition.BottomCenter,
			'items-end justify-start': this.position === SchmancySheetPosition.TopRight,
			'top-0 right-0': this.position === SchmancySheetPosition.TopRight,
			'items-end justify-end': this.position === SchmancySheetPosition.BottomRight,
			'bottom-0 right-0': this.position === SchmancySheetPosition.BottomRight,
		}
		return html`
			<div class="sheet ${classMap(classes)}" role="dialog" aria-hidden="true">
				<div
					class="overlay"
					@click=${() => {
						if (this.allowOverlyDismiss) bottomsheetService.dismiss(this.uid)
					}}
				></div>
				<div class="contents" data-position=${this.position}>
					<schmancy-sheet-content .closeButton=${true}>
						<slot></slot>
					</schmancy-sheet-content>
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
