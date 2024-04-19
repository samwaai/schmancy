import { html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { $LitElement } from '@mhmo91/lit-mixins/src'

@customElement('funkhaus-logo')
export default class Logo extends $LitElement() {
	@property({ type: String }) width = '24'
	render() {
		const classes = {
			'w-24': this.width === '24',
			'w-32': this.width === '32',
			'w-48': this.width === '48',
		}
		return html` <img class="${this.classMap(classes)}" src="/logo-full.png" alt="Funkhaus Logo" /> `
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'funkhaus-logo': Logo
	}
}
