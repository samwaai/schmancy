import { SchmancyElement, SurfaceMixin } from '@mixins/index'
import { css, html, LitElement, nothing } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { cursorGlow } from '../directives/cursor-glow'
import { magnetic } from '../directives/magnetic'
import { createRef, ref, Ref } from 'lit/directives/ref.js'
import { BehaviorSubject, fromEvent, Subscription } from 'rxjs'
import { distinctUntilChanged, filter, take, takeUntil, tap } from 'rxjs/operators'
import { SPRING_SNAPPY } from '../utils/animation.js'
import { reducedMotion$ } from '../directives/reduced-motion'

@customElement('schmancy-details')
export default class SchmancyDetails extends SurfaceMixin(SchmancyElement) {
	static styles = [css`
		:host {
			display: block;
		}

		:host([overlay]) {
			position: relative;
		}

		:host([open]) {
			z-index: 10;
		}

		details {
			background: inherit;
			color: inherit;
			border-radius: inherit;
		}

		summary::-webkit-details-marker {
			display: none;
		}

		summary {
			list-style: none;
			color: inherit;
		}

		/*
		 * Blackbird 2.1 — CSS-driven collapse/expand
		 *
		 * Single animation system: CSS grid transition handles height,
		 * coordinated opacity fade for buttery smooth feel.
		 * No competing Web Animations API on content.
		 */

		.content-wrapper {
			display: grid;
			grid-template-rows: 0fr;
			overflow: hidden;
			opacity: 0;
			transition:
				grid-template-rows 400ms cubic-bezier(0.34, 1.2, 0.64, 1),
				opacity 250ms ease;
		}

		/* Spring easing when linear() is supported */
		@supports (animation-timing-function: linear(0, 1)) {
			.content-wrapper {
				transition:
					grid-template-rows 400ms linear(
						0, 0.006, 0.025 2.8%, 0.101 6.1%, 0.539 18.9%, 0.721 25.3%, 0.849 31.5%,
						0.937 38.1%, 0.968 41.8%, 0.991 45.7%, 1.006 50%, 1.015 54.8%,
						1.017 63.3%, 1.001
					),
					opacity 250ms ease;
			}
		}

		.content-wrapper[data-open='true'] {
			grid-template-rows: 1fr;
			opacity: 1;
		}

		.content-inner {
			min-height: 0;
			overflow: hidden;
		}

		/*
		 * Progressive Enhancement: ::details-content (Chrome 131+)
		 *
		 * When both ::details-content AND interpolate-size are supported,
		 * the browser handles height animation natively — including animated
		 * close via transition-behavior: allow-discrete on content-visibility.
		 * The grid wrapper becomes transparent (display: contents).
		 */
		@supports selector(::details-content) and (interpolate-size: allow-keywords) {
			:host {
				interpolate-size: allow-keywords;
			}

			.content-wrapper {
				display: contents;
			}

			details::details-content {
				block-size: 0;
				overflow-y: clip;
				opacity: 0;
				transition:
					block-size 400ms cubic-bezier(0.34, 1.2, 0.64, 1),
					opacity 250ms ease,
					content-visibility 400ms;
				transition-behavior: allow-discrete;
			}

			details[open]::details-content {
				block-size: auto;
				opacity: 1;
			}
		}

		@media (prefers-reduced-motion: reduce) {
			.content-wrapper {
				transition: none;
			}
			details::details-content {
				transition: none;
			}
		}
	`];
	protected static shadowRootOptions = {
		...LitElement.shadowRootOptions,
		mode: 'open' as const,
		delegatesFocus: true,
	}

	@property() summary = ''

	@property({ type: Boolean, reflect: true })
	get open() {
		return this._open$.value
	}
	set open(value: boolean) {
		if (this._open$.value !== value) {
			this._open$.next(value)
		}
	}

	@property({ attribute: 'indicator-placement', reflect: true })
	indicatorPlacement: 'start' | 'end' = 'end'

