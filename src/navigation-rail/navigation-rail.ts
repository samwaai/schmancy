import { TailwindElement } from '@mixins/tailwind.mixin'
import { css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

/**
 * `<schmancy-navigation-rail>` component
 *
 * A vertical navigation component typically positioned on the left side of an application.
 * Navigation rails provide access to between 3-7 primary destinations with a compact footprint.
 *
 * @element schmancy-navigation-rail
 * @slot - Default slot for navigation rail items
 *
 * @example
 * <schmancy-navigation-rail>
 *   <schmancy-navigation-rail-item icon="home" label="Home"></schmancy-navigation-rail-item>
 *   <schmancy-navigation-rail-item icon="search" label="Search"></schmancy-navigation-rail-item>
 * </schmancy-navigation-rail>
 */
@customElement('schmancy-navigation-rail')
export class SchmancyNavigationRail extends TailwindElement(css`
	:host {
		display: flex;
		flex-direction: column;
		width: 80px;
		height: 100%;
		background-color: var(--schmancy-sys-color-surface-container);
		color: var(--schmancy-sys-color-surface-on);
		box-sizing: border-box;
	}

	:host([extended]) {
		width: 192px;
	}

	/* Alignment options */
	:host([align='start']) {
		align-items: flex-start;
		padding: 16px 12px;
	}

	:host([align='center']) {
		align-items: center;
		justify-content: center;
		padding: 16px 12px;
	}

	:host([align='end']) {
		align-items: flex-end;
		padding: 16px 12px;
	}

	/* Default center alignment */
	:host {
		align-items: center;
		padding: 16px 12px;
		gap: 12px;
	}
`) {
	/**
	 * Whether the navigation rail is extended to show labels
	 * @default false
	 */
	@property({ type: Boolean, reflect: true })
	extended = false

	/**
	 * Alignment of items within the rail
	 * @default 'center'
	 */
	@property({ reflect: true })
	align: 'start' | 'center' | 'end' = 'center'

	protected render() {
		return html`<slot></slot>`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-navigation-rail': SchmancyNavigationRail
	}
}