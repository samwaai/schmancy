import { consume } from '@lit/context'
import { $LitElement } from '@mixins/index'
import { delayContext } from '@schmancy/delay'
import hashContent from '@schmancy/utils/hashContent'
import { intersection$ } from '@schmancy/utils/intersection'
import { html, TemplateResult } from 'lit'
import { customElement, property, query, queryAssignedElements, queryAssignedNodes } from 'lit/decorators.js'
import TypeIt, { Options as TypeItOptions } from 'typeit'

@customElement('schmancy-typewriter')
export class TypewriterElement extends $LitElement() {
	/**
	 * Typing speed in milliseconds per character.
	 */
	@property({ type: Number })
	speed: number = 50

	/**
	 * Delay before typing starts (ms).
	 */
	@consume({ context: delayContext, subscribe: true })
	@property({ type: Number })
	delay: number = 0

	/**
	 * Automatically start typing on initialization.
	 */
	@property({ type: Boolean })
	autoStart: boolean = true

	/**
	 * The cursor character.
	 */
	@property({ type: String })
	cursorChar: string = ''

	/**
	 * Typing speed for deletions (ms per character).
	 */
	@property({ type: Number })
	deleteSpeed: number = 25

	@property({ type: Boolean }) once = true
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

	@queryAssignedElements({
		flatten: true,
	})
	private _getSlottedElements!: HTMLElement[]
	/**
	 * Lifecycle method called when the component is disconnected from the DOM.
	 * Ensures that TypeIt instances are properly cleaned up.
	 */

	private sessionKey = ''
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

		this.sessionKey = this.generateSessionKey()

		if (this.once && sessionStorage.getItem(this.sessionKey) === 'true') {
			// Skip delay and render immediately if once is set and already rendered
			this.shadowRoot?.querySelector('slot')?.removeAttribute('hidden')
			return
		}

		if (!this.typewriterContainer) {
			console.warn('Typewriter container not found.')
			return
		}

		// Configure TypeIt options
		const typeItOptions: TypeItOptions = {
			speed: this.speed,
			startDelay: this.delay,
			cursor: !!this.cursorChar,
			cursorChar: this.cursorChar,
			deleteSpeed: this.deleteSpeed,
			afterComplete: () => {
				if (this.once) {
					try {
						sessionStorage.setItem(this.sessionKey, 'true')
					} catch (error) {
						console.error('Error saving to session storage:', error)
					}
				}
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
		// use rxjs to detect once we are in the view port
		intersection$(this.shadowRoot?.host as Element).subscribe(() => {
			// alert('in view')
			this.typeItInstance?.go()
		})
		// Start the typing animation if autoStart is enabled
	}

	private generateSessionKey(): string {
		const slotContent = this._getSlottedElements.map(el => el.outerHTML).join('')
		return this.once ? hashContent(slotContent) : ''
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

			<div class="typewriter">
				<slot
					hidden
					@slotchange=${() => {
						this._startTyping()
					}}
				></slot>
			</div> `
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-typewriter': TypewriterElement
	}
}
