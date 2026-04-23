# schmancy-steps-container / schmancy-step

> Vertical stepper with collapsible steps, completion state, and navigation.

## Usage
```html
<schmancy-steps-container currentStep="1" @change=${(e) => handleStep(e.detail.value)}>
  <schmancy-step position="1" title="Account" description="Create your account">
    <schmancy-input label="Email" required></schmancy-input>
  </schmancy-step>
  <schmancy-step position="2" title="Profile" description="Set up profile">
    <schmancy-input label="Name" required></schmancy-input>
  </schmancy-step>
</schmancy-steps-container>
```

## Properties (schmancy-steps-container)
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| currentStep | number | `1` | Currently active step (1-based) |
| gap | number | `4` | Gap between steps (Tailwind scale) |

## Properties (schmancy-step)
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| position | number | `1` | Step position (1-based) |
| title | string | `''` | Step title |
| description | string | `''` | Step description |
| completed | boolean | `false` | Explicitly mark as complete |
| lockBack | boolean | `false` | Prevent navigating to previous steps |

## Events (schmancy-steps-container)
| Event | Detail | Description |
|-------|--------|-------------|
| change | `{ value: number }` | When current step changes |

## Examples
```html
<!-- With locked steps -->
<schmancy-steps-container currentStep="2">
  <schmancy-step position="1" title="Step 1" completed lockBack>
    <!-- Already completed, cannot go back -->
  </schmancy-step>
  <schmancy-step position="2" title="Step 2">
    <p>Current step content</p>
  </schmancy-step>
  <schmancy-step position="3" title="Step 3">
    <!-- Not yet reachable -->
  </schmancy-step>
</schmancy-steps-container>
```

Only the active step renders its slotted content. Completed steps show a checkmark. Active step expands with `flex: 1`.
