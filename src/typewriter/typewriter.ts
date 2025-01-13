import { $LitElement } from '@mixins/index'
import { css, html, TemplateResult } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import { BehaviorSubject, distinctUntilChanged, startWith, Subscription } from 'rxjs'
import TypeIt, { Options as TypeItOptions } from 'typeit'
import { CursorOptions } from 'typeit/dist/types'

/**
 * Type definition for typing actions.
 * - Strings represent 'type' actions.
 * - Objects represent control actions like 'pause', 'delete', etc.
 */
type TypingAction =
	| string
	| {
			action: 'pause' | 'delete' | 'reset' | 'options' | string
			value?: string | number | TypeItOptions
	  }

/**
 * A highly configurable typewriter component using Lit, TypeIt, and RxJS.
 *
 * Usage:
 *   <schmancy-typewriter
 *     .actions=${[
 *       "Hello there!",
 *       { action: 'pause', value: 1000 },
 *       " This is typed.",
 *       { action: 'pause', value: 500 },
 *       { action: 'delete', value: 6 },
 *       "RxJS.",
 *       { action: 'reset' } // Resets the typing sequence
 *     ]}
 *     .speed=${50}
 *     .cursor=${true}
 *     .cursorChar=${'|'}
 *     .loop=${false}
 *     .pause=${500}
 *     .startDelay=${500}
 *     .deleteSpeed=${30}
 *     .autoStart=${false}
 *     .loopDelay=${2500}
 *     .className="custom-class"
 *     .styleString="color: blue; font-size: 1.5em;"
 *   ></schmancy-typewriter>
 */
