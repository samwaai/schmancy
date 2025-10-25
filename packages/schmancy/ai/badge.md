# Schmancy Badge - AI Reference

```js
// Basic Badge
<schmancy-badge>
  42
</schmancy-badge>

// Also supports <schmancy-badge> for backward compatibility

// Badge with color variants
<schmancy-badge
  color="primary|secondary|tertiary|success|warning|error|neutral"
  size="xs|sm|md|lg"
  shape="square|rounded|pill">
  New
</schmancy-badge>

// Badge with icon slot
<schmancy-badge color="warning">
  <schmancy-icon slot="icon" icon="warning"></schmancy-icon>
  Caution
</schmancy-badge>

// Badge with icon property
<schmancy-badge color="success" icon="check">
  Complete
</schmancy-badge>

// Outlined badge
<schmancy-badge color="primary" outlined>
  Outlined
</schmancy-badge>

// Pulsing badge
<schmancy-badge color="error" pulse>
  Alert
</schmancy-badge>

// Badge Properties
color: BadgeColor     // Color variant: "primary", "secondary", "tertiary", "success", "warning", "error", "neutral"
size: BadgeSize       // Size: "xs", "sm", "md", "lg"
shape: BadgeShape     // Shape: "square", "rounded", "pill"
outlined: boolean     // Outlined style instead of filled
icon: string          // Icon name to display (if no icon slot is provided)
pulse: boolean        // Make the badge pulse for attention

// Slots
default: Badge content (text or HTML)
icon: Optional icon to display before the content

// Examples
// Simple numeric badge
<schmancy-badge>10</schmancy-badge>

// Styled text badge
<schmancy-badge color="success" shape="pill">
  Completed
</schmancy-badge>

// Status badges
<div>
  <schmancy-badge color="success">Active</schmancy-badge>
  <schmancy-badge color="warning">Pending</schmancy-badge>
  <schmancy-badge color="error">Failed</schmancy-badge>
  <schmancy-badge color="primary">Draft</schmancy-badge>
</div>

// Badge sizes
<schmancy-badge size="xs">XS</schmancy-badge>
<schmancy-badge size="sm">Small</schmancy-badge>
<schmancy-badge size="md">Medium</schmancy-badge>
<schmancy-badge size="lg">Large</schmancy-badge>

// Badge shapes
<schmancy-badge shape="square">Square</schmancy-badge>
<schmancy-badge shape="rounded">Rounded</schmancy-badge>
<schmancy-badge shape="pill">Pill</schmancy-badge>

// Outlined badges
<schmancy-badge color="primary" outlined>Primary</schmancy-badge>
<schmancy-badge color="secondary" outlined>Secondary</schmancy-badge>
<schmancy-badge color="error" outlined>Error</schmancy-badge>

// Badge with icon
<schmancy-badge color="success" icon="check_circle">
  Verified
</schmancy-badge>

// Badge with custom icon slot
<schmancy-badge color="warning">
  <schmancy-icon slot="icon" icon="warning"></schmancy-icon>
  Warning
</schmancy-badge>

// Pulsing badges for attention
<schmancy-badge color="error" pulse>
  New
</schmancy-badge>

// Badge with dynamic properties
<schmancy-badge
  color=${status === 'active' ? 'success' : 'neutral'}
  outlined=${isOutlined}
  pulse=${needsAttention}>
  ${statusText}
</schmancy-badge>
```