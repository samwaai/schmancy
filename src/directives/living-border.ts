import { directive, type ElementPart, PartType } from 'lit/directive.js'
import { AsyncDirective } from 'lit/async-directive.js'
import { fromEvent, merge, Subject } from 'rxjs'
import { map, takeUntil } from 'rxjs/operators'
import { reducedMotion$ } from './reduced-motion'

export interface LivingBorderOptions {
	/** Animation duration in ms (default: 3000) */
	duration?: number
	/** Border width in pixels (default: 1) */
	width?: number
	/** Glow color (default: primary) */
	color?: string
	/** Glow spread in pixels (default: 6) */
	spread?: number
	/** Only animate on hover (default: false) */
	onHover?: boolean
}

// Shared style for ALL instances — single @property + @keyframes
const SHARED_ANIM_NAME = 'schmancy-lb-rotate'
let sharedStyleInjected = false

function ensureSharedStyle() {
	if (sharedStyleInjected) return
	const style = document.createElement('style')
	style.id = 'schmancy-living-border-shared'
	style.textContent = `
		@property --${SHARED_ANIM_NAME}-angle {
			syntax: '<angle>';
			initial-value: 0deg;
			inherits: false;
		}
		@keyframes ${SHARED_ANIM_NAME} {
			to { --${SHARED_ANIM_NAME}-angle: 360deg; }
		}
	`
	document.head.appendChild(style)
	sharedStyleInjected = true
}

/**
 * Living border directive — a gradient light traces the element's edges.
 *
 * @example
 * ```html
 * <schmancy-card ${livingBorder()}>content</schmancy-card>
 * <div ${livingBorder({ duration: 4000, onHover: true })}>panel</div>
 * ```
 */
class LivingBorderDirective extends AsyncDirective {
	private element!: HTMLElement
	private borderEl?: HTMLElement
	private readonly teardown$ = new Subject<void>()
	private prevKey?: string
	private didSetPosition = false
	private lastOptions?: LivingBorderOptions

	render(_options?: LivingBorderOptions) {
		return undefined
	}

	override update(part: ElementPart, [options]: [LivingBorderOptions?]) {
		if (part.type !== PartType.ELEMENT) {
			throw new Error('livingBorder directive must be used on an element')
		}

		const key = JSON.stringify(options ?? {})
		if (this.element && key === this.prevKey) return undefined
		this.prevKey = key

		this.element = part.element as HTMLElement
		this.lastOptions = options
		if (reducedMotion$.value) return undefined

		this.teardown$.next()
		this.cleanup()
		ensureSharedStyle()
		this.createBorderOverlay(options)

		return undefined
	}

	override reconnected() {
		// Re-create border directly — don't rely on update()
		if (this.lastOptions && !reducedMotion$.value) {
			ensureSharedStyle()
			this.createBorderOverlay(this.lastOptions)
		}
	}

	private createBorderOverlay(options?: LivingBorderOptions) {
		const width = options?.width ?? 1
		const color = options?.color ?? 'var(--schmancy-sys-color-primary-default)'
		const spread = options?.spread ?? 6
		const duration = options?.duration ?? 3000
		const onHover = options?.onHover ?? false

		const pos = getComputedStyle(this.element).position
		if (pos === 'static') {
			this.element.style.position = 'relative'
			this.didSetPosition = true
		}

		this.borderEl = document.createElement('div')
		this.borderEl.setAttribute('aria-hidden', 'true')

		const inset = `-${width}px`
		Object.assign(this.borderEl.style, {
			position: 'absolute',
			top: inset,
			left: inset,
			right: inset,
			bottom: inset,
			borderRadius: 'inherit',
			pointerEvents: 'none',
			zIndex: '0',
			background: `conic-gradient(
				from var(--${SHARED_ANIM_NAME}-angle),
				transparent 0%, transparent 30%,
				color-mix(in srgb, ${color} 50%, transparent) 45%,
				${color} 50%,
				color-mix(in srgb, ${color} 50%, transparent) 55%,
				transparent 70%, transparent 100%
			)`,
			mask: `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`,
			maskComposite: 'exclude',
			WebkitMaskComposite: 'xor',
			padding: `${width}px`,
			animation: `${SHARED_ANIM_NAME} ${duration}ms linear infinite`,
			filter: `blur(${spread * 0.3}px) drop-shadow(0 0 ${spread}px color-mix(in srgb, ${color} 40%, transparent))`,
			opacity: onHover ? '0' : '0.5',
			transition: 'opacity 300ms ease',
		})

		this.element.prepend(this.borderEl)

		// RxJS hover listeners with takeUntil cleanup
		const enter$ = fromEvent(this.element, 'mouseenter').pipe(
			map(() => { if (this.borderEl) this.borderEl.style.opacity = onHover ? '0.7' : '0.8' }),
		)
		const leave$ = fromEvent(this.element, 'mouseleave').pipe(
			map(() => { if (this.borderEl) this.borderEl.style.opacity = onHover ? '0' : '0.5' }),
		)

		merge(enter$, leave$)
			.pipe(takeUntil(this.teardown$))
			.subscribe()
	}

	private cleanup() {
		this.borderEl?.remove()
		this.borderEl = undefined
	}

	override disconnected() {
		this.teardown$.next()
		this.cleanup()
		if (this.didSetPosition && this.element) {
			this.element.style.position = ''
			this.didSetPosition = false
		}
	}
}

export const livingBorder = directive(LivingBorderDirective)