	@property({ type: Boolean, attribute: 'hide-indicator' })
	hideIndicator = false

	@property({ type: Number, attribute: 'indicator-rotate' })
	indicatorRotate: number = 90

	@property({ type: Boolean, reflect: true })
	locked = false

	@property({ type: Boolean, reflect: true })
	overlay = false

	@property({ attribute: 'summary-padding' })
	summaryPadding = 'p-3'

	@property({ attribute: 'content-padding' })
	contentPadding = 'p-3'

	private _open$ = new BehaviorSubject<boolean>(false)
	private _indicatorRef: Ref<HTMLElement> = createRef()
	private _contentRef: Ref<HTMLDivElement> = createRef()
	private _currentAnimation?: Animation
	private _indicatorIsOpen = false
	private _closing = false
	private _closeSub?: Subscription

	/** True when browser handles close animation natively via ::details-content */
	private _nativeAnim =
		typeof CSS !== 'undefined' &&
		!!CSS.supports?.('selector(::details-content)') &&
		!!CSS.supports?.('interpolate-size', 'allow-keywords')

	/**
	 * Lazy rendering: tracks if content has ever been opened.
	 * Once true, content stays rendered (even when closed) for smooth animations.
	 */
	@state() private _hasOpened = false

	constructor() {
		super()
		this.type = 'solid'
		this.rounded = 'all'
	}

	connectedCallback() {
		super.connectedCallback()

		this._open$
			.pipe(
				distinctUntilChanged(),
				tap(isOpen => {
					if (isOpen && !this._hasOpened) {
						this._hasOpened = true
					}
					this._animateIndicator(isOpen)
					this._updateIndicatorSlot()
				}),
				takeUntil(this.disconnecting),
			)
			.subscribe(() => this.requestUpdate())
	}

	disconnectedCallback() {
		super.disconnectedCallback()
		this._closeSub?.unsubscribe()
	}

	render() {
		const isOpen = this._open$.value

		const detailsClasses = this.classMap({
			'w-full rounded-xl transition-shadow duration-200 ease-out': true,
			'overflow-visible': !this.overlay,
			'overflow-visible relative': this.overlay,
		})

		const summaryClasses = this.classMap({
			[this.summaryPadding]: true,
			'select-none relative flex items-center gap-2 rounded-xl': true,
			'transition-colors duration-150': true,
			'hover:bg-surface-on/5 active:bg-surface-on/8': !this.locked,
			'focus-visible:ring-2 focus-visible:ring-primary-default/50 focus-visible:ring-offset-1': !this.locked,
			'cursor-pointer group': !this.locked,
			'cursor-default': this.locked,
			'flex-row': this.indicatorPlacement === 'start',
			'flex-row-reverse': this.indicatorPlacement === 'end',
		})

		const contentClasses = this.classMap({
			[this.contentPadding]: true,
			'text-sm': true,
			'absolute inset-x-0 bg-surface-lowest/55 backdrop-blur-[16px] shadow-2xl rounded-b-xl z-20':
				this.overlay,
		})

		return html`
			<details ?open=${isOpen} @toggle=${this._handleToggle} class=${detailsClasses}>
				<summary ${this.locked ? '' : magnetic({ strength: 2, radius: 50 })} ${this.locked ? '' : cursorGlow({ radius: 250, intensity: 0.08 })} class=${summaryClasses} tabindex=${this.locked ? -1 : 0} @click=${this._handleSummaryClick}>
					${!this.hideIndicator
						? html`
								<span
									${ref(this._indicatorRef)}
									class="flex items-center justify-center w-5 h-5 rounded-full shrink-0 opacity-70 group-hover:opacity-100"
								>
									<slot name="indicator" @slotchange=${this._handleIndicatorSlotChange}>
										<svg
											width="20"
											height="20"
											viewBox="0 0 24 24"
											fill="none"
											class="w-5 h-5"
											aria-hidden="true"
										>
											<path
												d="M9 6L15 12L9 18"
												stroke="currentColor"
												stroke-width="2"
												stroke-linecap="round"
												stroke-linejoin="round"
											/>
										</svg>
									</slot>
								</span>
							`
						: ''}

					<span class="flex-1 min-w-0">
						<slot name="summary">${this.summary}</slot>
					</span>

					<slot name="actions"></slot>
				</summary>

				<div
					${ref(this._contentRef)}
					class="content-wrapper"
					data-open=${isOpen && !this._closing}
					aria-hidden=${isOpen ? 'false' : 'true'}
				>
					<div class="content-inner">
						${this._hasOpened
							? html`
									<div class=${contentClasses}>
										<slot></slot>
										<slot name="details"></slot>
									</div>
								`
							: nothing}
					</div>
				</div>
			</details>
		`
	}

