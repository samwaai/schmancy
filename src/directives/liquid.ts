/**
 * Liquid Glass Directive — Apple WWDC 2025 Liquid Glass
 *
 * Pure CSS, zero DOM mutation. Applies only inline styles to the host element:
 * - backdrop-filter: blur + saturate + brightness (glass material)
 * - background: semi-transparent tint (glass visibility layer)
 * - box-shadow: Fresnel edge glow (inset) + depth shadow (outer)
 * - border: thin luminous edge
 *
 * Does NOT insert any child elements, so it's safe on flex/grid containers.
 *
 * Usage:
 * ```ts
 * html`<div ${liquid()}>Content</div>`
 * html`<div ${liquid({ intensity: 'strong' })}>Thick glass</div>`
 * html`<div ${liquid({ active: false })}>No glass</div>`
 * ```
 */

import { noChange } from 'lit'
import { AsyncDirective, directive } from 'lit/async-directive.js'
import type { ElementPart } from 'lit'

export interface LiquidOptions {
	/** Whether the effect is active. Default: true */
	active?: boolean
	/** Glass thickness. Default: 'medium' */
	intensity?: 'light' | 'medium' | 'strong'
}

const DEFAULTS: Required<LiquidOptions> = {
	active: true,
	intensity: 'medium',
}

interface Params {
	blur: number
	sat: number
	bright: number
	tint: number
	border: number
	shadow: number
}

const INTENSITY: Record<string, Params> = {
	light:  { blur: 12, sat: 1.3, bright: 1.05, tint: 0.45, border: 0.20, shadow: 0.06 },
	medium: { blur: 16, sat: 1.4, bright: 1.08, tint: 0.55, border: 0.28, shadow: 0.08 },
	strong: { blur: 24, sat: 1.5, bright: 1.12, tint: 0.65, border: 0.35, shadow: 0.10 },
}

// Style keys we modify — saved and restored on cleanup
const STYLE_KEYS = [
	'backdropFilter',
	'background',
	'boxShadow',
	'borderTop',
	'borderBottom',
] as const
type StyleKey = typeof STYLE_KEYS[number]

interface State {
	element: HTMLElement
	origStyles: Record<StyleKey, string>
}

class LiquidDirective extends AsyncDirective {
	private state: State | null = null

	render(_options?: LiquidOptions) {
		return noChange
	}

	override update(part: ElementPart, [options = {}]: [LiquidOptions?]) {
		const el = part.element as HTMLElement
		const opts = { ...DEFAULTS, ...options }

		if (opts.active) {
			this.activate(el, opts)
		} else {
			this.cleanup()
		}
		return noChange
	}

	private activate(el: HTMLElement, opts: Required<LiquidOptions>): void {
		if (!this.isConnected) return
		const p = INTENSITY[opts.intensity]

		if (!this.state) {
			// Save original styles
			const origStyles = {} as Record<StyleKey, string>
			for (const key of STYLE_KEYS) {
				origStyles[key] = el.style[key]
			}
			this.state = { element: el, origStyles }
		}

		this.applyStyles(el, p)
	}

	private applyStyles(el: HTMLElement, p: Params): void {
		// Glass material
		const bdFilter = `blur(${p.blur}px) saturate(${p.sat}) brightness(${p.bright})`
		el.style.backdropFilter = bdFilter
		el.style.setProperty('-webkit-backdrop-filter', bdFilter)

		// Glass tint (uses theme surface color, adapts to light/dark)
		el.style.background = `rgba(var(--md-sys-color-surface-container, 255 255 255) / ${p.tint})`

		// Fresnel edge glow (inset) + depth shadow (outer)
		const b = p.border
		el.style.boxShadow = [
			// Top Fresnel rim — bright edge (directional light from above)
			`inset 0 1px 0 0 rgba(255,255,255, ${b * 1.5})`,
			`inset 0 2px 6px rgba(255,255,255, ${b * 0.6})`,
			// Bottom subtle rim
			`inset 0 -1px 0 0 rgba(255,255,255, ${b * 0.25})`,
			// Depth shadows
			`0 1px 3px rgba(0,0,0, ${p.shadow})`,
			`0 6px 20px rgba(0,0,0, ${p.shadow * 0.5})`,
		].join(', ')

		// Luminous border edges
		el.style.borderTop = `0.5px solid rgba(255,255,255, ${b * 0.9})`
		el.style.borderBottom = `0.5px solid rgba(0,0,0, 0.05)`
	}

	private cleanup(): void {
		if (!this.state) return
		const { element, origStyles } = this.state

		// Restore all original styles
		for (const key of STYLE_KEYS) {
			element.style[key] = origStyles[key]
		}
		element.style.removeProperty('-webkit-backdrop-filter')

		this.state = null
	}

	override disconnected(): void {
		this.cleanup()
	}

	override reconnected(): void {
		// Will re-activate on next update()
	}
}

export const liquid = directive(LiquidDirective)
