/**
 * Art Directive — GPU-accelerated decorative overlays.
 * Lazy-initialised, IntersectionObserver-paused, RAF-driven, particle-pooled.
 */

import type { ElementPart } from 'lit'
import { noChange } from 'lit'
import { AsyncDirective, directive } from 'lit/async-directive.js'

import type { ArtOptions, ArtState } from './types'
import { createFunkhausOverlay, animateFunkhaus } from './effects/funkhaus'
import { createSamwaOverlay, animateSamwa } from './effects/samwa'
import { createHowlOverlay, animateHowl } from './effects/howl'
import { createErrorOverlay, animateError } from './effects/error'
import { createSnowOverlay, animateSnow } from './effects/snow'
import { createStarfieldOverlay, animateStarfield } from './effects/starfield'

interface ExtendedArtState extends ArtState {
	initialized: boolean
	originalPosition: string
}

class ArtDirective extends AsyncDirective {
	private state: ExtendedArtState | null = null

	render(_options: ArtOptions) {
		return noChange
	}

	override update(part: ElementPart, [options]: [ArtOptions]) {
		const element = part.element as HTMLElement
		const { name, color, intensity = 1, speed = 1, density = 1 } = options

		if (
			this.state &&
			(this.state.effect !== name ||
				this.state.color !== color ||
				this.state.intensity !== intensity ||
				this.state.speed !== speed ||
				this.state.density !== density)
		) {
			this.cleanup()
		}

		if (!this.state) {
			const originalPosition = element.style.position

			this.state = {
				effect: name,
				color,
				intensity,
				speed,
				density,
				element,
				isVisible: true,
				initialized: false,
				originalPosition,
			}

			requestAnimationFrame(() => {
				if (!this.state) return

				const rect = element.getBoundingClientRect()
				const isVisible =
					rect.top < window.innerHeight && rect.bottom > 0 && rect.left < window.innerWidth && rect.right > 0

				if (!isVisible) {
					this.state.isVisible = false
					this.setupVisibilityObserver()
					return
				}

				this.initializeResources()
				this.startAnimation()
				this.setupVisibilityObserver()
			})
		}

		return noChange
	}

	private initializeResources(): void {
		if (!this.state || this.state.initialized) return

		const { element, effect: name } = this.state

		const computedStyle = getComputedStyle(element)
		if (computedStyle.position === 'static') {
			element.style.position = 'relative'
		}

		switch (name) {
			case 'funkhaus':
				createFunkhausOverlay(this.state)
				break
			case 'samwa':
				createSamwaOverlay(this.state)
				break
			case 'howl':
				createHowlOverlay(this.state)
				break
			case 'error':
				createErrorOverlay(this.state)
				break
			case 'snow':
				createSnowOverlay(this.state)
				break
			case 'starfield':
				createStarfieldOverlay(this.state)
				break
		}

		this.state.initialized = true
	}

	private setupVisibilityObserver(): void {
		if (!this.state || typeof IntersectionObserver === 'undefined') return

		this.state.observer = new IntersectionObserver(
			entries => {
				if (!this.state) return
				const isVisible = entries[0].isIntersecting

				if (isVisible && !this.state.isVisible) {
					this.state.isVisible = true

					if (!this.state.initialized) {
						this.initializeResources()
					}

					this.startAnimation()
				} else if (!isVisible && this.state.isVisible) {
					this.state.isVisible = false
					if (this.state.animationId) {
						cancelAnimationFrame(this.state.animationId)
						this.state.animationId = undefined
					}
				}
			},
			{ threshold: 0 },
		)

		this.state.observer.observe(this.state.element)
	}

	private startAnimation(): void {
		if (!this.state || !this.state.isVisible) return
		if (this.state.animationId) return

		if (!this.state.initialized) {
			this.initializeResources()
		}

		const animate = (currentTime: number) => {
			if (!this.state || !this.state.isVisible) {
				if (this.state) this.state.animationId = undefined
				return
			}

			switch (this.state.effect) {
				case 'funkhaus':
					animateFunkhaus(this.state, currentTime)
					break
				case 'samwa':
					animateSamwa(this.state, currentTime)
					break
				case 'howl':
					animateHowl(this.state, currentTime)
					break
				case 'error':
					animateError(this.state, currentTime)
					break
				case 'snow':
					animateSnow(this.state, currentTime)
					break
				case 'starfield':
					animateStarfield(this.state, currentTime)
					break
			}

			this.state.animationId = requestAnimationFrame(animate)
		}

		this.state.animationId = requestAnimationFrame(animate)
	}

	private cleanup(): void {
		if (!this.state) return

		if (this.state.animationId) {
			cancelAnimationFrame(this.state.animationId)
		}

		if (this.state.observer) {
			this.state.observer.disconnect()
		}

		if (this.state.samwa) {
			this.state.samwa.leafPool.clear()
		}

		if (this.state.howl) {
			this.state.howl.steamPool.clear()
		}

		if (this.state.error) {
			this.state.error.boltPool.clear()
		}

		if (this.state.snow) {
			this.state.snow.snowflakePool.clear()
		}

		if (this.state.overlayElement) {
			this.state.overlayElement.remove()
		}

		if (this.state.originalPosition !== undefined) {
			this.state.element.style.position = this.state.originalPosition
		}

		this.state = null
	}

	override disconnected(): void {
		this.cleanup()
	}
}

export const art = directive(ArtDirective)
