import { $LitElement } from '@mhmo91/lit-mixins/src'
import { css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { fromEvent, merge, takeUntil, tap } from 'rxjs'
import { FINDING_MORTIES, FINDING_MORTIES_EVENT, HERE_RICKY, HERE_RICKY_EVENT } from '..'
import {
	default as teleport,
	default as teleportationService,
	HereMorty,
	HereMortyEvent,
	WhereAreYouRicky,
	WhereAreYouRickyEvent,
} from './teleport.service'

@customElement('mo-teleport')
export class SchmancyTeleportation extends $LitElement() {
	static styles = [
		css`
			:host {
				display: flex;
				height: 100%;
				width: fit-content;
			}
		`,
	] // It's not really unsafe 🐈

	/**
	 * @attr {string} uuid - The component tag to teleport
	 * @readonly
	 */
	@property({ type: Number, reflect: true }) uuid = Math.floor(Math.random() * Date.now())

	/**
	 * @attr {string} id - The component tag to teleport
	 * @required
	 */
	@property({ type: String }) id!: string

	@property({ type: Number }) delay = 0

	debugging = import.meta.env.DEV ? true : false

	connectedCallback(): void {
		if (this.id === undefined) throw new Error('id is required')
		super.connectedCallback()
		merge(
			fromEvent<FINDING_MORTIES_EVENT>(window, FINDING_MORTIES).pipe(
				tap({
					next: () => {
						this.dispatchEvent(
							new CustomEvent<HERE_RICKY_EVENT['detail']>(HERE_RICKY, {
								detail: {
									component: this,
								},
								bubbles: true,
								composed: true,
							}),
						)
					},
				}),
			),
			fromEvent<WhereAreYouRickyEvent>(window, WhereAreYouRicky).pipe(
				tap({
					next: e => {
						if (e.detail.id === this.id && this.uuid && e.detail.callerID !== this.uuid) {
							this.dispatchEvent(
								new CustomEvent<HereMortyEvent['detail']>(HereMorty, {
									detail: {
										component: this,
									},
									bubbles: true,
									composed: true,
								}),
							)
						}
					},
				}),
			),
		)
			.pipe(takeUntil(this.disconnecting))
			.subscribe()
	}

	async firstUpdated() {
		teleportationService
			.find(this)
			.pipe(takeUntil(this.disconnecting))
			.subscribe({
				next: component => {
					this.style.setProperty('visibility', 'hidden')
					// teleport.flipRequests.next({ from: component, to: this, stagger: 0 })
					teleport.flipRequests.next({ from: component, to: this, host: this })
				},
				error: () => {
					this.style.setProperty('visibility', 'visible')
				},
			})
	}

	render() {
		return html`<slot></slot>`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-teleport': SchmancyTeleportation
	}
}
