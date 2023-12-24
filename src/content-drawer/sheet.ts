import { animate } from '@juliangarnierorg/anime-beta'
import { consume } from '@lit/context'
import { $LitElement } from '@mhmo91/lit-mixins/src'
import { css, html } from 'lit'
import { customElement, query, queryAssignedElements, state } from 'lit/decorators.js'
import { SchmancyEvents, SchmancyTheme, color } from '..'
import {
	SchmancyContentDrawerID,
	SchmancyContentDrawerSheetMode,
	SchmancyContentDrawerSheetState,
	TSchmancyContentDrawerSheetMode,
	TSchmancyContentDrawerSheetState,
} from './context'
@customElement('schmancy-content-drawer-sheet')
export class SchmancyContentDrawerSheet extends $LitElement(css``) {
	@consume({ context: SchmancyContentDrawerSheetMode, subscribe: true })
	@state()
	mode: TSchmancyContentDrawerSheetMode

	@consume({ context: SchmancyContentDrawerSheetState, subscribe: true })
	@state()
	private state: TSchmancyContentDrawerSheetState

	@consume({ context: SchmancyContentDrawerID })
	schmancyContentDrawerID

	@query('#overlay') overlay!: HTMLElement
	@query('#sheet') sheet!: HTMLElement
	@queryAssignedElements({ flatten: true, slot: undefined }) defaultSlot!: HTMLElement[]
	updated(changedProperties: Map<string, any>) {
		if (changedProperties.has('state')) {
			if (this.mode === 'overlay') {
				if (this.state === 'close') {
					this.close()
				} else if (this.state === 'open') {
					this.open()
				}
			} else if (this.mode === 'push') {
				if (this.state === 'close') this.close()
				else if (this.state === 'open') this.open()
			}
		}
	}

	open() {
		if (this.mode === 'overlay')
			animate(this.overlay, {
				opacity: 0.4,
				duration: 500,
				ease: 'cubicBezier(0.5, 0.01, 0.25, 1)',
				onBegin: () => {
					this.overlay.style.display = 'block'
					this.overlay.style.position = 'fixed'
				},
			})
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

	close() {
		animate(this.overlay, {
			opacity: [0.4, 0],
			duration: 500,
			ease: 'cubicBezier(0.5, 0.01, 0.25, 1)',
			onComplete: () => {
				this.overlay.style.display = 'none'
			},
		})
		animate(this.sheet, {
			opacity: 1,
			duration: 500,
			translateX: ['0%', '100%'],
			ease: 'cubicBezier(0.5, 0.01, 0.25, 1)',
			onComplete: () => {
				this.sheet.style.display = 'none'
			},
		})
	}

	protected render() {
		const sheetClasses = {
			'min-w-[360px]': true,
			block: this.mode === 'push',
			'absolute z-[50]': this.mode === 'overlay',
			'opacity-1': this.mode === 'overlay' && this.state === 'open',
		}
		const overlayClass = {
			'hidden inset-0 z-[49]': true,
		}

		return html`
			<div
				id="overlay"
				${color({
					bgColor: SchmancyTheme.sys.color.scrim,
				})}
				@click=${() => {
					this.dispatchEvent(
						new CustomEvent(SchmancyEvents.ContentDrawerToggle, {
							detail: { state: 'close' },
							bubbles: true,
							composed: true,
						}),
					)
				}}
				class="${this.classMap(overlayClass)}"
			></div>
			<schmancy-surface
				id="sheet"
				class="${this.classMap(sheetClasses)}"
				rounded="all"
				fill
				elevation="1"
				type="containerHigh"
			>
				<schmancy-area name="${this.schmancyContentDrawerID}"> </schmancy-area>
			</schmancy-surface>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-content-drawer-sheet': SchmancyContentDrawerSheet
	}
}
