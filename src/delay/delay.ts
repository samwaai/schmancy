import { animate, fadeIn, flyAbove, flyBelow } from '@lit-labs/motion'
import { consume, createContext, provide } from '@lit/context'
import { $LitElement } from '@mixins/litElement.mixin'
import hashContent from '@schmancy/utils/hashContent'
import { html } from 'lit'
import { customElement, property, queryAssignedElements, state } from 'lit/decorators.js'
import { cache } from 'lit/directives/cache.js'
import { timer } from 'rxjs'
import { takeUntil } from 'rxjs/operators'

export const delayContext = createContext<number>('delay-context')

@customElement('schmancy-delay')
export class SchmancyDelay extends $LitElement() {
	@property({ type: Number, reflect: true }) delay = 0 // Delay in milliseconds
	@property({ type: String }) motion = 'flyBelow' // Motion type (default: flyBelow)
	@state() private rendered = false // Tracks if the content is rendered
	@consume({ context: delayContext, subscribe: true }) parentDelay = 0 // Consumes the parent's delay value
	@provide({ context: delayContext }) effectiveDelay = 0 // Provides the effective delay to children

	@property({ type: Boolean }) once? = true // Only render once per session

	private sessionKey = '' // Unique session key
	private mutationObserver?: MutationObserver

	@queryAssignedElements({
		flatten: true,
	})
	assignedElements: HTMLElement[]
	firstUpdated() {
		this.observeSlotChanges()
		this.updateRenderState()
	}

	disconnectedCallback() {
		super.disconnectedCallback()
		this.mutationObserver?.disconnect() // Clean up the observer
	}

	private observeSlotChanges() {
		const slot = this.shadowRoot?.querySelector('slot')
		if (!slot) return

		this.mutationObserver = new MutationObserver(() => {
			// Update session key when children change
			this.sessionKey = this.generateSessionKey()
		})

		this.mutationObserver.observe(slot, { childList: true, subtree: true })
	}

	private getTotalSiblingDelay(element: HTMLElement | null): number {
		if (!element || !(element instanceof HTMLElement)) return 0

		let totalDelay = 0
		let sibling = element.previousElementSibling // Start with the previous sibling

		while (sibling) {
			// Check if the sibling is a `schmancy-delay` and add its delay
			if (sibling instanceof SchmancyDelay) {
				totalDelay += sibling.delay
			}
			// Move to the previous sibling
			sibling = sibling.previousElementSibling
		}

		// Traverse up the tree and repeat for the parent node
		if (element.parentElement) {
			totalDelay += this.getTotalSiblingDelay(element.parentElement)
		}

		return totalDelay
	}

	private updateRenderState() {
		this.sessionKey = this.generateSessionKey()

		if (this.once && sessionStorage.getItem(this.sessionKey) === 'true') {
			// Skip delay and render immediately if once is set and already rendered
			this.rendered = true
			return
		}

		// Calculate the effective delay (parent + self + all preceding siblings)
		const siblingDelay = this.getTotalSiblingDelay(this)
		this.effectiveDelay = this.delay + this.parentDelay + siblingDelay

		// Start the delay timer
		timer(this.effectiveDelay)
			.pipe(takeUntil(this.disconnecting))
			.subscribe(() => {
				this.rendered = true // Render content after delay
				if (this.once) {
					try {
						sessionStorage.setItem(this.sessionKey, 'true')
					} catch (error) {
						console.error('Error saving to session storage:', error)
					}
				}
			})
	}

	private generateSessionKey(): string {
		const slotContent = this.assignedElements.map(el => el.outerHTML).join('')
		return this.once ? hashContent(slotContent) : ''
	}

	private get motionLit(): typeof fadeIn | typeof flyBelow | typeof flyAbove {
		return this.motion === 'flyBelow' ? flyBelow : this.motion === 'flyAbove' ? flyAbove : fadeIn
	}

	render() {
		return cache(
			this.rendered
				? html`<div
						${animate({
							in: this.motionLit, // Use the provided motion type
							keyframeOptions: { duration: 300, easing: 'ease-out' },
						})}
					>
						<slot></slot>
					</div>`
				: html`
						<section style="display: none;">
							<slot></slot>
						</section>
					`,
		)
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-delay': SchmancyDelay
	}
}
