import { $LitElement } from '@mixins/index'
import { css, html, TemplateResult } from 'lit'
import { customElement, property, query, queryAssignedNodes } from 'lit/decorators.js'
import TypeIt, { Options as TypeItOptions } from 'typeit'

@customElement('schmancy-typewriter')
export class TypewriterElement extends $LitElement(css`
	:host {
		display: inherit;
	}

	#typewriter {
		--ti-cursor-display: initial;
	}

	#typewriter .ti-cursor {
		display: var(--ti-cursor-display);
	}
`) {
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
	 */
	@property({ type: Boolean })
	cursor: boolean = true

	/**
	 * The cursor character.
	 */
	@property({ type: String })
	cursorChar: string = ''

	/**
	 * Typing speed for deletions (ms per character).
	 */
	@property({ type: Number })
	deleteSpeed: number = 30

	/**
	 * TypeIt instance.
	 */
	private typeItInstance: TypeIt | null = null

	/**
	 * Reference to the typewriter container.
	 */
	@query('#typewriter')
	private typewriterContainer!: HTMLElement

	@queryAssignedNodes({
		flatten: true,
	})
	private _getSlottedNodes!: Node[]
	/**
	 * Lifecycle method called when the component is disconnected from the DOM.
	 * Ensures that TypeIt instances are properly cleaned up.
	 */
	disconnectedCallback() {
		super.disconnectedCallback()
		this._destroyTypeIt()
	}

	/**
	 * Initializes the TypeIt instance with the provided slotted content.
	 */
	private _startTyping() {
		// Destroy any existing TypeIt instance
		this._destroyTypeIt()

		if (!this.typewriterContainer) {
			console.warn('Typewriter container not found.')
			return
		}

		// Configure TypeIt options
		const typeItOptions: TypeItOptions = {
			speed: this.speed,
			startDelay: this.startDelay,
			cursor: this.cursor,
			cursorChar: this.cursorChar,
			deleteSpeed: this.deleteSpeed,
			afterComplete: () => {
				// Dispatch the custom event
				this.dispatchEvent(new CustomEvent('typeit-complete', { bubbles: true, composed: true }))

				// Hide the cursor
				this.typewriterContainer.style.setProperty('--ti-cursor-display', 'none')
			},
		}

		// Initialize TypeIt
		this.typeItInstance = new TypeIt(this.typewriterContainer, typeItOptions)

		// Process slotted content as actions
		const slottedNodes = this._getSlottedNodes
		slottedNodes.forEach(node => {
			if (node.nodeType === Node.TEXT_NODE) {
				// Handle plain text
				this.typeItInstance?.type(node.textContent || '')
			} else if (node instanceof HTMLElement) {
				// Handle custom element
				this._processCustomElement(node)
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
		}
	}

	/**
	 * Processes a custom element for its typing behavior.
	 */
	private _processCustomElement(element: HTMLElement) {
		const action = element.getAttribute('action')
		const value = element.getAttribute('value')
		switch (action) {
			case 'pause':
				this.typeItInstance?.pause(parseInt(value || '0', 10))
				break
			case 'delete':
				this.typeItInstance?.delete(parseInt(value || '0', 10))
				break
			default:
				if (element.tagName === 'P') {
					this.typeItInstance.break()
				}
				// Treat as text if no action is defined
				this.typeItInstance?.type(element.textContent || '')
				break
		}
	}

	/**
	 * Renders the component's HTML.
	 */
	render(): TemplateResult {
		return html`<div id="typewriter" aria-live="polite"></div>

			<slot
				hidden
				@slotchange=${() => {
					this._startTyping()
				}}
			></slot> `
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-typewriter': TypewriterElement
	}
}
