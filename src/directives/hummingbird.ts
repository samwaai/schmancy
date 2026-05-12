/**
 * Hummingbird Directive - Realistic hummingbird flight animation
 *
 * PERFORMANCE OPTIMIZATIONS:
 * 1. Use CSS transforms only (GPU-accelerated, no layout/paint)
 * 2. will-change hints for compositor optimization
 * 3. Single RAF loop, no nested animations
 * 4. Minimize DOM operations
 * 5. Pre-calculate values where possible
 * 6. Use CSS animations for constant motion (wing blur)
 *
 * Based on scientific research:
 * - Wing beat ~43Hz (PMC3311889)
 * - Forward speed 13 m/s / 30mph (Britannica)
 * - Figure-8 hover pattern (Royal Society)
 *
 * ANIMATION STATES (State Machine):
 * - idle: waiting for delay
 * - flying: moving between waypoints
 * - hovering: figure-8 pattern at waypoint
 * - spiraling: approaching black hole
 * - absorbed: being sucked into black hole
 * - done: cleanup complete
 */

import { noChange } from 'lit'
import { AsyncDirective, directive } from 'lit/async-directive.js'
import type { ElementPart } from 'lit'
import { BehaviorSubject, EMPTY, Observable, forkJoin, timer, fromEvent, combineLatest } from 'rxjs'
import { distinctUntilChanged, filter, map, switchMap, takeUntil, tap, take, debounceTime, startWith } from 'rxjs/operators'
import { discover } from '../discovery/discovery.service'
import { ThemeWhereAreYou, ThemeHereIAm } from '../theme/theme.events'

// Physics constants
const FORWARD_SPEED_PX_S = 200 // Pixels per second
const PAUSE_DURATION_MS = 600 // Brief pause at each waypoint

// Animation states
type AnimationState = 'idle' | 'flying' | 'hovering' | 'spiraling' | 'absorbed' | 'done'

/**
 * Element reference for waypoints/target:
 * - CSS selector (e.g., '#app-card-melanie', '.my-class') - event-based discovery
 * - Component tag name (e.g., 'schmancy-fancy') - event-based discovery
 * - HTMLElement reference directly
 */
type ElementRef = string | HTMLElement

/** Waypoint with optional duration control */
interface Waypoint {
	ref: ElementRef
	duration?: number // How long to pause at this waypoint (ms)
}

interface HummingbirdOptions {
	/** Waypoints the bird visits in sequence */
	waypoints?: (ElementRef | Waypoint)[]
	/** Where the bird returns home (triggers black hole effect). If omitted, bird fades out after last waypoint. */
	home?: ElementRef
	/** Delay before starting flight (ms) */
	delay?: number
	/** Whether the hummingbird should be playing. When false, cleans up and pauses. Defaults to true. */
	playing?: boolean
	/** Show animated connection lines between visited waypoints. Defaults to false. */
	showConnections?: boolean
}

interface Destination {
	x: number
	y: number
	element?: HTMLElement // The actual element for theme discovery
	duration: number // How long to pause here
}

interface AnimationContext {
	// State machine
	state: AnimationState
	// Position tracking
	cx: number
	cy: number
	// Flight parameters
	flightStartX: number
	flightStartY: number
	phaseStart: number
	destIdx: number
	// Destinations
	destinations: Destination[]
	// Black hole position
	bx: number
	by: number
}

// Shared keyframes - inject once
let keyframesInjected = false
function injectKeyframes(): void {
	if (keyframesInjected) return
	keyframesInjected = true

	const style = document.createElement('style')
	style.id = 'hb-keyframes'
	style.textContent = `
		@keyframes hb-wing {
			0% { transform: scaleY(0.85); opacity: 0.4; }
			100% { transform: scaleY(1.15); opacity: 0.6; }
		}
		@keyframes hb-disk-inner {
			to { transform: translate(-50%, -50%) rotateX(75deg) rotate(360deg); }
		}
		@keyframes hb-disk-outer {
			to { transform: translate(-50%, -50%) rotateX(70deg) rotate(-360deg); }
		}
		@keyframes hb-disk-mid {
			to { transform: translate(-50%, -50%) rotateX(72deg) rotate(180deg); }
		}
		@keyframes hb-bh-in {
			0% { transform: translate(-50%, -50%) scale(0); }
			60% { transform: translate(-50%, -50%) scale(1.1); }
			100% { transform: translate(-50%, -50%) scale(1); }
		}
		@keyframes hb-horizon-pulse {
			0%, 100% { box-shadow: 0 0 20px 6px var(--hb-color), 0 0 40px 12px var(--hb-color-dim); }
			50% { box-shadow: 0 0 30px 10px var(--hb-color), 0 0 60px 20px var(--hb-color-dim); }
		}
		@keyframes hb-lensing {
			0% { transform: translate(-50%, -50%) rotateX(85deg) scale(1); opacity: 0.6; }
			50% { transform: translate(-50%, -50%) rotateX(85deg) scale(1.05); opacity: 0.8; }
			100% { transform: translate(-50%, -50%) rotateX(85deg) scale(1); opacity: 0.6; }
		}
		@keyframes hb-particle-orbit {
			0% { transform: rotate(0deg) translateX(var(--orbit-radius)) rotate(0deg) scale(1); opacity: 0.9; }
			100% { transform: rotate(720deg) translateX(0px) rotate(-720deg) scale(0); opacity: 0; }
		}
		@keyframes hb-ripple {
			0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0.8; }
			100% { transform: translate(-50%, -50%) scale(3); opacity: 0; }
		}
	`
	document.head.appendChild(style)
}

/**
 * Cosmic nebula color palette - based on real emission spectra
 * H-alpha (656nm) - Crimson ionized hydrogen
 * OIII (501nm) - Teal ionized oxygen
 * SII (672nm) - Deep burgundy sulfur
 * Reflection blue - scattered starlight
 */
const COSMIC_COLORS = {
	// H-alpha crimson
	hAlpha: 'rgba(200, 50, 100, 0.85)',
	hAlphaDim: 'rgba(150, 30, 80, 0.5)',
	// OIII teal
	oiii: 'rgba(40, 180, 180, 0.7)',
	oiiiDim: 'rgba(30, 140, 150, 0.35)',
	// Reflection/stellar
	stellar: 'rgba(255, 230, 240, 0.9)',
	stellarDim: 'rgba(255, 180, 200, 0.4)',
	// Deep space
	deepPurple: 'rgba(80, 40, 120, 0.6)',
	deepBlue: 'rgba(20, 40, 100, 0.5)',
	// Event horizon
	voidBlack: 'rgba(0, 0, 0, 1)',
	singularity: 'rgba(10, 5, 20, 1)',
}

/**
 * Glowing spark - simple, elegant light guide
 */
const createBirdSVG = (color: string) => `<svg viewBox="0 0 24 24" width="24" height="24" style="overflow:visible">
	<defs>
		<radialGradient id="glow">
			<stop offset="0%" stop-color="${color}" stop-opacity="1"/>
			<stop offset="50%" stop-color="${color}" stop-opacity="0.4"/>
			<stop offset="100%" stop-color="${color}" stop-opacity="0"/>
		</radialGradient>
	</defs>

	<!-- Outer glow -->
	<circle cx="12" cy="12" r="10" fill="url(#glow)"/>

	<!-- Core -->
	<circle cx="12" cy="12" r="4" fill="${color}"/>

	<!-- Bright center -->
	<circle cx="12" cy="12" r="2" fill="white" opacity="0.9"/>
</svg>`

/**
 * Convert hex color to rgba with alpha
 */
