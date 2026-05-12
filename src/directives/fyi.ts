/**
 * FYI Directive — cute animated emoji indicators.
 *
 * Shows adorable emoji indicators with timing control, position options, and
 * animation styles. Perfect for subtle hints, onboarding nudges, or playful UI
 * feedback.
 *
 * **Overlay-aware**: Waits for sheets/dialogs to close before showing.
 * **Requires emoji**: Without an emoji, this directive has no visible effect.
 * For shimmer effects, use `nebula()` (header) or `<schmancy-fancy>` (cards).
 *
 * ## Cleanup pattern (Lit AsyncDirective)
 *
 * - `disconnected()`: releases all resources when the directive leaves use.
 * - `reconnected()`: restores working state when the directive returns to use.
 * - `isConnected`: checked before subscribing to prevent memory leaks.
 *
 * @see https://lit.dev/docs/templates/custom-directives/#async-directives
 *
 * @example
 * ```ts
 * // Basic emoji hint
 * html`<button ${fyi('☝️')}>Select folder</button>`
 *
 * // Emoji with position
 * html`<button ${fyi({ emoji: '☝️', position: 'bottom' })}>Select folder</button>`
 *
 * // Full options
 * html`<button ${fyi({
 *   emoji: '🎉',
 *   position: 'bottom',
 *   showAfter: 500,
 *   hideAfter: 3000,
 *   animation: 'bounce',
 * })}>Celebrate!</button>`
 * ```
 */

import { noChange } from 'lit'
import { AsyncDirective, directive } from 'lit/async-directive.js'
import type { ElementPart } from 'lit'
import { EMPTY, Subject, Subscription, fromEvent, timer } from 'rxjs'
import { filter, switchMap, take, takeUntil } from 'rxjs/operators'
import { overlayStack } from '../utils/overlay-stack'

export type FyiPosition = 'auto' | 'top' | 'bottom' | 'left' | 'right'
export type FyiAnimation = 'point' | 'bounce' | 'pulse' | 'none'

export interface FyiOptions {
	/** The emoji to display (omit for shimmer-only mode) */
	emoji?: string
	/** Where to position the indicator (default: 'auto') */
	position?: FyiPosition
	/** Delay in ms before showing (default: 0) */
	showAfter?: number
	/** Duration in ms before auto-hiding (omit to stay visible) */
	hideAfter?: number
	/** Animation type (default: 'point') */
	animation?: FyiAnimation
	/** Duration of one shimmer cycle in ms (default: 3000) */
	shimmerDuration?: number
}

interface FyiState {
	emoji: string
	position: FyiPosition
	showAfter: number
	hideAfter?: number
	animation: FyiAnimation
	shimmerDuration: number
	element?: HTMLElement
	indicator?: HTMLElement
	shimmerOverlay?: HTMLElement
	webAnimation?: Animation
	elementAnimation?: Animation
	originalOverflow?: string
	originalPosition?: string
	activeAnimations: Set<Animation>
}

class FyiDirective extends AsyncDirective {
	private state: FyiState | null = null
	private destroy$ = new Subject<void>()
	private subscriptions = new Subscription()

	render(_options?: FyiOptions) {
		return noChange
	}

	override update(part: ElementPart, [options = {}]: [FyiOptions?]) {
		const element = part.element as HTMLElement

		const {
			emoji = '',
			position = 'auto',
			showAfter = 0,
			hideAfter,
			animation = 'point',
			shimmerDuration = 3000,
		} = options

		if (
			this.state &&
			(this.state.emoji !== emoji ||
				this.state.position !== position ||
				this.state.showAfter !== showAfter ||
				this.state.hideAfter !== hideAfter ||
				this.state.animation !== animation ||
				this.state.shimmerDuration !== shimmerDuration)
		) {
			this.cleanup()
		}

		if (!this.state && this.isConnected) {
			this.state = {
				emoji,
				position,
				showAfter,
				hideAfter,
				animation,
				shimmerDuration,
				element,
				activeAnimations: new Set(),
			}

			this.destroy$ = new Subject<void>()
			this.subscriptions = new Subscription()

			this.scheduleShow()
		}

		return noChange
	}

