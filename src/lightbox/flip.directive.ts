import { directive, PartInfo, PartType, ElementPart } from 'lit/directive.js'
import { AsyncDirective } from 'lit/async-directive.js'
import { noChange } from 'lit'

export interface FlipOptions {
	disabled?: boolean
	duration?: number
	easing?: string
	scale?: boolean
}

class FlipDirective extends AsyncDirective {
	private element?: HTMLElement
	private lastRect?: DOMRectReadOnly
	private animation?: Animation
	private options: FlipOptions = {}

	constructor(partInfo: PartInfo) {
		super(partInfo)
		if (partInfo.type !== PartType.ELEMENT) {
			throw new Error('flip directive can only be used on elements')
		}
	}

	render(_options?: FlipOptions) {
		return noChange
	}

	update(part: ElementPart, [options]: [FlipOptions?]) {
		this.element = part.element as HTMLElement
		this.options = options ?? {}

		// Let Lit finish DOM work, then run FLIP in a microtask
		queueMicrotask(() => this.runFlip())

		return noChange
	}

	private runFlip() {
		const el = this.element
		if (!el || this.options.disabled) return

		const newRect = el.getBoundingClientRect()
		const prevRect = this.lastRect

		// Store for next time
		this.lastRect = newRect

		// First render – nothing to animate from
		if (!prevRect) return

		const dx = prevRect.left - newRect.left
		const dy = prevRect.top - newRect.top
		const sx = prevRect.width / newRect.width
		const sy = prevRect.height / newRect.height

		const needsTranslation = Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5
		const wantsScale = this.options.scale !== false
		const needsScale =
			wantsScale && (Math.abs(sx - 1) > 0.01 || Math.abs(sy - 1) > 0.01)

		if (!needsTranslation && !needsScale) return

		let fromTransform = 'translate(0, 0)'
		if (needsTranslation) {
			fromTransform = `translate(${dx}px, ${dy}px)`
		}
		if (needsScale) {
			fromTransform += ` scale(${sx}, ${sy})`
		}

		this.animation?.cancel()

		const duration = this.options.duration ?? 250
		const easing = this.options.easing ?? 'cubic-bezier(0.25, 1, 0.5, 1)'

		const keyframes: Keyframe[] = [
			{ transform: fromTransform },
			{ transform: 'none' },
		]

		// FLIP usually wants a stable origin
		el.style.transformOrigin = 'top left'

		this.animation = el.animate(keyframes, {
			duration,
			easing,
			fill: 'both',
		})

		// Avoid unhandled promise rejections on cancel
		this.animation.finished.catch(() => {})
	}

	disconnected() {
		this.animation?.cancel()
		this.animation = undefined
		this.element = undefined
		this.lastRect = undefined
	}

	reconnected() {
		// Treat the next layout as the new "first" state
		if (this.element) {
			this.lastRect = this.element.getBoundingClientRect()
		}
	}
}

export const flip = directive(FlipDirective)