@customElement('schmancy-typewriter')
export class TypewriterElement extends $LitElement(css`
	:host {
		display: inherit;
	}

	#typewriter {
		white-space: nowrap;
	}

	/* Optional: Customize cursor styles */
	.typeit-cursor {
		display: inline-block;
		animation: blink 1s infinite;
	}

	@keyframes blink {
		0% {
			opacity: 1;
		}
		50% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}
`) {
	/**
	 * Array of typing actions to execute in sequence.
	 * - Strings represent 'type' actions.
	 * - Objects represent control actions like 'pause', 'delete', etc.
	 */
	@property({ type: Array })
	actions: TypingAction[] = []

	/**
	 * Typing speed in milliseconds per character.
	 */
	@property({ type: Number })
	speed: number = 60

	/**
	 * Delay before typing starts (ms).
	 */
	@property({ type: Number })
	startDelay: number = 0

	/**
	 * Automatically start typing on initialization.
	 */
	@property({ type: Boolean })
	autoStart: boolean = true

	/**
	 * Whether to show the cursor.
	 * Can be a boolean or CursorOptions object.
	 */
	@property({ type: Object })
	cursor: boolean | CursorOptions = true

	/**
	 * The cursor character.
	 */
	@property({ type: String })
	cursorChar: string = '|'

	/**
	 * Whether the typing should loop.
	 */
	@property({ type: Boolean })
	loop: boolean = false

	/**
	 * Delay before restarting the loop (ms or array of ms).
	 */
	@property({ type: Number })
	loopDelay: number | number[] = 2500

	/**
	 * Typing speed for deletions (ms per character).
	 */
	@property({ type: Number })
	deleteSpeed: number | null = 30

	/**
	 * Pause duration in milliseconds between typing and deleting.
	 */
	@property({ type: Number })
	pause: number = 500

	/**
	 * Automatically break lines on newline characters.
	 */
	@property({ type: Boolean })
	breakLines: boolean = true

	/**
	 * Simulate human-like typing with variable speed and errors.
	 */
	@property({ type: Boolean })
	lifeLike: boolean = false

	/**
	 * Whether to wait until the element is visible before typing.
	 */
	@property({ type: Boolean })
	waitUntilVisible: boolean = true

	/**
	 * Delay before typing the next string (ms or array of ms).
	 */
	@property({ type: Number })
	nextStringDelay: number | number[] = 750

	/**
	 * Internal BehaviorSubject to manage action changes.
	 */
	private actions$ = new BehaviorSubject<TypingAction[]>([])

	/**
	 * Subscription for the actions BehaviorSubject.
	 */
	private actionsSubscription: Subscription | null = null

	/**
	 * TypeIt instance.
	 */
	private typeItInstance: TypeIt | null = null

	/**
	 * Reference to the typewriter container.
	 */
	@query('#typewriter')
	private typewriterContainer!: HTMLElement

	/**
	 * Flag to prevent multiple reset calls.
	 */
	private isResetting: boolean = false

	/**
	 * Lifecycle method called after the component's DOM has been updated the first time.
	 */
	firstUpdated() {
		this.actionsSubscription = this.actions$
			.pipe(
				startWith(this.actions),
				distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
			)
			.subscribe(newActions => {
				this._startTyping(newActions)
			})
	}

	/**
	 * Lifecycle method called when the component is disconnected from the DOM.
	 * Ensures that subscriptions and TypeIt instances are properly cleaned up.
	 */
	disconnectedCallback() {
		super.disconnectedCallback()
		if (this.actionsSubscription) {
			this.actionsSubscription.unsubscribe()
		}
		this._destroyTypeIt()
	}

	/**
	 * Initializes or restarts the TypeIt instance with the provided actions.
	 */
	private _startTyping(actions: TypingAction[]) {
		// Prevent starting typing while resetting
		if (this.isResetting) {
			return
		}

		// Destroy any existing TypeIt instance
		this._destroyTypeIt()

		if (!this.typewriterContainer) {
			console.warn('Typewriter container not found.')
			return
		}

		// Configure TypeIt options based on component properties
		const typeItOptions: TypeItOptions = {
			speed: this.speed,
			startDelay: this.startDelay,
			cursor: this.cursor === true ? true : this.cursor, // If cursor is object, use it; else, boolean
			cursorChar: this.cursorChar,
			loop: this.loop,
			loopDelay: this.loopDelay,
			deleteSpeed: this.deleteSpeed,
			breakLines: this.breakLines,
			lifeLike: this.lifeLike,
			waitUntilVisible: this.waitUntilVisible,
			nextStringDelay: this.nextStringDelay,
			afterComplete: () => {
				this.dispatchEvent(new CustomEvent('typeit-complete', { bubbles: true, composed: true }))
				if (!this.loop) {
					this._destroyTypeIt()
				}
			},
		}

		// Initialize TypeIt
		this.typeItInstance = new TypeIt(this.typewriterContainer, typeItOptions)

		// Process each action
		actions.forEach(action => {
			if (typeof action === 'string') {
				// Treat as 'type' action
				this.typeItInstance?.type(action)
			} else {
				// Control actions
				switch (action.action) {
					case 'pause':
						if (typeof action.value === 'number') {
							this.typeItInstance?.pause(action.value)
						} else {
							console.warn('Value for "pause" action must be a number (milliseconds).')
						}
						break
					case 'delete':
						if (typeof action.value === 'number') {
							this.typeItInstance?.delete(action.value)
						} else {
							console.warn('Value for "delete" action must be a number (characters to delete).')
						}
						break
					case 'options':
						if (typeof action.value === 'object' && !Array.isArray(action.value)) {
							this.typeItInstance?.options(action.value as TypeItOptions)
						} else {
							console.warn('Value for "options" action must be a TypeItOptions object.')
						}
						break
					case 'reset':
						// Handle reset by scheduling it to prevent immediate recursive calls
						setTimeout(() => {
							this.reset()
						}, 0)
						break
					default:
						console.warn(`Unknown action: ${action.action}`)
				}
			}
		})

		// Start the typing animation if autoStart is enabled
		if (this.autoStart) {
			this.typeItInstance?.go()
		}
	}

	/**
	 * Destroys the current TypeIt instance if it exists.
	 */
	private _destroyTypeIt() {
		if (this.typeItInstance) {
			try {
				this.typeItInstance.destroy()
			} catch (error) {
				console.error('Error destroying TypeIt instance:', error)
			}
			this.typeItInstance = null
			this.dispatchEvent(new CustomEvent('typeit-destroy', { bubbles: true, composed: true }))
		}
	}

	/**
	 * Exposes a method to manually start the typing animation.
	 */
	public start() {
		this.actions$.next(this.actions)
	}

	/**
	 * Exposes a method to manually stop the typing animation.
	 */
	public stop() {
		this._destroyTypeIt()
	}

	/**
	 * Exposes a method to reset the typing animation.
	 */
	public reset() {
		if (this.isResetting) {
			return
		}
		this.isResetting = true
		this._destroyTypeIt()
		if (this.autoStart) {
			this.start()
		}
		this.isResetting = false
	}

	/**
	 * Renders the component's HTML.
	 */
	render(): TemplateResult {
		return html`<div id="typewriter" aria-live="polite"></div>`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-typewriter': TypewriterElement
	}
}
