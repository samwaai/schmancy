import { $LitElement } from '@mixins/index'
import { schmancyContentDrawer } from '@schmancy/content-drawer'
import { html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { repeat } from 'lit/directives/repeat.js'
import { when } from 'lit/directives/when.js'

// Mock user data
interface User {
	id: string
	name: string
	email: string
	role: string
	avatar?: string
}

const MOCK_USERS: User[] = [
	{ id: '1', name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin' },
	{ id: '2', name: 'Bob Smith', email: 'bob@example.com', role: 'Editor' },
	{ id: '3', name: 'Carol White', email: 'carol@example.com', role: 'Viewer' },
	{ id: '4', name: 'David Brown', email: 'david@example.com', role: 'Editor' },
	{ id: '5', name: 'Eve Davis', email: 'eve@example.com', role: 'Admin' },
	{ id: '6', name: 'Frank Miller', email: 'frank@example.com', role: 'Viewer' },
]

// User details component
class UserDetails extends $LitElement() {
	@state() user: User | null = null

	render() {
		if (!this.user) {
			return html`
				<div class="flex items-center justify-center h-full p-8">
					<schmancy-typography type="body" token="lg" class="text-surface-onVariant">
						Select a user to view details
					</schmancy-typography>
				</div>
			`
		}

		return html`
			<div class="flex flex-col gap-6 p-6">
				<!-- Header -->
				<div class="flex items-center gap-4">
					<schmancy-avatar size="xl" .initials=${this.user.name}></schmancy-avatar>
					<div class="flex-1">
						<schmancy-typography type="headline" token="lg" class="block mb-1">
							${this.user.name}
						</schmancy-typography>
						<schmancy-typography type="body" token="md" class="text-surface-onVariant">
							${this.user.email}
						</schmancy-typography>
					</div>
				</div>

				<schmancy-divider></schmancy-divider>

				<!-- Role Section -->
				<div class="space-y-3">
					<schmancy-typography type="title" token="lg">Role</schmancy-typography>
					<schmancy-surface type="container" class="p-4 rounded-lg">
						<div class="flex items-center gap-2">
							<schmancy-icon size="sm" class="text-primary">badge</schmancy-icon>
							<schmancy-typography type="body" token="lg">${this.user.role}</schmancy-typography>
						</div>
					</schmancy-surface>
				</div>

				<!-- Contact Information -->
				<div class="space-y-3">
					<schmancy-typography type="title" token="lg">Contact Information</schmancy-typography>
					<div class="space-y-2">
						<schmancy-input label="Name" .value=${this.user.name} disabled></schmancy-input>
						<schmancy-input label="Email" type="email" .value=${this.user.email} disabled></schmancy-input>
					</div>
				</div>

				<!-- Actions -->
				<schmancy-surface type="containerLow" class="p-4 rounded-lg mt-auto">
					<div class="flex gap-2 justify-end">
						<schmancy-button variant="outlined">
							<schmancy-icon size="sm" slot="prefix">edit</schmancy-icon>
							Edit User
						</schmancy-button>
						<schmancy-button variant="filled">
							<schmancy-icon size="sm" slot="prefix">mail</schmancy-icon>
							Send Message
						</schmancy-button>
					</div>
				</schmancy-surface>
			</div>
		`
	}
}

customElements.define('user-details', UserDetails)

@customElement('layout-content-drawer-users')
export default class LayoutContentDrawerUsers extends $LitElement() {
	@state() private users = MOCK_USERS
	@state() private selectedUser: User | null = null
	@state() private searchTerm = ''
	@state() private filteredUsers = MOCK_USERS

	private userDetailsInstance: UserDetails | null = null

	private handleSearch(e: Event) {
		const input = e.target as HTMLInputElement
		this.searchTerm = input.value.toLowerCase()
		this.filteredUsers = this.users.filter(
			user => user.name.toLowerCase().includes(this.searchTerm) || user.email.toLowerCase().includes(this.searchTerm),
		)
	}

	private selectUser(user: User) {
		this.selectedUser = user

		// Create instance if needed, or reuse existing one
		if (!this.userDetailsInstance) {
			this.userDetailsInstance = new UserDetails()
		}

		// Update user data using new push API with props
		schmancyContentDrawer.push({
			component: this.userDetailsInstance,
			props: {
				user: user,
			},
		})

		// Also directly set the property (for backwards compatibility)
		this.userDetailsInstance.user = user
	}

	render() {
		return html`
			<schmancy-surface class="p-8">
				<!-- Header -->
				<schmancy-typography type="display" token="lg" class="mb-4 block">
					Content Drawer - User Management
				</schmancy-typography>
				<schmancy-typography type="body" token="lg" class="mb-8 text-surface-onVariant block">
					A practical example showing how to use the content drawer for user management, similar to real-world
					applications. Demonstrates the new push API with props.
				</schmancy-typography>

				<!-- Demo -->
				<schmancy-surface type="container" class="rounded-lg overflow-hidden" style="height: 600px">
					<schmancy-content-drawer>
						<schmancy-content-drawer-main class="max-w-full lg:max-w-[360px]">
							<div class="h-full flex flex-col">
								<!-- Search Bar -->
								<div class="p-4 border-b border-surface-outline">
									<schmancy-input
										type="text"
										placeholder="Search users..."
										.value=${this.searchTerm}
										@input=${this.handleSearch}
										class="w-full"
									>
										<schmancy-icon slot="prefix" size="sm">search</schmancy-icon>
									</schmancy-input>
								</div>

								<!-- User List -->
								<div class="flex-1 overflow-y-auto p-2 space-y-1">
									${when(
										this.filteredUsers.length === 0,
										() => html`
											<div class="flex items-center justify-center h-full">
												<schmancy-typography type="body" token="md" class="text-surface-onVariant">
													No users found
												</schmancy-typography>
											</div>
										`,
										() => html`
											${repeat(
												this.filteredUsers,
												user => user.id,
												user => {
													const isSelected = this.selectedUser?.id === user.id
													return html`
														<schmancy-surface
															type="container"
															class="p-3 rounded-lg cursor-pointer hover:bg-surface-containerHigh transition-colors ${isSelected
																? 'bg-primary-container'
																: ''}"
															@click=${() => this.selectUser(user)}
														>
															<div class="flex items-center gap-3">
																<schmancy-avatar size="lg" .initials=${user.name}></schmancy-avatar>
																<div class="flex-1 min-w-0">
																	<schmancy-typography type="body" token="md" class="block truncate">
																		${user.name}
																	</schmancy-typography>
																	<schmancy-typography type="body" token="sm" class="text-surface-onVariant block truncate">
																		${user.email}
																	</schmancy-typography>
																</div>
																<schmancy-icon size="sm" class="text-surface-onVariant"> chevron_right </schmancy-icon>
															</div>
														</schmancy-surface>
													`
												},
											)}
										`,
									)}
								</div>
							</div>
						</schmancy-content-drawer-main>

						<schmancy-content-drawer-sheet>
							<div class="flex items-center justify-center h-full p-8" slot="placeholder">
								<schmancy-typography type="body" token="lg" class="text-surface-onVariant text-center">
									Select a user from the list to view their details
								</schmancy-typography>
							</div>
						</schmancy-content-drawer-sheet>
					</schmancy-content-drawer>
				</schmancy-surface>

				<!-- Code Example -->
				<schmancy-surface type="surfaceDim" class="rounded-lg p-6 mt-8">
					<schmancy-typography type="headline" token="sm" class="mb-3 flex items-center gap-2">
						<schmancy-icon size="sm" class="text-primary">code</schmancy-icon>
						Using the New Push API with Props
					</schmancy-typography>
					<schmancy-code-preview language="typescript">
// Create a reusable component instance
private userDetailsInstance: UserDetails | null = null

private selectUser(user: User) {
  if (!this.userDetailsInstance) {
    this.userDetailsInstance = new UserDetails()
  }

  // Use new push API with props - forces update!
  schmancyContentDrawer.push({
    component: this.userDetailsInstance,
    props: {
      user: user
    }
  })

  // Also set directly for backwards compatibility
  this.userDetailsInstance.user = user
}
					</schmancy-code-preview>
				</schmancy-surface>

				<!-- Benefits Section -->
				<schmancy-surface type="surfaceDim" class="rounded-lg p-6 mt-6">
					<schmancy-typography type="headline" token="sm" class="mb-3 flex items-center gap-2">
						<schmancy-icon size="sm" class="text-primary">check_circle</schmancy-icon>
						Why Use Props?
					</schmancy-typography>
					<div class="space-y-2">
						<schmancy-typography type="body" token="sm" class="text-surface-onVariant block">
							• <strong>Forces Updates:</strong> Each push with different props triggers a re-render, fixing the "subsequent
							pushes don't update" issue
						</schmancy-typography>
						<schmancy-typography type="body" token="sm" class="text-surface-onVariant block">
							• <strong>Better Change Detection:</strong> The area router now properly detects when content should update
						</schmancy-typography>
						<schmancy-typography type="body" token="sm" class="text-surface-onVariant block">
							• <strong>Instance Reuse:</strong> You can keep using the same component instance while ensuring updates work
							correctly
						</schmancy-typography>
						<schmancy-typography type="body" token="sm" class="text-surface-onVariant block">
							• <strong>Aligned with Area Router:</strong> Uses the same API pattern as area.push() for consistency
						</schmancy-typography>
					</div>
				</schmancy-surface>
			</schmancy-surface>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'layout-content-drawer-users': LayoutContentDrawerUsers
		'user-details': UserDetails
	}
}
