# Schmancy Table - AI Reference

```js
// Basic Table
<schmancy-table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Email</th>
      <th>Role</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>John Doe</td>
      <td>john@example.com</td>
      <td>Admin</td>
    </tr>
    <tr>
      <td>Jane Smith</td>
      <td>jane@example.com</td>
      <td>User</td>
    </tr>
  </tbody>
</schmancy-table>

// Table with custom row component
<schmancy-table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Email</th>
      <th>Role</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    <schmancy-row
      .data=${{ name: 'John Doe', email: 'john@example.com', role: 'Admin' }}
      @click=${handleRowClick}>
      <td>${data.name}</td>
      <td>${data.email}</td>
      <td>${data.role}</td>
      <td>
        <schmancy-button kind="tertiary" size="small">Edit</schmancy-button>
        <schmancy-button kind="danger" size="small">Delete</schmancy-button>
      </td>
    </schmancy-row>
    <!-- More rows -->
  </tbody>
</schmancy-table>

// Data Table with programmatic columns and custom sorting
<schmancy-table
  .columns=${[
    { 
      name: 'Name', 
      key: 'name', 
      sortable: true 
    },
    { 
      name: 'Date Joined', 
      key: 'dateJoined', 
      sortable: true,
      // Custom sort by Unix timestamp
      value: (item) => new Date(item.dateJoined).getTime()
    },
    { 
      name: 'Profile Completion', 
      key: 'profile',
      sortable: true,
      // Sort by completion percentage 
      value: (item) => item.profile.completionPercentage,
      // Display with custom rendering
      render: (item) => html`${item.profile.completionPercentage}%`
    }
  ]}
  .data=${users}
  sortable>
</schmancy-table>

// Table Properties
striped: boolean          // Apply alternating row colors
bordered: boolean         // Add borders to cells
compact: boolean          // Reduce cell padding
hover: boolean            // Highlight rows on hover
responsive: boolean       // Make table horizontally scrollable on small screens
sortable: boolean         // Enable column sorting
selectable: boolean       // Enable row selection
loading: boolean          // Show loading state

// Column Configuration Properties (when using programmatic columns)
name: string              // Display name for the column header
key?: keyof T             // Object property to access for this column
align?: string            // Text alignment ('left', 'right', 'center')
weight?: string           // Font weight ('normal', 'bold')
render?: function         // Custom render function for complex content: (item) => TemplateResult
sortable?: boolean        // Whether this column supports sorting
value?: function          // Custom value function for sorting: (item) => any

// Row Properties
selected: boolean         // Whether the row is selected
data: object              // Data object for the row

// Table Events
@sort      // Fires when a sortable column is clicked, with { detail: { column, direction } }
@selection // Fires when row selection changes, with { detail: { selected } }

// Examples
// Basic responsive table
<schmancy-table
  responsive
  striped
  hover>
  <thead>
    <tr>
      <th>ID</th>
      <th>Name</th>
      <th>Email</th>
      <th>Created</th>
      <th>Status</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1</td>
      <td>John Doe</td>
      <td>john@example.com</td>
      <td>2023-04-12</td>
      <td>
        <schmancy-badge variant="success">Active</schmancy-badge>
      </td>
    </tr>
    <tr>
      <td>2</td>
      <td>Jane Smith</td>
      <td>jane@example.com</td>
      <td>2023-04-15</td>
      <td>
        <schmancy-badge variant="warning">Pending</schmancy-badge>
      </td>
    </tr>
  </tbody>
</schmancy-table>

// Sortable table - standard HTML structure
<schmancy-table
  sortable
  @sort=${(e) => sortData(e.detail.column, e.detail.direction)}>
  <thead>
    <tr>
      <th data-sort="id">ID</th>
      <th data-sort="name">Name</th>
      <th data-sort="email">Email</th>
      <th data-sort="created">Created</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    ${sortedData.map(item => html`
      <tr>
        <td>${item.id}</td>
        <td>${item.name}</td>
        <td>${item.email}</td>
        <td>${formatDate(item.created)}</td>
        <td>
          <schmancy-icon-button
            icon="edit"
            variant="tertiary"
            @click=${() => editItem(item)}>
          </schmancy-icon-button>
          <schmancy-icon-button
            icon="delete"
            variant="danger"
            @click=${() => deleteItem(item)}>
          </schmancy-icon-button>
        </td>
      </tr>
    `)}
  </tbody>
</schmancy-table>

// Sortable table - programmatic with custom value functions
<schmancy-table
  .data=${userData}
  .columns=${[
    {
      name: 'ID', 
      key: 'id', 
      sortable: true
    },
    {
      name: 'User', 
      key: 'user', 
      sortable: true,
      // Sort by last name for "user" column
      value: (item) => item.user.lastName,
      // Custom render function for complex data
      render: (item) => html`
        <div class="flex items-center">
          <schmancy-avatar src=${item.user.avatar} size="sm"></schmancy-avatar>
          <div class="ml-2">
            <div>${item.user.firstName} ${item.user.lastName}</div>
            <div class="text-sm text-gray-500">${item.user.email}</div>
          </div>
        </div>
      `
    },
    {
      name: 'Status', 
      key: 'status', 
      sortable: true,
      // Sort by status priority (numeric value) but display text
      value: (item) => statusPriorities[item.status] || 0,
      render: (item) => html`
        <schmancy-badge variant=${getStatusVariant(item.status)}>
          ${item.status}
        </schmancy-badge>
      `
    },
    {
      name: 'Created', 
      key: 'createdAt', 
      sortable: true,
      // Sort by timestamp but display formatted date
      value: (item) => new Date(item.createdAt).getTime(),
      render: (item) => formatDate(item.createdAt)
    },
    {
      name: 'Actions',
      render: (item) => html`
        <div class="flex space-x-2">
          <schmancy-icon-button icon="edit" @click=${() => editItem(item)}></schmancy-icon-button>
          <schmancy-icon-button icon="delete" @click=${() => deleteItem(item)}></schmancy-icon-button>
        </div>
      `
    }
  ]}
  sortable
  @sort=${(e) => console.log('Sort changed:', e.detail)}>
</schmancy-table>

// Selectable table
<schmancy-table
  selectable
  @selection=${(e) => handleSelectedRows(e.detail.selected)}>
  <thead>
    <tr>
      <th>
        <schmancy-checkbox
          .checked=${allSelected}
          .indeterminate=${someSelected && !allSelected}
          @change=${toggleAllSelection}>
        </schmancy-checkbox>
      </th>
      <th>Name</th>
      <th>Email</th>
      <th>Role</th>
    </tr>
  </thead>
  <tbody>
    ${data.map(item => html`
      <schmancy-row
        .data=${item}
        .selected=${selectedRows.includes(item.id)}>
        <td>
          <schmancy-checkbox
            .checked=${selectedRows.includes(item.id)}
            @change=${(e) => toggleRowSelection(item.id, e.target.checked)}>
          </schmancy-checkbox>
        </td>
        <td>${item.name}</td>
        <td>${item.email}</td>
        <td>${item.role}</td>
      </schmancy-row>
    `)}
  </tbody>
</schmancy-table>

// Loading state
<schmancy-table loading>
  <thead>
    <tr>
      <th>Name</th>
      <th>Email</th>
      <th>Role</th>
    </tr>
  </thead>
  <tbody>
    <!-- Content will be dimmed and a loading indicator shown -->
  </tbody>
</schmancy-table>

// Pagination (with external component)
<div>
  <schmancy-table>
    <!-- Table content -->
  </schmancy-table>
  
  <div style="display: flex; justify-content: space-between; margin-top: 16px;">
    <div>
      Showing ${startIndex + 1} to ${Math.min(endIndex, totalItems)} of ${totalItems} items
    </div>
    
    <div>
      <schmancy-button
        variant="tertiary"
        size="small"
        ?disabled=${page === 1}
        @click=${() => setPage(page - 1)}>
        Previous
      </schmancy-button>
      
      <!-- Page numbers -->
      ${generatePageNumbers(page, totalPages).map(p => html`
        <schmancy-button
          variant=${p === page ? "primary" : "tertiary"}
          size="small"
          @click=${() => setPage(p)}>
          ${p}
        </schmancy-button>
      `)}
      
      <schmancy-button
        variant="tertiary"
        size="small"
        ?disabled=${page === totalPages}
        @click=${() => setPage(page + 1)}>
        Next
      </schmancy-button>
    </div>
  </div>
</div>
```