function hexToRgba(hex: string, alpha: number): string {
	const r = parseInt(hex.slice(1, 3), 16)
	const g = parseInt(hex.slice(3, 5), 16)
	const b = parseInt(hex.slice(5, 7), 16)
	return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

class HummingbirdDirective extends AsyncDirective {
	private state$ = new BehaviorSubject<AnimationState>('idle')
	private destroyed$ = new BehaviorSubject<boolean>(false)
	private visible$ = new BehaviorSubject<boolean>(true)
	private bird: HTMLElement | null = null
	private blackHole: HTMLElement | null = null
	private particles: HTMLElement[] = []
	private trailCanvas: HTMLCanvasElement | null = null
	private trailCtx: CanvasRenderingContext2D | null = null
	private lastTrailPos: { x: number; y: number } | null = null
	private rafId = 0
	private context: AnimationContext | null = null
	private element: HTMLElement | null = null
	private options: HummingbirdOptions = {}
	private hasHome = false

	/**
	 * Convert viewport coordinates to host-relative coordinates.
	 * getBoundingClientRect() returns viewport coords; we subtract the host's rect.
	 */
	private toHostRelative(viewportX: number, viewportY: number): { x: number; y: number } {
		if (!this.element) return { x: viewportX, y: viewportY }
		const hostRect = this.element.getBoundingClientRect()
		return {
			x: viewportX - hostRect.left + this.element.scrollLeft,
			y: viewportY - hostRect.top + this.element.scrollTop,
		}
	}

	render(_options?: boolean | HummingbirdOptions) {
		return noChange
	}

	override update(part: ElementPart, [options = true]: [boolean | HummingbirdOptions | undefined]) {
		const element = part.element as HTMLElement
		const opts: HummingbirdOptions = typeof options === 'object' ? options : {}
		// Check both: boolean false OR options.playing === false
		const shouldPlay = typeof options === 'boolean' ? options : (opts.playing !== false)

		if (!shouldPlay) {
			this.fadeOutAndCleanup()
			return noChange
		}

		if (this.bird) return noChange // Already running

		// Reset destroyed state so subscriptions can work again
		if (this.destroyed$.value) {
			this.destroyed$.next(false)
			this.state$.next('idle')
		}

		this.element = element
		this.options = opts

		// Ensure host element can contain absolutely-positioned children
		const computedPos = window.getComputedStyle(element).position
		if (computedPos === 'static') {
			element.style.position = 'relative'
		}
		element.style.overflow = 'visible'

		injectKeyframes()
		this.initStateMachine()

		return noChange
	}

	private initStateMachine(): void {
		// State machine subscription
		this.state$
			.pipe(
				distinctUntilChanged(),
				filter(() => !this.destroyed$.value),
				switchMap(state => this.handleStateTransition(state)),
				takeUntil(this.destroyed$.pipe(filter(v => v)))
			)
			.subscribe()

		// Combine IntersectionObserver + Page Visibility + Parent Playing State - all must be true
		combineLatest([
			// IntersectionObserver
			new Observable<boolean>(subscriber => {
				if (!this.element || typeof IntersectionObserver === 'undefined') {
					subscriber.next(true)
					return
				}
				const observer = new IntersectionObserver(
					entries => subscriber.next(entries[0].isIntersecting),
					{ threshold: 0 }
				)
				observer.observe(this.element)
				return () => observer.disconnect()
			}),
			// Page Visibility
			fromEvent(document, 'visibilitychange').pipe(
				map(() => document.visibilityState === 'visible'),
				startWith(document.visibilityState === 'visible')
			),
			// Parent playing state - find ancestor with 'playing' property and observe changes
			new Observable<boolean>(subscriber => {
				if (!this.element) {
					subscriber.next(true)
					return
				}
				// Find ancestor with 'playing' property (scene components)
				let ancestor: HTMLElement | null = this.element
				let playingHost: HTMLElement | null = null
				while (ancestor) {
					if ('playing' in ancestor) {
						playingHost = ancestor
						break
					}
					ancestor = ancestor.parentElement
				}
				if (!playingHost) {
					subscriber.next(true)
					return
				}
				// Emit current value
				subscriber.next((playingHost as HTMLElement & { playing: boolean }).playing)
				// Observe attribute changes on the host
				const observer = new MutationObserver(() => {
					subscriber.next((playingHost as HTMLElement & { playing: boolean }).playing)
				})
				observer.observe(playingHost, { attributes: true, attributeFilter: ['playing'] })
				return () => observer.disconnect()
			}),
		])
			.pipe(
				map(([inView, tabActive, playing]) => inView && tabActive && playing),
				distinctUntilChanged(),
				tap(visible => this.visible$.next(visible)),
				filter(() => !this.destroyed$.value && !!this.context),
				takeUntil(this.destroyed$.pipe(filter(v => v)))
			)
			.subscribe(visible => {
				if (visible && !this.rafId) {
					this.startAnimationLoop()
				} else if (!visible && this.rafId) {
					cancelAnimationFrame(this.rafId)
					this.rafId = 0
				}
			})

		// React to window resize - update destination positions
		// Scroll listener removed: bird is position:absolute inside host, moves naturally with scroll
		fromEvent(window, 'resize')
			.pipe(
				debounceTime(100),
				filter(() => !this.destroyed$.value && !!this.context),
				takeUntil(this.destroyed$.pipe(filter(v => v)))
			)
			.subscribe(() => this.updateDestinationPositions())

		// Wait for delay + host visibility, then discover elements and create bird
		const delay = this.options.delay ?? 500
		timer(delay)
			.pipe(
				filter(() => !this.destroyed$.value && !this.bird),
				// Wait for host element to be visible (opacity > 0.5)
				switchMap(() => new Observable<void>(subscriber => {
					if (!this.element) {
						subscriber.next()
						subscriber.complete()
						return
					}
					const checkVisibility = () => {
						if (this.isElementVisible(this.element!)) {
							subscriber.next()
							subscriber.complete()
						} else {
							timer(50)
								.pipe(takeUntil(this.destroyed$.pipe(filter(v => v))))
								.subscribe(checkVisibility)
						}
					}
					checkVisibility()
				})),
				switchMap(() => this.createBird()),
				tap(() => {
					if (!this.destroyed$.value) {
						this.state$.next('flying')
					}
				}),
				takeUntil(this.destroyed$.pipe(filter(v => v)))
			)
			.subscribe()
	}

	private handleStateTransition(state: AnimationState) {
		switch (state) {
			case 'idle':
				return EMPTY
			case 'flying':
			case 'hovering':
			case 'spiraling':
			case 'absorbed':
				this.startAnimationLoop()
				return EMPTY
			case 'done':
				this.cleanup()
				// Emit completion event so parent can react
				this.element?.dispatchEvent(
					new CustomEvent('hummingbird-complete', { bubbles: true, composed: true })
				)
				return EMPTY
			default:
				return EMPTY
		}
	}

	private async createBird(): Promise<void> {
		if (!this.element) return

		// Create bird with default color first
		const bird = document.createElement('div')
		bird.innerHTML = createBirdSVG(this.currentColor)
		bird.className = 'pointer-events-none'
		bird.style.cssText = `
			position: absolute;
			left: 0;
			top: 0;
			width: 24px;
			height: 24px;
			z-index: 99999;
			will-change: transform, opacity;
			transform-origin: center center;
			transition: opacity 400ms ease-out;
		`
		this.element.appendChild(bird)
		this.bird = bird

		// Discover initial theme color asynchronously
		this.discoverInitialColor()

		const rect = this.element.getBoundingClientRect()
		const hostRel = this.toHostRelative(rect.left, rect.top)
		const waypoints = await this.discoverWaypoints(this.options.waypoints || [])
		const home = this.options.home ? await this.getPosition(this.options.home) : null

		const destinations = [...waypoints]
		this.hasHome = !!home
		if (home) destinations.push(home)

		// If no destinations, create simple fly-through
		if (destinations.length === 0) {
			destinations.push({
				x: hostRel.x + rect.width + 60,
				y: hostRel.y + rect.height * 0.5,
				duration: PAUSE_DURATION_MS,
			})
		}

		// Start position (host-relative)
		const startX = hostRel.x - 60
		const startY = hostRel.y + rect.height / 2

		this.context = {
			state: 'flying',
			cx: startX,
			cy: startY,
			flightStartX: startX,
			flightStartY: startY,
			phaseStart: performance.now(),
			destIdx: 0,
			destinations,
			bx: 0,
			by: 0,
		}

		// Offset by half element size (-12px) so spark centers at the position
		this.bird.style.transform = `translate(${startX - 12}px, ${startY - 12}px)`
	}

	/** Current bird color — empty until `discoverInitialColor()` resolves a theme color. */
	private currentColor = ''

	/**
	 * Discover initial theme color from nearest schmancy-theme.
	 * Dispatches event FROM the host element so it bubbles up to nearest theme.
	 */
	private discoverInitialColor(): void {
		if (!this.element) return

		// Listen for theme response first
		fromEvent<CustomEvent<{ theme: HTMLElement & { color?: string } }>>(window, ThemeHereIAm)
			.pipe(
				take(1),
				takeUntil(timer(150)),
				map(e => e.detail.theme?.color),
				filter((color): color is string => !!color && color !== this.currentColor),
				takeUntil(this.destroyed$.pipe(filter(v => v)))
			)
			.subscribe(color => {
				if (!this.bird) return
				this.currentColor = color
				this.bird.innerHTML = createBirdSVG(color)
			})

		// Dispatch FROM the host element (bubbles up to nearest theme)
		this.element.dispatchEvent(
			new CustomEvent(ThemeWhereAreYou, { bubbles: true, composed: true })
		)
	}

	/**
	 * Discover and update bird color based on current destination's theme.
	 * Dispatches event FROM the destination element so it bubbles to its nearest theme.
	 */
	private updateBirdColor(): void {
		if (!this.bird || !this.context || this.destroyed$.value) return

		// Get the current destination element
		const dest = this.context.destinations[this.context.destIdx]
		if (!dest?.element) return

		// Listen for theme response
		fromEvent<CustomEvent<{ theme: HTMLElement & { color?: string } }>>(window, ThemeHereIAm)
			.pipe(
				take(1),
				takeUntil(timer(100)),
				map(e => e.detail.theme?.color),
				filter((color): color is string => !!color && color !== this.currentColor),
				takeUntil(this.destroyed$.pipe(filter(v => v)))
			)
			.subscribe(color => {
				if (!this.bird) return
				this.currentColor = color
				this.bird.innerHTML = createBirdSVG(color)
			})

		// Dispatch FROM the destination element (bubbles up to its nearest theme)
		dest.element.dispatchEvent(
			new CustomEvent(ThemeWhereAreYou, { bubbles: true, composed: true })
		)
	}

	/**
	 * Discover all waypoint elements and return their positions with element references.
	 * Supports both simple ElementRef and Waypoint objects with duration.
	 * Uses RxJS forkJoin for parallel discovery.
	 */
	private discoverWaypoints(waypoints: (ElementRef | Waypoint)[]): Promise<Destination[]> {
		if (waypoints.length === 0) return Promise.resolve([])

		// Normalize waypoints to { ref, duration } format
		const normalized = waypoints.map(wp => {
			if (typeof wp === 'string' || wp instanceof HTMLElement) {
				return { ref: wp, duration: PAUSE_DURATION_MS }
			}
			return { ref: wp.ref, duration: wp.duration ?? PAUSE_DURATION_MS }
		})

		const discoveries$ = normalized.map(wp => this.discoverElement(wp.ref))

		return new Promise(resolve => {
			forkJoin(discoveries$)
				.pipe(
					map(elements =>
						elements
							.map((el, i): Destination | null => {
								if (!el) return null
								const r = el.getBoundingClientRect()
								const center = this.toHostRelative(r.left + r.width / 2, r.top + r.height / 2)
								return {
									x: center.x,
									y: center.y,
									element: el,
									duration: normalized[i].duration,
								}
							})
							.filter((d): d is Destination => d !== null)
					),
					takeUntil(this.destroyed$.pipe(filter(v => v)))
				)
				.subscribe({
					next: positions => resolve(positions),
					error: () => resolve([]),
				})
		})
	}

	/**
	 * Discover a single element by reference using event-based discovery.
	 * - HTMLElement: return directly
	 * - String (CSS selector or component tag): use discover() service
	 */
	private discoverElement(ref: ElementRef): Promise<HTMLElement | null> {
		if (ref instanceof HTMLElement) {
			return Promise.resolve(ref)
		}

		return new Promise(resolve => {
			discover<HTMLElement>(ref, 300)
				.pipe(takeUntil(this.destroyed$.pipe(filter(v => v))))
				.subscribe({
					next: el => resolve(el),
					error: () => resolve(null),
				})
		})
	}

	/**
	 * Get position from an element reference (includes element for theme discovery).
	 * Target uses center position (for black hole effect).
	 */
	private async getPosition(ref: ElementRef): Promise<Destination | null> {
		const el = await this.discoverElement(ref)
		if (!el) return null
		const r = el.getBoundingClientRect()
		const center = this.toHostRelative(r.left + r.width / 2, r.top + r.height / 2)
		return { x: center.x, y: center.y, element: el, duration: PAUSE_DURATION_MS }
	}

	/**
	 * Update all destination positions from their stored element references.
	 * Called on window resize/scroll to keep positions accurate.
	 */
	private updateDestinationPositions(): void {
		if (!this.context) return

		for (const dest of this.context.destinations) {
			if (dest.element) {
				const r = dest.element.getBoundingClientRect()
				const center = this.toHostRelative(r.left + r.width / 2, r.top + r.height / 2)
				dest.x = center.x
				dest.y = center.y
			}
		}
	}

	private startAnimationLoop(): void {
		if (this.rafId) return

		const tick = (now: number) => {
			if (!this.bird || !this.context || this.destroyed$.value || !this.visible$.value) {
				this.rafId = 0
				return
			}

			switch (this.state$.value) {
				case 'flying':
					this.tickFlying(now)
					break
				case 'hovering':
					this.tickHovering(now)
					break
				case 'spiraling':
					this.tickSpiraling(now)
					break
				case 'absorbed':
					this.tickAbsorbed(now)
					return // Don't schedule next frame - absorption handles completion
			}

			this.rafId = requestAnimationFrame(tick)
		}

		this.rafId = requestAnimationFrame(tick)
	}

	private tickFlying(now: number): void {
		if (!this.context || !this.bird) return

		const ctx = this.context
		const elapsed = now - ctx.phaseStart
		const dest = ctx.destinations[ctx.destIdx]

		const dx = dest.x - ctx.flightStartX
		const dy = dest.y - ctx.flightStartY
		const dist = Math.hypot(dx, dy)
		const duration = (dist / FORWARD_SPEED_PX_S) * 1000
		const t = Math.min(1, elapsed / duration)

		// Cubic ease-in-out
		const e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

		ctx.cx = ctx.flightStartX + dx * e
		ctx.cy = ctx.flightStartY + dy * e

		// Simple smooth movement - no rotation or bouncing
		this.bird.style.transform = `translate(${ctx.cx - 12}px, ${ctx.cy - 12}px)`

		// Draw trail in real-time as bird flies (airplane vapor trail effect)
		if (this.options.showConnections) {
			this.drawTrail(ctx.cx, ctx.cy)
			this.fadeTrail() // Continuously fade for vapor effect
		}

		// Update color based on section the bird is flying over
		if (Math.floor(elapsed / 200) !== Math.floor((elapsed - 16) / 200)) {
			this.updateBirdColor()
		}

		if (t >= 1) {
			const isLastDestination = ctx.destIdx >= ctx.destinations.length - 1

			if (isLastDestination && this.hasHome) {
				// Has home: transition to spiraling into black hole
				ctx.bx = dest.x
				ctx.by = dest.y
				ctx.phaseStart = now
				this.createBlackHole(ctx.bx, ctx.by)
				this.state$.next('spiraling')
			} else {
				// Transition to hovering (including last waypoint when no home)
				ctx.phaseStart = now
				this.state$.next('hovering')
			}
		}
	}

	/** Active shimmer overlay for current waypoint */
	private shimmerOverlay: HTMLDivElement | null = null
	private shimmerAnimation: Animation | null = null
	/** Active pulse rings for current waypoint */
	private pulseRings: HTMLDivElement[] = []

	private tickHovering(now: number): void {
		if (!this.context || !this.bird) return

		const ctx = this.context
		const elapsed = now - ctx.phaseStart
		const dest = ctx.destinations[ctx.destIdx]

		// Show shimmer, pulse rings, and fade spark on first frame of hover
		if (elapsed < 20 && dest.element && !this.shimmerOverlay) {
			this.showShimmer(dest.element)
			this.showPulseRings(dest.x, dest.y)
			// Fade spark to invisible while hovering
			this.bird.style.opacity = '0'
		}

		// Stay in place with subtle breathing pulse (no movement)
		ctx.cx = dest.x
		ctx.cy = dest.y
		const pulse = 1 + Math.sin(elapsed * 0.006) * 0.08 // Very subtle 8% scale pulse
		this.bird.style.transform = `translate(${dest.x - 12}px, ${dest.y - 12}px) scale(${pulse})`

		// Use per-waypoint duration - but also wait for next element to be visible
		if (elapsed > dest.duration) {
			const nextDest = ctx.destinations[ctx.destIdx + 1]
			const isLastWaypoint = !nextDest

			// Last waypoint (no home): fade out after hovering
			if (isLastWaypoint && !this.hasHome) {
				this.hideShimmer()
				this.fadeOutBird()
				return
			}

			// Check if next waypoint element is visible (not opacity-0)
			if (nextDest?.element && !this.isElementVisible(nextDest.element)) {
				// Next element not visible yet, keep waiting
				return
			}
			// Scroll next waypoint into view if off-screen
			if (nextDest?.element && !this.isInViewport(nextDest.element)) {
				nextDest.element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' })
			}
			// Refresh next destination position (element may have animated to new position)
			if (nextDest?.element) {
				const r = nextDest.element.getBoundingClientRect()
				const center = this.toHostRelative(r.left + r.width / 2, r.top + r.height / 2)
				nextDest.x = center.x
				nextDest.y = center.y
			}
			// Restore spark opacity before moving
			this.bird.style.opacity = '1'
			// Hide shimmer before moving
			this.hideShimmer()
			// Reset trail for new flight segment
			this.resetTrail()
			// Move to next destination
			ctx.destIdx++
			ctx.flightStartX = dest.x
			ctx.flightStartY = dest.y
			ctx.phaseStart = now
			this.state$.next('flying')
		}
	}

		/**
	 * Check if an element is sufficiently visible (opacity > 0.5 and not hidden)
	 * Uses 0.5 threshold to wait for CSS transitions to be halfway done
	 */
	private isElementVisible(element: HTMLElement): boolean {
		const style = window.getComputedStyle(element)
		const opacity = parseFloat(style.opacity)
		return opacity > 0.5 && style.visibility !== 'hidden' && style.display !== 'none'
	}

	/** Check if element is within the viewport bounds (with padding so bird doesn't fly to edges) */
	private isInViewport(element: HTMLElement): boolean {
		const r = element.getBoundingClientRect()
		const pad = 80
		return r.bottom > pad && r.top < window.innerHeight - pad && r.right > pad && r.left < window.innerWidth - pad
	}





	/**
	 * Show shimmer effect on an element (similar to fyi directive)
	 */
	private showShimmer(element: HTMLElement): void {
		// Store and modify element position if needed
		const computedStyle = window.getComputedStyle(element)
		if (computedStyle.position === 'static') {
			element.style.position = 'relative'
		}

		// Create shimmer overlay
		const shimmer = document.createElement('div')
		shimmer.style.cssText = `
			position: absolute;
			inset: 0;
			pointer-events: none;
			z-index: 9999;
			border-radius: ${computedStyle.borderRadius};
			background: linear-gradient(
				108deg,
				transparent 0%,
				transparent 30%,
				rgba(255, 255, 255, 0.02) 38%,
				rgba(255, 255, 255, 0.06) 45%,
				rgba(255, 255, 255, 0.08) 50%,
				rgba(255, 255, 255, 0.06) 55%,
				rgba(255, 255, 255, 0.02) 62%,
				transparent 70%,
				transparent 100%
			);
			background-size: 300% 100%;
		`

		element.appendChild(shimmer)
		this.shimmerOverlay = shimmer

		// Animate shimmer - slow and elegant like fyi directive (10 seconds)
		this.shimmerAnimation = shimmer.animate(
			[{ backgroundPosition: '300% 0' }, { backgroundPosition: '-100% 0' }],
			{ duration: 10000, easing: 'cubic-bezier(0.25, 0.1, 0.25, 1)', iterations: Infinity }
		)
	}

	/**
	 * Hide and cleanup shimmer effect
	 */
	private hideShimmer(): void {
		if (this.shimmerAnimation) {
			this.shimmerAnimation.cancel()
			this.shimmerAnimation = null
		}
		if (this.shimmerOverlay) {
			// Fade out then remove
			const fadeOut = this.shimmerOverlay.animate([{ opacity: 1 }, { opacity: 0 }], {
				duration: 300,
				easing: 'ease-out',
				fill: 'forwards',
			})
			const overlay = this.shimmerOverlay
			fadeOut.onfinish = () => overlay.remove()
			this.shimmerOverlay = null
		}
	}

	/**
	 * Fade out bird gracefully (when no home defined)
	 */
	private fadeOutBird(): void {
		if (!this.bird) return

		// Set state to idle to prevent tickHovering from being called again
		this.state$.next('idle')

		// Restore opacity before fading (may be 0 from hovering)
		this.bird.style.opacity = '1'

		this.bird.animate(
			[{ opacity: 1, transform: this.bird.style.transform }, { opacity: 0, transform: this.bird.style.transform }],
			{ duration: 400, easing: 'ease-out', fill: 'forwards' }
		).onfinish = () => {
			this.state$.next('done')
		}
	}

	/**
	 * Fade out bird and all visual elements gracefully before cleanup (when playing becomes false)
	 */
	private fadeOutAndCleanup(): void {
		// If no bird exists yet, just cleanup
		if (!this.bird) {
			this.cleanup()
			return
		}

		// Cancel animation loop to prevent further updates
		if (this.rafId) {
			cancelAnimationFrame(this.rafId)
			this.rafId = 0
		}

		// Restore opacity before fading (may be 0 from hovering)
		this.bird.style.opacity = '1'

		// Very slow, gradual fade - barely noticeable at first, then gently disappears
		const birdAnim = this.bird.animate(
			[
				{ opacity: 1 },
				{ opacity: 0.8, offset: 0.3 },
				{ opacity: 0.5, offset: 0.6 },
				{ opacity: 0.2, offset: 0.85 },
				{ opacity: 0 },
			],
			{ duration: 3000, easing: 'linear', fill: 'forwards' }
		)

		// Fade out trail canvas even more slowly if exists
		if (this.trailCanvas) {
			this.trailCanvas.animate(
				[{ opacity: 1 }, { opacity: 0 }],
				{ duration: 3500, easing: 'ease-out', fill: 'forwards' }
			)
		}

		// Fade out shimmer
		this.hideShimmer()

		// Cleanup after fade completes
		birdAnim.onfinish = () => {
			this.cleanup()
		}
	}

	/**
	 * Show expanding pulse rings at position (like ripple/wave effect)
	 */
	private showPulseRings(x: number, y: number): void {
		const color = this.currentColor

		// Create 3 staggered pulse rings
		for (let i = 0; i < 3; i++) {
			const ring = document.createElement('div')
			ring.className = 'pointer-events-none'
			ring.style.cssText = `
				position: absolute;
				left: ${x}px;
				top: ${y}px;
				width: 40px;
				height: 40px;
				border-radius: 9999px;
				border: 2px solid ${hexToRgba(color, 0.5)};
				transform: translate(-50%, -50%) scale(1);
				z-index: 9998;
				will-change: transform, opacity;
			`
			this.element?.appendChild(ring)
			this.pulseRings.push(ring)

			// Animate: expand and fade out
			ring.animate(
				[
					{ transform: 'translate(-50%, -50%) scale(1)', opacity: 0.6 },
					{ transform: 'translate(-50%, -50%) scale(4)', opacity: 0 },
				],
				{
					duration: 1200,
					delay: i * 300,
					easing: 'ease-out',
					fill: 'forwards',
				}
			).onfinish = () => ring.remove()
		}

		// Clear refs after animation completes (last ring)
		timer(1200 + 600)
			.pipe(takeUntil(this.destroyed$.pipe(filter(v => v))))
			.subscribe(() => {
				this.pulseRings = []
			})
	}

	private tickSpiraling(now: number): void {
		if (!this.context || !this.bird) return

		const ctx = this.context
		const elapsed = now - ctx.phaseStart
		const dx = ctx.bx - ctx.cx
		const dy = ctx.by - ctx.cy
		const d = Math.hypot(dx, dy)

		if (d > 8) {
			// Smoother acceleration as it gets closer (gravitational pull)
			const gravitationalPull = Math.pow(1 - d / 150, 2) * 180 + 40
			const speed = Math.min(gravitationalPull, d * 0.15)
			const angle = Math.atan2(dy, dx)

			// Elegant spiral motion - tighter as it gets closer
			const spiralIntensity = Math.min(1, d / 60) * 0.015
			const spiralAngle = elapsed * 0.012
			const spiral = Math.sin(spiralAngle) * d * spiralIntensity

			ctx.cx += Math.cos(angle) * speed * 0.016 + Math.cos(angle + Math.PI / 2) * spiral
			ctx.cy += Math.sin(angle) * speed * 0.016 + Math.sin(angle + Math.PI / 2) * spiral

			// Smooth scale reduction with slight rotation
			const scale = Math.max(0.2, d / 120)
			const rotation = elapsed * 0.3
			this.bird.style.transform = `translate(${ctx.cx - 12}px, ${ctx.cy - 12}px) rotate(${rotation}deg) scale(${scale})`

			// Add subtle glow intensification as it approaches
			const glowIntensity = 1 - d / 100
			if (glowIntensity > 0.3) {
				this.bird.style.filter = `brightness(${1 + glowIntensity * 0.5}) drop-shadow(0 0 ${glowIntensity * 8}px ${this.currentColor})`
			}
		} else {
			// Transition to absorbed
			ctx.phaseStart = now
			this.startHostDistortion()
			this.state$.next('absorbed')
		}
	}

	/** Store home element for distortion effect */
	private homeElement: HTMLElement | null = null

	/**
	 * Start gravitational shake/wobble effect on the home element during absorption
	 */
	private startHostDistortion(): void {
		if (!this.context) return

		// Find the home element from destinations
		const homeDest = this.context.destinations[this.context.destinations.length - 1]
		if (!homeDest?.element) return

		this.homeElement = homeDest.element
		const el = this.homeElement
		const color = this.currentColor

		// Store original transform
		const originalTransform = el.style.transform || ''

		// Violent shake/wobble - gravitational tremor as energy is being absorbed
		// Rapid oscillations that build in intensity
		el.animate(
			[
				{ transform: `${originalTransform} translate(0, 0) scale(1) rotate(0deg)`, filter: 'brightness(1)' },
				{ transform: `${originalTransform} translate(-2px, 1px) scale(0.992) rotate(-0.3deg)`, filter: 'brightness(1.05)', offset: 0.05 },
				{ transform: `${originalTransform} translate(3px, -1px) scale(1.005) rotate(0.4deg)`, filter: 'brightness(1.1)', offset: 0.1 },
				{ transform: `${originalTransform} translate(-1px, 2px) scale(0.995) rotate(-0.2deg)`, filter: `brightness(1.15) drop-shadow(0 0 5px ${color})`, offset: 0.15 },
				{ transform: `${originalTransform} translate(2px, 0px) scale(1.008) rotate(0.5deg)`, filter: 'brightness(1.2)', offset: 0.2 },
				{ transform: `${originalTransform} translate(-3px, -2px) scale(0.988) rotate(-0.6deg)`, filter: `brightness(1.25) drop-shadow(0 0 8px ${color})`, offset: 0.25 },
				{ transform: `${originalTransform} translate(1px, 3px) scale(1.01) rotate(0.3deg)`, filter: 'brightness(1.3)', offset: 0.3 },
				{ transform: `${originalTransform} translate(-2px, -1px) scale(0.985) rotate(-0.4deg)`, filter: `brightness(1.35) drop-shadow(0 0 12px ${color})`, offset: 0.35 },
				{ transform: `${originalTransform} translate(4px, 1px) scale(1.015) rotate(0.7deg)`, filter: 'brightness(1.4)', offset: 0.4 },
				{ transform: `${originalTransform} translate(-1px, 2px) scale(0.99) rotate(-0.5deg)`, filter: `brightness(1.35) drop-shadow(0 0 15px ${color})`, offset: 0.45 },
				{ transform: `${originalTransform} translate(2px, -2px) scale(1.012) rotate(0.4deg)`, filter: 'brightness(1.3)', offset: 0.5 },
				{ transform: `${originalTransform} translate(-3px, 1px) scale(0.993) rotate(-0.3deg)`, filter: `brightness(1.25) drop-shadow(0 0 10px ${color})`, offset: 0.55 },
				{ transform: `${originalTransform} translate(1px, -1px) scale(1.006) rotate(0.2deg)`, filter: 'brightness(1.2)', offset: 0.6 },
				{ transform: `${originalTransform} translate(-1px, 1px) scale(0.997) rotate(-0.15deg)`, filter: 'brightness(1.15)', offset: 0.7 },
				{ transform: `${originalTransform} translate(1px, 0px) scale(1.003) rotate(0.1deg)`, filter: 'brightness(1.1)', offset: 0.8 },
				{ transform: `${originalTransform} translate(0px, -1px) scale(0.999) rotate(-0.05deg)`, filter: 'brightness(1.05)', offset: 0.9 },
				{ transform: `${originalTransform} translate(0, 0) scale(1) rotate(0deg)`, filter: 'brightness(1)' },
			],
			{
				duration: 500,
				easing: 'linear',
			}
		)
	}

	private tickAbsorbed(now: number): void {
		if (!this.context || !this.bird) return

		const ctx = this.context
		const elapsed = now - ctx.phaseStart
		const duration = 500
		const t = Math.min(1, elapsed / duration)

		// Exponential ease-in for dramatic acceleration into the singularity
		const e = t * t * t

		// Spaghettification effect - stretch vertically while shrinking horizontally
		const scaleX = 0.2 * (1 - e * 0.9)
		const scaleY = 0.2 * (1 - e) * (1 + e * 2) // Elongates before disappearing

		// Rapid rotation acceleration
		const rotation = t * t * 1080 // Accelerating spin

		this.bird.style.transform = `translate(${ctx.bx - 12}px, ${ctx.by - 12}px) rotate(${rotation}deg) scale(${scaleX}, ${scaleY})`
		this.bird.style.opacity = String(Math.max(0, 1 - e * 1.2))
		this.bird.style.filter = `brightness(${1 + e * 3}) blur(${e * 2}px)`

		if (t >= 1) {
			this.collapseBlackHole()
		} else {
			this.rafId = requestAnimationFrame(now => this.tickAbsorbed(now))
		}
	}

	/** Additional visual elements for enhanced blackhole */
	private accretionDisks: HTMLElement[] = []
	private lensingRing: HTMLElement | null = null
	private eventHorizon: HTMLElement | null = null

	private createBlackHole(x: number, y: number): void {
		const color = this.currentColor

		// 1. Outer gravitational lensing ring - cosmic teal/purple glow
		const lensing = document.createElement('div')
		lensing.className = 'pointer-events-none'
		lensing.style.cssText = `
			position: absolute;
			left: ${x}px;
			top: ${y}px;
			width: 100px;
			height: 100px;
			border-radius: 9999px;
			border: 1px solid ${COSMIC_COLORS.oiiiDim};
			background: radial-gradient(circle, transparent 40%, ${COSMIC_COLORS.deepPurple} 70%, transparent 100%);
			box-shadow:
				inset 0 0 25px ${COSMIC_COLORS.oiiiDim},
				0 0 40px ${COSMIC_COLORS.deepPurple},
				0 0 60px ${hexToRgba(color, 0.15)};
			transform: translate(-50%, -50%) rotateX(85deg) scale(0);
			z-index: 9994;
			will-change: transform, opacity;
			animation: hb-lensing 2s ease-in-out infinite;
		`
		lensing.animate(
			[
				{ transform: 'translate(-50%, -50%) rotateX(85deg) scale(0)' },
				{ transform: 'translate(-50%, -50%) rotateX(85deg) scale(1)' },
			],
			{ duration: 600, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)', fill: 'forwards' }
		)
		this.element?.appendChild(lensing)
		this.lensingRing = lensing

		// 2. Layered accretion disks - cosmic nebula colors (H-alpha crimson, OIII teal, stellar pink)
		const diskConfigs = [
			{ size: 85, speed: 4, color1: COSMIC_COLORS.oiii, color2: COSMIC_COLORS.deepBlue, rotateX: 68, reverse: true },
			{ size: 68, speed: 2.5, color1: COSMIC_COLORS.hAlpha, color2: COSMIC_COLORS.hAlphaDim, rotateX: 72, reverse: false },
			{ size: 52, speed: 1.8, color1: COSMIC_COLORS.stellar, color2: COSMIC_COLORS.stellarDim, rotateX: 76, reverse: true },
		]

		diskConfigs.forEach((config, i) => {
			const disk = document.createElement('div')
			disk.className = 'pointer-events-none'
			const direction = config.reverse ? '-' : ''
			disk.style.cssText = `
				position: absolute;
				left: ${x}px;
				top: ${y}px;
				width: ${config.size}px;
				height: ${config.size}px;
				border-radius: 9999px;
				background: conic-gradient(
					from ${i * 45}deg,
					transparent 0%,
					${config.color1} 15%,
					${config.color2} 35%,
					transparent 50%,
					${config.color1} 65%,
					${config.color2} 85%,
					transparent 100%
				);
				transform: translate(-50%, -50%) rotateX(${config.rotateX}deg) scale(0);
				z-index: ${9995 + i};
				will-change: transform;
				filter: blur(${i * 0.3}px);
				mix-blend-mode: screen;
			`
			// Entrance animation then continuous rotation
			disk.animate(
				[
					{ transform: `translate(-50%, -50%) rotateX(${config.rotateX}deg) scale(0) rotate(0deg)` },
					{ transform: `translate(-50%, -50%) rotateX(${config.rotateX}deg) scale(1) rotate(0deg)` },
				],
				{ duration: 400 + i * 100, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)', fill: 'forwards' }
			).onfinish = () => {
				disk.style.transform = `translate(-50%, -50%) rotateX(${config.rotateX}deg) scale(1)`
				disk.animate(
					[
						{ transform: `translate(-50%, -50%) rotateX(${config.rotateX}deg) scale(1) rotate(0deg)` },
						{ transform: `translate(-50%, -50%) rotateX(${config.rotateX}deg) scale(1) rotate(${direction}360deg)` },
					],
					{ duration: config.speed * 1000, easing: 'linear', iterations: Infinity }
				)
			}
			this.element?.appendChild(disk)
			this.accretionDisks.push(disk)
		})

		// 3. Event horizon - deep void with cosmic glow corona
		const horizon = document.createElement('div')
		horizon.className = 'pointer-events-none'
		horizon.style.cssText = `
			--hb-color: ${COSMIC_COLORS.hAlpha};
			--hb-color-dim: ${COSMIC_COLORS.oiiiDim};
			position: absolute;
			left: ${x}px;
			top: ${y}px;
			width: 36px;
			height: 36px;
			border-radius: 9999px;
			background: radial-gradient(circle,
				${COSMIC_COLORS.singularity} 0%,
				${COSMIC_COLORS.voidBlack} 40%,
				${COSMIC_COLORS.deepPurple} 60%,
				${COSMIC_COLORS.hAlphaDim} 75%,
				transparent 100%
			);
			box-shadow:
				0 0 15px 4px ${COSMIC_COLORS.hAlpha},
				0 0 30px 8px ${COSMIC_COLORS.oiiiDim},
				0 0 50px 15px ${COSMIC_COLORS.deepPurple},
				inset 0 0 15px ${COSMIC_COLORS.voidBlack};
			transform: translate(-50%, -50%) scale(0);
			z-index: 9999;
			will-change: transform, box-shadow;
			animation: hb-horizon-pulse 1.5s ease-in-out infinite;
		`
		horizon.animate(
			[
				{ transform: 'translate(-50%, -50%) scale(0)' },
				{ transform: 'translate(-50%, -50%) scale(1.15)', offset: 0.6 },
				{ transform: 'translate(-50%, -50%) scale(1)' },
			],
			{ duration: 500, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)', fill: 'forwards' }
		)
		this.element?.appendChild(horizon)
		this.eventHorizon = horizon
		this.blackHole = horizon // Keep reference for backward compatibility

		// 4. Enhanced orbital particles with cosmic colors
		this.addParticles(x, y)
	}

	private addParticles(cx: number, cy: number): void {
		// Cosmic particle colors - alternating between nebula emission colors
		const cosmicParticleColors = [
			{ bg: COSMIC_COLORS.hAlpha, glow: COSMIC_COLORS.hAlphaDim },
			{ bg: COSMIC_COLORS.oiii, glow: COSMIC_COLORS.oiiiDim },
			{ bg: COSMIC_COLORS.stellar, glow: COSMIC_COLORS.stellarDim },
			{ bg: 'rgba(255, 255, 255, 0.9)', glow: COSMIC_COLORS.stellarDim },
		]

		// Create orbital particles that spiral inward elegantly
		const particleCount = 10
		for (let i = 0; i < particleCount; i++) {
			const p = document.createElement('div')
			const startAngle = (i / particleCount) * Math.PI * 2
			const orbitRadius = 45 + (i % 3) * 18
			const size = 2 + (i % 3)
			const duration = 1400 + (i % 3) * 400
			const delay = i * 70
			const colorSet = cosmicParticleColors[i % cosmicParticleColors.length]

			p.className = 'pointer-events-none'
			p.style.cssText = `
				--orbit-radius: ${orbitRadius}px;
				position: absolute;
				width: ${size}px;
				height: ${size}px;
				border-radius: 9999px;
				background: ${colorSet.bg};
				box-shadow: 0 0 ${size * 4}px ${colorSet.bg}, 0 0 ${size * 8}px ${colorSet.glow};
				left: ${cx}px;
				top: ${cy}px;
				z-index: 9997;
				will-change: transform, opacity;
				transform-origin: center center;
				transform: rotate(${startAngle}rad) translateX(${orbitRadius}px);
				opacity: 0;
			`

			this.element?.appendChild(p)
			this.particles.push(p)

			// Smooth orbital spiral animation
			p.animate(
				[
					{
						transform: `rotate(${startAngle}rad) translateX(${orbitRadius}px) scale(1)`,
						opacity: 0,
					},
					{
						transform: `rotate(${startAngle}rad) translateX(${orbitRadius}px) scale(1)`,
						opacity: 0.9,
						offset: 0.1,
					},
					{
						transform: `rotate(${startAngle + Math.PI}rad) translateX(${orbitRadius * 0.5}px) scale(0.8)`,
						opacity: 0.7,
						offset: 0.5,
					},
					{
						transform: `rotate(${startAngle + Math.PI * 2}rad) translateX(0px) scale(0)`,
						opacity: 0,
					},
				],
				{
					duration,
					delay,
					easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
					fill: 'forwards',
				}
			).onfinish = () => p.remove()
		}

		// Cosmic light streaks being pulled in - alternating H-alpha and OIII
		const streakColors = [COSMIC_COLORS.hAlpha, COSMIC_COLORS.oiii, COSMIC_COLORS.stellar, COSMIC_COLORS.oiii]
		for (let i = 0; i < 5; i++) {
			const streak = document.createElement('div')
			const angle = (i / 5) * Math.PI * 2 + Math.PI / 10
			const startDist = 65 + Math.random() * 25
			const streakColor = streakColors[i % streakColors.length]

			streak.className = 'pointer-events-none'
			streak.style.cssText = `
				position: absolute;
				width: 2px;
				height: 14px;
				border-radius: 1px;
				background: linear-gradient(to bottom, transparent, ${streakColor}, rgba(255,255,255,0.3));
				left: ${cx + Math.cos(angle) * startDist}px;
				top: ${cy + Math.sin(angle) * startDist}px;
				z-index: 9996;
				will-change: transform, opacity;
				transform: rotate(${angle + Math.PI / 2}rad) scale(0);
				opacity: 0;
				mix-blend-mode: screen;
			`

			this.element?.appendChild(streak)
			this.particles.push(streak)

			streak.animate(
				[
					{
						transform: `rotate(${angle + Math.PI / 2}rad) scale(0)`,
						opacity: 0,
						left: `${cx + Math.cos(angle) * startDist}px`,
						top: `${cy + Math.sin(angle) * startDist}px`,
					},
					{
						transform: `rotate(${angle + Math.PI / 2}rad) scale(1.5)`,
						opacity: 0.85,
						left: `${cx + Math.cos(angle) * startDist * 0.5}px`,
						top: `${cy + Math.sin(angle) * startDist * 0.5}px`,
						offset: 0.3,
					},
					{
						transform: `rotate(${angle + Math.PI / 2}rad) scale(0.5)`,
						opacity: 0,
						left: `${cx}px`,
						top: `${cy}px`,
					},
				],
				{
					duration: 900,
					delay: 150 + i * 120,
					easing: 'cubic-bezier(0.55, 0, 1, 0.45)',
					fill: 'forwards',
				}
			).onfinish = () => streak.remove()
		}
	}

	private collapseBlackHole(): void {
		this.bird?.remove()
		this.particles.forEach(p => p.remove())

		if (!this.context) {
			this.state$.next('done')
			return
		}

		const { bx, by } = this.context
		const color = this.currentColor

		// 1. Collapse accretion disks inward rapidly
		this.accretionDisks.forEach((disk, i) => {
			disk.animate(
				[
					{ transform: disk.style.transform, opacity: 1 },
					{ transform: 'translate(-50%, -50%) rotateX(90deg) scale(0)', opacity: 0 },
				],
				{ duration: 200 + i * 50, easing: 'ease-in', fill: 'forwards' }
			).onfinish = () => disk.remove()
		})
		this.accretionDisks = []

		// 2. Lensing ring collapses
		if (this.lensingRing) {
			this.lensingRing.animate(
				[
					{ transform: 'translate(-50%, -50%) rotateX(85deg) scale(1)', opacity: 0.6 },
					{ transform: 'translate(-50%, -50%) rotateX(85deg) scale(0)', opacity: 0 },
				],
				{ duration: 250, easing: 'ease-in', fill: 'forwards' }
			).onfinish = () => this.lensingRing?.remove()
		}

		// 3. Event horizon/blackhole - brief bright flash then collapse
		const bh = this.blackHole
		if (bh) {
			bh.animate(
				[
					{ transform: 'translate(-50%, -50%) scale(1)', filter: 'brightness(1)' },
					{ transform: 'translate(-50%, -50%) scale(1.3)', filter: 'brightness(3)', offset: 0.2 },
					{ transform: 'translate(-50%, -50%) scale(0)', filter: 'brightness(5)', opacity: 0 },
				],
				{ duration: 350, easing: 'cubic-bezier(0.55, 0, 1, 0.45)', fill: 'forwards' }
			).onfinish = () => bh.remove()
		}

		// 4. COSMIC BIG BANG - Multiple expanding shockwave rings with nebula colors
		const cosmicRingColors = [
			{ border: COSMIC_COLORS.stellar, glow: COSMIC_COLORS.stellarDim },
			{ border: COSMIC_COLORS.hAlpha, glow: COSMIC_COLORS.hAlphaDim },
			{ border: COSMIC_COLORS.oiii, glow: COSMIC_COLORS.oiiiDim },
			{ border: COSMIC_COLORS.deepPurple, glow: COSMIC_COLORS.deepBlue },
		]

		for (let i = 0; i < 4; i++) {
			const ring = document.createElement('div')
			const ringColor = cosmicRingColors[i]
			ring.className = 'pointer-events-none'
			ring.style.cssText = `
				position: absolute;
				left: ${bx}px;
				top: ${by}px;
				width: 20px;
				height: 20px;
				border-radius: 9999px;
				border: ${2.5 - i * 0.4}px solid ${ringColor.border};
				box-shadow:
					0 0 ${18 - i * 3}px ${ringColor.border},
					0 0 ${30 - i * 5}px ${ringColor.glow},
					inset 0 0 ${12 - i * 2}px ${ringColor.glow};
				transform: translate(-50%, -50%) scale(0.5);
				z-index: ${9990 - i};
				will-change: transform, opacity;
				mix-blend-mode: screen;
			`
			this.element?.appendChild(ring)

			ring.animate(
				[
					{
						transform: 'translate(-50%, -50%) scale(0.5)',
						opacity: 0.95,
						borderWidth: `${2.5 - i * 0.4}px`,
					},
					{
						transform: 'translate(-50%, -50%) scale(2.5)',
						opacity: 0.6,
						borderWidth: `${1.8 - i * 0.3}px`,
						offset: 0.35,
					},
					{
						transform: 'translate(-50%, -50%) scale(6)',
						opacity: 0,
						borderWidth: '0.5px',
					},
				],
				{
					duration: 800 + i * 120,
					delay: i * 60,
					easing: 'cubic-bezier(0, 0.55, 0.45, 1)',
					fill: 'forwards',
				}
			).onfinish = () => ring.remove()
		}

		// 5. Central cosmic flash burst - white core with H-alpha corona
		const flash = document.createElement('div')
		flash.className = 'pointer-events-none'
		flash.style.cssText = `
			position: absolute;
			left: ${bx}px;
			top: ${by}px;
			width: 10px;
			height: 10px;
			border-radius: 9999px;
			background: radial-gradient(circle,
				white 0%,
				${COSMIC_COLORS.stellar} 20%,
				${COSMIC_COLORS.hAlpha} 50%,
				${COSMIC_COLORS.oiiiDim} 70%,
				transparent 100%
			);
			transform: translate(-50%, -50%) scale(0);
			z-index: 10000;
			will-change: transform, opacity;
		`
		this.element?.appendChild(flash)

		flash.animate(
			[
				{ transform: 'translate(-50%, -50%) scale(0)', opacity: 1 },
				{ transform: 'translate(-50%, -50%) scale(5)', opacity: 1, offset: 0.12 },
				{ transform: 'translate(-50%, -50%) scale(8)', opacity: 0 },
			],
			{ duration: 450, easing: 'ease-out', fill: 'forwards' }
		).onfinish = () => flash.remove()

		// 6. Cosmic afterglow nebula - layered emission colors
		const afterglow = document.createElement('div')
		afterglow.className = 'pointer-events-none'
		afterglow.style.cssText = `
			position: absolute;
			left: ${bx}px;
			top: ${by}px;
			width: 50px;
			height: 50px;
			border-radius: 9999px;
			background: radial-gradient(circle,
				${COSMIC_COLORS.stellarDim} 0%,
				${COSMIC_COLORS.hAlphaDim} 30%,
				${COSMIC_COLORS.oiiiDim} 50%,
				${COSMIC_COLORS.deepPurple} 70%,
				transparent 100%
			);
			transform: translate(-50%, -50%);
			z-index: 9989;
			will-change: opacity;
			mix-blend-mode: screen;
		`
		this.element?.appendChild(afterglow)

		afterglow.animate(
			[
				{ opacity: 1, transform: 'translate(-50%, -50%) scale(1)' },
				{ opacity: 0.6, transform: 'translate(-50%, -50%) scale(1.8)', offset: 0.4 },
				{ opacity: 0, transform: 'translate(-50%, -50%) scale(2.5)' },
			],
			{ duration: 900, easing: 'ease-out', fill: 'forwards' }
		).onfinish = () => {
			afterglow.remove()
			this.state$.next('done')
		}

		// 7. BIG BANG SHOCKWAVE on host element - violent impact then settle
		if (this.homeElement) {
			const el = this.homeElement
			const originalTransform = el.style.transform || ''

			// Phase 1: Violent shockwave impact with shake
			el.animate(
				[
					// Initial impact - sudden expansion with bright flash
					{ transform: `${originalTransform} translate(0, 0) scale(1) rotate(0deg)`, filter: 'brightness(1)' },
					{ transform: `${originalTransform} translate(0, 0) scale(1.04) rotate(0deg)`, filter: `brightness(2) drop-shadow(0 0 30px ${color})`, offset: 0.05 },
					// Violent shake sequence
					{ transform: `${originalTransform} translate(-4px, 2px) scale(1.025) rotate(-0.8deg)`, filter: `brightness(1.6) drop-shadow(0 0 25px ${color})`, offset: 0.1 },
					{ transform: `${originalTransform} translate(5px, -3px) scale(0.98) rotate(1deg)`, filter: `brightness(1.4) drop-shadow(0 0 20px ${color})`, offset: 0.15 },
					{ transform: `${originalTransform} translate(-3px, -2px) scale(1.02) rotate(-0.6deg)`, filter: `brightness(1.3) drop-shadow(0 0 18px ${color})`, offset: 0.2 },
					{ transform: `${originalTransform} translate(4px, 3px) scale(0.985) rotate(0.8deg)`, filter: `brightness(1.25) drop-shadow(0 0 15px ${color})`, offset: 0.25 },
					{ transform: `${originalTransform} translate(-2px, 1px) scale(1.015) rotate(-0.5deg)`, filter: `brightness(1.2) drop-shadow(0 0 12px ${color})`, offset: 0.3 },
					{ transform: `${originalTransform} translate(3px, -2px) scale(0.99) rotate(0.6deg)`, filter: `brightness(1.18) drop-shadow(0 0 10px ${color})`, offset: 0.35 },
					{ transform: `${originalTransform} translate(-2px, 2px) scale(1.01) rotate(-0.4deg)`, filter: `brightness(1.15) drop-shadow(0 0 8px ${color})`, offset: 0.4 },
					{ transform: `${originalTransform} translate(2px, -1px) scale(0.995) rotate(0.4deg)`, filter: 'brightness(1.12)', offset: 0.45 },
					{ transform: `${originalTransform} translate(-1px, 1px) scale(1.008) rotate(-0.3deg)`, filter: 'brightness(1.1)', offset: 0.5 },
					{ transform: `${originalTransform} translate(1px, -1px) scale(0.997) rotate(0.25deg)`, filter: 'brightness(1.08)', offset: 0.55 },
					{ transform: `${originalTransform} translate(-1px, 0px) scale(1.005) rotate(-0.2deg)`, filter: 'brightness(1.06)', offset: 0.6 },
					{ transform: `${originalTransform} translate(1px, 1px) scale(0.998) rotate(0.15deg)`, filter: 'brightness(1.05)', offset: 0.65 },
					{ transform: `${originalTransform} translate(0px, -1px) scale(1.003) rotate(-0.1deg)`, filter: 'brightness(1.04)', offset: 0.7 },
					{ transform: `${originalTransform} translate(-1px, 0px) scale(0.999) rotate(0.08deg)`, filter: 'brightness(1.03)', offset: 0.75 },
					{ transform: `${originalTransform} translate(0px, 1px) scale(1.002) rotate(-0.05deg)`, filter: 'brightness(1.02)', offset: 0.8 },
					{ transform: `${originalTransform} translate(0px, 0px) scale(1.001) rotate(0.03deg)`, filter: 'brightness(1.01)', offset: 0.9 },
					{ transform: `${originalTransform} translate(0, 0) scale(1) rotate(0deg)`, filter: 'brightness(1)' },
				],
				{
					duration: 800,
					easing: 'linear',
				}
			)
		}
	}

	/**
	 * Create the canvas for real-time trail rendering
	 */
	private ensureTrailCanvas(): void {
		if (this.trailCanvas || !this.element) return

		const hostW = this.element.scrollWidth
		const hostH = this.element.scrollHeight
		const canvas = document.createElement('canvas')
		canvas.width = hostW * window.devicePixelRatio
		canvas.height = hostH * window.devicePixelRatio
		canvas.style.cssText = `
			position: absolute;
			top: 0;
			left: 0;
			width: ${hostW}px;
			height: ${hostH}px;
			pointer-events: none;
			z-index: 9990;
		`
		this.element.appendChild(canvas)
		this.trailCanvas = canvas
		this.trailCtx = canvas.getContext('2d')
		if (this.trailCtx) {
			this.trailCtx.scale(window.devicePixelRatio, window.devicePixelRatio)
		}
	}

	/**
	 * Draw trail segment from last position to current position
	 */
	private drawTrail(x: number, y: number): void {
		if (!this.options.showConnections) return
		this.ensureTrailCanvas()
		if (!this.trailCtx || !this.lastTrailPos) {
			this.lastTrailPos = { x, y }
			return
		}

		const ctx = this.trailCtx
		const color = this.currentColor

		// Draw line segment from last position to current
		ctx.beginPath()
		ctx.moveTo(this.lastTrailPos.x, this.lastTrailPos.y)
		ctx.lineTo(x, y)
		ctx.strokeStyle = color
		ctx.lineWidth = 3
		ctx.lineCap = 'round'
		ctx.globalAlpha = 0.6
		ctx.shadowColor = color
		ctx.shadowBlur = 8
		ctx.stroke()
		ctx.globalAlpha = 1
		ctx.shadowBlur = 0

		this.lastTrailPos = { x, y }
	}

	/**
	 * Reset trail position (called when starting new flight segment)
	 */
	private resetTrail(): void {
		this.lastTrailPos = null
	}

	/**
	 * Fade out the entire trail canvas
	 */
	private fadeTrail(): void {
		if (!this.trailCtx || !this.element) return
		const hostW = this.element.scrollWidth
		const hostH = this.element.scrollHeight
		// Gradually fade existing content
		this.trailCtx.globalCompositeOperation = 'destination-out'
		this.trailCtx.fillStyle = 'rgba(0, 0, 0, 0.02)'
		this.trailCtx.fillRect(0, 0, hostW, hostH)
		this.trailCtx.globalCompositeOperation = 'source-over'
	}

	private cleanup(): void {
		this.destroyed$.next(true)

		if (this.rafId) {
			cancelAnimationFrame(this.rafId)
			this.rafId = 0
		}

		// Cleanup shimmer
		this.shimmerAnimation?.cancel()
		this.shimmerOverlay?.remove()
		this.shimmerAnimation = null
		this.shimmerOverlay = null

		// Cleanup pulse rings
		this.pulseRings.forEach(r => r.remove())
		this.pulseRings = []

		// Cleanup trail canvas
		this.trailCanvas?.remove()
		this.trailCanvas = null
		this.trailCtx = null
		this.lastTrailPos = null

		// Cleanup enhanced blackhole elements
		this.accretionDisks.forEach(d => d.remove())
		this.accretionDisks = []
		this.lensingRing?.remove()
		this.lensingRing = null
		this.eventHorizon?.remove()
		this.eventHorizon = null
		this.homeElement = null

		this.bird?.remove()
		this.blackHole?.remove()
		this.particles.forEach(p => p.remove())

		this.bird = null
		this.blackHole = null
		this.particles = []
		this.context = null
	}

	override disconnected(): void {
		this.cleanup()
	}
}

export const hummingbird = directive(HummingbirdDirective)
