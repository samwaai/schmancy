# Schmancy Dropdown - AI Reference

```js
// Basic Dropdown
<schmancy-dropdown>
  <schmancy-button slot="trigger">
    Open Dropdown
  </schmancy-button>
  
  <div slot="content">
    <div>Dropdown content goes here</div>
  </div>
</schmancy-dropdown>

// Dropdown with position
<schmancy-dropdown
  position="bottom-start|bottom-end|top-start|top-end|left-start|left-end|right-start|right-end">
  <schmancy-button slot="trigger">
    Open Dropdown
  </schmancy-button>
  
  <div slot="content">
    <div>Positioned dropdown content</div>
  </div>
</schmancy-dropdown>

// Dropdown with menu items
<schmancy-dropdown>
  <schmancy-button slot="trigger">
    Options
  </schmancy-button>
  
  <schmancy-menu slot="content">
    <schmancy-menu-item @click=${handleEdit}>Edit</schmancy-menu-item>
    <schmancy-menu-item @click=${handleDuplicate}>Duplicate</schmancy-menu-item>
    <schmancy-menu-item @click=${handleArchive}>Archive</schmancy-menu-item>
    <schmancy-menu-item disabled>Share</schmancy-menu-item>
    <schmancy-divider></schmancy-divider>
    <schmancy-menu-item variant="danger" @click=${handleDelete}>Delete</schmancy-menu-item>
  </schmancy-menu>
</schmancy-dropdown>

// Dropdown with custom width and offset
<schmancy-dropdown
  width="300px"
  offset="5">
  <schmancy-button slot="trigger">
    Wide Dropdown
  </schmancy-button>
  
  <div slot="content" style="padding: 16px;">
    <h3>Custom Content</h3>
    <p>This dropdown has custom width and offset.</p>
  </div>
</schmancy-dropdown>

// Dropdown Properties
position: string        // Position relative to trigger: "bottom-start" (default), "top-end", etc.
width: string           // Width of the dropdown content
offset: number          // Distance between trigger and content (pixels)
open: boolean           // Whether the dropdown is open
disabled: boolean       // Disable the dropdown
closeOnSelect: boolean  // Close dropdown when an item inside is selected
closeOnClickOutside: boolean // Close dropdown when clicking outside
matchTriggerWidth: boolean   // Make content width match trigger width

// Dropdown Events
@open    // Fires when dropdown opens
@close   // Fires when dropdown closes
@select  // Fires when an item is selected (if using menu items)

// Dropdown Methods
dropdown.open() -> void    // Programmatically open the dropdown
dropdown.close() -> void   // Programmatically close the dropdown
dropdown.toggle() -> void  // Toggle the dropdown state

// Examples
// Basic dropdown menu
<schmancy-dropdown>
  <schmancy-button slot="trigger">
    <span>Actions</span>
    <schmancy-icon slot="suffix" icon="chevron-down"></schmancy-icon>
  </schmancy-button>
  
  <schmancy-menu slot="content">
    <schmancy-menu-item @click=${viewItem}>
      <schmancy-icon slot="prefix" icon="eye"></schmancy-icon>
      View
    </schmancy-menu-item>
    
    <schmancy-menu-item @click=${editItem}>
      <schmancy-icon slot="prefix" icon="edit"></schmancy-icon>
      Edit
    </schmancy-menu-item>
    
    <schmancy-divider></schmancy-divider>
    
    <schmancy-menu-item variant="danger" @click=${deleteItem}>
      <schmancy-icon slot="prefix" icon="trash"></schmancy-icon>
      Delete
    </schmancy-menu-item>
  </schmancy-menu>
</schmancy-dropdown>

// Profile dropdown
<schmancy-dropdown position="bottom-end">
  <div slot="trigger" style="cursor: pointer;">
    <schmancy-avatar
      src="path/to/avatar.jpg"
      size="medium">
    </schmancy-avatar>
  </div>
  
  <div slot="content">
    <div style="padding: 16px; text-align: center;">
      <schmancy-avatar
        src="path/to/avatar.jpg"
        size="large">
      </schmancy-avatar>
      <h3>John Doe</h3>
      <p>john@example.com</p>
    </div>
    
    <schmancy-divider></schmancy-divider>
    
    <schmancy-menu>
      <schmancy-menu-item @click=${viewProfile}>
        <schmancy-icon slot="prefix" icon="user"></schmancy-icon>
        Profile
      </schmancy-menu-item>
      
      <schmancy-menu-item @click=${openSettings}>
        <schmancy-icon slot="prefix" icon="settings"></schmancy-icon>
        Settings
      </schmancy-menu-item>
      
      <schmancy-divider></schmancy-divider>
      
      <schmancy-menu-item @click=${signOut}>
        <schmancy-icon slot="prefix" icon="logout"></schmancy-icon>
        Sign Out
      </schmancy-menu-item>
    </schmancy-menu>
  </div>
</schmancy-dropdown>

// Dropdown with form
<schmancy-dropdown>
  <schmancy-button slot="trigger">
    Add User
  </schmancy-button>
  
  <div slot="content" style="padding: 16px; width: 300px;">
    <h3>Add User</h3>
    <schmancy-form @submit=${(e) => {
      addUser(e.detail.values);
      dropdown.close();
    }}>
      <schmancy-input
        name="name"
        label="Name"
        required>
      </schmancy-input>
      
      <schmancy-input
        name="email"
        label="Email"
        type="email"
        required>
      </schmancy-input>
      
      <div style="display: flex; justify-content: flex-end; gap: 8px; margin-top: 16px;">
        <schmancy-button
          type="button"
          variant="tertiary"
          @click=${() => dropdown.close()}>
          Cancel
        </schmancy-button>
        
        <schmancy-button
          type="submit"
          variant="primary">
          Add
        </schmancy-button>
      </div>
    </schmancy-form>
  </div>
</schmancy-dropdown>

// Icon button dropdown
<schmancy-dropdown>
  <schmancy-icon-button
    slot="trigger"
    icon="more-vertical">
  </schmancy-icon-button>
  
  <schmancy-menu slot="content">
    <schmancy-menu-item>Option 1</schmancy-menu-item>
    <schmancy-menu-item>Option 2</schmancy-menu-item>
    <schmancy-menu-item>Option 3</schmancy-menu-item>
  </schmancy-menu>
</schmancy-dropdown>

// Filter dropdown
<schmancy-dropdown>
  <schmancy-button slot="trigger" variant="tertiary">
    <schmancy-icon slot="prefix" icon="filter"></schmancy-icon>
    Filter
  </schmancy-button>
  
  <div slot="content" style="padding: 16px; width: 250px;">
    <h3>Filters</h3>
    
    <div style="margin-bottom: 16px;">
      <label>Status</label>
      <schmancy-radio-group>
        <schmancy-radio-button value="all" label="All"></schmancy-radio-button>
        <schmancy-radio-button value="active" label="Active"></schmancy-radio-button>
        <schmancy-radio-button value="inactive" label="Inactive"></schmancy-radio-button>
      </schmancy-radio-group>
    </div>
    
    <div style="margin-bottom: 16px;">
      <label>Categories</label>
      <schmancy-checkbox label="Products"></schmancy-checkbox>
      <schmancy-checkbox label="Services"></schmancy-checkbox>
      <schmancy-checkbox label="Resources"></schmancy-checkbox>
    </div>
    
    <schmancy-button 
      variant="primary" 
      style="width: 100%;"
      @click=${applyFilters}>
      Apply Filters
    </schmancy-button>
  </div>
</schmancy-dropdown>
```