import { TailwindElement } from '@mixins/index'
import { css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

/**
 * Placeholder shimmer surface shown while content loads. Renders a
 * shape-configurable rectangle with a reduced-motion-aware shimmer.
 *
 * @element schmancy-skeleton
 * @attr shape - 'rect' | 'circle' | 'text'. Default 'rect'.
 * @attr width  - CSS length (e.g. `100%`, `12rem`).
 * @attr height - CSS length; for `shape=text` defaults to 1em.
 * @attr radius - CSS length for corner radius; ignored for `shape=circle`.
 * @csspart surface - The shimmering surface element.
 */
@customElement('schmancy-skeleton')
export class SchmancySkeleton extends TailwindElement(css`
	:host {
		display: block;
		width: var(--_sw, 100%);
		height: var(--_sh, 1rem);
	}
	.surface {
		width: 100%;
		height: 100%;
		border-radius: var(--_sr, 0.25rem);
		background: linear-gradient(
			90deg,
			var(--schmancy-sys-color-surface-containerHighest, #e6e6e6) 25%,
			var(--schmancy-sys-color-surface-container, #f2f2f2) 37%,
			var(--schmancy-sys-color-surface-containerHighest, #e6e6e6) 63%
		);
		background-size: 400% 100%;
		animation: schmancy-skeleton-shimmer 1.4s ease infinite;
	}
	:host([shape='circle']) .surface {
		border-radius: 50%;
	}
	@keyframes schmancy-skeleton-shimmer {
		0% { background-position: 100% 50%; }
		100% { background-position: 0 50%; }
	}
	@media (prefers-reduced-motion: reduce) {
		.surface {
			animation: none;
			background: var(--schmancy-sys-color-surface-containerHighest, #e6e6e6);
		}
	}
`) {
	@property({ type: String, reflect: true }) shape: 'rect' | 'circle' | 'text' = 'rect'
	@property({ type: String }) width = ''
	@property({ type: String }) height = ''
	@property({ type: String }) radius = ''

	connectedCallback(): void {
		super.connectedCallback()
		this.setAttribute('role', 'status')
		this.setAttribute('aria-busy', 'true')
		this.setAttribute('aria-label', 'Loading')
	}

	protected updated(): void {
		if (this.width) this.style.setProperty('--_sw', this.width)
		const defaultHeight = this.shape === 'text' ? '1em' : '1rem'
		this.style.setProperty('--_sh', this.height || defaultHeight)
		if (this.radius) this.style.setProperty('--_sr', this.radius)
	}

	render() {
		return html`<div part="surface" class="surface"></div>`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-skeleton': SchmancySkeleton
	}
}
