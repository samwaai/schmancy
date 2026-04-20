import { consume } from '@lit/context'
import { TailwindElement } from '@mixins/index'
import { SchmancySurfaceTypeContext } from '@schmancy/surface/context'
import { TSurfaceColor } from '@schmancy/types/surface'
import { css, html } from 'lit'
import { customElement, property, queryAssignedElements } from 'lit/decorators.js'

/**
 * @element schmancy-list-item
 * @slot leading - leading content
 * @slot trailing - trailing content
 * @slot - default content
 */
@customElement('schmancy-list-item')
export class SchmancyListItem extends TailwindElement(css`
	:host {
		display: block;
		border-radius: 0.5rem;
		transition:
			background 200ms ease,
			box-shadow 300ms ease,
			transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1);
	}
	:host(:hover:not([readonly])) {
		background: color-mix(in srgb, var(--schmancy-sys-color-surface-on) 8%, transparent);
		box-shadow: 0 2px 8px -4px color-mix(in srgb, var(--schmancy-sys-color-primary-default) 10%, transparent);
	}
	:host(:active:not([readonly])) {
		transform: scale(0.98);
		transition-duration: 100ms;
	}
	:host([selected]) {
		background: color-mix(in srgb, var(--schmancy-sys-color-secondary-container) 30%, transparent);
		box-shadow: 0 0 10px -3px color-mix(in srgb, var(--schmancy-sys-color-secondary-default) 12%, transparent);
	}
	@media (prefers-reduced-motion: reduce) {
		:host { transition: background 200ms ease; }
		:host(:active:not([readonly])) { transform: none; }
	}
`) {
	@consume({ context: SchmancySurfaceTypeContext, subscribe: true })
	@property()
	variant: TSurfaceColor

	@property({ type: Boolean, reflect: true })
	rounded: boolean

	@property({ type: Boolean, reflect: true }) readonly: boolean

	@property({ type: Boolean, reflect: true }) selected: boolean = false

	@queryAssignedElements({
		slot: 'leading',
		flatten: true,
	})
	private leading!: HTMLElement[]

	@queryAssignedElements({
		slot: 'trailing',
		flatten: true,
	})
	private trailing!: HTMLElement[]

	protected get imgClasses(): string[] {
		return ['h-4', 'w-4', 'sm:h-5', 'sm:w-5', 'object-contain']
	}

	firstUpdated() {
		this.leading?.forEach(img => {
			img.classList.add(...this.imgClasses)
		})
		this.trailing?.forEach(img => {
			img.classList.add(...this.imgClasses)
		})
	}

	render() {
		const classes = {
			'w-full flex items-center min-h-[36px] sm:min-h-[40px] py-1 px-2 sm:px-3 text-sm': true,
			'focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:z-1 outline-secondary-default outline-hidden': true,
			'cursor-pointer': !this.readonly,
		}

		return html`<li .tabIndex=${this.readonly ? -1 : 0} class=${this.classMap(classes)}>
			<slot></slot>
		</li>`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-list-item': SchmancyListItem
	}
}
