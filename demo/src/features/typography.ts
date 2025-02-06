import { $LitElement } from '@mixins/index'
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
				<schmancy-typography lineHeight="50px" fontSize="80px" letterSpacing="1px" type="display" token="lg"
					>Display (lg)</schmancy-typography
				>
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
			<schmancy-grid gap="md">
				<schmancy-surface type="surfaceBright" elevation="1" rounded="all">
					<schmancy-typography align="center" type="display" token="lg">Centered</schmancy-typography>
				</schmancy-surface>
				<schmancy-surface type="surfaceBright" elevation="1" rounded="all">
					<schmancy-typography align="left" type="display" token="lg">Left</schmancy-typography>
				</schmancy-surface>

				<schmancy-surface type="surfaceBright" elevation="1" rounded="all">
					<schmancy-typography align="center" type="headline" token="lg">Centered</schmancy-typography>
				</schmancy-surface>

				<schmancy-surface type="surfaceBright" elevation="1" rounded="all">
					<schmancy-typography align="right" type="headline" token="lg">Right</schmancy-typography>
				</schmancy-surface>

				<schmancy-surface type="surfaceBright" elevation="1" rounded="all">
					<schmancy-typography align="justify" type="title" token="lg">
						Justify this text to see how it looks like with a longer text that spans multiple lines and how it looks
						like with a longer text that spans multiple lines and how it looks like with a longer text that spans
						multiple lines and how it looks like with a longer text that spans multiple lines
					</schmancy-typography>
				</schmancy-surface>
			</schmancy-grid>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'demo-typography': DemoTypography
	}
}
