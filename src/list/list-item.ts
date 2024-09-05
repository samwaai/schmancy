import { consume } from '@lit/context'
import TailwindElement from '@schmancy/mixin/tailwind/tailwind.mixin'
import { SchmancySurfaceTypeContext } from '@schmancy/surface/context'
import { SchmancyTheme } from '@schmancy/theme/theme.interface'
import { TSurfaceColor } from '@schmancy/types/surface'
import { html } from 'lit'
import { customElement, property, queryAssignedElements } from 'lit/decorators.js'
import { when } from 'lit/directives/when.js'
import { color } from '..'

/**
 * @element schmancy-list-item
 * @slot leading - leading content
 * @slot trailing - trailing content
 * @slot - default content
 */
@customElement('schmancy-list-item')
export class SchmancyListItem extends TailwindElement() {
	@consume({ context: SchmancySurfaceTypeContext, subscribe: true })
	@property()
	variant: TSurfaceColor

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
			'min-h-[56px] relative flex items-center gap-[16px] py-[8px] px-[16px] duration-500 transition-colors': true,
			'bg-secondary-container text-secondery-onContainer': this.selected,
		}

		const stateLayerClasses = {
			'z-0 duration-500 transition-opacity': true,
			'rounded-none': this.rounded === false,
			'rounded-full': this.rounded,
			'hover:bg-surface-on opacity-[0.08] cursor-pointer absolute inset-0': !this.readonly,
		}
		return html`<li class=${this.classMap(classes)}>
			${when(!this.readonly, () => html` <div class="${this.classMap(stateLayerClasses)}"></div> `)}
			<slot name="leading"> </slot>
			<schmancy-grid class="flex-1" justify="stretch" align="center">
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
				${when(!this.readonly, () => html` <div class="${this.classMap(stateLayerClasses)}"></div> `)}
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
