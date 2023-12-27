import { animate, utils } from '@juliangarnierorg/anime-beta'
import { consume } from '@lit/context'
import { $LitElement } from '@mhmo91/lit-mixins/src'
import { css, html } from 'lit'
import { customElement, query, queryAssignedElements, state } from 'lit/decorators.js'
import { from, merge, of, takeUntil, tap } from 'rxjs'
import {
	SchmancyContentDrawerID,
	SchmancyContentDrawerSheetMode,
	SchmancyContentDrawerSheetState,
	TSchmancyContentDrawerSheetMode,
	TSchmancyContentDrawerSheetState,
} from './context'
import { sheet } from '..'
@customElement('schmancy-content-drawer-sheet')
export class SchmancyContentDrawerSheet extends $LitElement(css``) {
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
	updated(changedProperties: Map<string, any>) {
		if (changedProperties.has('state') || changedProperties.has('mode')) {
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
			'min-w-[360px]': true,
			block: this.mode === 'push',
			'absolute z-[50]': this.mode === 'overlay',
			'opacity-1': this.mode === 'overlay' && this.state === 'open',
		}

		return html`
			<schmancy-grid gap="sm" cols="auto 1fr" rows="1fr" flow="col" align="stretch" justify="stretch">
				<schmancy-divider class="px-4" orientation="vertical"></schmancy-divider>
				<section id="sheet" class="${this.classMap(sheetClasses)}">
					<schmancy-area name="${this.schmancyContentDrawerID}">
						<slot name="placeholder"></slot>
					</schmancy-area>
				</section>
			</schmancy-grid>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-content-drawer-sheet': SchmancyContentDrawerSheet
	}
}
