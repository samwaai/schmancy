/**
 * AI Badge Directive — Indicator for AI-generated content.
 * Pulses gently on the host element; color routed through theme tokens.
 */

import { noChange } from 'lit'
import { AsyncDirective, directive } from 'lit/async-directive.js'
import type { ElementPart } from 'lit'

interface State {
	message: string
	element: HTMLElement
	badge: HTMLElement | null
	animation: Animation | null
}

class AIBadgeDirective extends AsyncDirective {
	private state: State | null = null

	render(_message?: string) {
		return noChange
	}

	override update(part: ElementPart, [message = '']: [string?]) {
		const element = part.element as HTMLElement

		if (!message) {
			this.cleanup()
			return noChange
		}

		if (this.state) return noChange

		this.state = {
			message,
			element,
			badge: null,
			animation: null,
		}

		if (getComputedStyle(element).position === 'static') {
			element.style.position = 'relative'
		}

		const badge = document.createElement('div')
		badge.style.cssText = `
			display: block;
			position: absolute;
			bottom: -8px;
			left: 8px;
			z-index: 10;
			padding: 3px 10px;
			border-radius: 12px;
			font-size: 0.65rem;
			font-weight: 600;
			background: linear-gradient(
				135deg,
				var(--md-sys-color-primary, #7c5cff),
				var(--md-sys-color-primary-container, #6750a4)
			);
			color: var(--md-sys-color-on-primary, #fff);
			box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
			white-space: nowrap;
		`
		badge.textContent = `✦ ${message}`
		badge.title = message

		element.appendChild(badge)
		this.state.badge = badge

		this.state.animation = badge.animate(
			[
				{ transform: 'scale(1)' },
				{ transform: 'scale(1.03)' },
				{ transform: 'scale(1)' },
			],
			{ duration: 2000, easing: 'ease-in-out', iterations: Infinity },
		)

		return noChange
	}

	private cleanup(): void {
		if (!this.state) return
		this.state.animation?.cancel()
		this.state.badge?.remove()
		this.state = null
	}

	override disconnected(): void {
		this.cleanup()
	}
}

export const aiBadge = directive(AIBadgeDirective)
