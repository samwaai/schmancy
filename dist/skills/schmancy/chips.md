# Chips

> Four chip types: filter (toggleable), input (removable), suggestion (action), assist (action + elevated). Filter chips have embedded `magnetic` directive and selection glow.

## Chip Types

| Element | Purpose | Selected state | Default elevated |
|---------|---------|---------------|-----------------|
| `schmancy-filter-chip` | Toggle filters on/off | Yes (persists) | No |
| `schmancy-input-chip` | Display user input, removable | No | No |
| `schmancy-suggestion-chip` | Contextual recommendations | No | No |
| `schmancy-assist-chip` | Prompt user actions | No | Yes |

## Properties (schmancy-filter-chip)
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `value` | `string` | `''` | Unique identifier |
| `selected` | `boolean` | `false` | Toggle state |
| `removable` | `boolean` | `false` | Show remove button |
| `disabled` | `boolean` | `false` | Disabled state |
| `elevated` | `boolean` | `false` | Add shadow elevation |

## Properties (schmancy-input-chip)
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `value` | `string` | `''` | Unique identifier |
| `icon` | `string` | `''` | Material icon name |
| `avatar` | `string` | `''` | Avatar image URL |
| `removable` | `boolean` | `true` | Show remove button |
| `disabled` | `boolean` | `false` | Disabled state |

## Properties (schmancy-suggestion-chip / schmancy-assist-chip)
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `value` | `string` | `''` | Unique identifier |
| `icon` | `string` | `''` | Material icon name |
| `href` | `string` | `''` | Navigation URL |
| `target` | `string` | `''` | Link target |
| `disabled` | `boolean` | `false` | Disabled state |
| `elevated` | `boolean` | `false` (suggestion) / `true` (assist) | Shadow elevation |

## Events
| Event | Chip types | Detail | Description |
|-------|-----------|--------|-------------|
| `change` | filter | `{ value, selected }` | Selection toggled |
| `remove` | filter, input | `{ value }` | Remove button clicked |
| `action` | suggestion, assist | `{ value }` | Chip clicked |

## Physics
- **magnetic** directive on filter chips (strength: 2, radius: 40)
- Filter selected: secondary glow shadow (20% intensity)
- Hover: luminous glow shadow (primary, 15%)
- Active: spring press `scale(0.95)` with 100ms transition

## Examples
```html
<!-- Filter chips for categories -->
${repeat(categories, c => c.id, c => html`
  <schmancy-filter-chip
    value=${c.id}
    ?selected=${selectedIds.has(c.id)}
    @change=${(e: CustomEvent) => this.toggleFilter(e.detail)}
  >
    ${c.name}
  </schmancy-filter-chip>
`)}

<!-- Input chips for tags -->
${repeat(tags, t => t, t => html`
  <schmancy-input-chip
    value=${t}
    @remove=${(e: CustomEvent) => this.removeTag(e.detail.value)}
  >
    ${t}
  </schmancy-input-chip>
`)}

<!-- Suggestion chips -->
<schmancy-suggestion-chip value="nearby" icon="location_on">
  Nearby
</schmancy-suggestion-chip>

<!-- Assist chip with navigation -->
<schmancy-assist-chip value="calendar" icon="event" href="/calendar">
  Open Calendar
</schmancy-assist-chip>
```
