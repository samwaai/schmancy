import { $LitElement } from '@mhmo91/lit-mixins/src'
import { html } from 'lit'
import { customElement, property, query, queryAssignedElements, queryAsync } from 'lit/decorators.js'
import { fromEvent, merge, takeUntil, tap } from 'rxjs'
import { hook } from './hook'
import style from './sheet.scss?inline'
import {
	SheetHereMorty,
	SchmancySheetPosition,
	SheetWhereAreYouRicky,
	SheetWhereAreYouRickyEvent,
	sheet,
} from './sheet.service'

@customElement('schmancy-sheet')
export default class SchmancySheet extends $LitElement(style) {
	@property({ type: String, reflect: true }) uid!: string
	@property({ type: Boolean, reflect: true }) open = false
	@property({ type: String, reflect: true }) position: SchmancySheetPosition = SchmancySheetPosition.Side
	@property({ type: Boolean, reflect: true }) persist = false
	@property({ type: Boolean, reflect: true }) allowOverlyDismiss = true
	@property({ type: String, reflect: true }) title = ''

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
						sheet.dismiss(this.uid)
					}
				}),
			),
		)
			.pipe(takeUntil(this.disconnecting))
			.subscribe()

		// Handshaking communication between Ricky and Morty
		fromEvent<SheetWhereAreYouRickyEvent>(window, SheetWhereAreYouRicky)
			.pipe(takeUntil(this.disconnecting))
			.subscribe(e => {
				if (e.detail.uid === this.uid) {
					this.dispatchEvent(
						new CustomEvent(SheetHereMorty, {
							detail: {
								sheet: this,
							},
							bubbles: true,
							composed: true,
						}),
					)
				}
			})

		fromEvent(this, 'sheetDismiss')
			.pipe(
				tap(e => e.stopPropagation()),
				takeUntil(this.disconnecting),
			)
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
			'inset-0 fixed min-w-[360px]': true,
			'transition-all duration-[600]': true,
			'bottom-0 items-center justify-end': this.position === SchmancySheetPosition.Bottom,
			'top-0 right-0 bottom-0 mx-auto items-end justify-start h-full w-full':
				this.position === SchmancySheetPosition.Side,
		}
		const contentClasses = {
			'h-full rounded-l-[16px]': this.position === SchmancySheetPosition.Side,
			'rounded-t-[16px]': this.position === SchmancySheetPosition.Bottom,
			'bg-surface-low text-surface-onVariant border-outline shadow-1': true,
		}
		const overlayClasses = {
			'bg-scrim transition-all duration-[600] opacity-[0.4] absolute inset-0': true,
		}
		return html`
			<div class="sheet ${this.classMap(classes)}" role="dialog" aria-hidden="true">
				<div
					class="overlay ${this.classMap(overlayClasses)}"
					@click=${() => {
						if (this.allowOverlyDismiss) sheet.dismiss(this.uid)
					}}
				></div>
				<schmancy-sheet-content class="content ${this.classMap(contentClasses)}" data-position=${this.position}>
					<schmancy-sheet-header title="${this.title}"> </schmancy-sheet-header>
					<section class="flex flex-1 px-16">
						<slot></slot>
					</section>
				</schmancy-sheet-content>
			</div>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-sheet': SchmancySheet
	}
}
