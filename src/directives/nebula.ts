/**
 * Nebula Directive v3 - Surreal Dimensional Rift
 *
 * A surreal, otherworldly cosmic loading effect inspired by deep-space imagery
 * but rendered as a dimensional rift — chromatic aberration channels, iridescent
 * hue-cycling core, event horizon pulse, bioluminescent tendrils, and quantum
 * particles — all implemented with CSS @keyframes for GPU-composited performance.
 *
 * ## Performance (v3 architecture):
 * - 6 DOM layers with CSS @keyframes (no JS in hot path)
 * - Shared NebulaCoordinator singleton (1 IntersectionObserver for all instances)
 * - Visibility gating via CSS class toggle (`paused`/`running`)
 * - `contain: strict` + `translateZ(0)` for compositor promotion
 * - `animation-play-state` pauses when off-screen or tab hidden
 *
 * ## Visual layers (back to front):
 * 1. Cosmic Dust + Void — static dark filaments, vignette, void pockets (multiply, zero animation cost)
 * 2. Chromatic Red — aberration channel shifted right (screen blend)
 * 3. Chromatic Blue — aberration channel shifted left (screen blend)
 * 4. Iridescent Core + Event Horizon — hue-rotate cycling center (screen blend)
 * 5. Bioluminescent Tendrils — organic breathing gas wisps (screen blend)
 * 6. Quantum Particles — scattered hue-shifting dots (screen blend)
 *
 * Uses spring physics from Blackbird animation system for organic motion.
 * Respects prefers-reduced-motion for accessibility.
 *
 * Usage:
 * ```ts
 * html`<div ${nebula()}>Content</div>`
 * html`<div ${nebula({ active: this.loading })}>Content</div>`
 * html`<div ${nebula({ active: true, temperature: -0.5 })}>Content</div>`
 * ```
 */

import { noChange } from 'lit'
import { AsyncDirective, directive } from 'lit/async-directive.js'
import type { ElementPart } from 'lit'
import { SPRING_SMOOTH, SPRING_GENTLE, getEasing } from '../utils/animation'
import { reducedMotion$ } from './reduced-motion'
import { Subscription, timer, fromEvent, from, EMPTY } from 'rxjs'
import { take, tap, catchError } from 'rxjs/operators'

export interface NebulaOptions {
	/** Whether the nebula is active/visible. Default: true (auto-shows, auto-hides after autoHideDuration) */
	active?: boolean

	/** Auto-hide after this duration (ms). Set to 0 to disable. Default: 3000 */
	autoHideDuration?: number

	/** Render behind content instead of on top. Default: true */
	background?: boolean

	/** Overall brightness/intensity (0-1). Default: 1 */
	intensity?: number

	/** Blur amount multiplier. Default: 1 */
	blur?: number

	/** Animation speed multiplier (0.5 = half speed, 2 = double speed). Default: 1 */
	speed?: number

	/** Fade-in duration (ms). Default: 1000 */
	fadeInDuration?: number

	/** Fade-out duration (ms). Default: 8000 */
	fadeOutDuration?: number

	/** Opacity when idle/dimmed (0-1). Set to 0 to fully hide. Default: 0.6 */
	idleOpacity?: number

	/** Whether idle state continues breathing. Default: true */
	idleBreathe?: boolean

	/** Color temperature shift (-1 = cool/blue, 0 = neutral, 1 = warm/pink). Default: 0 */
	temperature?: number

	/** Chromatic aberration intensity (0-1). Default: 1 */
	chromaticAberration?: number

	/** Number of quantum particles. Default: 8 */
	particleCount?: number
}

const DEFAULTS: Required<NebulaOptions> = {
	active: true,
	autoHideDuration: 3000,
	background: true,
	intensity: 1,
	blur: 1,
	speed: 1,
	fadeInDuration: 1000,
	fadeOutDuration: 8000,
	idleOpacity: 0.6,
	idleBreathe: true,
	temperature: 0,
	chromaticAberration: 1,
	particleCount: 30,
}

// =============================================================================
// EASING CONSTANTS (cached, no function calls in hot path)
// =============================================================================

const BREATHING_EASING = 'cubic-bezier(0.37, 0, 0.63, 1)'
const DRIFT_EASING = 'cubic-bezier(0.25, 0.1, 0.25, 1)'