	private scheduleShow() {
		if (!this.state || !this.isConnected) return

		const showDelay = this.state.showAfter

		const showSubscription = timer(showDelay)
			.pipe(
				takeUntil(this.destroy$),
				filter(() => this.isConnected && this.state !== null),
				switchMap(() => {
					if (overlayStack.activeCount > 0) {
						return timer(500).pipe(
							takeUntil(this.destroy$),
							switchMap(() => this.waitForOverlaysClear()),
						)
					}
					return timer(0)
				}),
			)
			.subscribe({
				next: () => {
					if (this.isConnected && this.state) {
						this.show()
					}
				},
				error: () => {
					// Graceful degradation — overlay scheduling is best-effort.
				},
			})

		this.subscriptions.add(showSubscription)
	}

	private waitForOverlaysClear() {
		return timer(500).pipe(
			takeUntil(this.destroy$),
			switchMap(() => {
				if (!this.isConnected) return EMPTY
				if (overlayStack.activeCount > 0) {
					return this.waitForOverlaysClear()
				}
				return timer(0)
			}),
		)
	}

	private show() {
		if (!this.state || !this.state.element || !this.isConnected) return

		const hostElement = this.state.element
		const computedStyle = window.getComputedStyle(hostElement)
		const computedPosition = computedStyle.position

		this.state.originalOverflow = hostElement.style.overflow
		this.state.originalPosition = hostElement.style.position

		if (computedPosition === 'static') {
			hostElement.style.position = 'relative'
		}

		hostElement.style.overflow = 'hidden'

		const shimmerOverlay = document.createElement('div')
		shimmerOverlay.className = 'fyi-shimmer-overlay'

		const borderRadius = computedStyle.borderRadius

		Object.assign(shimmerOverlay.style, {
			position: 'absolute',
			inset: '0',
			pointerEvents: 'none',
			zIndex: '9999',
			borderRadius: borderRadius,
			background: `
				linear-gradient(
					108deg,
					transparent 0%,
					transparent 40%,
					rgba(255, 255, 255, 0.02) 44%,
					rgba(255, 255, 255, 0.06) 48%,
					rgba(255, 255, 255, 0.08) 50%,
					rgba(255, 255, 255, 0.06) 52%,
					rgba(255, 255, 255, 0.02) 56%,
					transparent 60%,
					transparent 100%
				)
			`,
			backgroundSize: '400% 100%',
			backgroundRepeat: 'no-repeat',
		})

		hostElement.appendChild(shimmerOverlay)
		this.state.shimmerOverlay = shimmerOverlay

		this.state.elementAnimation = shimmerOverlay.animate(
			[{ backgroundPosition: '100% 0' }, { backgroundPosition: '0% 0' }],
			{
				duration: this.state.shimmerDuration,
				easing: 'linear',
				iterations: Infinity,
			},
		)
		this.state.activeAnimations.add(this.state.elementAnimation)

		if (!this.state.emoji) {
			this.scheduleHide()
			return
		}

		const indicator = document.createElement('div')
		indicator.className = 'fyi-indicator'
		indicator.textContent = this.state.emoji

		const positionTransform = this.getPositionTransform(this.state.position)

		Object.assign(indicator.style, {
			fontSize: '1.5rem',
			pointerEvents: 'none',
			zIndex: '10001',
		})

		indicator.style.transform = positionTransform

		const rect = this.state.element.getBoundingClientRect()
		indicator.style.position = 'fixed'

		switch (this.state.position) {
			case 'bottom':
				indicator.style.top = `${rect.bottom + 2}px`
				indicator.style.left = `${rect.left + rect.width / 2}px`
				break
			case 'top':
				indicator.style.bottom = `${window.innerHeight - rect.top}px`
				indicator.style.left = `${rect.left + rect.width / 2}px`
				break
			case 'left':
				indicator.style.right = `${window.innerWidth - rect.left}px`
				indicator.style.top = `${rect.top + rect.height / 2}px`
				break
			case 'right':
				indicator.style.left = `${rect.right + 12}px`
				indicator.style.top = `${rect.top + rect.height / 2}px`
				break
			case 'auto':
			default:
				indicator.style.top = `${rect.top}px`
				indicator.style.right = `${window.innerWidth - rect.right}px`
				break
		}

		document.body.appendChild(indicator)
		this.state.indicator = indicator

		const fadeIn = indicator.animate(
			[
				{ opacity: 0, transform: `${positionTransform} scale(0.5)` },
				{ opacity: 1, transform: `${positionTransform} scale(1)` },
			],
			{
				duration: 400,
				easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
				fill: 'forwards',
			},
		)
		this.state.activeAnimations.add(fadeIn)

		this.applyAnimation(fadeIn, indicator, positionTransform)

		this.scheduleHide()
	}

