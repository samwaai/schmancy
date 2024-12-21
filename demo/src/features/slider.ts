import { $LitElement } from '@mixins/index'
import { html } from 'lit'
import { customElement } from 'lit/decorators.js'

@customElement('demo-slider')
export class DemoSlider extends $LitElement() {
	protected render(): unknown {
		return html`
			<!-- Example page or component -->
			<schmancy-slider showArrows @slide-changed=${e => console.log('Index:', e.detail.index)}>
				<!-- Image slide -->
				<schmancy-slide
					type="image"
					src="https://via.placeholder.com/500x300?text=Image+1"
					alt="Placeholder"
					fit="contain"
				></schmancy-slide>

				<!-- Video slide -->
				<schmancy-slide
					type="video"
					src="https://www.w3schools.com/html/mov_bbb.mp4"
					autoplay
					muted
					loop
					fit="cover"
				></schmancy-slide>

				<!-- Content slide (type defaults to "content") -->
				<schmancy-slide>
					<h2>Custom Content Slide</h2>
					<p>You can place any markup here.</p>
				</schmancy-slide>

				<!-- Another image slide (with default fit="cover") -->
				<schmancy-slide
					type="image"
					src="https://via.placeholder.com/600x400?text=Image+2"
					alt="Another Placeholder"
				></schmancy-slide>
			</schmancy-slider>
		`
	}
}