// =============================================================================
// CSS KEYFRAMES (injected once per document)
// =============================================================================

let stylesInjected = false

function injectGlobalStyles(): void {
	if (stylesInjected || typeof document === 'undefined') return
	stylesInjected = true

	const style = document.createElement('style')
	style.id = 'nebula-directive-styles'
	style.textContent = `
/* =============================================================================
   NEBULA v3 - SURREAL DIMENSIONAL RIFT - GPU-COMPOSITED CSS ANIMATIONS
   Chromatic aberration, iridescent hue-cycling, event horizon, tendrils.
   Performance: translate3d + opacity for most layers, hue-rotate for core only.
   ============================================================================= */

/* Chromatic red channel - rightward aberration drift */
@keyframes nebula-chromatic-red {
	0%, 100% { transform: translate3d(var(--nebula-aberration, 3px), 0, 0); }
	25% { transform: translate3d(calc(var(--nebula-aberration, 3px) * 1.8), -1%, 0); }
	50% { transform: translate3d(var(--nebula-aberration, 3px), 1%, 0); }
	75% { transform: translate3d(calc(var(--nebula-aberration, 3px) * 0.5), 0, 0); }
}

/* Chromatic blue channel - leftward counter-drift */
@keyframes nebula-chromatic-blue {
	0%, 100% { transform: translate3d(calc(var(--nebula-aberration, 3px) * -1), 0, 0); }
	25% { transform: translate3d(calc(var(--nebula-aberration, 3px) * -0.5), 1%, 0); }
	50% { transform: translate3d(calc(var(--nebula-aberration, 3px) * -1), -1%, 0); }
	75% { transform: translate3d(calc(var(--nebula-aberration, 3px) * -1.8), 0, 0); }
}

/* Iridescent core - continuous 360-degree hue rotation (the ONE filter animation) */
@keyframes nebula-iridescent {
	0% { filter: hue-rotate(0deg) blur(var(--nebula-blur-core, 12px)) saturate(1.6); }
	100% { filter: hue-rotate(360deg) blur(var(--nebula-blur-core, 12px)) saturate(1.6); }
}

/* Bioluminescent tendrils - organic breathing */
@keyframes nebula-tendrils-breathe {
	0%, 100% { opacity: 0.6; transform: translate3d(0, 0, 0); }
	30% { opacity: 0.9; transform: translate3d(1%, -1.5%, 0); }
	60% { opacity: 0.5; transform: translate3d(-1%, 1.5%, 0); }
}

/* Quantum particle twinkle - opacity only (cheapest) */
@keyframes nebula-particle-twinkle {
	0%, 100% { opacity: 0.7; }
	15% { opacity: 1; }
	40% { opacity: 0.5; }
	65% { opacity: 0.85; }
	85% { opacity: 0.6; }
}

/* Idle breathing - gentle pulse when dimmed */
@keyframes nebula-idle-breathe {
	0%, 100% {
		opacity: var(--nebula-idle-opacity, 0.08);
		filter: blur(calc(var(--nebula-blur-base, 10px) * 8));
		transform: scale(1);
	}
	50% {
		opacity: calc(var(--nebula-idle-opacity, 0.08) * 1.4);
		filter: blur(calc(var(--nebula-blur-base, 10px) * 10));
		transform: scale(1.005);
	}
}

/* =============================================================================
   STATE CLASSES - Control via CSS class toggle (no JS animation calls)
   ============================================================================= */

.nebula-overlay {
	contain: strict;
	pointer-events: none;
	isolation: isolate;
}

.nebula-overlay.paused .nebula-layer {
	animation-play-state: paused !important;
}

.nebula-overlay.running .nebula-layer {
	animation-play-state: running !important;
}

/* Reduced motion - respect user preferences */
@media (prefers-reduced-motion: reduce) {
	.nebula-layer {
		animation: none !important;
		transition: opacity 0s !important;
	}
}
`
	document.head.appendChild(style)
}

// =============================================================================
// STATE INTERFACE (simplified)
// =============================================================================

interface State {
	element: HTMLElement
	overlay: HTMLElement | null
	originalPosition: string
	originalOverflow: string
	originalContain: string
	isDimmed: boolean
	autoHideSub: Subscription | null
	options: Required<NebulaOptions>
	reducedMotion: boolean
	isVisible: boolean
}

