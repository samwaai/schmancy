import { css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { filter, fromEvent, merge, of, takeUntil, tap, throwIfEmpty } from 'rxjs'
import { FINDING_MORTIES, FINDING_MORTIES_EVENT, HERE_RICKY, HERE_RICKY_EVENT } from '..'
import {
	HereMorty,
	HereMortyEvent,
	WhereAreYouRicky,
	WhereAreYouRickyEvent,
	default as teleport,
	default as teleportationService,
} from './teleport.service'
import { watchElementRect } from './watcher'
import { $LitElement } from '@mixins/index'
@customElement('schmancy-teleport')
export class SchmancyTeleportation extends $LitElement(css``) {
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

	get _slottedChildren() {
		const slot = this.shadowRoot.querySelector('slot')
		return slot.assignedElements({ flatten: true })
	}

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
		of(teleportationService.activeTeleportations.get(this.id))
			.pipe(
				filter(a => !!a),
				takeUntil(this.disconnecting),
				throwIfEmpty(),
			)
			.subscribe({
				next: domRect => {
					console.count('teleport')
					this.style.setProperty('visibility', 'hidden')
					// teleport.flipRequests.next({ from: component, to: this, stagger: 0 })
					watchElementRect(this)
						.pipe(takeUntil(this.disconnecting))
						.subscribe({
							next: e => {
								// console.log(e)
								teleportationService.activeTeleportations.set(this.id, e)
								teleport.flipRequests.next({
									from: {
										rect: domRect,
									},
									to: {
										rect: e,
										element: this._slottedChildren[0] as HTMLElement,
									},
									host: this,
								})
							},
						})
				},
				error: () => {
					this.style.setProperty('visibility', 'visible')
					watchElementRect(this)
						.pipe(takeUntil(this.disconnecting))
						.subscribe({
							next: e => {
								console.log(e)
								teleportationService.activeTeleportations.set(this.id, e)
							},
						})
				},
				complete: () => {},
			})
	}

	render() {
		return html`<slot></slot>`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-teleport': SchmancyTeleportation
	}
}
