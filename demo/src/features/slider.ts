import { $LitElement } from '@mixins/index'
import { html } from 'lit'
import { customElement } from 'lit/decorators.js'

@customElement('demo-slider')
export class DemoSlider extends $LitElement() {
	protected render(): unknown {
		return html`
			<!-- Example page or component -->
			<schmancy-slider @slide-changed=${e => console.log('Index:', e.detail.index)}>
				<!-- Content slide (type defaults to "content") -->
				<schmancy-slide>
					<h2>Custom Content Slide</h2>
					<p>You can place any markup here.</p>
				</schmancy-slide>
				<!-- Video slide -->
				<schmancy-slide
					.controls=${false}
					type="video"
					src="https://www.w3schools.com/html/mov_bbb.mp4"
					autoplay
					muted
					loop
					fit="cover"
				></schmancy-slide>
			</schmancy-slider>
		`
	}
}