// =============================================================================
// SINGLETON COORDINATOR (optimized)
// =============================================================================

class NebulaCoordinator {
	private static _instance: NebulaCoordinator | null = null
	private elementToDirective = new WeakMap<HTMLElement, NebulaDirective>()
	private instances = new Set<NebulaDirective>()
	private observer: IntersectionObserver | null = null
	private visibilitySub: Subscription | null = null
	private tabVisible = true

	static get instance(): NebulaCoordinator {
		if (!NebulaCoordinator._instance) {
			NebulaCoordinator._instance = new NebulaCoordinator()
		}
		return NebulaCoordinator._instance
	}

	register(dir: NebulaDirective, element: HTMLElement): void {
		const wasEmpty = this.instances.size === 0
		this.instances.add(dir)
		this.elementToDirective.set(element, dir)

		if (wasEmpty) {
			this.setup()
		}

		this.observer?.observe(element)
	}

	unregister(dir: NebulaDirective, element: HTMLElement): void {
		this.observer?.unobserve(element)
		this.elementToDirective.delete(element)
		this.instances.delete(dir)

		if (this.instances.size === 0) {
			this.teardown()
		}
	}

	private setup(): void {
		// IntersectionObserver for element visibility
		this.observer = new IntersectionObserver(
			entries => {
				for (const entry of entries) {
					const dir = this.elementToDirective.get(entry.target as HTMLElement)
					if (dir) {
						dir.onVisibilityChange(entry.isIntersecting && this.tabVisible)
					}
				}
			},
			{ threshold: 0 },
		)

		// Tab visibility - batch update via CSS class
		this.visibilitySub = fromEvent(document, 'visibilitychange').pipe(
			tap(() => {
				this.tabVisible = document.visibilityState === 'visible'
				for (const dir of this.instances) {
					dir.onVisibilityChange(this.tabVisible)
				}
			}),
		).subscribe()
	}

	private teardown(): void {
		if (this.observer) {
			this.observer.disconnect()
			this.observer = null
		}
		if (this.visibilitySub) {
			this.visibilitySub.unsubscribe()
			this.visibilitySub = null
		}
	}
}

// =============================================================================
// DIRECTIVE IMPLEMENTATION (optimized)
// =============================================================================

class NebulaDirective extends AsyncDirective {
	private state: State | null = null
	private coordinator = NebulaCoordinator.instance

	render(_options?: NebulaOptions) {
		return noChange
	}

	override update(part: ElementPart, [options = {}]: [NebulaOptions?]) {
		const element = part.element as HTMLElement
		const opts = { ...DEFAULTS, ...options }

		if (opts.active) {
			this.show(element, opts)
		} else {
			this.hide(opts)
		}

		return noChange
	}

	// Called by coordinator - toggles CSS class (no JS animation API calls)
	onVisibilityChange(isVisible: boolean): void {
		if (!this.state?.overlay) return

		const wasVisible = this.state.isVisible
		this.state.isVisible = isVisible

		if (wasVisible !== isVisible) {
			this.state.overlay.classList.toggle('paused', !isVisible)
			this.state.overlay.classList.toggle('running', isVisible)
		}
	}

	private show(element: HTMLElement, opts: Required<NebulaOptions>): void {
		injectGlobalStyles()

		// Clear any pending auto-hide
		if (this.state?.autoHideSub) {
			this.state.autoHideSub.unsubscribe()
			this.state.autoHideSub = null
		}

		const reducedMotion = reducedMotion$.value

		// If already showing but dimmed, reawaken
		if (this.state?.overlay && this.state.isDimmed) {
			this.state.isDimmed = false
			this.state.options = opts
			this.awakenOverlay(opts, reducedMotion)
			this.scheduleAutoHide(opts)
			return
		}

		// Already showing and active
		if (this.state?.overlay) {
			this.scheduleAutoHide(opts)
			return
		}

		// Create new overlay
		this.createOverlay(element, opts, reducedMotion)
		this.scheduleAutoHide(opts)
	}

