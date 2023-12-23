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
	@queryAssignedElements({ flatten: true, slot: undefined }) defaultSlot!: HTMLElement[]
	updated(changedProperties: Map<string, any>) {
		if (changedProperties.has('state')) {
			if (this.mode === 'overlay') {
				if (this.state === 'close') {
					this.closeOverlay()
				} else if (this.state === 'open') {
					this.openOverlay()
				}
			} else if (this.mode === 'push') {
				this.closeOverlay()
			}
		}
	}

	openOverlay() {
		animate(this.overlay, {
			opacity: 0.4,
			duration: 500,
			ease: 'cubicBezier(0.5, 0.01, 0.25, 1)',
			onBegin: () => {
				this.overlay.style.display = 'block'
			},
		})
	}

	closeOverlay() {
		animate(this.overlay, {
			opacity: [0.4, 0],
			duration: 500,
			ease: 'cubicBezier(0.5, 0.01, 0.25, 1)',
			onComplete: () => {
				this.overlay.style.display = 'none'
			},
		})
	}

	protected render() {
		const sheetClasses = {
			'p-[16px] min-w-[360px] w-fit': true,
			block: this.mode === 'push',
			'absolute opacity-0 r-0 t-0 z-50': this.mode === 'overlay',
			'opacity-1': this.mode === 'overlay' && this.state === 'open',
			'opacity-0': this.mode === 'overlay' && this.state === 'close',
		}
		const overlayClass = {
			'fixed inset-0 z-[49] hidden': true,
		}

		return html`
			<div
				class="${this.classMap(sheetClasses)}"
				${color({
					bgColor: SchmancyTheme.sys.color.surface.container,
				})}
			>
				<schmancy-area name="${this.schmancyContentDrawerID}"> </schmancy-area>
			</div>
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
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-content-drawer-sheet': SchmancyContentDrawerSheet
	}
}
