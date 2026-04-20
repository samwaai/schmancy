import { directive, type ElementPart, PartType } from 'lit/directive.js'
import { AsyncDirective } from 'lit/async-directive.js'
import { reducedMotion$ } from './reduced-motion'

export interface DepthOfFieldOptions {
	/** When true, blur is applied. When false, blur is removed. */
	active: boolean
	/** Max blur radius in pixels (default: 8) */
	maxBlur?: number
	/** Duration of blur transition in ms (default: 400) */
	duration?: number
}

/**
 * Depth-of-field directive — progressive blur on background content.
 *
 * Reactive: responds to `active` changing. Uses `style.scale` instead of
 * `style.transform` to avoid conflicts with other directives.
 *
 * @example
 * ```html
 * <main ${depthOfField({ active: this.dialogOpen, maxBlur: 8 })}>
 *   page content
 * </main>
 * ```
 */
class DepthOfFieldDirective extends AsyncDirective {
	private element!: HTMLElement
	private maxBlur = 8
	private duration = 400
	private isBlurred = false
	private transitionSet = false

	render(_options: DepthOfFieldOptions) {
		return undefined
	}

	override update(part: ElementPart, [options]: [DepthOfFieldOptions]) {
		if (part.type !== PartType.ELEMENT) {
			throw new Error('depthOfField directive must be used on an element')
		}

		this.element = part.element as HTMLElement
		this.maxBlur = options.maxBlur ?? 8
		this.duration = options.duration ?? 400

		// Setup transition once (uses filter + scale, not transform)
		if (!this.transitionSet && !reducedMotion$.value) {
			this.element.style.transition = `filter ${this.duration}ms cubic-bezier(0.34, 1.2, 0.64, 1), scale ${this.duration}ms cubic-bezier(0.34, 1.2, 0.64, 1)`
			this.transitionSet = true
		}

		if (options.active && !this.isBlurred) {
			this.applyBlur()
		} else if (!options.active && this.isBlurred) {
			this.clearBlur()
		}

		return undefined
	}

	private applyBlur() {
		this.element.style.filter = `blur(${this.maxBlur}px) saturate(60%)`
		this.element.style.scale = '1.01'
		this.isBlurred = true
	}

	private clearBlur() {
		this.element.style.filter = ''
		this.element.style.scale = ''
		this.isBlurred = false
	}

	override disconnected() {
		if (this.isBlurred) this.clearBlur()
	}

	override reconnected() {
		// Inline styles persist — no action needed
	}
}

export const depthOfField = directive(DepthOfFieldDirective)
