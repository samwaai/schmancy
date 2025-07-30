# Schmancy Badge - AI Reference

```js
// Basic Badge
<sch-badge>
  42
</sch-badge>

// Badge with color variants
<sch-badge
  color="primary|secondary|tertiary|success|warning|error|neutral"
  size="xs|sm|md|lg"
  shape="square|rounded|pill">
  New
</sch-badge>

// Badge with icon slot
<sch-badge color="warning">
  <schmancy-icon slot="icon" icon="warning"></schmancy-icon>
  Caution
</sch-badge>

// Badge with icon property
<sch-badge color="success" icon="check">
  Complete
</sch-badge>

// Outlined badge
<sch-badge color="primary" outlined>
  Outlined
</sch-badge>

// Pulsing badge
<sch-badge color="error" pulse>
  Alert
</sch-badge>

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
<sch-badge>10</sch-badge>

// Styled text badge
<sch-badge color="success" shape="pill">
  Completed
</sch-badge>

// Status badges
<div>
  <sch-badge color="success">Active</sch-badge>
  <sch-badge color="warning">Pending</sch-badge>
  <sch-badge color="error">Failed</sch-badge>
  <sch-badge color="primary">Draft</sch-badge>
</div>

// Badge sizes
<sch-badge size="xs">XS</sch-badge>
<sch-badge size="sm">Small</sch-badge>
<sch-badge size="md">Medium</sch-badge>
<sch-badge size="lg">Large</sch-badge>

// Badge shapes
<sch-badge shape="square">Square</sch-badge>
<sch-badge shape="rounded">Rounded</sch-badge>
<sch-badge shape="pill">Pill</sch-badge>

// Outlined badges
<sch-badge color="primary" outlined>Primary</sch-badge>
<sch-badge color="secondary" outlined>Secondary</sch-badge>
<sch-badge color="error" outlined>Error</sch-badge>

// Badge with icon
<sch-badge color="success" icon="check_circle">
  Verified
</sch-badge>

// Badge with custom icon slot
<sch-badge color="warning">
  <schmancy-icon slot="icon" icon="warning"></schmancy-icon>
  Warning
</sch-badge>

// Pulsing badges for attention
<sch-badge color="error" pulse>
  New
</sch-badge>

// Badge with dynamic properties
<sch-badge
  color=${status === 'active' ? 'success' : 'neutral'}
  outlined=${isOutlined}
  pulse=${needsAttention}>
  ${statusText}
</sch-badge>
```