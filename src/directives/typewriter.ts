/**
 * Typewriter Directive - RxJS-based typing animation
 *
 * Creates a smooth typewriter effect with automatic cycling through phrases.
 * Uses RxJS for precise timing and clean reactive patterns.
 *
 * @example
 * ```ts
 * // Simple cycling through words
 * html`<div ${typewriter(['Trustless', 'Permissionless', 'Transparent'])}>
 *   <span class="typed"></span>
 * </div>`
 *
 * // Custom speeds and pauses
 * html`<div ${typewriter(['Fast', 'Typing'], { typeSpeed: 50, pauseDuration: 1000 })}>
 *   <span class="typed"></span>
 * </div>`
 *
 * // One-time typing (no loop)
 * html`<div ${typewriter(['Hello World'], { loop: false })}>
 *   <span class="typed"></span>
 * </div>`
 * ```
 */

import type { ElementPart } from 'lit'
import { noChange } from 'lit'
import { AsyncDirective, directive } from 'lit/async-directive.js'
import { concat, defer, EMPTY, interval, of, Subscription } from 'rxjs'
import { delay, repeat, take, tap } from 'rxjs/operators'

export interface TypewriterOptions {
	typeSpeed?: number // Speed of typing (ms per character)
	deleteSpeed?: number // Speed of deleting (ms per character)
	pauseDuration?: number // Pause after typing before deleting (ms)
	loop?: boolean // Whether to loop through phrases
	selector?: string // CSS selector for target element (default: '.typed')
	cursor?: boolean // Show cursor
	finalMessage?: string // Message to display after cycling completes
	sound?: boolean // Play typewriter sounds (default: true)
	volume?: number // Sound volume (0-1, default: 0.3)
}

interface TypewriterState {
	phrases: string[]
	options: Required<TypewriterOptions>
	element?: HTMLElement
	targetElement?: HTMLElement
	subscription?: Subscription
	audioContext?: AudioContext
}

// Typewriter sound generator using Web Audio API
class TypewriterSound {
	private audioContext: AudioContext
	private volume: number

	constructor(volume: number = 0.3) {
		this.audioContext = new AudioContext()
		this.volume = Math.max(0, Math.min(1, volume))
	}

	// Generate cute, soft typing sound - like a gentle "pop"
	playKeyPress() {
		const now = this.audioContext.currentTime

		// Higher, softer main tone - more "pop" than "clack"
		const osc = this.audioContext.createOscillator()
		const gainNode = this.audioContext.createGain()

		// Higher base frequency for cute sound + randomness
		const baseFreq = 800 + Math.random() * 200
		osc.frequency.setValueAtTime(baseFreq, now)
		osc.type = 'sine' // Smoother, rounder sound

		// Gentler attack, quick but soft
		gainNode.gain.setValueAtTime(0, now)
		gainNode.gain.linearRampToValueAtTime(this.volume * 0.2, now + 0.005)
		gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.03)

		osc.connect(gainNode)
		gainNode.connect(this.audioContext.destination)

		osc.start(now)
		osc.stop(now + 0.03)

		// Add a cute high "bleep" for character
		const bleepOsc = this.audioContext.createOscillator()
		const bleepGain = this.audioContext.createGain()

		bleepOsc.frequency.setValueAtTime(1800 + Math.random() * 400, now)
		bleepOsc.type = 'sine'

		bleepGain.gain.setValueAtTime(0, now)
		bleepGain.gain.linearRampToValueAtTime(this.volume * 0.08, now + 0.003)
		bleepGain.gain.exponentialRampToValueAtTime(0.001, now + 0.015)

		bleepOsc.connect(bleepGain)
		bleepGain.connect(this.audioContext.destination)

		bleepOsc.start(now)
		bleepOsc.stop(now + 0.015)
	}

	// Softer "whoosh" sound for deletion - like erasing
	playDelete() {
		const now = this.audioContext.currentTime

		const osc = this.audioContext.createOscillator()
		const gainNode = this.audioContext.createGain()

		// Descending pitch for "erasing" feel
		osc.frequency.setValueAtTime(600, now)
		osc.frequency.exponentialRampToValueAtTime(200, now + 0.04)
		osc.type = 'sine'

		gainNode.gain.setValueAtTime(0, now)
		gainNode.gain.linearRampToValueAtTime(this.volume * 0.12, now + 0.005)
		gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.04)

		osc.connect(gainNode)
		gainNode.connect(this.audioContext.destination)

		osc.start(now)
		osc.stop(now + 0.04)
	}

	cleanup() {
		this.audioContext.close()
	}
}

class TypewriterDirective extends AsyncDirective {
	private state: TypewriterState | null = null
	private soundEngine: TypewriterSound | null = null

	render(_phrases: string[], _options: TypewriterOptions = {}) {
		return noChange
	}

