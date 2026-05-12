/**
 * Urgent directive — shattering glass attention effect.
 *
 * Creates a dramatic shattering glass effect with particles exploding from the
 * center. Uses GPU-accelerated CSS transforms and requestAnimationFrame for
 * smooth 60fps animation.
 *
 * Designed for 100+ concurrent instances on a page:
 * - Shared global container: single DOM container for all instances.
 * - Shared animation loop: one rAF loop coordinates all shard updates.
 * - Shared visibility observer: single IntersectionObserver for all elements.
 * - Shared tab visibility: single document listener shared across instances.
 * - Shared shard pool: global pool reduces memory allocation.
 * - Throttled sound: prevents audio system saturation.
 * - Staggered bursts: prevents all instances bursting simultaneously.
 *
 * @example
 * ```ts
 * // Basic usage — shattering glass when condition is true (auto mode)
 * html`<button ${urgent(isOverdue)}>Confirm Delivery</button>`
 *
 * // With custom color (defaults to error color)
 * html`<div ${urgent(needsAttention, 'warning')}>Action needed</div>`
 *
 * // Without shake
 * html`<button ${urgent(isCritical, 'error', false)}>Critical</button>`
 *
 * // Using options object (default interval is 4000ms)
 * html`<div ${urgent({ active: true, color: 'warning', interval: 5000 })}>Alert</div>`
 *
 * // Manual mode with controller
 * const controller = urgent.getController(element)
 * controller.play()        // Single burst
 * controller.start(1500)   // Start interval at 1.5s
 * controller.stop()        // Stop interval
 * ```
 */

import { noChange } from 'lit'
import { AsyncDirective, directive } from 'lit/async-directive.js'
import type { ElementPart } from 'lit'
import { $sounds } from '../audio'

export type UrgentColor = 'error' | 'warning' | 'primary'
export type UrgentMode = 'auto' | 'manual'

export interface UrgentController {
	/** Trigger a single burst of shards */
	play(): void
	/** Start the burst interval (auto mode behavior) */
	start(intervalMs?: number): void
	/** Stop the burst interval */
	stop(): void
	/** Whether the burst interval is currently running */
	readonly isRunning: boolean
}

export interface UrgentOptions {
	/** Whether the urgent effect should be active */
	active?: boolean
	/** Color scheme: 'error' (default) | 'warning' | 'primary' */
	color?: UrgentColor
	/** Whether to add shake animation (default: true) */
	shake?: boolean
	/** Mode: 'auto' creates bursts on interval, 'manual' requires controller (default: 'auto') */
	mode?: UrgentMode
	/** Interval between bursts in ms (default: 4000) */
	interval?: number
}

interface ShardData {
	x: number
	y: number
	vx: number
	vy: number
	rotation: number
	rotationSpeed: number
	initialScale: number
	life: number
	maxLife: number
	element: HTMLElement
	colorIndex: number
}

// Intentional effect-variant palettes — these are the visual identity of each
// urgent scheme, not theming tokens. Kept as hex on purpose.
const COLORS: Record<UrgentColor, readonly string[]> = {
	error: ['#ef4444', '#dc2626', '#b91c1c', '#fca5a5', '#fee2e2'],
	warning: ['#f59e0b', '#d97706', '#b45309', '#fcd34d', '#fef3c7'],
	primary: ['#3b82f6', '#2563eb', '#1d4ed8', '#93c5fd', '#dbeafe'],
}

const COLOR_INDEX: Record<UrgentColor, number> = { error: 0, warning: 1, primary: 2 }

// ============================================================================
// SHARED GLOBAL RESOURCES (singleton)
// ============================================================================

class UrgentCoordinator {
	private static instance: UrgentCoordinator | null = null

	private container: HTMLElement | null = null
	private stylesInjected = false

	private shardPools: Map<number, HTMLElement[]> = new Map([
		[0, []],
		[1, []],
		[2, []],
	])
	private activeShards: ShardData[] = []

	private animationId: number | null = null
	private instances = new Set<UrgentDirective>()

	private tabVisible = true
	private visibilityObserver: IntersectionObserver | null = null
	private elementVisibility = new WeakMap<HTMLElement, boolean>()
	private observedElements = new WeakSet<HTMLElement>()

	private lastSoundTime = 0
	private readonly SOUND_THROTTLE_MS = 150

	private constructor() {
		document.addEventListener('visibilitychange', () => {
			this.tabVisible = document.visibilityState === 'visible'
			if (this.tabVisible) {
				this.resumeAllAnimations()
				this.startAnimationLoop()
			} else {
				this.pauseAllAnimations()
				this.stopAnimationLoop()
				this.clearAllShards()
			}
		})
	}

