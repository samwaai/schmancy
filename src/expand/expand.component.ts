import { css, html, nothing } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { createRef, ref } from 'lit/directives/ref.js'
import { styleMap } from 'lit/directives/style-map.js'
import { filter, fromEvent, lastValueFrom } from 'rxjs'
import { tap, takeUntil } from 'rxjs/operators'
import { TailwindElement } from '@mixins/index'
import { SPRING_SNAPPY } from '../utils/animation.js'
import { reducedMotion$ } from '../directives/reduced-motion'
import { SchmancyExpandRoot } from './expand-root.component.js'

/** Dispatch this event on window to close whichever schmancy-expand is currently open */
export const SCHMANCY_EXPAND_REQUEST_CLOSE = 'schmancy-expand-request-close'

@customElement('schmancy-expand')
export default class SchmancyExpand extends TailwindElement(css`
	:host {
		display: block;
	}

	summary::-webkit-details-marker {
		display: none;
	}

	summary {
		list-style: none;
		color: inherit;
	}

	.inline-grid {
		display: grid;
		grid-template-rows: 0fr;
		overflow: hidden;
		transition: grid-template-rows 300ms cubic-bezier(0.22, 1.25, 0.36, 1),
		            opacity 300ms cubic-bezier(0.22, 1.25, 0.36, 1);
		opacity: 0;
	}

	.inline-grid[data-open] {
		grid-template-rows: 1fr;
		opacity: 1;
	}

	.inline-grid > .inner {
		min-height: 0;
		overflow: hidden;
	}
`) {
	@property() summary = ''

	@property({ type: Boolean, reflect: true }) open = false

	@property({ attribute: 'summary-padding' }) summaryPadding = ''

	@property({ attribute: 'content-padding' }) contentPadding = ''

	@property({ type: Boolean, attribute: 'hide-indicator' }) hideIndicator = false

	@property({ type: Number, attribute: 'indicator-rotate' }) indicatorRotate = 90

	@property({ type: Boolean }) backdrop = true

	@property({ type: Boolean }) inline = false

	private _summaryRef = createRef<HTMLElement>()
	private _contentSlotRef = createRef<HTMLSlotElement>()
	private _root: SchmancyExpandRoot | null = null
	private _movedNodes: Element[] = []
	private _currentIndicatorAnim: Animation | undefined

	connectedCallback() {
		super.connectedCallback()

		// Close on Escape key
		fromEvent<KeyboardEvent>(window, 'keydown')
			.pipe(
				filter(e => e.key === 'Escape'),
				filter(() => this.open),
				tap(() => void this._handleClose()),
				takeUntil(this.disconnecting),
			)
			.subscribe()

		// Close on click outside the portal panel
		fromEvent<PointerEvent>(document, 'pointerdown')
			.pipe(
				filter(() => this.open),
				filter(e => !!this._root && !e.composedPath().includes(this._root)),
				tap(() => void this._handleClose()),
				takeUntil(this.disconnecting),
			)
			.subscribe()
	}

	disconnectedCallback() {
		super.disconnectedCallback()
		if (this._movedNodes.length > 0) {
			this._movedNodes.forEach(n => this.appendChild(n))
			this._movedNodes = []
		}
		if (this._root && this._root.children.length === 0) {
			this._root.remove()
			this._root = null
		}
	}

	private async _getOrCreateRoot(): Promise<SchmancyExpandRoot> {
		const theme = await lastValueFrom(this.discover<HTMLElement>('schmancy-theme'))
		const container: HTMLElement = theme ?? document.querySelector('schmancy-theme') ?? document.body
		let root = container.querySelector('schmancy-expand-root') as SchmancyExpandRoot | null
		if (!root) {
			root = new SchmancyExpandRoot()
			container.appendChild(root)
		}
		return root
	}

	/** Close the expand portal, animating back to the summary position. */
	public close(): void {
		void this._handleClose()
	}

	/** Programmatically open the expand portal. */
	public expand(): void {
		if (this.open) return
		void this._expand()
	}

	protected override updated(changed: Map<PropertyKey, unknown>) {
		super.updated(changed)
		if (changed.has('open') && this.open && !this.inline && !this._root) {
			void this._expand()
		}
	}

	private _toggle() {
		if (this.inline) {
			this.open = !this.open
			this._animateIndicator(this.open)
		} else if (!this.open) {
			void this._expand()
		}
	}

	private _handleSummaryClick(e: MouseEvent) {
		e.preventDefault()
		this._toggle()
	}

	private async _expand() {
		if (this.inline) {
			this.open = true
			this._animateIndicator(true)
			return
		}

		const root = await this._getOrCreateRoot()
		this._root = root
		const summary = this._summaryRef.value
		const contentSlot = this._contentSlotRef.value
		if (!summary || !contentSlot) return

		const summaryRect = summary.getBoundingClientRect()
		const nodes = contentSlot.assignedElements({ flatten: true })
		if (nodes.length === 0) return

		root.prepare(summaryRect, this, this.hideIndicator, this.backdrop)

		this._movedNodes = [...nodes]
		this._movedNodes.forEach(n => root.appendChild(n))

		root.triggerOpen()

		this._animateIndicator(true)
		this.open = true
	}

	async _handleClose() {
		if (this.inline) {
			this._animateIndicator(false)
			this.open = false
			return
		}

		const root = this._root
		const summary = this._summaryRef.value
		if (!root || !summary) return

		const summaryRect = summary.getBoundingClientRect()
		this._animateIndicator(false)

		await root.triggerClose(summaryRect)

		this._movedNodes.forEach(n => this.appendChild(n))
		this._movedNodes = []
		this.open = false
	}

	private _animateIndicator(isOpen: boolean) {
		if (reducedMotion$.value) return

		const indicator = this.shadowRoot?.querySelector('.indicator') as HTMLElement | null
		if (!indicator) return

		this._currentIndicatorAnim?.cancel()
		this._currentIndicatorAnim = indicator.animate(
			[
				{ transform: `rotate(${isOpen ? '0deg' : `${this.indicatorRotate}deg`})` },
				{ transform: `rotate(${isOpen ? `${this.indicatorRotate}deg` : '0deg'})` },
			],
			{
				duration: SPRING_SNAPPY.duration,
				easing: SPRING_SNAPPY.easingFallback,
				fill: 'forwards',
			},
		)
	}

	render() {
		const summaryClasses = this.classMap({
			[this.summaryPadding]: true,
			'select-none relative flex items-center gap-2 rounded-xl transition-all duration-150': true,
			'hover:brightness-[0.92] active:brightness-[0.85] cursor-pointer group': true,
			'flex-row-reverse': true,
		})

		return html`
			<div class="w-full rounded-xl">
				<div
					${ref(this._summaryRef)}
					class=${summaryClasses}
					tabindex="0"
					role="button"
					@click=${this._handleSummaryClick}
					@keydown=${(e: KeyboardEvent) => {
						if (e.key === 'Enter' || e.key === ' ') {
							e.preventDefault()
							this._toggle()
						}
					}}
				>
					${!this.hideIndicator
						? html`
								<span class="indicator flex items-center justify-center w-5 h-5 rounded-full shrink-0 opacity-70 group-hover:opacity-100 will-change-transform">
									<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
										<path
											d="M9 6L15 12L9 18"
											stroke="currentColor"
											stroke-width="2"
											stroke-linecap="round"
											stroke-linejoin="round"
										/>
									</svg>
								</span>
							`
						: nothing}

					<span class="flex-1 font-medium text-base min-w-0">
						<slot name="summary">${this.summary}</slot>
					</span>

					<slot name="actions"></slot>
				</div>

				${this.inline
					? html`
						<div class="inline-grid" ?data-open=${this.open}>
							<div class="inner">
								<slot ${ref(this._contentSlotRef)}></slot>
							</div>
						</div>
					`
					: html`
						<div style=${styleMap(this.open ? {} : { display: 'none' })}>
							<slot ${ref(this._contentSlotRef)}></slot>
						</div>
					`}
			</div>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-expand': SchmancyExpand
	}
}
