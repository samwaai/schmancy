/**
 * User Management: Create Organization API Types
 * Request/response types for createOrganization Cloud Function
 */

/**
 * Team member to invite (new user by email)
 */
export interface TeamMemberInvite {
	/** Email address (required) */
	email: string
	/** Display name (optional, defaults to email prefix) */
	name?: string
}

/**
 * Request to create a new organization
 */
export interface Request {
	/** Organization details */
	organization: {
		/** Organization name (required) */
		name: string
		/** Short abbreviation (optional) */
		abbreviation?: string
		/** Organization address (optional) */
		address?: {
			street: string
			city: string
			state?: string
			zip: string
			country: string
		}
		/** VAT ID for tax purposes (optional) */
		vatID?: string
		/** Tax ID (optional) */
		taxID?: string
		/** Bank accounts (optional) */
		accounts?: Array<{
			id: string
			iban: string
			bic?: string
			bankName?: string
			accountHolder?: string
		}>
	}
	/** First business to create for this organization (optional) */
	business?: {
		/** Business name (required if business is provided) */
		name: string
		/** Business type */
		type: 'restaurant' | 'retail' | 'service' | 'events' | 'other'
		/** Timezone (optional, defaults to Europe/Berlin) */
		timezone?: string
		/** Currency (optional, defaults to EUR) */
		currency?: string
	}
	/** Existing user IDs to add as team members (optional) */
	teamMemberIds?: string[]
	/** New users to invite by email (optional) */
	teamMemberInvites?: TeamMemberInvite[]
}

/**
 * Result for each invited user
 */
export interface InviteResult {
	email: string
	success: boolean
	userCreated: boolean
	userId?: string
	error?: string
}

/**
 * Response from creating an organization
 */
export interface Response {
	/** Whether creation succeeded */
	success: boolean
	/** ID of the created organization */
	organizationId: string
	/** ID of the created business (if business was provided) */
	businessId?: string
	/** ID of the created warehouse (if business was provided) */
	warehouseId?: string
	/** Status message */
	message: string
	/** Results for invited users (if any) */
	inviteResults?: InviteResult[]
}
