# schmancy-json

> Pretty-printed JSON viewer with key highlighting and click-to-copy.

## Usage
```html
<schmancy-json .data=${{ user: 'alice', score: 42 }}></schmancy-json>
```

## Properties
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `data` | object | `{}` | JSON-serialisable data to display |
| `highlightKeys` | string[] | `[]` | Keys whose values are highlighted (warning color, bold) |
| `compact` | boolean | `false` | Disable pretty-printing (single line) |

## Behavior
- Click anywhere on the viewer to copy the full JSON to clipboard (fires `$notify.success`).
- Container uses `surface-container` glass background with hover state.
- Monospace font, 10px size — optimized for dense debug output.
- Values for `highlightKeys` render inside `<span class="text-warning-default font-bold">`.

## Examples
```html
<!-- Debug view with key highlights -->
<schmancy-json
  .data=${this.state}
  .highlightKeys=${['error', 'pending']}
></schmancy-json>

<!-- Compact inline -->
<schmancy-json compact .data=${{ id: 42, status: 'ok' }}></schmancy-json>
```
