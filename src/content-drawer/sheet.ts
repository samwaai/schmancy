import { animate, utils } from '@juliangarnierorg/anime-beta'
import { consume } from '@lit/context'
import { $LitElement } from '@mhmo91/lit-mixins/src'
import { css, html } from 'lit'
import { customElement, property, query, queryAssignedElements, state } from 'lit/decorators.js'
import { from, merge, of, takeUntil, tap } from 'rxjs'
import { SchmancyEvents, sheet } from '..'
import {
	SchmancyContentDrawerID,
	SchmancyContentDrawerMinWidth,
	SchmancyContentDrawerSheetMode,
	SchmancyContentDrawerSheetState,
	TSchmancyContentDrawerSheetMode,
	TSchmancyContentDrawerSheetState,
} from './context'
@customElement('schmancy-content-drawer-sheet')
export class SchmancyContentDrawerSheet extends $LitElement(css`
	:host {
		padding-left: 16px;
		padding-right: 16px;
	}
`) {
	@property({ type: Number })
	minWidth

	@consume({ context: SchmancyContentDrawerSheetMode, subscribe: true })
	@state()
	mode: TSchmancyContentDrawerSheetMode

	@consume({ context: SchmancyContentDrawerSheetState, subscribe: true })
	@state()
	state: TSchmancyContentDrawerSheetState

	@consume({ context: SchmancyContentDrawerID })
	schmancyContentDrawerID

	@query('#sheet') sheet!: HTMLElement
	@queryAssignedElements({ flatten: true, slot: undefined }) defaultSlot!: HTMLElement[]

	@consume({ context: SchmancyContentDrawerMinWidth, subscribe: true })
	drawerMinWidth: typeof SchmancyContentDrawerMinWidth.__context__

	connectedCallback(): void {
		super.connectedCallback()
		if (this.minWidth) this.drawerMinWidth.sheet = this.minWidth
		else this.minWidth = this.drawerMinWidth.sheet
	}

	updated(changedProperties: Map<string, any>) {
		super.updated(changedProperties)
		if (changedProperties.has('minWidth') && this.minWidth) {
			this.drawerMinWidth.sheet = this.minWidth
			this.dispatchEvent(new CustomEvent(SchmancyEvents.ContentDrawerResize, { bubbles: true, composed: true }))
		} else if (changedProperties.has('state') || changedProperties.has('mode')) {
			if (this.mode === 'overlay') {
				if (this.state === 'close') {
					this.closeAll()
				} else if (this.state === 'open') {
					// this.open()
				}
			} else if (this.mode === 'push') {
				sheet.dismiss(this.schmancyContentDrawerID)
				if (this.state === 'close') this.closeAll()
				else if (this.state === 'open') this.open()
			}
		}
	}

	open() {
		animate(this.sheet, {
			opacity: 1,
			duration: 500,
			translateX: ['100%', '0%'],
			ease: 'cubicBezier(0.5, 0.01, 0.25, 1)',
			onBegin: () => {
				if (this.mode === 'overlay') this.sheet.style.position = 'fixed'
				else this.sheet.style.position = 'relative'
				this.sheet.style.display = 'block'
			},
		})
	}

	closeAll() {
		merge(from(this.closeModalSheet()), from(this.closeSheet())).pipe(takeUntil(this.disconnecting)).subscribe()
	}

	closeModalSheet() {
		return of(true).pipe(tap(() => sheet.dismiss(this.schmancyContentDrawerID)))
	}

	closeSheet() {
		return utils.promisify(
			animate(this.sheet, {
				opacity: 1,
				duration: 500,
				translateX: ['0%', '100%'],
				ease: 'cubicBezier(0.5, 0.01, 0.25, 1)',
				onComplete: () => {
					this.sheet.style.display = 'none'
				},
			}),
		)
	}

	protected render() {
		const sheetClasses = {
			block: this.mode === 'push',
			'absolute z-[50]': this.mode === 'overlay',
			'opacity-1': this.mode === 'overlay' && this.state === 'open',
		}

		const styles = {
			minWidth: `${this.minWidth}px`,
		}
		return html`
			<section id="sheet" class="${this.classMap(sheetClasses)}" style=${this.styleMap(styles)}>
				<schmancy-area name="${this.schmancyContentDrawerID}">
					<slot name="placeholder"></slot>
				</schmancy-area>
			</section>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-content-drawer-sheet': SchmancyContentDrawerSheet
	}
}
