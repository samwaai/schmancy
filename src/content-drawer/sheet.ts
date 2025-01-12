import { consume } from '@lit/context'
import { $LitElement } from '@mixins/index'
import { css, html } from 'lit'
import { customElement, property, query, queryAssignedElements, state } from 'lit/decorators.js'
import { from, merge, Observable, of, takeUntil, tap } from 'rxjs'
import { SchmancyEvents, sheet } from '..'
import {
	SchmancyContentDrawerID,
	SchmancyContentDrawerMaxHeight,
	SchmancyContentDrawerMinWidth,
	SchmancyContentDrawerSheetMode,
	SchmancyContentDrawerSheetState,
	TSchmancyContentDrawerSheetMode,
	TSchmancyContentDrawerSheetState,
} from './context'

// --- 1) Removed the custom animate import
// import { animate } from '@packages/anime-beta-master'

@customElement('schmancy-content-drawer-sheet')
export class SchmancyContentDrawerSheet extends $LitElement(css`
	:host {
		overflow: scroll;
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

	@consume({ context: SchmancyContentDrawerMaxHeight, subscribe: true })
	@state()
	maxHeight

	connectedCallback(): void {
		super.connectedCallback()
		if (this.minWidth) {
			this.drawerMinWidth.sheet = this.minWidth
		} else {
			this.minWidth = this.drawerMinWidth.sheet
		}
	}

	updated(changedProperties: Map<string, any>) {
		super.updated(changedProperties)
		if (changedProperties.has('minWidth') && this.minWidth) {
			// If the 'minWidth' property changed
			this.drawerMinWidth.sheet = this.minWidth
			this.dispatchEvent(new CustomEvent(SchmancyEvents.ContentDrawerResize, { bubbles: true, composed: true }))
		} else if (changedProperties.has('state') || changedProperties.has('mode')) {
			if (this.mode === 'overlay') {
				if (this.state === 'close') {
					this.closeAll()
				} else if (this.state === 'open') {
					// Overlay open logic if needed
					// this.open()
				}
			} else if (this.mode === 'push') {
				sheet.dismiss(this.schmancyContentDrawerID)
				if (this.state === 'close') {
					this.closeAll()
				} else if (this.state === 'open') {
					this.open()
				}
			}
		}
	}

	/**
	 * Open the sheet by sliding it into view.
	 */
	open() {
		// "onBegin" logic from the old `animate(...)`
		if (this.mode === 'overlay') {
			this.sheet.style.position = 'fixed'
		} else {
			this.sheet.style.position = 'relative'
		}
		this.sheet.style.display = 'block'

		// --- 2) Use native Web Animations API ---
		this.sheet.animate(
			[
				{ opacity: '0', transform: 'translateX(100%)' },
				{ opacity: '1', transform: 'translateX(0%)' },
			],
			{
				duration: 500,
				easing: 'cubic-bezier(0.5, 0.01, 0.25, 1)',
			},
		)
		// No return is needed if you don't rely on the result
	}

	/**
	 * Close everything (modal sheet + the sheet itself).
	 */
	closeAll() {
		// Merge them into a single subscription,
		// so that everything closes in parallel.
		merge(from(this.closeModalSheet()), from(this.closeSheet())).pipe(takeUntil(this.disconnecting)).subscribe()
	}

	/**
	 * Dismiss the "modal sheet."
	 * This just returns an Observable that completes immediately.
	 */
	closeModalSheet() {
		return of(true).pipe(tap(() => sheet.dismiss(this.schmancyContentDrawerID)))
	}

	/**
	 * Slide the sheet out of view + hide it.
	 * Return an Observable so we can merge it with other close operations.
	 */
	closeSheet() {
		// --- 2) Use native Web Animations API and wrap in an Observable ---
		return new Observable<void>(observer => {
			const animation = this.sheet.animate(
				[
					{ opacity: '1', transform: 'translateX(0%)' },
					{ opacity: '1', transform: 'translateX(100%)' },
				],
				{
					duration: 500,
					easing: 'cubic-bezier(0.5, 0.01, 0.25, 1)',
				},
			)

			animation.onfinish = () => {
				// "onComplete" logic
				this.sheet.style.display = 'none'
				observer.next()
				observer.complete()
			}
		})
	}

	protected render() {
		const sheetClasses = {
			block: this.mode === 'push',
			'absolute z-[50]': this.mode === 'overlay',
			'opacity-1': this.mode === 'overlay' && this.state === 'open',
		}

		const styles = {
			minWidth: `${this.minWidth}px`,
			maxHeight: this.maxHeight,
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
