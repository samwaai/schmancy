import { $LitElement } from '@mixins/index'
import { TableColumn } from '@schmancy/table'
import { html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { fullHeight } from '../../../src/directives/height'

interface User {
	id: number
	name: string
	email: string
	role: string
	status: 'active' | 'inactive'
	lastLogin: Date
}

@customElement('table-demo')
export class TableDemo extends $LitElement() {
	@state()
	private users: User[] = [
		{
			id: 1,
			name: 'John Doe',
			email: 'john.doe@example.com',
			role: 'Administrator',
			status: 'active',
			lastLogin: new Date('2023-12-15T14:30:00'),
		},
		{
			id: 2,
			name: 'Jane Smith',
			email: 'jane.smith@example.com',
			role: 'Editor',
			status: 'active',
			lastLogin: new Date('2023-12-20T09:15:00'),
		},
		{
			id: 3,
			name: 'Robert Johnson',
			email: 'robert.johnson@example.com',
			role: 'Viewer',
			status: 'inactive',
			lastLogin: new Date('2023-11-05T11:45:00'),
		},
		{
			id: 4,
			name: 'Emily Wilson',
			email: 'emily.wilson@example.com',
			role: 'Editor',
			status: 'active',
			lastLogin: new Date('2023-12-18T16:20:00'),
		},
		{
			id: 5,
			name: 'Michael Brown',
			email: 'michael.brown@example.com',
			role: 'Administrator',
			status: 'active',
			lastLogin: new Date('2023-12-21T10:05:00'),
		},
	]

	@state()
	private columns: TableColumn<User>[] = [
		{
			name: 'ID',
			key: 'id',
			align: 'center',
			sortable: true,
		},
		{
			name: 'Name',
			key: 'name',
			sortable: true,
		},
		{
			name: 'Email',
			key: 'email',
			sortable: true,
		},
		{
			name: 'Role',
			key: 'role',
			sortable: true,
		},
		{
			name: 'Status',
			key: 'status',
			align: 'center',
			sortable: true,
			render: user => {
				const statusClass = user.status === 'active' ? 'text-success-default text-white' : 'text-error-default'
				return html`<schmancy-typography class="${statusClass}">${user.status}</schmancy-typography>`
			},
		},
		{
			name: 'Last Login',
			key: 'lastLogin',
			sortable: true,
			render: user => {
				return user.lastLogin.toLocaleString()
			},
		},
	]

	private handleRowClick(e: CustomEvent) {
		// Handle row click
	}

	private handleSortChange(e: CustomEvent) {
		// Handle sort change (if you want to do server-side sorting)
	}

	private handleSearchChange(e: CustomEvent) {
		// Handle search change (if you want to do server-side searching)
	}

	render() {
		return html`
			<schmancy-grid gap="md" cols="1fr" rows="auto 1fr" ${fullHeight()}>
				<schmancy-nav-drawer-appbar .toggler=${true} class="py-2">
					<sch-flex>
						<schmancy-typography type="headline">Table Demo</schmancy-typography>
					</sch-flex>
				</schmancy-nav-drawer-appbar>
				<schmancy-table
					class="h-full flex-1"
					.data=${this.users}
					.columns=${this.columns}
					sortable
					searchPlaceholder="Search users..."
					cols="0.5fr 1fr 1.5fr 1fr 1fr 1.5fr 0.5fr"
					@click=${this.handleRowClick}
					@sort-change=${this.handleSortChange}
					@search-change=${this.handleSearchChange}
				></schmancy-table
			></schmancy-grid>
		`
	}
}
