import { $LitElement } from '@mixins/index'
import { css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { cache } from 'lit/directives/cache.js'

/**
 * Supported slide "types."
 * - 'image': Renders an <img>
 * - 'video': Renders a <video>
 * - 'content': Renders a <slot> (the default)
 */
type SlideType = 'image' | 'video' | 'content'

/**
 * Allowed values for the 'fit' property,
 * which maps to CSS object-fit.
 */
type ObjectFit = 'cover' | 'contain' | 'fill' | 'scale-down' | 'none'

@customElement('schmancy-slide')
export class SchmancySlide extends $LitElement(css`
	:host {
		display: block;
		scroll-snap-align: center; /* If your slider uses scroll-snap */
	}

	.slide {
		display: block;
		width: 100%;
		height: auto;
		object-fit: var(--object-fit, cover);
	}
`) {
	/**
	 * Determines how this slide should be rendered.
	 * Defaults to 'content' if not provided.
	 */
	@property({ type: String }) type: SlideType = 'content'

	/**
	 * Source for images or videos (if `type` is 'image' or 'video').
	 */
	@property({ type: String }) src: string = ''

	/**
	 * Alternate text for images.
	 */
	@property({ type: String }) alt: string = ''

	/**
	 * Whether to show default video controls (if `type` is 'video').
	 */
	@property({ type: Boolean }) controls = true

	/**
	 * Whether the video should autoplay (if `type` is 'video').
	 */
	@property({ type: Boolean }) autoplay = false

	/**
	 * Whether the video should loop (if `type` is 'video').
	 */
	@property({ type: Boolean }) loop = false

	/**
	 * Whether the video is muted (if `type` is 'video').
	 */
	@property({ type: Boolean }) muted = false

	/**
	 * CSS `object-fit` property, applied to images/videos.
	 */
	@property({ type: String }) fit: ObjectFit = 'cover'

	render() {
		return html` <div style="--object-fit: ${this.fit}">${cache(this.renderSlide())}</div> `
	}

	private renderSlide() {
		switch (this.type) {
			case 'image':
				return html` <img class="slide" src="${this.src}" alt="${this.alt}" loading="lazy" /> `
			case 'video':
				return html`
					<video
						class="slide"
						src="${this.src}"
						?controls="${this.controls}"
						?autoplay="${this.autoplay}"
						?loop="${this.loop}"
						?muted="${this.muted}"
					>
						Your browser does not support HTML video.
					</video>
				`
			case 'content':
			default:
				return html`<slot></slot>`
		}
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-slide': SchmancySlide
	}
}
