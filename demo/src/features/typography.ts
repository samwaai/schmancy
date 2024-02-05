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
			<div>
				<schmancy-grid gap="md">
					<schmancy-typography type="display" token="lg">Display (lg)</schmancy-typography>
					<schmancy-typography type="display">Display (md) </schmancy-typography>
					<schmancy-typography type="display" token="sm">Display (sm) </schmancy-typography>
					<schmancy-typography type="headline" token="lg">Headline (lg)</schmancy-typography>
					<schmancy-typography type="headline" token="md">Headline (md)</schmancy-typography>
					<schmancy-typography type="headline" token="sm">Headline (sm)</schmancy-typography>
					<schmancy-typography type="title" token="lg">Title (lg)</schmancy-typography>
					<schmancy-typography type="title" token="md">Title (md)</schmancy-typography>
					<schmancy-typography type="title" token="sm">Title (sm)</schmancy-typography>
					<schmancy-typography type="body" token="lg">Body (lg)</schmancy-typography>
					<schmancy-typography type="body" token="md">Body (md)</schmancy-typography>
					<schmancy-typography type="body" token="sm">Body (sm)</schmancy-typography>
					<schmancy-typography type="label" token="lg">Label (lg)</schmancy-typography>
					<schmancy-typography type="label" token="md">Label (md)</schmancy-typography>
					<schmancy-typography type="label" token="sm">Label (sm)</schmancy-typography>

					<schmancy-typography type="display" token="lg">Max lines</schmancy-typography>
					<schmancy-typography maxLines="2">
						“I'm selfish, impatient and a little insecure. I make mistakes, I am out of control and at times hard to
						handle. But if you can't handle me at my worst, then you sure as hell don't deserve me at my best.”
					</schmancy-typography>
				</schmancy-grid>
			</div>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'demo-typography': DemoTypography
	}
}
