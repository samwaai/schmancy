# Schmancy Tabs - AI Reference

## Components

### schmancy-tab-group
Container component that manages tab navigation and content display. Supports two modes: "tabs" (traditional tab interface) and "scroll" (scrollspy navigation).

### schmancy-tab
Individual tab component that must be placed inside schmancy-tab-group. Contains the content for each tab.

## API Reference

### schmancy-tab-group

```typescript
// Properties
mode: 'tabs' | 'scroll' = 'tabs' // Navigation mode
rounded: boolean = true // Apply rounded styling to tab navigation
activeTab: string // Currently active tab value

// Events
@tab-changed // Fired when active tab changes, detail contains the active tab value

// Slots
default // Place schmancy-tab components here
```

### schmancy-tab

```typescript
// Properties
label: string // Tab label displayed in navigation
value: string // Unique identifier for the tab
active: boolean // Whether tab is currently active (managed by tab-group)

// Slots
default // Tab content
```

## Usage Examples

### Basic Tabs Mode (Default)
```html
<schmancy-tab-group activeTab="tab1" @tab-changed=${(e) => console.log('Active tab:', e.detail)}>
  <schmancy-tab value="tab1" label="Profile">
    <div class="p-4">
      <h3>Profile Content</h3>
      <p>User profile information goes here.</p>
    </div>
  </schmancy-tab>
  
  <schmancy-tab value="tab2" label="Settings">
    <div class="p-4">
      <h3>Settings Content</h3>
      <p>Application settings go here.</p>
    </div>
  </schmancy-tab>
  
  <schmancy-tab value="tab3" label="Security">
    <div class="p-4">
      <h3>Security Content</h3>
      <p>Security options go here.</p>
    </div>
  </schmancy-tab>
</schmancy-tab-group>
```

### Scroll Mode (Scrollspy)
```html
<!-- Navigation stays sticky at top, highlights active section while scrolling -->
<schmancy-tab-group mode="scroll" activeTab="intro">
  <schmancy-tab value="intro" label="Introduction">
    <section class="min-h-screen p-8">
      <h2>Introduction</h2>
      <p>Long content that requires scrolling...</p>
    </section>
  </schmancy-tab>
  
  <schmancy-tab value="features" label="Features">
    <section class="min-h-screen p-8">
      <h2>Features</h2>
      <p>Feature descriptions...</p>
    </section>
  </schmancy-tab>
  
  <schmancy-tab value="pricing" label="Pricing">
    <section class="min-h-screen p-8">
      <h2>Pricing</h2>
      <p>Pricing information...</p>
    </section>
  </schmancy-tab>
</schmancy-tab-group>
```

### Without Rounded Navigation
```html
<schmancy-tab-group rounded=${false} activeTab="tab1">
  <schmancy-tab value="tab1" label="Tab 1">Content 1</schmancy-tab>
  <schmancy-tab value="tab2" label="Tab 2">Content 2</schmancy-tab>
</schmancy-tab-group>
```

### Programmatic Tab Selection
```javascript
// In component
@query('schmancy-tab-group') tabGroup: any;

selectTab(tabValue: string) {
  this.tabGroup.activeTab = tabValue;
}

handleTabChange(e: CustomEvent) {
  console.log('Tab changed to:', e.detail);
  // Update application state, router, etc.
}

// In template
html`
  <schmancy-tab-group 
    activeTab=${this.currentTab} 
    @tab-changed=${this.handleTabChange}
  >
    <!-- tabs -->
  </schmancy-tab-group>
`
```

### Dynamic Tabs from Data
```javascript
const tabs = [
  { value: 'overview', label: 'Overview', content: 'Overview content...' },
  { value: 'details', label: 'Details', content: 'Detailed information...' },
  { value: 'history', label: 'History', content: 'Historical data...' }
];

html`
  <schmancy-tab-group activeTab=${tabs[0].value}>
    ${tabs.map(tab => html`
      <schmancy-tab value=${tab.value} label=${tab.label}>
        <div class="p-4">${tab.content}</div>
      </schmancy-tab>
    `)}
  </schmancy-tab-group>
`
```

## Important Notes

1. **Tab Structure**: Each schmancy-tab must have a unique `value` and a `label` for display
2. **Active Tab**: The `activeTab` property on tab-group controls which tab is visible
3. **Scroll Mode**: In scroll mode, the navigation becomes sticky and highlights based on scroll position
4. **Event Handling**: Listen to `@tab-changed` event to react to tab changes
5. **Styling**: The tab navigation uses theme colors and can be rounded or rectangular

## Common Patterns

### Tabs with Icons (using label slot)
```html
<schmancy-tab-group activeTab="home">
  <schmancy-tab value="home" label="🏠 Home">
    Home content
  </schmancy-tab>
  <schmancy-tab value="settings" label="⚙️ Settings">
    Settings content
  </schmancy-tab>
</schmancy-tab-group>
```

### Full Page Scroll Navigation
```html
<schmancy-tab-group mode="scroll">
  <schmancy-tab value="section1" label="Section 1">
    <div style="height: 100vh;">Full height section 1</div>
  </schmancy-tab>
  <schmancy-tab value="section2" label="Section 2">
    <div style="height: 100vh;">Full height section 2</div>
  </schmancy-tab>
</schmancy-tab-group>
```

### Integration with Router
```javascript
// React to route changes
connectedCallback() {
  super.connectedCallback();
  // Set active tab based on route
  this.activeTab = this.getTabFromRoute();
}

handleTabChange(e: CustomEvent) {
  // Update route when tab changes
  this.updateRoute(e.detail);
}
```