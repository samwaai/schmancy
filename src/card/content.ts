import TailwindElement from '@schmancy/mixin/tailwind/tailwind.mixin'
import { SchmancyTheme } from '@schmancy/theme/theme.interface'
import { html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { color } from '..'

/**
 * @element schmancy-card-content
 * @slot headline
 * @slot subhead
 * @slot default - The content of the card
 */
@customElement('schmancy-card-content')
export default class SchmancyCardContent extends TailwindElement() {
	protected render(): unknown {
		const classes = {
			'px-[16px] py-[24px]': true,
		}
		const onSurface = SchmancyTheme.sys.color.surface.on
		const onSurfaceVariant = SchmancyTheme.sys.color.surface.onVariant
		return html`<schmancy-grid gap="md" class="${this.classMap(classes)}">
			<schmancy-grid gap="xs">
				<schmancy-typography
					${color({
						color: onSurface,
					})}
					type="body"
					token="lg"
					><slot name="headline"> </slot
				></schmancy-typography>
				<schmancy-typography
					${color({
						color: onSurfaceVariant,
					})}
					type="body"
					><slot name="subhead"></slot>
				</schmancy-typography>
			</schmancy-grid>
			<schmancy-typography
				type="body"
				${color({
					color: onSurfaceVariant,
				})}
			>
				<slot></slot>
			</schmancy-typography>
		</schmancy-grid>`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-card-content': SchmancyCardContent
	}
}