	static getInstance(): UrgentCoordinator {
		if (!UrgentCoordinator.instance) {
			UrgentCoordinator.instance = new UrgentCoordinator()
		}
		return UrgentCoordinator.instance
	}

	ensureInitialized(): void {
		this.ensureStyles()
		this.ensureContainer()
		this.ensureObserver()
	}

	private ensureStyles(): void {
		if (this.stylesInjected) return
		const style = document.createElement('style')
		style.id = 'urgent-shard-styles'
		style.textContent = `
			.urgent-shard {
				position: absolute;
				transform-origin: center;
				will-change: transform, opacity;
				pointer-events: none;
				contain: layout style;
			}
			.urgent-container {
				position: fixed;
				top: 0;
				left: 0;
				width: 100vw;
				height: 100vh;
				pointer-events: none;
				overflow: visible;
				z-index: 9999;
				contain: strict;
			}
		`
		document.head.appendChild(style)
		this.stylesInjected = true
	}

	private ensureContainer(): void {
		if (this.container && this.container.isConnected) return
		this.container = document.createElement('div')
		this.container.className = 'urgent-container'
		document.body.appendChild(this.container)
	}

	private ensureObserver(): void {
		if (this.visibilityObserver) return
		this.visibilityObserver = new IntersectionObserver(
			entries => {
				for (const entry of entries) {
					this.elementVisibility.set(entry.target as HTMLElement, entry.isIntersecting)
				}
			},
			{ threshold: 0 },
		)
	}

	register(instance: UrgentDirective): void {
		this.ensureInitialized()
		this.instances.add(instance)
		this.startAnimationLoop()
	}

	unregister(instance: UrgentDirective): void {
		this.instances.delete(instance)
		if (this.instances.size === 0) {
			this.stopAnimationLoop()
		}
	}

	observeElement(element: HTMLElement): void {
		if (this.observedElements.has(element)) return
		this.ensureObserver()
		this.visibilityObserver!.observe(element)
		this.observedElements.add(element)
		this.elementVisibility.set(element, true)
	}

	unobserveElement(element: HTMLElement): void {
		this.visibilityObserver?.unobserve(element)
		this.observedElements.delete(element)
	}

	isElementVisible(element: HTMLElement): boolean {
		return this.elementVisibility.get(element) ?? true
	}

	isTabVisible(): boolean {
		return this.tabVisible
	}

	acquireShard(colorIndex: number, colors: readonly string[]): HTMLElement {
		const pool = this.shardPools.get(colorIndex)!
		let shard = pool.pop()

		if (!shard) {
			shard = document.createElement('div')
			shard.className = 'urgent-shard'
			this.container!.appendChild(shard)
		}

		const width = 4 + Math.random() * 12
		const height = 4 + Math.random() * 12
		const color = colors[Math.floor(Math.random() * colors.length)]

		Object.assign(shard.style, {
			width: `${width}px`,
			height: `${height}px`,
			background: `linear-gradient(${Math.random() * 360}deg,${color},transparent)`,
			clipPath: `polygon(${Math.random() * 30}% ${Math.random() * 30}%,${70 + Math.random() * 30}% ${Math.random() * 40}%,${60 + Math.random() * 40}% ${60 + Math.random() * 40}%,${Math.random() * 40}% ${70 + Math.random() * 30}%)`,
			boxShadow: `0 0 ${2 + Math.random() * 4}px ${colors[0]}88`,
			opacity: '1',
		})

		return shard
	}

	releaseShard(shard: HTMLElement, colorIndex: number): void {
		Object.assign(shard.style, { opacity: '0', transform: 'translate(-9999px,-9999px)' })
		this.shardPools.get(colorIndex)!.push(shard)
	}

	addShards(shards: ShardData[]): void {
		this.activeShards.push(...shards)
	}

	private clearAllShards(): void {
		for (const shard of this.activeShards) {
			this.releaseShard(shard.element, shard.colorIndex)
		}
		this.activeShards = []
	}

	private startAnimationLoop(): void {
		if (this.animationId !== null || !this.tabVisible) return

		const tick = () => {
			this.updateShards()
			this.updateInstanceTimers()

			if (this.instances.size > 0 && this.tabVisible) {
				this.animationId = requestAnimationFrame(tick)
			} else {
				this.animationId = null
			}
		}

		this.animationId = requestAnimationFrame(tick)
	}

	private stopAnimationLoop(): void {
		if (this.animationId !== null) {
			cancelAnimationFrame(this.animationId)
			this.animationId = null
		}
	}

