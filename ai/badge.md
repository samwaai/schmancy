# Schmancy Badge - AI Reference

```js
// Basic Badge
<schmancy-badge>
  42
</schmancy-badge>

// Badge with variants
<schmancy-badge
  variant="primary|secondary|success|warning|danger|info"
  size="small|medium|large"
  shape="square|pill|circle">
  New
</schmancy-badge>

// Badge with icon
<schmancy-badge variant="warning">
  <schmancy-icon icon="warning"></schmancy-icon>
  Caution
</schmancy-badge>

// Dot badge
<schmancy-badge dot variant="danger"></schmancy-badge>

// Badge on other elements
<div style="position: relative;">
  <schmancy-icon icon="notifications"></schmancy-icon>
  <schmancy-badge
    position="top-right"
    value="5">
  </schmancy-badge>
</div>

// Badge Properties
variant: string       // Visual style: "primary", "secondary", "success", "warning", "danger", "info"
size: string          // Size: "small", "medium", "large"
shape: string         // Shape: "square", "pill", "circle"
dot: boolean          // Show as a dot instead of with content
position: string      // Positioning: "top-right", "top-left", "bottom-right", "bottom-left"
value: string|number  // Value to display (alternative to slot content)
max: number           // Maximum value to display before showing "+"
invisible: boolean    // Hide the badge while maintaining layout

// Examples
// Simple numeric badge
<schmancy-badge>10</schmancy-badge>

// Styled text badge
<schmancy-badge variant="success" shape="pill">
  Completed
</schmancy-badge>

// Status badges
<div>
  <schmancy-badge variant="success">Active</schmancy-badge>
  <schmancy-badge variant="warning">Pending</schmancy-badge>
  <schmancy-badge variant="danger">Failed</schmancy-badge>
  <schmancy-badge variant="info">Draft</schmancy-badge>
</div>

// Badge on a button
<schmancy-button>
  Notifications
  <schmancy-badge
    position="top-right"
    variant="danger"
    value="99+">
  </schmancy-badge>
</schmancy-button>

// Badge with maximum value
<schmancy-badge
  value="125"
  max="99">
</schmancy-badge>
// Shows "99+"

// Dot indicators for status
<div style="display: flex; align-items: center; gap: 8px;">
  <schmancy-badge dot variant="success"></schmancy-badge>
  <span>Online</span>
</div>

<div style="display: flex; align-items: center; gap: 8px;">
  <schmancy-badge dot variant="warning"></schmancy-badge>
  <span>Away</span>
</div>

<div style="display: flex; align-items: center; gap: 8px;">
  <schmancy-badge dot variant="danger"></schmancy-badge>
  <span>Offline</span>
</div>

// Badge with dynamic content
<schmancy-badge
  variant=${status === 'active' ? 'success' : 'warning'}
  value=${count}>
</schmancy-badge>
```