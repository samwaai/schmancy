# Schmancy List - AI Reference

```js
// Basic List
<schmancy-list>
  <schmancy-list-item>Item 1</schmancy-list-item>
  <schmancy-list-item>Item 2</schmancy-list-item>
  <schmancy-list-item>Item 3</schmancy-list-item>
</schmancy-list>

// List Options
<schmancy-list
  size="small|medium|large"
  dividers?                // Show dividers between items
  interactive?             // Enable hover and focus states
  dense?                   // More compact appearance
  @select=${handleSelect}>
  <!-- List items -->
</schmancy-list>

// List Item Options
<schmancy-list-item
  value="item-value"       // Value for selection
  disabled?                // Disabled state
  selected?                // Selected state
  compact?                 // Compact appearance
  clickable?               // Makes item clickable (implied if interactive list)
  @click=${handleClick}>
  
  <!-- Content structure -->
  <div slot="leading">
    <schmancy-icon icon="home"></schmancy-icon>
  </div>
  
  <div slot="main">
    <div>Primary Text</div>
    <div>Secondary Text</div>
  </div>
  
  <div slot="trailing">
    <schmancy-badge>42</schmancy-badge>
  </div>
</schmancy-list-item>

// List Events
@select // Fires when item is selected, with { detail: { value, item } }
@action // Fires when action is triggered, with { detail: { action, value, item } }

// List Context
// For creating controlled lists and handling selection
import { ListContext } from '@schmancy/index';
// Or specific import: import { ListContext } from '@schmancy/list';

const listContext = new ListContext({
  selectable: true,           // Enable selection
  multiple: false,            // Allow multiple selection
  selected: [],               // Initial selected values
  onSelect: handleSelect      // Selection handler
});

// Examples
// Simple navigation list
<schmancy-list interactive>
  <schmancy-list-item>
    <schmancy-icon slot="leading" icon="home"></schmancy-icon>
    Dashboard
  </schmancy-list-item>
  <schmancy-list-item>
    <schmancy-icon slot="leading" icon="settings"></schmancy-icon>
    Settings
  </schmancy-list-item>
  <schmancy-list-item>
    <schmancy-icon slot="leading" icon="person"></schmancy-icon>
    Profile
  </schmancy-list-item>
</schmancy-list>

// Selectable list
<schmancy-list 
  interactive 
  @select=${(e) => console.log('Selected:', e.detail.value)}>
  
  <schmancy-list-item value="item1">
    <div slot="main">
      <div>Item One</div>
      <div>Description for item one</div>
    </div>
  </schmancy-list-item>
  
  <schmancy-list-item value="item2">
    <div slot="main">
      <div>Item Two</div>
      <div>Description for item two</div>
    </div>
    <div slot="trailing">
      <schmancy-badge>New</schmancy-badge>
    </div>
  </schmancy-list-item>
  
  <schmancy-list-item value="item3" disabled>
    <div slot="main">
      <div>Item Three (Disabled)</div>
      <div>Cannot be selected</div>
    </div>
  </schmancy-list-item>
</schmancy-list>

// Dynamic list from data
<schmancy-list>
  ${items.map(item => html`
    <schmancy-list-item value=${item.id}>
      ${item.icon ? html`
        <schmancy-icon slot="leading" icon=${item.icon}></schmancy-icon>
      ` : ''}
      
      <div slot="main">
        <div>${item.primary}</div>
        ${item.secondary ? html`<div>${item.secondary}</div>` : ''}
      </div>
      
      ${item.badge ? html`
        <div slot="trailing">
          <schmancy-badge>${item.badge}</schmancy-badge>
        </div>
      ` : ''}
    </schmancy-list-item>
  `)}
</schmancy-list>

// List with context (controlled selection)
const selectedItems = ['item2'];

<schmancy-list .context=${new ListContext({
  selectable: true,
  multiple: true,
  selected: selectedItems,
  onSelect: (values) => {
    selectedItems = values;
    console.log('Selected items:', values);
  }
})}>
  <schmancy-list-item value="item1">Item 1</schmancy-list-item>
  <schmancy-list-item value="item2">Item 2</schmancy-list-item>
  <schmancy-list-item value="item3">Item 3</schmancy-list-item>
</schmancy-list>
```