	private applyAnimation(fadeIn: Animation, indicator: HTMLElement, positionTransform: string) {
		if (!this.state) return

		const animation = this.state.animation
		const position = this.state.position

		switch (animation) {
			case 'point': {
				const pointingKeyframes = this.getPointingKeyframes(position, positionTransform)

				const animationFinish$ = fromEvent(fadeIn, 'finish').pipe(take(1), takeUntil(this.destroy$))

				const subscription = animationFinish$.subscribe(() => {
					if (!this.state || !this.isConnected) return

					const anim = indicator.animate(pointingKeyframes, {
						duration: 1800,
						easing: 'ease-in-out',
						iterations: Infinity,
					})
					this.state.webAnimation = anim
					this.state.activeAnimations.add(anim)
				})

				this.subscriptions.add(subscription)
				break
			}

			case 'bounce': {
				const anim = indicator.animate(
					[
						{ opacity: 0, transform: `${positionTransform} scale(0.3)`, offset: 0 },
						{ transform: `${positionTransform} scale(1.1)`, offset: 0.5 },
						{ transform: `${positionTransform} scale(0.95)`, offset: 0.7 },
						{ opacity: 1, transform: `${positionTransform} scale(1)`, offset: 1 },
					],
					{
						duration: 600,
						easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
						fill: 'forwards',
					},
				)
				this.state.webAnimation = anim
				this.state.activeAnimations.add(anim)
				break
			}

			case 'pulse': {
				const animationFinish$ = fromEvent(fadeIn, 'finish').pipe(take(1), takeUntil(this.destroy$))

				const subscription = animationFinish$.subscribe(() => {
					if (!this.state || !this.isConnected) return

					const anim = indicator.animate(
						[
							{ transform: `${positionTransform} scale(1)` },
							{ transform: `${positionTransform} scale(1.15)` },
							{ transform: `${positionTransform} scale(1)` },
						],
						{
							duration: 1500,
							easing: 'ease-in-out',
							iterations: Infinity,
						},
					)
					this.state.webAnimation = anim
					this.state.activeAnimations.add(anim)
				})

				this.subscriptions.add(subscription)
				break
			}

			case 'none': {
				const anim = indicator.animate([{ opacity: 0 }, { opacity: 1 }], {
					duration: 300,
					easing: 'ease-in',
					fill: 'forwards',
				})
				this.state.webAnimation = anim
				this.state.activeAnimations.add(anim)
				break
			}
		}
	}

