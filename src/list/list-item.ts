import { consume } from '@lit/context'
import TailwindElement from '@schmancy/mixin/tailwind/tailwind.mixin'
import { SchmancyTheme } from '@schmancy/theme/theme.interface'
import { html } from 'lit'
import { customElement, property, queryAssignedElements } from 'lit/decorators.js'
import { when } from 'lit/directives/when.js'
import { color } from '..'
import { SchmancyListContext, SchmancyListVariant } from './context'

@customElement('schmancy-list-item')
export class SchmancyListItem extends TailwindElement() {
	@consume({ context: SchmancyListContext, subscribe: true })
	@property()
	variant: SchmancyListVariant

	@property({ type: Boolean }) readonly: boolean = false

	@property({ type: Boolean }) active: boolean = false

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
			'min-h-[56px] relative flex items-center gap-[16px] py-[8px] px-[16px] rounded-full': true,
			'bg-secondary-container text-secondery-onContainer': this.active && this.variant === 'container',
			'text-surface-on bg-surface-default': !this.active && this.variant === 'surface',
			'text-surface-on bg-surface-variant-default': !this.active && this.variant === 'surfaceVariant',
			'text-surface-on bg-surface-container': !this.active && this.variant === 'container',
		}

		const stateLayerClasses = {
			'hover:bg-surface-on opacity-[0.08] cursor-pointer absolute inset-0 rounded-full': !this.readonly,
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