	private updateShards(): void {
		const shards = this.activeShards

		for (let i = shards.length - 1; i >= 0; i--) {
			const data = shards[i]
			data.life++

			data.x += data.vx
			data.y += data.vy
			data.vy += 0.15 // Gravity
			data.vx *= 0.98 // Air resistance
			data.rotation += data.rotationSpeed

			const progress = data.life / data.maxLife
			const opacity = Math.max(0, 1 - progress * progress)
			const scale = data.initialScale * (1 - progress * 0.5)

			data.element.style.transform = `translate3d(${data.x}px,${data.y}px,0) rotate(${data.rotation}deg) scale(${scale})`
			data.element.style.opacity = String(opacity)

			if (data.life >= data.maxLife) {
				this.releaseShard(data.element, data.colorIndex)
				shards.splice(i, 1)
			}
		}
	}

	private updateInstanceTimers(): void {
		const now = performance.now()
		for (const instance of this.instances) {
			instance.checkBurstTimer(now)
		}
	}

	private pauseAllAnimations(): void {
		for (const instance of this.instances) {
			instance.pauseAnimations()
		}
	}

	private resumeAllAnimations(): void {
		for (const instance of this.instances) {
			instance.resumeAnimations()
		}
	}

	playSound(color: UrgentColor): void {
		const now = performance.now()
		if (now - this.lastSoundTime < this.SOUND_THROTTLE_MS) return
		this.lastSoundTime = now

		const feeling = color === 'error' ? 'anxious' : color === 'warning' ? 'worried' : 'curious'
		$sounds.play(feeling as Parameters<typeof $sounds.play>[0])
	}

	destroy(): void {
		this.stopAnimationLoop()
		this.visibilityObserver?.disconnect()
		this.container?.remove()
		this.shardPools.forEach(pool => pool.forEach(el => el.remove()))
		this.shardPools.clear()
		this.activeShards = []
		UrgentCoordinator.instance = null
	}
}

// ============================================================================
// DIRECTIVE
// ============================================================================

interface DirectiveState {
	active: boolean
	color: UrgentColor
	shake: boolean
	mode: UrgentMode
	interval: number
	element: HTMLElement
	originalPosition: string
	originalOverflow: string
	shakeAnimation: Animation | null
	pulseAnimation: Animation | null
	isRunning: boolean
	lastBurstTime: number
	initialized: boolean
}

const controllerMap = new WeakMap<HTMLElement, UrgentController>()

class UrgentDirective extends AsyncDirective {
	private state: DirectiveState | null = null
	private coordinator = UrgentCoordinator.getInstance()

	render(_activeOrOptions?: boolean | UrgentOptions, _color?: UrgentColor, _shake?: boolean) {
		return noChange
	}

	override update(part: ElementPart, args: [boolean | UrgentOptions | undefined, UrgentColor?, boolean?]) {
		const element = part.element as HTMLElement

		let active: boolean
		let color: UrgentColor
		let shake: boolean
		let mode: UrgentMode
		let interval: number

		const first = args[0]
		if (typeof first === 'object' && first !== null) {
			active = first.active ?? false
			color = first.color ?? 'error'
			shake = first.shake ?? true
			mode = first.mode ?? 'auto'
			interval = first.interval ?? 4000
		} else {
			active = typeof first === 'boolean' ? first : false
			color = args[1] ?? 'error'
			shake = args[2] ?? true
			mode = 'auto'
			interval = 4000
		}

		if (!active && this.state?.active) {
			this.cleanup()
			return noChange
		}

		if (
			this.state &&
			this.state.active === active &&
			this.state.color === color &&
			this.state.shake === shake &&
			this.state.mode === mode &&
			this.state.interval === interval
		) {
			return noChange
		}

		if (
			this.state &&
			(this.state.color !== color ||
				this.state.shake !== shake ||
				this.state.mode !== mode ||
				this.state.interval !== interval)
		) {
			this.cleanup()
		}

		if (active && !this.state) {
			const originalPosition = element.style.position
			const originalOverflow = element.style.overflow

			this.state = {
				active,
				color,
				shake,
				mode,
				interval,
				element,
				originalPosition,
				originalOverflow,
				shakeAnimation: null,
				pulseAnimation: null,
				isRunning: false,
				lastBurstTime: performance.now() + Math.random() * interval,
				initialized: false,
			}

			controllerMap.set(element, this.createController())

			this.coordinator.register(this)
			this.coordinator.observeElement(element)

			requestAnimationFrame(() => {
				if (!this.state) return
				this.initializeElement()

				if (mode === 'auto') {
					this.startBurstInterval()
				}
			})
		}

		return noChange
	}

