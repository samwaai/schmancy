# schmancy-radio-group

> Radio button group with options array or slotted radio buttons.

## Usage
```html
<!-- With options array -->
<schmancy-radio-group label="Size" name="size"
  .options=${[{label: 'Small', value: 's'}, {label: 'Large', value: 'l'}]}
  @change=${(e) => handle(e.detail.value)}>
</schmancy-radio-group>
```

## Properties (schmancy-radio-group)
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| value | string | `''` | Currently selected value |
| label | string | `''` | Group label |
| name | string | `''` | Form submission name |
| options | `{label: string, value: string}[]` | `[]` | Radio options |
| required | boolean | `false` | Whether selection is required |

## Events
| Event | Detail | Description |
|-------|--------|-------------|
| change | `{ value: string }` | When selection changes |

## Properties (schmancy-radio-button)
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| value | string | `''` | Button value |
| checked | boolean | `false` | Whether selected |
| disabled | boolean | `false` | Whether disabled |
| name | string | `''` | Group name |

## Examples
```html
<!-- With slotted radio buttons -->
<schmancy-radio-group label="Priority" name="priority" value="medium">
  <schmancy-radio-button value="low">
    <span slot="label">Low</span>
  </schmancy-radio-button>
  <schmancy-radio-button value="medium">
    <span slot="label">Medium</span>
  </schmancy-radio-button>
  <schmancy-radio-button value="high">
    <span slot="label">High</span>
  </schmancy-radio-button>
</schmancy-radio-group>
```
