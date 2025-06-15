import { $LitElement } from '@mixins/index'
import { html } from 'lit'
import { customElement } from 'lit/decorators.js'

@customElement('installation-section')
export class InstallationSection extends $LitElement() {
	render() {
		return html`
			<div class="mb-8">
				<schmancy-typography type="title" token="lg" class="mb-4 block">Installation</schmancy-typography>
				
				<schmancy-typography type="body" token="md" class="mb-3 block">
					Install Schmancy via npm or yarn:
				</schmancy-typography>
				
				<schmancy-code-preview language="bash">
					npm install @mhmo91/schmancy
					# or
					yarn add @mhmo91/schmancy
				</schmancy-code-preview>
			</div>
		`
	}
}

export default InstallationSection