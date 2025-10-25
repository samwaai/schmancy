# Schmancy Tree - AI Reference

```js
// Basic Tree
<schmancy-tree>
  <schmancy-tree-item label="Root">
    <schmancy-tree-item label="Child 1"></schmancy-tree-item>
    <schmancy-tree-item label="Child 2">
      <schmancy-tree-item label="Grandchild 1"></schmancy-tree-item>
      <schmancy-tree-item label="Grandchild 2"></schmancy-tree-item>
    </schmancy-tree-item>
    <schmancy-tree-item label="Child 3"></schmancy-tree-item>
  </schmancy-tree-item>
</schmancy-tree>

// Tree with selection
<schmancy-tree
  selectable
  @select=${handleSelection}>
  <!-- Tree items -->
</schmancy-tree>

// Tree with custom items
<schmancy-tree>
  <schmancy-tree-item value="item1">
    <div slot="label">
      <schmancy-icon icon="folder"></schmancy-icon>
      <span>Documents</span>
    </div>
    
    <schmancy-tree-item value="item1.1">
      <div slot="label">
        <schmancy-icon icon="file-text"></schmancy-icon>
        <span>Report.pdf</span>
      </div>
    </schmancy-tree-item>
    
    <schmancy-tree-item value="item1.2">
      <div slot="label">
        <schmancy-icon icon="file-text"></schmancy-icon>
        <span>Presentation.pptx</span>
      </div>
    </schmancy-tree-item>
  </schmancy-tree-item>
</schmancy-tree>

// Tree Properties
selectable: boolean       // Enable item selection
multiselect: boolean      // Allow multiple selections
expandOnSelect: boolean   // Expand items when selected
compact: boolean          // Reduce padding and spacing
indentSize: number        // Indentation size in pixels (default: 20)
expandedItems: string[]   // Initially expanded items (by value)
selectedItems: string[]   // Initially selected items (by value)

// Tree Item Properties
label: string             // Text label for the item
value: string             // Value for selection/identification
expanded: boolean         // Whether the item is expanded
selected: boolean         // Whether the item is selected
disabled: boolean         // Disable the item
icon: string              // Icon to display (if using default rendering)
loading: boolean          // Show loading indicator
checkable: boolean        // Show checkbox for selection
childrenCount: number     // Number of children (for lazy loading)

// Tree Events
@select   // Fires when selection changes, with { detail: { selected } }
@expand   // Fires when item expands, with { detail: { value, expanded } }
@collapse // Fires when item collapses, with { detail: { value, expanded } }
@toggle   // Fires when item expands/collapses, with { detail: { value, expanded } }

// Tree Methods
tree.expandAll() -> void            // Expand all items
tree.collapseAll() -> void          // Collapse all items
tree.getSelectedItems() -> string[] // Get selected item values
tree.selectItem(value) -> void      // Select an item
tree.deselectItem(value) -> void    // Deselect an item
tree.expandItem(value) -> void      // Expand an item
tree.collapseItem(value) -> void    // Collapse an item

// Examples
// File explorer tree
<schmancy-tree
  selectable
  expandOnSelect
  @select=${(e) => handleFileSelection(e.detail.selected)}>
  
  <schmancy-tree-item value="documents" expanded>
    <div slot="label">
      <schmancy-icon icon="folder"></schmancy-icon>
      <span>Documents</span>
    </div>
    
    <schmancy-tree-item value="documents/reports">
      <div slot="label">
        <schmancy-icon icon="folder"></schmancy-icon>
        <span>Reports</span>
      </div>
      
      <schmancy-tree-item value="documents/reports/q1.pdf">
        <div slot="label">
          <schmancy-icon icon="file-text"></schmancy-icon>
          <span>Q1 Report.pdf</span>
        </div>
      </schmancy-tree-item>
      
      <schmancy-tree-item value="documents/reports/q2.pdf">
        <div slot="label">
          <schmancy-icon icon="file-text"></schmancy-icon>
          <span>Q2 Report.pdf</span>
        </div>
      </schmancy-tree-item>
    </schmancy-tree-item>
    
    <schmancy-tree-item value="documents/presentations">
      <div slot="label">
        <schmancy-icon icon="folder"></schmancy-icon>
        <span>Presentations</span>
      </div>
      
      <schmancy-tree-item value="documents/presentations/product.pptx">
        <div slot="label">
          <schmancy-icon icon="file-presentation"></schmancy-icon>
          <span>Product Roadmap.pptx</span>
        </div>
      </schmancy-tree-item>
    </schmancy-tree-item>
  </schmancy-tree-item>
  
  <schmancy-tree-item value="images">
    <div slot="label">
      <schmancy-icon icon="folder"></schmancy-icon>
      <span>Images</span>
    </div>
    
    <schmancy-tree-item value="images/logo.png">
      <div slot="label">
        <schmancy-icon icon="image"></schmancy-icon>
        <span>Logo.png</span>
      </div>
    </schmancy-tree-item>
    
    <schmancy-tree-item value="images/banner.jpg">
      <div slot="label">
        <schmancy-icon icon="image"></schmancy-icon>
        <span>Banner.jpg</span>
      </div>
    </schmancy-tree-item>
  </schmancy-tree-item>
</schmancy-tree>

// Organization tree with checkboxes
<schmancy-tree
  selectable
  multiselect
  @select=${(e) => updateSelectedDepartments(e.detail.selected)}>
  
  <schmancy-tree-item value="company" checkable expanded>
    <div slot="label">
      <strong>Acme Inc.</strong>
    </div>
    
    <schmancy-tree-item value="engineering" checkable>
      <div slot="label">Engineering</div>
      
      <schmancy-tree-item value="frontend" checkable>
        <div slot="label">Frontend</div>
      </schmancy-tree-item>
      
      <schmancy-tree-item value="backend" checkable>
        <div slot="label">Backend</div>
      </schmancy-tree-item>
      
      <schmancy-tree-item value="qa" checkable>
        <div slot="label">QA</div>
      </schmancy-tree-item>
    </schmancy-tree-item>
    
    <schmancy-tree-item value="design" checkable>
      <div slot="label">Design</div>
      
      <schmancy-tree-item value="ux" checkable>
        <div slot="label">UX</div>
      </schmancy-tree-item>
      
      <schmancy-tree-item value="ui" checkable>
        <div slot="label">UI</div>
      </schmancy-tree-item>
    </schmancy-tree-item>
    
    <schmancy-tree-item value="marketing" checkable>
      <div slot="label">Marketing</div>
    </schmancy-tree-item>
    
    <schmancy-tree-item value="sales" checkable>
      <div slot="label">Sales</div>
    </schmancy-tree-item>
  </schmancy-tree-item>
</schmancy-tree>

// Dynamic tree from data
<schmancy-tree
  selectable
  .expandedItems=${expandedItems}
  .selectedItems=${selectedItems}
  @select=${handleSelection}
  @toggle=${handleToggle}>
  
  ${renderTree(treeData)}
</schmancy-tree>

// Helper function to render tree recursively
function renderTree(items) {
  return items.map(item => html`
    <schmancy-tree-item
      value=${item.id}
      label=${item.label}
      ?expanded=${expandedItems.includes(item.id)}
      ?selected=${selectedItems.includes(item.id)}
      ?disabled=${item.disabled}
      ?loading=${item.loading}>
      
      ${item.children ? renderTree(item.children) : ''}
    </schmancy-tree-item>
  `);
}

// Lazy loading tree
<schmancy-tree @toggle=${handleToggle}>
  <schmancy-tree-item
    value="root"
    label="Root Folder"
    expanded
    childrenCount=${3}>
    
    ${loadedChildren.root ? loadedChildren.root.map(child => html`
      <schmancy-tree-item
        value=${child.id}
        label=${child.name}
        childrenCount=${child.hasChildren ? 1 : 0}
        ?loading=${loadingItems.includes(child.id)}>
        
        ${loadedChildren[child.id] ? loadedChildren[child.id].map(grandchild => html`
          <schmancy-tree-item
            value=${grandchild.id}
            label=${grandchild.name}
            childrenCount=${grandchild.hasChildren ? 1 : 0}>
          </schmancy-tree-item>
        `) : ''}
      </schmancy-tree-item>
    `) : html`
      <schmancy-tree-item loading>Loading...</schmancy-tree-item>
    `}
  </schmancy-tree-item>
</schmancy-tree>

// Handling toggle for lazy loading
async function handleToggle(e) {
  const { value, expanded } = e.detail;
  
  if (expanded && !loadedChildren[value]) {
    // Mark item as loading
    loadingItems = [...loadingItems, value];
    
    // Load children
    const children = await fetchChildren(value);
    
    // Update loaded children
    loadedChildren = {
      ...loadedChildren,
      [value]: children
    };
    
    // Remove from loading items
    loadingItems = loadingItems.filter(id => id !== value);
  }
}
```