	private getPointingKeyframes(position: FyiPosition, positionTransform: string): Keyframe[] {
		switch (position) {
			case 'top':
				return [
					{ transform: `${positionTransform} scale(1) translateY(0px)` },
					{ transform: `${positionTransform} scale(1) translateY(8px)` },
					{ transform: `${positionTransform} scale(1) translateY(0px)` },
				]
			case 'bottom':
				return [
					{ transform: `${positionTransform} scale(1) translateY(0px)` },
					{ transform: `${positionTransform} scale(1) translateY(-8px)` },
					{ transform: `${positionTransform} scale(1) translateY(0px)` },
				]
			case 'left':
				return [
					{ transform: `${positionTransform} scale(1) translateX(0px)` },
					{ transform: `${positionTransform} scale(1) translateX(8px)` },
					{ transform: `${positionTransform} scale(1) translateX(0px)` },
				]
			case 'right':
				return [
					{ transform: `${positionTransform} scale(1) translateX(0px)` },
					{ transform: `${positionTransform} scale(1) translateX(-8px)` },
					{ transform: `${positionTransform} scale(1) translateX(0px)` },
				]
			case 'auto':
			default:
				return [
					{ transform: `${positionTransform} scale(1) translate(0px, 0px)` },
					{ transform: `${positionTransform} scale(1) translate(-6px, 6px)` },
					{ transform: `${positionTransform} scale(1) translate(0px, 0px)` },
				]
		}
	}

	private scheduleHide() {
		if (!this.state?.hideAfter || !this.isConnected) return

		const hideSubscription = timer(this.state.hideAfter)
			.pipe(takeUntil(this.destroy$))
			.subscribe(() => {
				if (this.isConnected) {
					this.hide()
				}
			})

		this.subscriptions.add(hideSubscription)
	}

	private hide() {
		if (!this.state) return

		const state = this.state
		const exitPromises: Promise<void>[] = []

		if (state.indicator) {
			const indicatorExit = state.indicator.animate([{ opacity: 1 }, { opacity: 0 }], {
				duration: 600,
				easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
				fill: 'forwards',
			})
			state.activeAnimations.add(indicatorExit)

			const cleanupIndicator = () => {
				state.webAnimation?.cancel()
				state.indicator?.remove()
				return undefined
			}
			exitPromises.push(indicatorExit.finished.then(cleanupIndicator).catch(cleanupIndicator))
		}

		if (state.shimmerOverlay) {
			const shimmerExit = state.shimmerOverlay.animate(
				[
					{ opacity: 1 },
					{ opacity: 0.7, offset: 0.3 },
					{ opacity: 0.3, offset: 0.7 },
					{ opacity: 0 },
				],
				{
					duration: 3000,
					easing: 'ease-out',
					fill: 'forwards',
				},
			)
			state.activeAnimations.add(shimmerExit)

			const cleanupShimmer = () => {
				state.elementAnimation?.cancel()
				state.shimmerOverlay?.remove()
				return undefined
			}
			exitPromises.push(shimmerExit.finished.then(cleanupShimmer).catch(cleanupShimmer))
		}

		Promise.all(exitPromises).then(() => {
			if (this.state !== state) return undefined

			this.restoreStyles(state)
			this.state = null
			return undefined
		})
	}

	private restoreStyles(state: FyiState) {
		if (state.element) {
			if (state.originalOverflow !== undefined) {
				state.element.style.overflow = state.originalOverflow
			}
			if (state.originalPosition !== undefined) {
				state.element.style.position = state.originalPosition
			}
		}
	}

	private getPositionTransform(position: FyiPosition): string {
		switch (position) {
			case 'top':
			case 'bottom':
				return 'translateX(-50%)'
			case 'left':
			case 'right':
				return 'translateY(-50%)'
			case 'auto':
			default:
				return ''
		}
	}

	private cleanup() {
		this.destroy$.next()
		this.destroy$.complete()

		this.subscriptions.unsubscribe()

		if (!this.state) return

		this.state.activeAnimations.forEach(anim => anim.cancel())
		this.state.activeAnimations.clear()

		this.restoreStyles(this.state)

		this.state.shimmerOverlay?.remove()
		this.state.indicator?.remove()

		this.state = null
	}

	override disconnected() {
		this.cleanup()
	}

	override reconnected() {
		this.destroy$ = new Subject<void>()
		this.subscriptions = new Subscription()
	}
}

export const fyi = directive(FyiDirective)
