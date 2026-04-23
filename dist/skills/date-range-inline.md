# schmancy-date-range-inline

> Smart inline from/to date picker with validation, auto-correction, and gap constraints. Simpler surface than the full `schmancy-date-range` popover.

## Usage
```html
<schmancy-date-range-inline
  .dateFrom=${{ label: 'Check-in', value: '2026-05-01' }}
  .dateTo=${{ label: 'Check-out', value: '2026-05-05' }}
  min-date="2026-01-01"
  max-date="2026-12-31"
  .minGap=${1}
  .maxGap=${30}
  @change=${e => this.handleRange(e.detail)}
></schmancy-date-range-inline>
```

## Properties
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `type` | `'date' \| 'datetime-local'` | `'date'` | Underlying input type |
| `dateFrom` | `{ label, value }` | `{ label: 'From', value: '' }` | From-date configuration |
| `dateTo` | `{ label, value }` | `{ label: 'To', value: '' }` | To-date configuration |
| `minDate` | string | — | Minimum selectable date (ISO string) |
| `maxDate` | string | — | Maximum selectable date (ISO string) |
| `compact` | boolean | `false` | Tighter UI spacing |
| `autoCorrect` | boolean | `true` | Auto-fix invalid ranges (e.g. swap if from > to) |
| `minGap` | number | `0` | Minimum days between from and to |
| `maxGap` | number | — | Maximum days between from and to |
| `defaultGap` | number | `1` | Default gap when seeding the second date |
| `allowSameDate` | boolean | `false` | Permit from === to |

## Events
| Event | Detail | When |
|-------|--------|------|
| `change` | `{ dateFrom, dateTo, isValid }` | Either input changes |

## Behavior
- Extends `SchmancyFormField()` — integrates with `schmancy-form` validation.
- Auto-correction: invalid ranges flip, or the second date shifts to respect `minGap`/`maxGap`.
- Inline (not a popover) — always visible, good for filters and trip-planning UIs.

## Prefer full picker
For a popup calendar with presets and visual selection, use [`schmancy-date-range`](./date-range.md).