	private awakenOverlay(opts: Required<NebulaOptions>, reducedMotion: boolean): void {
		if (!this.state?.overlay) return

		const overlay = this.state.overlay
		const awakenDuration = reducedMotion ? 0 : opts.fadeInDuration * 0.6
		const easing = reducedMotion ? 'linear' : getEasing(SPRING_SMOOTH)

		// Update CSS custom properties
		overlay.style.setProperty('--nebula-intensity', String(opts.intensity))

		overlay.animate(
			[
				{ opacity: opts.idleOpacity, transform: 'scale(0.98)', filter: `blur(${4 * opts.blur}px)` },
				{ opacity: opts.intensity * 0.7, transform: 'scale(1.01)', filter: `blur(${1 * opts.blur}px)` },
				{ opacity: opts.intensity, transform: 'scale(1)', filter: 'blur(0px)' },
			] as Keyframe[],
			{
				duration: awakenDuration,
				easing,
				fill: 'forwards',
			},
		)

		// Resume CSS animations
		overlay.classList.remove('paused')
		overlay.classList.add('running')
	}

	private createOverlay(element: HTMLElement, opts: Required<NebulaOptions>, reducedMotion: boolean): void {
		const computedStyle = window.getComputedStyle(element)
		const computedPosition = computedStyle.position

		const originalPosition = element.style.position
		const originalOverflow = element.style.overflow
		const originalContain = element.style.contain

		if (computedPosition === 'static') {
			element.style.position = 'relative'
		}
		element.style.overflow = 'hidden'
		element.style.contain = 'paint'

		// =====================================================================
		// SURREAL DIMENSIONAL RIFT - Color Palette
		// Temperature shifts the balance between warm (pink/magenta) and cool (blue/cyan)
		// Opacities kept subdued for dark, moody aesthetic
		// =====================================================================
		const temp = opts.temperature
		const warmShift = Math.max(0, temp)
		const coolShift = Math.max(0, -temp)
		const I = opts.intensity // shorthand
		const aberrationPx = Math.round(3 + opts.chromaticAberration * 5)

		// Surreal palette
		const red = { r: 255, g: Math.round(20 + coolShift * 60), b: Math.round(80 + coolShift * 80) }
		const blue = { r: Math.round(20 + warmShift * 80), g: 100, b: Math.round(255 - warmShift * 55) }
		const pink = { r: 255, g: Math.round(100 + coolShift * 100), b: 200 }
		const cyan = { r: Math.round(warmShift * 100), g: Math.round(255 - warmShift * 55), b: 200 }
		const magenta = { r: 255, g: Math.round(100 + coolShift * 55), b: Math.round(255 - coolShift * 55) }

		// === CONTAINER ===
		const overlay = document.createElement('div')
		overlay.className = 'nebula-overlay running'
		Object.assign(overlay.style, {
			position: 'absolute',
			inset: '-20%',
			zIndex: opts.background ? '-1' : '9999',
			opacity: '0',
			'--nebula-intensity': String(I),
			'--nebula-blur-base': `${opts.blur * 10}px`,
			'--nebula-idle-opacity': String(opts.idleOpacity),
			'--nebula-aberration': `${aberrationPx}px`,
			'--nebula-blur-core': `${12 * opts.blur}px`,
		})

		if (reducedMotion) {
			// Static surreal rift - no animation, same palette
			const simpleLayer = document.createElement('div')
			Object.assign(simpleLayer.style, {
				position: 'absolute',
				inset: '0',
				background: `
					radial-gradient(ellipse 45% 40% at 50% 50%,
						rgba(${magenta.r},${magenta.g},${magenta.b},${0.12 * I}) 0%,
						rgba(${blue.r},${blue.g},${blue.b},${0.06 * I}) 40%,
						transparent 70%),
					radial-gradient(circle 8% at 50% 50%,
						rgba(255,255,255,${0.15 * I}) 0%,
						transparent 100%)`,
				filter: `blur(${10 * opts.blur}px)`,
				opacity: String(I),
			})
			overlay.appendChild(simpleLayer)
		} else {
			// === LAYER 1: Cosmic Dust + Void (STATIC — zero animation cost) ===
			// Dark filaments, vignette, and void pockets merged into one multiply layer
			const dustLayer = document.createElement('div')
			dustLayer.className = 'nebula-layer'
			Object.assign(dustLayer.style, {
				position: 'absolute',
				inset: '-5%',
				background: `
					linear-gradient(155deg,
						transparent 0%, transparent 38%,
						rgba(8,2,18,${0.35 * I}) 44%,
						rgba(0,0,0,${0.4 * I}) 49%,
						rgba(8,2,18,${0.35 * I}) 54%,
						transparent 60%, transparent 100%),
					linear-gradient(225deg,
						transparent 0%, transparent 42%,
						rgba(5,0,12,${0.28 * I}) 47%,
						rgba(0,0,0,${0.32 * I}) 50%,
						rgba(5,0,12,${0.28 * I}) 53%,
						transparent 58%, transparent 100%),
					radial-gradient(ellipse 110% 110% at 50% 50%,
						transparent 35%,
						rgba(3,0,8,${0.2 * I}) 60%,
						rgba(0,0,0,${0.35 * I}) 85%),
					radial-gradient(ellipse 50% 45% at 30% 35%,
						rgba(0,0,0,${0.3 * I}) 0%,
						transparent 65%),
					radial-gradient(ellipse 40% 55% at 70% 65%,
						rgba(0,0,0,${0.25 * I}) 0%,
						transparent 60%)`,
				filter: `blur(${4 * opts.blur}px)`,
				mixBlendMode: 'multiply',
				transform: 'translateZ(0)',
				// NO animation — static structure for zero ongoing cost
			})
			overlay.appendChild(dustLayer)

			// === LAYER 2: Chromatic Red channel — aberration shifted right ===
			const chromaticRed = document.createElement('div')
			chromaticRed.className = 'nebula-layer'
			Object.assign(chromaticRed.style, {
				position: 'absolute',
				inset: '-15%',
				background: `
					radial-gradient(ellipse 55% 50% at 48% 50%,
						rgba(${red.r},${red.g},${red.b},${0.14 * I}) 0%,
						rgba(${red.r},${red.g},${red.b},${0.06 * I}) 35%,
						transparent 65%),
					radial-gradient(ellipse 30% 35% at 30% 35%,
						rgba(${pink.r},${pink.g},${pink.b},${0.1 * I}) 0%,
						rgba(${pink.r},${pink.g},${pink.b},${0.03 * I}) 50%,
						transparent 70%),
					radial-gradient(ellipse 25% 30% at 65% 70%,
						rgba(${red.r},${Math.min(255, red.g + 30)},${red.b},${0.08 * I}) 0%,
						transparent 60%)`,
				filter: `blur(${18 * opts.blur}px) saturate(1.4)`,
				mixBlendMode: 'screen',
				transform: 'translateZ(0)',
				animation: `nebula-chromatic-red ${35000 / opts.speed}ms ${DRIFT_EASING} infinite`,
			})
			overlay.appendChild(chromaticRed)

			// === LAYER 3: Chromatic Blue channel — aberration shifted left ===
			const chromaticBlue = document.createElement('div')
			chromaticBlue.className = 'nebula-layer'
			Object.assign(chromaticBlue.style, {
				position: 'absolute',
				inset: '-15%',
				background: `
					radial-gradient(ellipse 50% 55% at 52% 50%,
						rgba(${blue.r},${blue.g},${blue.b},${0.12 * I}) 0%,
						rgba(${blue.r},${blue.g},${blue.b},${0.05 * I}) 35%,
						transparent 60%),
					radial-gradient(ellipse 35% 30% at 68% 40%,
						rgba(${cyan.r},${cyan.g},${cyan.b},${0.09 * I}) 0%,
						rgba(${cyan.r},${cyan.g},${cyan.b},${0.03 * I}) 45%,
						transparent 65%),
					radial-gradient(ellipse 28% 25% at 35% 65%,
						rgba(${blue.r},${blue.g},${Math.min(255, blue.b + 20)},${0.07 * I}) 0%,
						transparent 55%)`,
				filter: `blur(${18 * opts.blur}px) saturate(1.4)`,
				mixBlendMode: 'screen',
				transform: 'translateZ(0)',
				animation: `nebula-chromatic-blue ${35000 / opts.speed}ms ${DRIFT_EASING} infinite`,
			})
			overlay.appendChild(chromaticBlue)

			// === LAYER 4: Iridescent Core + Event Horizon ===
			// The ONE layer with filter animation (hue-rotate) — essential for iridescence
			const iridescentLayer = document.createElement('div')
			iridescentLayer.className = 'nebula-layer'
			Object.assign(iridescentLayer.style, {
				position: 'absolute',
				inset: '0',
				background: `
					radial-gradient(ellipse 20% 22% at 50% 50%,
						rgba(${magenta.r},${magenta.g},${magenta.b},${0.18 * I}) 0%,
						rgba(${pink.r},${pink.g},${pink.b},${0.08 * I}) 40%,
						rgba(${blue.r},${blue.g},${blue.b},${0.03 * I}) 65%,
						transparent 80%),
					radial-gradient(circle 6% at 50% 50%,
						rgba(255,255,255,${0.25 * I}) 0%,
						rgba(255,240,245,${0.1 * I}) 50%,
						transparent 100%)`,
				mixBlendMode: 'screen',
				transform: 'translateZ(0)',
				// hue-rotate is the core visual — continuous 360deg cycle
				animation: `nebula-iridescent ${28000 / opts.speed}ms linear infinite`,
			})
			overlay.appendChild(iridescentLayer)

			// === LAYER 5: Bioluminescent Tendrils — organic breathing gas wisps ===
			const tendrilLayer = document.createElement('div')
			tendrilLayer.className = 'nebula-layer'
			Object.assign(tendrilLayer.style, {
				position: 'absolute',
				inset: '-12%',
				background: `
					radial-gradient(ellipse 60% 12% at 50% 48%,
						rgba(${pink.r},${pink.g},${pink.b},${0.1 * I}) 0%,
						transparent 70%),
					radial-gradient(ellipse 12% 55% at 48% 50%,
						rgba(${cyan.r},${cyan.g},${cyan.b},${0.08 * I}) 0%,
						transparent 65%),
					radial-gradient(ellipse 45% 10% at 45% 35%,
						rgba(${magenta.r},${magenta.g},${magenta.b},${0.07 * I}) 0%,
						transparent 60%),
					radial-gradient(ellipse 10% 40% at 60% 60%,
						rgba(${blue.r},${blue.g},${blue.b},${0.06 * I}) 0%,
						transparent 55%)`,
				filter: `blur(${14 * opts.blur}px)`,
				mixBlendMode: 'screen',
				transform: 'translateZ(0)',
				animation: `nebula-tendrils-breathe ${22000 / opts.speed}ms ${BREATHING_EASING} infinite`,
			})
			overlay.appendChild(tendrilLayer)

			// === LAYER 6: Quantum Particles — scattered hue-shifting dots ===
			if (opts.particleCount > 0) {
				const particleLayer = document.createElement('div')
				particleLayer.className = 'nebula-layer'

				const particleGradients: string[] = []
				for (let i = 0; i < opts.particleCount; i++) {
					const x = 5 + Math.random() * 90
					const y = 5 + Math.random() * 90
					const size = 0.5 + Math.random() * 2
					const hue = Math.round(Math.random() * 360)
					const alpha = (0.3 + Math.random() * 0.5) * I

					particleGradients.push(
						`radial-gradient(circle ${size}px at ${x}% ${y}%, hsla(${hue},80%,70%,${alpha}) 0%, transparent 100%)`,
					)
				}

				Object.assign(particleLayer.style, {
					position: 'absolute',
					inset: '0',
					background: particleGradients.join(','),
					mixBlendMode: 'screen',
					transform: 'translateZ(0)',
					animation: `nebula-particle-twinkle ${5000 / opts.speed}ms ${BREATHING_EASING} infinite`,
				})
				overlay.appendChild(particleLayer)
			}
		}

		element.appendChild(overlay)

		// Entrance animation with spring physics
		const fadeInDuration = reducedMotion ? 0 : opts.fadeInDuration
		const entranceEasing = reducedMotion ? 'linear' : getEasing(SPRING_SMOOTH)

		overlay.animate(
			[
				{ opacity: 0, transform: 'scale(0.85)', filter: `blur(${25 * opts.blur}px) saturate(0.5)` },
				{ opacity: opts.intensity * 0.3, transform: 'scale(0.95)', filter: `blur(${12 * opts.blur}px) saturate(0.8)` },
				{ opacity: opts.intensity * 0.6, transform: 'scale(1.02)', filter: `blur(${4 * opts.blur}px) saturate(1.1)` },
				{ opacity: opts.intensity * 0.85, transform: 'scale(1.005)', filter: `blur(${1 * opts.blur}px) saturate(1.05)` },
				{ opacity: opts.intensity, transform: 'scale(1)', filter: 'blur(0px) saturate(1)' },
			] as Keyframe[],
			{
				duration: fadeInDuration,
				easing: entranceEasing,
				fill: 'forwards',
			},
		)

		this.state = {
			element,
			overlay,
			originalPosition,
			originalOverflow,
			originalContain,
			isDimmed: false,
			autoHideSub: null,
			options: opts,
			reducedMotion,
			isVisible: document.visibilityState === 'visible',
		}

		this.coordinator.register(this, element)
	}

