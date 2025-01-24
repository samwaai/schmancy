import { TailwindElement } from '@mixins/index'
import { html } from 'lit'
import { customElement, query } from 'lit/decorators.js'

@customElement('schmancy-theme-button')
export default class SchmancyThemeButton extends TailwindElement() {
	@query('#color') color!: HTMLElement

	protected render(): unknown {
		return html`
			<schmancy-button
				@click=${() => {
					// Trigger any other effects you have
					// $newSchmancyTheme.next(undefined)

					// Native Web Animations API usage:
					this.color.animate([{ transform: 'rotate(0deg)' }, { transform: 'rotate(360deg)' }], {
						duration: 300,
						// fill: 'forwards',    // Use if you want it to remain rotated at 360°
						// easing: 'ease-out',  // Or another easing function
					})
				}}
				variant="text"
			>
				<schmancy-icon id="color">palette</schmancy-icon>
			</schmancy-button>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-theme-button': SchmancyThemeButton
	}
}
