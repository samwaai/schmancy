import supabase from '@db/supabase'
import { provide } from '@lit/context'
import { $LitElement } from '@mhmo91/lit-mixins/src'
import { $notify, area, fullHeight } from '@mhmo91/schmancy'
import { html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { fromEvent, takeUntil } from 'rxjs'
import SupabaseLoginEmail from './email'
import { LoginCredentials, LoginCredentialsContext } from './login.context'
import SupabaseLoginOTP from './otp'
import App from '../app/app'
import appSettings from 'app.settings'

@customElement('supabase-login')
export default class SupabaseLogin extends $LitElement() {
	@provide({ context: LoginCredentialsContext })
	@state()
	loginInfo = new LoginCredentials()

	@state()
	busy = false
	@state()
	activeForm: 'email' | 'otp' = 'email'
	@state()
	otp = ''
	@state()
	email = ''

	connectedCallback(): void {
		super.connectedCallback()

		if (!this.loginInfo.email) {
			area.push({
				area: 'login',
				component: SupabaseLoginEmail,
			})
		}

		fromEvent<CustomEvent>(this, 'otp-sent')
			.pipe(takeUntil(this.disconnecting))
			.subscribe(() => {
				area.push({
					area: 'login',
					component: SupabaseLoginOTP,
				})
			})
		fromEvent<CustomEvent>(this, 'login-success')
			.pipe(takeUntil(this.disconnecting))
			.subscribe(() => {
				this.next()
			})
	}
	next() {
		area.push({
			area: 'root',
			component: App,
		})
	}

	async getOTP() {
		this.busy = true
		const { error } = await supabase.auth.signInWithOtp({
			email: this.email,
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
			this.activeForm = 'otp'
			$notify.success('One time password was sent to your email')
		}
	}

	verifyOTP() {
		supabase.auth.verifyOtp({
			email: this.email,
			token: this.otp,
			type: 'email',
		})
	}

	protected render(): unknown {
		return html`
			<section ${fullHeight()}>
				<schmancy-grid gap="md" rows="0.5fr auto auto 1fr" justify="center" align="center" class="w-full px-6 h-full">
					<span></span>
					<schmancy-typography type="display" token="sm"> ${appSettings.NAME}</schmancy-typography>
					<div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm h-full">
						<schmancy-area class="h-full" name="login" .default=${SupabaseLoginEmail}></schmancy-area>
					</div>
					<span></span>
				</schmancy-grid>
			</section>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'supabase-login': SupabaseLogin
	}
}
