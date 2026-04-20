import { directive, type ElementPart, PartType } from 'lit/directive.js'
import { AsyncDirective } from 'lit/async-directive.js'
import { animationFrameScheduler, fromEvent, merge, Subject } from 'rxjs'
import { auditTime, map, takeUntil } from 'rxjs/operators'
import { reducedMotion$ } from './reduced-motion'

export interface CursorGlowOptions {
	/** Glow radius in pixels (default: 200) */
	radius?: number
	/** Glow color — CSS color value (default: primary color) */
	color?: string
	/** Glow opacity 0-1 (default: 0.12) */
	intensity?: number
}

/**
 * Cursor glow directive — a soft radial light follows the cursor across the surface.
 *
 * @example
 * ```html
 * <schmancy-surface type="glass" ${cursorGlow()}>content</schmancy-surface>
 * <div ${cursorGlow({ radius: 300, intensity: 0.2 })}>hero panel</div>
 * ```
 */
class CursorGlowDirective extends AsyncDirective {
	private element!: HTMLElement
	private glowEl?: HTMLElement
	private readonly teardown$ = new Subject<void>()
	private radius = 200
	private color = 'var(--schmancy-sys-color-primary-default)'
	private intensity = 0.12
	private prevKey?: string
	private didSetPosition = false
	private cachedRect?: DOMRect

	render(_options?: CursorGlowOptions) {
		return undefined
	}

	override update(part: ElementPart, [options]: [CursorGlowOptions?]) {
		if (part.type !== PartType.ELEMENT) {
			throw new Error('cursorGlow directive must be used on an element')
		}

		const key = JSON.stringify(options ?? {})
		if (this.element && key === this.prevKey) return undefined
		this.prevKey = key

		this.element = part.element as HTMLElement
		this.radius = options?.radius ?? 200
		this.color = options?.color ?? 'var(--schmancy-sys-color-primary-default)'
		this.intensity = options?.intensity ?? 0.12

		if (reducedMotion$.value) return undefined

		this.teardown$.next()
		this.ensureGlowElement()
		this.setupTracking()

		return undefined
	}

	override reconnected() {
		this.ensureGlowElement()
		this.teardown$.next()
		this.setupTracking()
	}

	private ensureGlowElement() {
		const pos = getComputedStyle(this.element).position
		if (pos === 'static') {
			this.element.style.position = 'relative'
			this.didSetPosition = true
		}

		if (!this.glowEl) {
			this.glowEl = document.createElement('div')
			this.glowEl.setAttribute('aria-hidden', 'true')
			Object.assign(this.glowEl.style, {
				position: 'absolute',
				inset: '0',
				pointerEvents: 'none',
				zIndex: '0',
				borderRadius: 'inherit',
				overflow: 'hidden',
				opacity: '0',
				transition: 'opacity 400ms ease',
			})
			this.element.prepend(this.glowEl)
		}
	}

	private setupTracking() {
		const enter$ = fromEvent<MouseEvent>(this.element, 'mouseenter').pipe(
			map(() => {
				if (this.glowEl) this.glowEl.style.opacity = '1'
				this.cachedRect = this.element.getBoundingClientRect()
				return null
			}),
		)

		const move$ = fromEvent<MouseEvent>(this.element, 'mousemove').pipe(
			auditTime(0, animationFrameScheduler),
			map(e => {
				const rect = this.cachedRect ?? this.element.getBoundingClientRect()
				return { x: e.clientX - rect.left, y: e.clientY - rect.top }
			}),
		)

		const leave$ = fromEvent(this.element, 'mouseleave').pipe(
			map(() => {
				if (this.glowEl) this.glowEl.style.opacity = '0'
				this.cachedRect = undefined
				return null
			}),
		)

		merge(enter$, move$, leave$)
			.pipe(takeUntil(this.teardown$))
			.subscribe(pos => {
				if (pos && this.glowEl) {
					this.glowEl.style.background = `radial-gradient(
						${this.radius}px circle at ${pos.x}px ${pos.y}px,
						color-mix(in srgb, ${this.color} ${Math.round(this.intensity * 100)}%, transparent),
						transparent
					)`
				}
			})
	}

	override disconnected() {
		this.teardown$.next()
		this.glowEl?.remove()
		this.glowEl = undefined
		if (this.didSetPosition && this.element) {
			this.element.style.position = ''
			this.didSetPosition = false
		}
	}
}

export const cursorGlow = directive(CursorGlowDirective)