	private initializeElement(): void {
		if (!this.state || this.state.initialized) return

		const { element, color, shake } = this.state
		const colors = COLORS[color]

		const computedPosition = getComputedStyle(element).position
		if (computedPosition === 'static') {
			element.style.position = 'relative'
		}
		element.style.overflow = 'visible'

		if (shake) {
			this.state.shakeAnimation = element.animate(
				[
					{ transform: 'rotate(0deg) scale(1)' },
					{ transform: 'rotate(-2deg) scale(1.02)' },
					{ transform: 'rotate(2deg) scale(1.02)' },
					{ transform: 'rotate(-1deg) scale(1.01)' },
					{ transform: 'rotate(1deg) scale(1.01)' },
					{ transform: 'rotate(0deg) scale(1)' },
				],
				{ duration: 400, easing: 'ease-in-out', iterations: Infinity },
			)
		}

		this.state.pulseAnimation = element.animate(
			[
				{ boxShadow: `0 0 0 0 ${colors[0]}66` },
				{ boxShadow: `0 0 20px 5px ${colors[0]}33` },
				{ boxShadow: `0 0 0 0 ${colors[0]}66` },
			] as Keyframe[],
			{ duration: 1500, easing: 'ease-in-out', iterations: Infinity },
		)

		this.coordinator.playSound(color)

		this.state.initialized = true
	}

	checkBurstTimer(now: number): void {
		if (!this.state || !this.state.isRunning) return
		if (!this.coordinator.isTabVisible()) return
		if (!this.coordinator.isElementVisible(this.state.element)) return

		if (now - this.state.lastBurstTime >= this.state.interval) {
			this.state.lastBurstTime = now
			this.createBurst()
		}
	}

	private createBurst(): void {
		if (!this.state) return

		const { element, color } = this.state
		const colors = COLORS[color]
		const colorIndex = COLOR_INDEX[color]

		const rect = element.getBoundingClientRect()
		const centerX = rect.left + rect.width / 2
		const centerY = rect.top + rect.height / 2

		const count = 8 + Math.floor(Math.random() * 5)
		const shards: ShardData[] = []

		for (let i = 0; i < count; i++) {
			const shardElement = this.coordinator.acquireShard(colorIndex, colors)

			const angle = Math.random() * Math.PI * 2
			const speed = 2 + Math.random() * 4

			shards.push({
				element: shardElement,
				colorIndex,
				x: centerX,
				y: centerY,
				vx: Math.cos(angle) * speed,
				vy: Math.sin(angle) * speed,
				rotation: Math.random() * 360,
				rotationSpeed: -15 + Math.random() * 30,
				initialScale: 0.5 + Math.random() * 0.5,
				life: 0,
				maxLife: 40 + Math.random() * 30,
			})
		}

		this.coordinator.addShards(shards)
		this.coordinator.playSound(color)
	}

	pauseAnimations(): void {
		this.state?.shakeAnimation?.pause()
		this.state?.pulseAnimation?.pause()
	}

	resumeAnimations(): void {
		this.state?.shakeAnimation?.play()
		this.state?.pulseAnimation?.play()
	}

	private createController(): UrgentController {
		// eslint-disable-next-line @typescript-eslint/no-this-alias
		const self = this
		return {
			play: () => self.playOnce(),
			start: (intervalMs?: number) => {
				if (self.state && intervalMs !== undefined) {
					self.state.interval = intervalMs
				}
				self.startBurstInterval()
			},
			stop: () => self.stopBurstInterval(),
			get isRunning() {
				return self.state?.isRunning ?? false
			},
		}
	}

	private playOnce(): void {
		if (!this.state) return
		if (!this.state.initialized) {
			this.initializeElement()
		}
		this.createBurst()
	}

	private startBurstInterval(): void {
		if (!this.state) return
		this.state.isRunning = true
		this.state.lastBurstTime = performance.now()
	}

	private stopBurstInterval(): void {
		if (!this.state) return
		this.state.isRunning = false
	}

	private cleanup(): void {
		if (!this.state) return

		this.coordinator.unregister(this)
		this.coordinator.unobserveElement(this.state.element)

		this.state.shakeAnimation?.cancel()
		this.state.pulseAnimation?.cancel()

		controllerMap.delete(this.state.element)

		if (this.state.originalPosition !== undefined) {
			this.state.element.style.position = this.state.originalPosition
		}
		if (this.state.originalOverflow !== undefined) {
			this.state.element.style.overflow = this.state.originalOverflow
		}

		this.state = null
	}

	override disconnected(): void {
		this.cleanup()
	}
}

const urgentDirective = directive(UrgentDirective)

type UrgentFn = {
	(active?: boolean, color?: UrgentColor, shake?: boolean): ReturnType<typeof urgentDirective>
	(options: UrgentOptions): ReturnType<typeof urgentDirective>
	getController(element: HTMLElement): UrgentController | undefined
}

export const urgent: UrgentFn = Object.assign(
	(activeOrOptions?: boolean | UrgentOptions, color?: UrgentColor, shake?: boolean) =>
		urgentDirective(activeOrOptions, color, shake),
	{
		getController(element: HTMLElement): UrgentController | undefined {
			return controllerMap.get(element)
		},
	},
)
