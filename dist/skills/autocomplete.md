# schmancy-autocomplete

> Searchable input with fuzzy filtering, single/multi-select, and inline chip display.

## Usage
```html
<schmancy-autocomplete label="Assignee" placeholder="Search...">
  <schmancy-option value="alice" label="Alice"></schmancy-option>
  <schmancy-option value="bob" label="Bob"></schmancy-option>
</schmancy-autocomplete>
```

## Properties
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| value | string | `''` | Selected value (single) or comma-separated (multi) |
| values | string[] | `[]` | Selected values (multi-select) |
| label | string | `''` | Label text |
| placeholder | string | `''` | Placeholder text |
| name | string | `''` | Form submission name |
| required | boolean | `false` | Whether selection is required |
| multi | boolean | `false` | Enable multi-select with inline chips |
| size | `'xs'\|'sm'\|'md'\|'lg'` | `'md'` | Input height |
| maxHeight | string | `'300px'` | Max dropdown height |
| debounceMs | number | `200` | Search debounce in ms |
| similarityThreshold | number | `0.3` | Minimum fuzzy match score (0-1) |
| error | boolean | `false` | Error state |
| validationMessage | string | `''` | Validation message |
| description | string | `''` | Screen reader description |

## Events
| Event | Detail | Description |
|-------|--------|-------------|
| change | `{ value: string \| string[], values?: string[] }` | When selection changes |

## Examples
```html
<!-- Multi-select with chips -->
<schmancy-autocomplete label="Skills" multi placeholder="Type to search...">
  <schmancy-option value="ts" label="TypeScript"></schmancy-option>
  <schmancy-option value="lit" label="Lit"></schmancy-option>
  <schmancy-option value="rxjs" label="RxJS"></schmancy-option>
</schmancy-autocomplete>

<!-- Single select, auto-selects best match on blur -->
<schmancy-autocomplete label="City" placeholder="Search city..."
  @change=${(e) => console.log(e.detail.value)}>
  <schmancy-option value="berlin" label="Berlin"></schmancy-option>
  <schmancy-option value="munich" label="Munich"></schmancy-option>
</schmancy-autocomplete>
```

Children must be `<schmancy-option>` elements. In multi mode, selected items appear as removable chips.
