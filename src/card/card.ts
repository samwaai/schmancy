import { TailwindElement } from '@mixins/index'
import { css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('schmancy-card')
export default class SchmancyCard extends TailwindElement(css`:host{
	display: block;
	position: relative;
	inset: 0;
	border-radius: 0.375rem; /* rounded-md */
}
:host([type="elevated"]) {
	background-color: var(--schmancy-sys-color-surface-low);
	box-shadow: var(--schmancy-sys-elevation-1);
}
:host([type="elevated"]:hover) {
	box-shadow: var(--schmancy-sys-elevation-2);
}
:host([type="filled"]) {
	background-color: var(--schmancy-sys-color-surface-highest);
}
:host([type="filled"]:hover) {
	box-shadow: var(--schmancy-sys-elevation-1);
}
:host([type="outlined"]) {
	background-color: var(--schmancy-sys-color-surface-default);
	border: 1px solid var(--schmancy-sys-color-outlineVariant);
}
:host([type="outlined"]:hover) {
	box-shadow: var(--schmancy-sys-elevation-1);
}
:host([elevation="1"]) {
	box-shadow: var(--schmancy-sys-elevation-1);
}
:host([elevation="2"]) {
	box-shadow: var(--schmancy-sys-elevation-2);
}
:host([elevation="3"]) {
	box-shadow: var(--schmancy-sys-elevation-3);
}
:host([elevation="4"]) {
	box-shadow: var(--schmancy-sys-elevation-4);
}
:host([elevation="5"]) {
	box-shadow: var(--schmancy-sys-elevation-5);
}`) {
	@property() type: 'elevated' | 'filled' | 'outlined' = 'elevated'
	@property({ type: Number }) elevation: 0 | 1 | 2 | 3 | 4 | 5 = 0
	protected render(): unknown {
		return html`<slot></slot>`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-card': SchmancyCard
	}
}
