import { TailwindElement } from '@mixins/index'
import { css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

/**
 * @element schmancy-card-media
 */
@customElement('schmancy-card-media')
export default class SchmancyCardMedia extends TailwindElement(css`
	:host {
		display: block;
		position: relative;
		height: 200px;
		overflow: hidden;
	}
	
	/* Allow height to be overridden when used in flex/grid layouts */
	:host-context(.h-full) {
		height: 100%;
	}
	
	::slotted(img),
	img {
		width: 100%;
		height: 100%;
		object-position: center;
	}
	
	/* Object fit styles based on fit attribute */
	:host([fit="contain"]) img,
	:host([fit="contain"]) ::slotted(img) {
		object-fit: contain;
	}
	
	:host([fit="cover"]) img,
	:host([fit="cover"]) ::slotted(img) {
		object-fit: cover;
	}
	
	:host([fit="fill"]) img,
	:host([fit="fill"]) ::slotted(img) {
		object-fit: fill;
	}
	
	:host([fit="none"]) img,
	:host([fit="none"]) ::slotted(img) {
		object-fit: none;
	}
	
	:host([fit="scale-down"]) img,
	:host([fit="scale-down"]) ::slotted(img) {
		object-fit: scale-down;
	}
`) {
	@property({ type: String, reflect: true })
	src: string = ''

	@property({ type: String, reflect: true })
	fit: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down' = 'contain'
	
	@property({ type: String })
	alt: string = ''

	protected render(): unknown {
		// If src is provided, render an img element
		// Otherwise, allow users to slot their own content
		return this.src 
			? html`<img src="${this.src}" alt="${this.alt}" />` 
			: html`<slot></slot>`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-card-media': SchmancyCardMedia
	}
}
