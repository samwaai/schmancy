import { $LitElement } from '@mhmo91/lit-mixins/src'
import { $notify } from '@mhmo91/schmancy'
import supabase from '@db/supabase'
import { html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { when } from 'lit/directives/when.js'
import { SchmancyInputChangeEvent } from '@mhmo91/schmancy'
import { consume } from '@lit/context'
import { LoginCredentialsContext, LoginCredentials } from './login.context'

@customElement('supabase-login-email')
export default class SupabaseLoginEmail extends $LitElement() {
	@state() busy = false
	@consume({ context: LoginCredentialsContext })
	@state()
	public loginCredentials?: LoginCredentials

	async getOTP() {
		this.busy = true
		const { error } = await supabase.auth.signInWithOtp({
			email: this.loginCredentials?.email as string,
			options: {
				// set this to false if you do not want the user to be automatically signed up
				shouldCreateUser: false,
			},
		})
		this.busy = false
		if (error) {
			$notify.error(error.message)
			return
		} else {
			this.dispatchEvent(
				new CustomEvent('otp-sent', {
					bubbles: true,
					composed: true,
				}),
			)
		}
	}
	protected render(): unknown {
		return html` <schmancy-form class="space-y-6" @submit=${this.getOTP}>
			<schmancy-grid gap="md" align="stretch">
				<schmancy-input
					label="Email address"
					id="email"
					name="email"
					type="email"
					autocomplete="email"
					required
					@change=${(e: SchmancyInputChangeEvent) => {
						this.loginCredentials!.email = e.detail.value
					}}
					.readonly=${this.busy}
				></schmancy-input>

				<schmancy-button .disabled=${this.busy} variant="filled" type="submit" width="full">
					${when(
						this.busy,
						() => html`on it...`,
						() => html`Next`,
					)}
				</schmancy-button>
			</schmancy-grid>
		</schmancy-form>`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'supabase-login-email': SupabaseLoginEmail
	}
}
