import { TailwindElement } from '@mixins/index'
import { css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import '../busy'

export type CircularProgressSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | string

@customElement('schmancy-circular-progress')
export class SchmancyCircularProgress extends TailwindElement(css`
	:host {
		display: inline-block;
		position: relative;
	}
`) {
	@property({ type: Boolean, reflect: true })
	indeterminate = false

	@property({ type: String })
	size: CircularProgressSize = 'md'

	private get spinnerSize(): string {
		const sizeMap = {
			xs: '16px',
			sm: '24px',
			md: '32px',
			lg: '48px',
			xl: '64px'
		}

		if (this.size in sizeMap) {
			return sizeMap[this.size as keyof typeof sizeMap]
		}

		// If it's a number, convert to px
		if (!isNaN(Number(this.size))) {
			return `${this.size}px`
		}

		// Otherwise, assume it's already a valid CSS size
		return this.size
	}

	protected render() {
		return html`
			<schmancy-spinner size="${this.spinnerSize}"></schmancy-spinner>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-circular-progress': SchmancyCircularProgress
	}
}