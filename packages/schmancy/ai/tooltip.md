# Schmancy Tooltip - AI Reference

```js
// Basic Tooltip
<schmancy-tooltip text="Tooltip text">
  <schmancy-button>Hover me</schmancy-button>
</schmancy-tooltip>

// Tooltip with position
<schmancy-tooltip
  text="Tooltip content"
  position="top|right|bottom|left|top-start|top-end|right-start|right-end|bottom-start|bottom-end|left-start|left-end">
  <div>Hover over this element</div>
</schmancy-tooltip>

// Tooltip with custom content
<schmancy-tooltip>
  <schmancy-button>Hover me</schmancy-button>
  
  <div slot="content">
    <h4>Custom Tooltip</h4>
    <p>This is a tooltip with custom HTML content.</p>
  </div>
</schmancy-tooltip>

// Tooltip with delay and offset
<schmancy-tooltip
  text="Delayed tooltip"
  show-delay="500"
  hide-delay="200"
  offset="10">
  <span>Hover for delayed tooltip</span>
</schmancy-tooltip>

// Tooltip directive (alternative usage)
<schmancy-button
  ${tooltip('Button tooltip', { 
    position: 'top',
    showDelay: 300
  })}>
  Hover me
</schmancy-button>

// Tooltip Properties
text: string           // Text content of the tooltip
position: string       // Position relative to target: "top", "right", "bottom", "left" and variations
showDelay: number      // Delay before showing tooltip (milliseconds)
hideDelay: number      // Delay before hiding tooltip (milliseconds)
offset: number         // Distance between tooltip and target (pixels)
maxWidth: string       // Maximum width of the tooltip
interactive: boolean   // Allow interaction with tooltip content
disabled: boolean      // Disable the tooltip
always-visible: boolean // Keep tooltip visible (for testing)

// Tooltip Events
@show    // Fires when tooltip is shown
@hide    // Fires when tooltip is hidden

// Tooltip Directive Options
tooltip(text, {
  position: string,    // Position relative to target
  showDelay: number,   // Delay before showing tooltip (milliseconds)
  hideDelay: number,   // Delay before hiding tooltip (milliseconds)
  offset: number,      // Distance between tooltip and target (pixels)
  maxWidth: string,    // Maximum width of the tooltip
  interactive: boolean // Allow interaction with tooltip content
})

// Examples
// Basic usage
<schmancy-tooltip text="Delete this item">
  <schmancy-icon-button
    icon="delete"
    variant="danger">
  </schmancy-icon-button>
</schmancy-tooltip>

// Tooltip with rich content
<schmancy-tooltip position="right">
  <schmancy-icon-button icon="info"></schmancy-icon-button>
  
  <div slot="content">
    <h4>Information</h4>
    <p>This feature allows you to:</p>
    <ul>
      <li>Create new records</li>
      <li>Edit existing data</li>
      <li>Export as CSV</li>
    </ul>
  </div>
</schmancy-tooltip>

// Interactive tooltip
<schmancy-tooltip 
  position="bottom"
  interactive>
  <span>Settings</span>
  
  <div slot="content">
    <h4>Quick Settings</h4>
    <schmancy-checkbox label="Enable notifications"></schmancy-checkbox>
    <schmancy-checkbox label="Dark mode"></schmancy-checkbox>
    <schmancy-button size="small">Apply</schmancy-button>
  </div>
</schmancy-tooltip>

// Using tooltip directive
<div>
  <schmancy-button ${tooltip('Save changes')}>
    Save
  </schmancy-button>
  
  <schmancy-button ${tooltip('Discard all changes', { position: 'bottom' })}>
    Cancel
  </schmancy-button>
  
  <schmancy-icon-button 
    icon="help"
    ${tooltip('Need help?', { position: 'right', showDelay: 500 })}>
  </schmancy-icon-button>
</div>

// Tooltip on disabled elements
<schmancy-tooltip text="You don't have permission to edit">
  <span>
    <schmancy-button disabled>
      Edit
    </schmancy-button>
  </span>
</schmancy-tooltip>

// Tooltip for form fields
<div>
  <schmancy-input 
    label="Username"
    ${tooltip('Enter your username or email address')}>
  </schmancy-input>
  
  <schmancy-input 
    label="Password"
    type="password">
    <schmancy-icon 
      slot="suffix" 
      icon="info"
      ${tooltip('Password must be at least 8 characters')}>
    </schmancy-icon>
  </schmancy-input>
</div>
```