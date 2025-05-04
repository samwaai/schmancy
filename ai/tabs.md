# Schmancy Tabs - AI Reference

```js
// Basic Tabs
<schmancy-tabs value="tab1">
  <schmancy-tab value="tab1" label="Tab 1"></schmancy-tab>
  <schmancy-tab value="tab2" label="Tab 2"></schmancy-tab>
  <schmancy-tab value="tab3" label="Tab 3"></schmancy-tab>
  
  <div slot="panel" data-tab="tab1">Content for Tab 1</div>
  <div slot="panel" data-tab="tab2">Content for Tab 2</div>
  <div slot="panel" data-tab="tab3">Content for Tab 3</div>
</schmancy-tabs>

// Tabs with Scrolling
<schmancy-tabs value="tab1" scrollable>
  <!-- Tab definitions -->
</schmancy-tabs>

// Tabs Groups (for complex tab structures)
<schmancy-tabs-group value="tab1" @change=${handleTabChange}>
  <schmancy-tab value="tab1" label="Tab 1"></schmancy-tab>
  <schmancy-tab value="tab2" label="Tab 2"></schmancy-tab>
  <schmancy-tab value="tab3" label="Tab 3"></schmancy-tab>
  
  <div data-tab="tab1">Content for Tab 1</div>
  <div data-tab="tab2">Content for Tab 2</div>
  <div data-tab="tab3">Content for Tab 3</div>
</schmancy-tabs-group>

// Tabs with Icons
<schmancy-tabs value="tab1">
  <schmancy-tab value="tab1">
    <schmancy-icon icon="home"></schmancy-icon>
    <span>Home</span>
  </schmancy-tab>
  <schmancy-tab value="tab2">
    <schmancy-icon icon="settings"></schmancy-icon>
    <span>Settings</span>
  </schmancy-tab>
</schmancy-tabs>

// Tab Attributes
value="tab-id" // Unique identifier for the tab
label="Tab Label" // Text label (optional if using custom content)
disabled? // Disabled state
icon="icon-name" // Icon to display (alternative to using schmancy-icon in content)

// Tab Methods and Events
tabs.select(value) -> void // Programmatically select a tab
@change // Fires when tab selection changes with { detail: { value } }

// Examples
// Basic usage
<schmancy-tabs value="tab1" @change=${(e) => console.log('Selected tab:', e.detail.value)}>
  <schmancy-tab value="tab1" label="Info"></schmancy-tab>
  <schmancy-tab value="tab2" label="Settings"></schmancy-tab>
  
  <div slot="panel" data-tab="tab1">Information content here</div>
  <div slot="panel" data-tab="tab2">Settings content here</div>
</schmancy-tabs>

// Dynamic tabs from data
${tabData.map(tab => html`
  <schmancy-tab value=${tab.id} label=${tab.label}></schmancy-tab>
`)}

${tabData.map(tab => html`
  <div slot="panel" data-tab=${tab.id}>${tab.content}</div>
`)}
```