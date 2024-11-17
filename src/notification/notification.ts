import { TailwindElement } from '@mhmo91/lit-mixins/src'

import { html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
@customElement('schmancy-notification')
export class SchmancyNotification extends TailwindElement() {
	@property({ type: String })
	type: 'success' | 'error' | 'warning' | 'info' = 'success'

	render() {
		return html`
			<div
				aria-live="assertive"
				class="pointer-events-none z-[100] fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6"
			>
				<div class="flex w-full flex-col items-center space-y-4 sm:items-end">
					<div
						class="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5"
					>
						<div class="p-2">
							<div class="flex items-center">
								<div class="flex-shrink-0">
									${this.type === 'success'
										? html` <svg
												class="h-6 w-6 text-green-400"
												fill="none"
												viewBox="0 0 24 24"
												stroke-width="1.5"
												stroke="currentColor"
												aria-hidden="true"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
												/>
											</svg>`
										: html` <svg
												class="h-6 w-6 text-red-600"
												fill="none"
												viewBox="0 0 24 24"
												stroke-width="1.5"
												stroke="currentColor"
												aria-hidden="true"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
												/>
											</svg>`}
								</div>
								<div class="ml-3 w-0 flex-1 pt-0.5">
									<p class=" text-sm text-gray-500">
										<slot></slot>
									</p>
								</div>
								<div class="ml-4 flex flex-shrink-0">
									<button
										type="button"
										class="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-900 hover:bg-gray-100 hover:rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
										@click=${() => {
											this.dispatchEvent(new CustomEvent('close'))
										}}
									>
										<span class="sr-only">Close</span>
										<svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
											<path
												d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"
											/>
										</svg>
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-notification': SchmancyNotification
	}
}