	override update(
		part: ElementPart,
		[phrases, options = {}]: [string[], TypewriterOptions]
	) {
		const element = part.element as HTMLElement

		// Clean up if params changed
		if (
			this.state &&
			(JSON.stringify(this.state.phrases) !== JSON.stringify(phrases) ||
				JSON.stringify(this.state.options) !== JSON.stringify(options))
		) {
			this.cleanup()
		}

		// Initialize state
		if (!this.state) {
			const defaultOptions: Required<TypewriterOptions> = {
				typeSpeed: 50,
				deleteSpeed: 30,
				pauseDuration: 1500,
				loop: true,
				selector: '.typed',
				cursor: false,
				finalMessage: '',
				sound: true,
				volume: 0.08,
			}

			this.state = {
				phrases,
				options: { ...defaultOptions, ...options },
				element,
			}

			// Initialize sound engine if enabled
			if (this.state.options.sound) {
				this.soundEngine = new TypewriterSound(this.state.options.volume)
			}

			// Find target element
			this.state.targetElement = element.querySelector<HTMLElement>(
				this.state.options.selector
			) ?? undefined

			if (!this.state.targetElement) {
				console.warn(
					`Typewriter: Target element "${this.state.options.selector}" not found`
				)
				return noChange
			}

			// Add cursor if enabled
			if (this.state.options.cursor) {
				this.state.targetElement.style.position = 'relative'
				this.state.targetElement.style.display = 'inline-block'
				const cursor = document.createElement('span')
				cursor.className = 'typewriter-cursor'
				cursor.textContent = '|'
				cursor.style.cssText = `
					display: inline-block;
					margin-left: 2px;
					animation: typewriter-blink 1s step-end infinite;
				`
				this.state.targetElement.appendChild(cursor)

				// Add blink animation if not already present
				if (!document.getElementById('typewriter-styles')) {
					const style = document.createElement('style')
					style.id = 'typewriter-styles'
					style.textContent = `
						@keyframes typewriter-blink {
							0%, 50% { opacity: 1; }
							51%, 100% { opacity: 0; }
						}
					`
					document.head.appendChild(style)
				}
			}

			this.startTyping()
		}

		return noChange
	}

	private startTyping() {
		if (!this.state || !this.state.targetElement) return

		const { phrases, options, targetElement } = this.state

		// Create typing observable for a single phrase
		const typePhrase = (phrase: string, shouldDelete: boolean = true) => {
			return concat(
				// Type each character
				defer(() => {
					const chars = phrase.split('')
					return concat(
						...chars.map((char) =>
							of(char).pipe(
								delay(options.typeSpeed),
								tap((c) => {
									const textNode = this.getTextNode(targetElement)
									if (textNode) {
										textNode.textContent += c
									}
									// Play key press sound
									if (this.soundEngine) {
										this.soundEngine.playKeyPress()
									}
								})
							)
						)
					)
				}),
				// Pause after typing
				of(null).pipe(delay(options.pauseDuration)),
				// Delete each character (only if shouldDelete is true)
				shouldDelete ? defer(() => {
					const deleteCount = phrase.length
					return interval(options.deleteSpeed).pipe(
						take(deleteCount),
						tap(() => {
							const textNode = this.getTextNode(targetElement)
							if (textNode && textNode.textContent) {
								textNode.textContent = textNode.textContent.slice(0, -1)
							}
							// Play delete sound
							if (this.soundEngine) {
								this.soundEngine.playDelete()
							}
						})
					)
				}) : EMPTY,
				// Small pause before next phrase
				shouldDelete ? of(null).pipe(delay(200)) : EMPTY
			)
		}

		// Create observable that cycles through all phrases
		const phrasesSequence = concat(
			...phrases.map((phrase) => typePhrase(phrase))
		)

		// Add final message if provided
		const typingSequence = options.finalMessage
			? concat(
					phrasesSequence,
					typePhrase(options.finalMessage, false) // Don't delete final message
				)
			: phrasesSequence

		// Subscribe and optionally loop
		this.state.subscription = (
			options.loop ? phrasesSequence.pipe(repeat()) : typingSequence
		).subscribe({
			error: (err) => console.error('Typewriter error:', err),
		})
	}

	private getTextNode(targetElement: HTMLElement): Text | null {
		// Get or create text node (ignoring cursor element)
		for (const child of Array.from(targetElement.childNodes)) {
			if (child.nodeType === Node.TEXT_NODE) {
				return child as Text
			}
		}
		// Create text node if it doesn't exist
		const textNode = document.createTextNode('')
		targetElement.insertBefore(textNode, targetElement.firstChild)
		return textNode
	}

	private cleanup() {
		if (!this.state) return

		// Unsubscribe from typing observable
		if (this.state.subscription) {
			this.state.subscription.unsubscribe()
		}

		// Remove cursor if present
		if (this.state.targetElement) {
			const cursor = this.state.targetElement.querySelector('.typewriter-cursor')
			cursor?.remove()
		}

		// Cleanup sound engine
		if (this.soundEngine) {
			this.soundEngine.cleanup()
			this.soundEngine = null
		}

		this.state = null
	}

	override disconnected() {
		this.cleanup()
	}

	override reconnected(): void {
		// Re-start typing if state exists
		if (this.state && !this.state.subscription) {
			this.startTyping()
		}
	}
}

export const typewriter = directive(TypewriterDirective)
