import { SchmancyElement } from '@mixins/index'
import { css, html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { styleMap } from 'lit/directives/style-map.js'
import { fromEvent, of, timer, zip } from 'rxjs'
import { take, takeUntil, tap } from 'rxjs/operators'

export type SchmancySplashScreenDoneEvent = CustomEvent<void>

/**
 * Full-viewport splash overlay that dismisses once a minimum duration has
 * elapsed and (optionally) an external `ready` signal has fired. The splash
 * fades out while the underlying app content fades in.
 *
 * Bring-your-own visuals: the `splash` slot is empty by default so the
 * component pulls in no dependencies. Provide a logo, spinner, or
 * animation from the consumer side.
 *
 * @element schmancy-splash-screen
 * @slot splash - Content rendered on the splash layer (logo, spinner, etc.).
 * @slot - Default slot for the actual app content, revealed once dismissed.
 * @fires schmancy-splash-done - `CustomEvent<void>` when the splash dismisses.
 *
 * @example
 * ```html
 * <schmancy-splash-screen min-duration="1200">
 *   <my-logo slot="splash"></my-logo>
 *   <my-app></my-app>
 * </schmancy-splash-screen>
 * ```
 */
@customElement('schmancy-splash-screen')
export default class SchmancySplashScreen extends SchmancyElement {
	static styles = [css`
	:host {
		display: block;
		position: relative;
	}

	.splash-layer {
		position: fixed;
		inset: 0;
		z-index: 50;
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(
			--schmancy-splash-background,
			var(--schmancy-sys-color-surface-containerLowest, #000)
		);
		transition: opacity var(--schmancy-splash-transition, 500ms) ease-out;
	}

	.content-layer {
		display: block;
		width: 100%;
		transition: opacity var(--schmancy-splash-transition, 500ms) ease-in-out;
	}
`]

	/**
	 * Minimum duration (ms) the splash layer stays visible. Prevents a flash
	 * when the app loads faster than expected.
	 */
	@property({ type: Number, attribute: 'min-duration' }) minDuration = 1500

	/**
	 * When true, the splash dismisses on the `minDuration` timer alone.
	 * When false (default), it additionally waits for an external ready signal
	 * (a `ready` event on this element, or a call to `this.ready()`).
	 */
	@property({ type: Boolean }) auto = false

	/**
	 * When true, the splash starts hidden. Use this for imperative control.
	 */
	@property({ type: Boolean, attribute: 'initially-hidden' }) initiallyHidden = false

	@state() private _visible = true

	connectedCallback() {
		super.connectedCallback()

		if (this.initiallyHidden) {
			this._visible = false
			return
		}

		const readySignal$ = this.auto ? of(null) : fromEvent<Event>(this, 'ready').pipe(take(1))
		const minTimer$ = timer(this.minDuration)

		zip(readySignal$, minTimer$)
			.pipe(
				take(1),
				tap(() => this._dismiss()),
				takeUntil(this.disconnecting),
			)
			.subscribe()
	}

	/**
	 * Imperative API: signal that the app is ready and dismiss the splash
	 * after the minimum duration has elapsed.
	 */
	public ready(): void {
		this.dispatchEvent(new Event('ready'))
	}

	/**
	 * Force the splash to show again (e.g. between route transitions).
	 */
	public show(): void {
		this._visible = true
	}

	private _dismiss(): void {
		this._visible = false
		this.dispatchEvent(
			new CustomEvent<void>('schmancy-splash-done', {
				bubbles: true,
				composed: true,
			}),
		)
	}

	render() {
		return html`
			<div
				class="splash-layer"
				aria-hidden=${!this._visible}
				style=${styleMap({
					opacity: this._visible ? '1' : '0',
					pointerEvents: this._visible ? 'auto' : 'none',
				})}
			>
				<slot name="splash"></slot>
			</div>
			<div
				class="content-layer"
				style=${styleMap({
					opacity: this._visible ? '0' : '1',
					pointerEvents: this._visible ? 'none' : 'auto',
				})}
			>
				<slot></slot>
			</div>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-splash-screen': SchmancySplashScreen
	}
}