	private scheduleAutoHide(opts: Required<NebulaOptions>): void {
		if (!this.state || opts.autoHideDuration <= 0) return

		this.state.autoHideSub = timer(opts.autoHideDuration).pipe(
			take(1),
			tap(() => {
				if (this.state) {
					this.state.autoHideSub = null
					this.hide(this.state.options)
				}
			}),
		).subscribe()
	}

	private hide(opts: Required<NebulaOptions>): void {
		if (!this.state?.overlay) return

		// Clear any pending auto-hide
		if (this.state.autoHideSub) {
			this.state.autoHideSub.unsubscribe()
			this.state.autoHideSub = null
		}

		if (this.state.isDimmed) return

		this.state.isDimmed = true
		const overlay = this.state.overlay
		const currentOpts = this.state.options
		const reducedMotion = this.state.reducedMotion

		const fadeOutDuration = reducedMotion ? 0 : opts.fadeOutDuration
		const exitEasing = reducedMotion ? 'linear' : getEasing(SPRING_GENTLE)

		// Full hide (idleOpacity = 0)
		if (opts.idleOpacity <= 0) {
			overlay.animate(
				[
					{ opacity: currentOpts.intensity, transform: 'scale(1)', filter: 'blur(0px) saturate(1)' },
					{ opacity: currentOpts.intensity * 0.4, transform: 'scale(0.95)', filter: `blur(${8 * currentOpts.blur}px) saturate(0.7)` },
					{ opacity: 0, transform: 'scale(0.9)', filter: `blur(${15 * currentOpts.blur}px) saturate(0.3)` },
				] as Keyframe[],
				{
					duration: fadeOutDuration,
					easing: exitEasing,
					fill: 'forwards',
				},
			)
			return
		}

		// Fade to idle with CSS animation for breathing
		const fadeDown = overlay.animate(
			[
				{ opacity: currentOpts.intensity, transform: 'scale(1)', filter: 'blur(0px) saturate(1)' },
				{ opacity: currentOpts.intensity * 0.5, transform: 'scale(0.99)', filter: `blur(${3 * currentOpts.blur}px) saturate(0.75)` },
				{ opacity: opts.idleOpacity, transform: 'scale(1)', filter: `blur(${8 * currentOpts.blur}px) saturate(0.4)` },
			] as Keyframe[],
			{
				duration: fadeOutDuration,
				easing: exitEasing,
				fill: 'forwards',
			},
		)

		// Switch to CSS animation for idle breathing (more efficient)
		if (opts.idleBreathe && !reducedMotion) {
			from(fadeDown.finished).pipe(
				take(1),
				catchError(() => EMPTY),
			).subscribe(() => {
				if (this.state?.overlay) {
					// Use pure CSS animation for idle - no JS overhead
					this.state.overlay.style.animation = `nebula-idle-breathe ${12000 / currentOpts.speed}ms ${BREATHING_EASING} infinite`
				}
			})
		}
	}

	private cleanup(): void {
		if (!this.state) return

		this.coordinator.unregister(this, this.state.element)

		this.state.autoHideSub?.unsubscribe()

		this.state.overlay?.remove()
		this.state.element.style.position = this.state.originalPosition
		this.state.element.style.overflow = this.state.originalOverflow
		this.state.element.style.contain = this.state.originalContain
		this.state = null
	}

	override disconnected(): void {
		this.cleanup()
	}

	override reconnected(): void {
		// Re-register with coordinator if state exists
		if (this.state) {
			this.coordinator.register(this, this.state.element)
		}
	}
}

export const nebula = directive(NebulaDirective)
