import { $LitElement } from '@mhmo91/lit-mixins/src'
import { css, html } from 'lit'
import { customElement } from 'lit/decorators.js'

@customElement('demo-typography')
export default class DemoTypography extends $LitElement(css`
	:host {
		display: block;
	}
`) {
	protected render() {
		return html`
			<schmancy-grid gap="md">
				<schmancy-typography type="display" token="large">Display (large)</schmancy-typography>
				<schmancy-typography type="display" token="medium">Display (medium) </schmancy-typography>
				<schmancy-typography type="display" token="small">Display (small) </schmancy-typography>
				<schmancy-typography type="headline" token="large">Headline (large)</schmancy-typography>
				<schmancy-typography type="headline" token="medium">Headline (medium)</schmancy-typography>
				<schmancy-typography type="headline" token="small">Headline (small)</schmancy-typography>
				<schmancy-typography type="title" token="large">Title (large)</schmancy-typography>
				<schmancy-typography type="title" token="medium">Title (medium)</schmancy-typography>
				<schmancy-typography type="title" token="small">Title (small)</schmancy-typography>
				<schmancy-typography type="body" token="large">Body (large)</schmancy-typography>
				<schmancy-typography type="body" token="medium">Body (medium)</schmancy-typography>
				<schmancy-typography type="body" token="small">Body (small)</schmancy-typography>
				<schmancy-typography type="label" token="large">Label (large)</schmancy-typography>
				<schmancy-typography type="label" token="medium">Label (medium)</schmancy-typography>
				<schmancy-typography type="label" token="small">Label (small)</schmancy-typography>
			</schmancy-grid>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'demo-typography': DemoTypography
	}
}
