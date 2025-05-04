# Schmancy Menu - AI Reference

```js
// Basic Menu
<schmancy-menu @select=${handleSelect}>
  <schmancy-menu-item value="item1">Item 1</schmancy-menu-item>
  <schmancy-menu-item value="item2">Item 2</schmancy-menu-item>
  <schmancy-menu-item value="item3" disabled>Item 3</schmancy-menu-item>
  <schmancy-divider></schmancy-divider>
  <schmancy-menu-item value="item4">Item 4</schmancy-menu-item>
</schmancy-menu>

// Menu with icons
<schmancy-menu>
  <schmancy-menu-item value="copy">
    <schmancy-icon slot="prefix" icon="copy"></schmancy-icon>
    Copy
  </schmancy-menu-item>
  
  <schmancy-menu-item value="cut">
    <schmancy-icon slot="prefix" icon="scissors"></schmancy-icon>
    Cut
  </schmancy-menu-item>
  
  <schmancy-menu-item value="paste">
    <schmancy-icon slot="prefix" icon="clipboard"></schmancy-icon>
    Paste
  </schmancy-menu-item>
</schmancy-menu>

// Menu with checkable items
<schmancy-menu multiple>
  <schmancy-menu-item value="bold" checkable>
    <schmancy-icon slot="prefix" icon="bold"></schmancy-icon>
    Bold
  </schmancy-menu-item>
  
  <schmancy-menu-item value="italic" checkable>
    <schmancy-icon slot="prefix" icon="italic"></schmancy-icon>
    Italic
  </schmancy-menu-item>
  
  <schmancy-menu-item value="underline" checkable>
    <schmancy-icon slot="prefix" icon="underline"></schmancy-icon>
    Underline
  </schmancy-menu-item>
</schmancy-menu>

// Menu in a dropdown
<schmancy-dropdown>
  <schmancy-button slot="trigger">
    Options
  </schmancy-button>
  
  <schmancy-menu slot="content" @select=${handleMenuSelect}>
    <schmancy-menu-item value="edit">Edit</schmancy-menu-item>
    <schmancy-menu-item value="duplicate">Duplicate</schmancy-menu-item>
    <schmancy-menu-item value="archive">Archive</schmancy-menu-item>
    <schmancy-divider></schmancy-divider>
    <schmancy-menu-item value="delete" variant="danger">Delete</schmancy-menu-item>
  </schmancy-menu>
</schmancy-dropdown>

// Menu Properties
multiple: boolean         // Allow selecting multiple items
value: string|string[]    // Selected item value(s)
size: string              // Size: "small", "medium", "large"
dense: boolean            // More compact appearance

// Menu Item Properties
value: string             // Value for selection
disabled: boolean         // Disable the item
selected: boolean         // Whether the item is selected
checkable: boolean        // Show checkbox/radio indicator
checked: boolean          // Checked state for checkable items
variant: string           // Variant: "default", "primary", "danger", etc.

// Menu Events
@select   // Fires when item is selected, with { detail: { value, item } }
@change   // Fires when selection changes, with { detail: { value } }

// Examples
// Context menu
<schmancy-dropdown>
  <div 
    slot="trigger"
    @contextmenu=${(e) => {
      e.preventDefault();
      dropdown.open({ x: e.clientX, y: e.clientY });
    }}
    style="width: 300px; height: 200px; border: 1px dashed #ccc; display: flex; align-items: center; justify-content: center;">
    Right-click me
  </div>
  
  <schmancy-menu slot="content" @select=${handleContextMenuSelect}>
    <schmancy-menu-item value="view">
      <schmancy-icon slot="prefix" icon="eye"></schmancy-icon>
      View
    </schmancy-menu-item>
    
    <schmancy-menu-item value="edit">
      <schmancy-icon slot="prefix" icon="edit"></schmancy-icon>
      Edit
    </schmancy-menu-item>
    
    <schmancy-menu-item value="share">
      <schmancy-icon slot="prefix" icon="share"></schmancy-icon>
      Share
      <schmancy-icon slot="suffix" icon="external-link"></schmancy-icon>
    </schmancy-menu-item>
    
    <schmancy-divider></schmancy-divider>
    
    <schmancy-menu-item value="delete" variant="danger">
      <schmancy-icon slot="prefix" icon="trash"></schmancy-icon>
      Delete
    </schmancy-menu-item>
  </schmancy-menu>
</schmancy-dropdown>

// Multi-select menu
<schmancy-menu
  multiple
  .value=${selectedOptions}
  @change=${(e) => selectedOptions = e.detail.value}>
  
  <schmancy-menu-item value="wifi" checkable>
    <schmancy-icon slot="prefix" icon="wifi"></schmancy-icon>
    Wi-Fi
  </schmancy-menu-item>
  
  <schmancy-menu-item value="bluetooth" checkable>
    <schmancy-icon slot="prefix" icon="bluetooth"></schmancy-icon>
    Bluetooth
  </schmancy-menu-item>
  
  <schmancy-menu-item value="airplane" checkable>
    <schmancy-icon slot="prefix" icon="airplane"></schmancy-icon>
    Airplane Mode
  </schmancy-menu-item>
  
  <schmancy-menu-item value="location" checkable>
    <schmancy-icon slot="prefix" icon="map-pin"></schmancy-icon>
    Location
  </schmancy-menu-item>
</schmancy-menu>

// Menu with keyboard shortcuts
<schmancy-menu>
  <schmancy-menu-item value="new">
    <schmancy-icon slot="prefix" icon="file"></schmancy-icon>
    New File
    <span slot="suffix">Ctrl+N</span>
  </schmancy-menu-item>
  
  <schmancy-menu-item value="open">
    <schmancy-icon slot="prefix" icon="folder-open"></schmancy-icon>
    Open...
    <span slot="suffix">Ctrl+O</span>
  </schmancy-menu-item>
  
  <schmancy-menu-item value="save">
    <schmancy-icon slot="prefix" icon="save"></schmancy-icon>
    Save
    <span slot="suffix">Ctrl+S</span>
  </schmancy-menu-item>
  
  <schmancy-menu-item value="saveAs">
    <schmancy-icon slot="prefix" icon="save"></schmancy-icon>
    Save As...
    <span slot="suffix">Ctrl+Shift+S</span>
  </schmancy-menu-item>
  
  <schmancy-divider></schmancy-divider>
  
  <schmancy-menu-item value="exit">
    <schmancy-icon slot="prefix" icon="x"></schmancy-icon>
    Exit
    <span slot="suffix">Alt+F4</span>
  </schmancy-menu-item>
</schmancy-menu>

// Menu with nested items (using dropdown)
<schmancy-menu>
  <schmancy-menu-item value="file">File</schmancy-menu-item>
  <schmancy-menu-item value="edit">Edit</schmancy-menu-item>
  <schmancy-menu-item value="view">View</schmancy-menu-item>
  
  <schmancy-dropdown position="right-start">
    <schmancy-menu-item slot="trigger" value="insert">
      Insert
      <schmancy-icon slot="suffix" icon="chevron-right"></schmancy-icon>
    </schmancy-menu-item>
    
    <schmancy-menu slot="content">
      <schmancy-menu-item value="insert-image">
        <schmancy-icon slot="prefix" icon="image"></schmancy-icon>
        Image
      </schmancy-menu-item>
      
      <schmancy-menu-item value="insert-table">
        <schmancy-icon slot="prefix" icon="grid"></schmancy-icon>
        Table
      </schmancy-menu-item>
      
      <schmancy-menu-item value="insert-chart">
        <schmancy-icon slot="prefix" icon="bar-chart"></schmancy-icon>
        Chart
      </schmancy-menu-item>
    </schmancy-menu>
  </schmancy-dropdown>
  
  <schmancy-menu-item value="format">Format</schmancy-menu-item>
  <schmancy-menu-item value="tools">Tools</schmancy-menu-item>
  <schmancy-menu-item value="help">Help</schmancy-menu-item>
</schmancy-menu>
```