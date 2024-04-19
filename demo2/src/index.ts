import { $LitElement } from '@mhmo91/lit-mixins/src'
import { $notify, fullHeight } from '@schmancy/index'
import { html } from 'lit'
import { customElement, query, state } from 'lit/decorators.js'
import { when } from 'lit/directives/when.js'
import { fromEvent, take } from 'rxjs'
// import ZolaApp from './app/app'
import App from './app/app'

@customElement('app-index')
export class AppIndex extends $LitElement() {
	@state() rehydrated = true
	@query('schmancy-surface') surface!: HTMLElement

	async connectedCallback() {
		super.connectedCallback()
		if (!navigator.onLine) {
			$notify.error('No internet connection')
			fromEvent(window, 'online')
				.pipe(take(1))
				.subscribe(() => {
					this.init()
				})
		} else {
			this.init()
		}
	}

	init() {
		// zip(
		// 	from(supabase.auth.getUser()).pipe(
		// 		retry(3),
		// 		tap(res => {
		// 			if (!res.data.user) {
		// 				area.push({
		// 					area: 'root',
		// 					component: ZolaLogin,
		// 				})
		// 			} else {
		// 				area.push({
		// 					area: 'root',
		// 					component: App,
		// 				})
		// 			}
		// 		}),
		// 	),
		// 	$persistor.pipe(
		// 		filter(() => store.getState().user._persist.rehydrated),
		// 		take(1),
		// 	),
		// ).subscribe({
		// 	complete: () => {
		// 		this.rehydrated = true
		// 	},
		// })
	}

	render() {
		return html`
			<schmancy-surface ${fullHeight()} type="container">
				${when(
					this.rehydrated,
					() => html`
						<schmancy-area class="h-full w-full" name="root" .default=${App}>
							<slot slot="stripe-element" name="stripe-element"></slot>
						</schmancy-area>
					`,
					() => html` <schmancy-busy></schmancy-busy> `,
				)}
				<schmancy-notification-outlet></schmancy-notification-outlet>
			</schmancy-surface>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'app-index': AppIndex
	}
}
