export class User {
	email?: string
	access_token?: string
	expires_at?: number
	expires_in?: number
	refresh_token?: string
	aud?: string | 'authenticated' | 'unauthenticated'
	confirmed_at?: string
	email_confirmed_at?: string
	last_sign_in_at?: string
	phone?: string
	role?: string
	updated_at?: string
	user_metadata?: object
	constructor() {
		this.email = ''
		this.aud = 'unauthenticated'
	}
}
