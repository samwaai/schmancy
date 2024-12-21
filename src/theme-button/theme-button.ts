import { animate } from '@juliangarnierorg/anime-beta'
import { TailwindElement } from '@mixins/tailwind'
import { html } from 'lit'
import { customElement, query } from 'lit/decorators.js'
import { $newSchmancyTheme } from '..'

@customElement('schmancy-theme-button')
export default class SchmancyThemeButton extends TailwindElement() {
	@query('#color') color!: HTMLElement

	protected render(): unknown {
		return html`
			<schmancy-button
				@click=${() => {
					// @ts-ignore TODO: fix
					$newSchmancyTheme.next(undefined)
					animate(this.color, {
						rotate: [0, 360],
						duration: 300,
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