	private _handleSummaryClick(e: MouseEvent) {
		if ((e.target as HTMLElement).closest('[slot="actions"]')) {
			e.preventDefault()
			return
		}
		if (this.locked) {
			e.preventDefault()
			return
		}
		if (this._closing) {
			e.preventDefault()
			return
		}

		// Native animated path (Chromium 131+): browser handles everything via CSS
		if (this._nativeAnim) return

		// Fallback: manually animate close via CSS transition, then close native details
		if (this._open$.value) {
			e.preventDefault()
			this._startClose()
		}
		// If closed, let native open happen (handled by _handleToggle)
	}

	private _handleToggle(e: Event) {
		e.stopPropagation()

		const ownDetails = this.shadowRoot?.querySelector('details')
		if (e.target !== ownDetails) return

		const newState = ownDetails.open

		if (this._nativeAnim) {
			// Native path: handle both open and close
			if (this._open$.value !== newState) {
				this.open = newState
				this.dispatchScopedEvent('toggle', { open: newState })
			}
		} else {
			// Fallback path: only handle OPEN (close is driven by _startClose)
			if (newState && this._open$.value !== newState) {
				this.open = newState
				this.dispatchScopedEvent('toggle', { open: newState })
			}
		}
	}

	/**
	 * Fallback close: trigger CSS grid+opacity transition, then close native <details>.
	 * The CSS transition (400ms) handles the visual collapse — no WAAPI needed.
	 */
	private _startClose() {
		this._closing = true
		this._closeSub?.unsubscribe()

		// Immediately collapse the grid wrapper via DOM attribute
		this._contentRef.value?.setAttribute('data-open', 'false')

		// Animate indicator immediately
		this._animateIndicator(false)

		// After CSS transition completes, close native details and update state
		const wrapper = this._contentRef.value
		if (!wrapper) return

		this._closeSub = fromEvent<TransitionEvent>(wrapper, 'transitionend').pipe(
			filter(e => e.propertyName === 'grid-template-rows'),
			take(1),
			tap(() => {
				this._closing = false
				this.open = false
				this.dispatchScopedEvent('toggle', { open: false })
			}),
			takeUntil(this.disconnecting),
		).subscribe()
	}

	private _handleIndicatorSlotChange(e: Event) {
		const slot = e.target as HTMLSlotElement
		slot.assignedElements().forEach(el => {
			el.setAttribute('data-open', String(this._open$.value))
		})
	}

	private _updateIndicatorSlot() {
		const slot = this.shadowRoot?.querySelector('slot[name="indicator"]') as HTMLSlotElement | null
		if (slot) {
			slot.assignedElements().forEach(el => {
				el.setAttribute('data-open', String(this._open$.value))
			})
		}
	}

	/** Idempotent indicator rotation — skips if already at target state */
	private _animateIndicator(isOpen: boolean) {
		if (this._indicatorIsOpen === isOpen) return
		this._indicatorIsOpen = isOpen

		const indicator = this._indicatorRef.value
		if (!indicator || reducedMotion$.value) return

		this._currentAnimation?.cancel()

		this._currentAnimation = indicator.animate(
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
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-details': SchmancyDetails
	}
}
