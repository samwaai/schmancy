import { TailwindElement } from '@mixins/tailwind.mixin'
import { css, html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'

/**
 * `<schmancy-navigation-rail-item>` component
 *
 * Individual navigation item for use within a navigation rail.
 * Represents a single destination or action with an icon and optional label.
 *
 * @element schmancy-navigation-rail-item
 * @slot icon - Slot for the navigation item icon
 * @slot - Default slot for custom content (takes precedence over icon/label props)
 *
 * @example
 * <schmancy-navigation-rail-item icon="home" label="Home" active></schmancy-navigation-rail-item>
 */
@customElement('schmancy-navigation-rail-item')
export class SchmancyNavigationRailItem extends TailwindElement(css`
	:host {
		display: flex;
		align-items: center;
		justify-content: center;
		min-width: 56px;
		min-height: 56px;
		border-radius: 16px;
		cursor: pointer;
		transition: all 0.2s ease;
		position: relative;
		box-sizing: border-box;
		color: var(--schmancy-sys-color-surface-on-variant);
		user-select: none;
	}

	:host(:hover) {
		background-color: var(--schmancy-sys-color-surface-container-high);
	}

	:host([active]) {
		background-color: var(--schmancy-sys-color-secondary-container);
		color: var(--schmancy-sys-color-secondary-container-on);
	}

	:host([extended]) {
		width: 168px;
		justify-content: flex-start;
		padding: 0 16px;
		gap: 12px;
	}

	.icon {
		font-family: 'Material Symbols Outlined';
		font-size: 24px;
		line-height: 1;
		flex-shrink: 0;
	}

	.label {
		font-size: 14px;
		font-weight: 500;
		line-height: 1.2;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.badge {
		position: absolute;
		top: 4px;
		right: 4px;
		min-width: 16px;
		height: 16px;
		border-radius: 8px;
		background-color: var(--schmancy-sys-color-error);
		color: var(--schmancy-sys-color-error-on);
		font-size: 11px;
		font-weight: 500;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0 4px;
		box-sizing: border-box;
	}

	:host([extended]) .badge {
		position: static;
		margin-left: auto;
	}
`) {
	/**
	 * Icon name for the navigation item
	 */
	@property({ type: String })
	icon = ''

	/**
	 * Label text for the navigation item
	 */
	@property({ type: String })
	label = ''

	/**
	 * Whether this item is currently active/selected
	 * @default false
	 */
	@property({ type: Boolean, reflect: true })
	active = false

	/**
	 * Badge text to display (e.g., notification count)
	 */
	@property({ type: String })
	badge = ''

	/**
	 * Whether the parent rail is extended
	 * @default false
	 */
	@property({ type: Boolean, reflect: true })
	extended = false

	/**
	 * Handle click events
	 */
	private handleClick() {
		this.dispatchEvent(new CustomEvent('rail-item-click', {
			detail: {
				icon: this.icon,
				label: this.label,
				active: this.active
			},
			bubbles: true,
			composed: true
		}))
	}

	protected render() {
		const hasSlotContent = this.querySelector('[slot]') || this.textContent?.trim()

		if (hasSlotContent) {
			return html`<slot @click=${this.handleClick}></slot>`
		}

		return html`
			<div @click=${this.handleClick}>
				${this.icon ? html`<span class="icon">${this.icon}</span>` : ''}
				${this.extended && this.label ? html`<span class="label">${this.label}</span>` : ''}
				${this.badge ? html`<span class="badge">${this.badge}</span>` : ''}
			</div>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-navigation-rail-item': SchmancyNavigationRailItem
	}
}