import TailwindElement from '@schmancy/mixin/tailwind/tailwind.mixin'
import { SchmancyTheme } from '@schmancy/theme/theme.interface'
import { html } from 'lit'
import { customElement, property, queryAssignedElements } from 'lit/decorators.js'
import { when } from 'lit/directives/when.js'
import { ColorConfig, color } from '..'
import { ripple } from './../directives/ripple'

@customElement('schmancy-list-item')
export class SchmancyListItem extends TailwindElement() {
	@property({ type: Boolean }) readonly: boolean = false

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
			'min-h-[56px] relative flex items-center gap-[16px] py-[8px] px-[16px]': true,
			'hover:bg-s': true,
		}

		const colorConfig: ColorConfig = {
			bgColor: SchmancyTheme.sys.color.surface.default,
			color: SchmancyTheme.sys.color.surface.on,
		}
		const stateLayerClasses = {
			'hover:bg-surface-on opacity-[0.08] cursor-pointer absolute inset-0': !this.readonly,
		}
		return html`<li ${color(colorConfig)} class=${this.classMap(classes)}>
			${when(!this.readonly, () => html` <div ${ripple()} class="${this.classMap(stateLayerClasses)}"></div> `)}
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
