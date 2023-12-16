import { consume } from '@lit/context'
import TailwindElement from '@schmancy/mixin/tailwind/tailwind.mixin'
import { SchmancyTheme } from '@schmancy/theme/theme.interface'
import { html } from 'lit'
import { customElement, property, queryAssignedElements } from 'lit/decorators.js'
import { when } from 'lit/directives/when.js'
import { color } from '..'
import { SchmancyListType, SchmancyListTypeContext } from './context'

/**
 * @element schmancy-list-item
 * @slot leading - leading content
 * @slot trailing - trailing content
 * @slot - default content
 */
@customElement('schmancy-list-item')
export class SchmancyListItem extends TailwindElement() {
	@consume({ context: SchmancyListTypeContext, subscribe: true })
	@property()
	variant: SchmancyListType

	@property({ type: Boolean })
	rounded: boolean

	@property({ type: Boolean }) readonly: boolean

	@property({ type: Boolean }) selected: boolean = false

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
		return ['h-[24px]', 'w-[24px]', 'object-contain']
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
			'rounded-none': this.rounded === false,
			'rounded-full': this.rounded,
			'min-h-[56px] relative flex items-center gap-[16px] py-[8px] px-[16px]': true,
			'bg-secondary-container text-secondery-onContainer': this.selected && this.variant === 'container',
			'text-surface-on bg-surface-default': !this.selected && this.variant === 'surface',
			'text-surface-on bg-surface-variant-default': !this.selected && this.variant === 'surfaceVariant',
			'text-surface-on bg-surface-container': !this.selected && this.variant === 'container',
		}

		const stateLayerClasses = {
			'rounded-none': this.rounded === false,
			'rounded-full': this.rounded,
			'hover:bg-surface-on opacity-[0.08] cursor-pointer absolute inset-0': !this.readonly,
		}
		return html`<li class=${this.classMap(classes)}>
			${when(!this.readonly, () => html` <div class="${this.classMap(stateLayerClasses)}"></div> `)}
			<slot name="leading"> </slot>
			<schmancy-grid class="flex-1">
				<schmancy-typography type="body" token="lg">
					<slot></slot>
				</schmancy-typography>
				<schmancy-typography
					${color({
						color: SchmancyTheme.sys.color.surface.onVariant,
					})}
					type="body"
					token="md"
					align="left"
				>
					<slot name="support"></slot>
				</schmancy-typography>
			</schmancy-grid>
			<slot name="trailing"></slot>
		</li>`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-list-item': SchmancyListItem
	}
}
