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

// Table Properties
striped: boolean          // Apply alternating row colors
bordered: boolean         // Add borders to cells
compact: boolean          // Reduce cell padding
hover: boolean            // Highlight rows on hover
responsive: boolean       // Make table horizontally scrollable on small screens
sortable: boolean         // Enable column sorting
selectable: boolean       // Enable row selection
loading: boolean          // Show loading state

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

// Sortable table
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