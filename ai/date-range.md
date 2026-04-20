# schmancy-date-range

> Date range selector with preset ranges, step navigation, and mobile sheet support.

## Usage
```html
<schmancy-date-range
  .dateFrom=${{label: 'From', value: '2024-01-01'}}
  .dateTo=${{label: 'To', value: '2024-12-31'}}
  @change=${(e) => handleRange(e.detail)}>
</schmancy-date-range>
```

## Properties
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| type | `'date'\|'datetime-local'` | `'date'` | Date input type |
| dateFrom | `{label: string, value: string}` | `{label:'From',value:''}` | Start date |
| dateTo | `{label: string, value: string}` | `{label:'To',value:''}` | End date |
| minDate | string | `undefined` | Minimum selectable date |
| maxDate | string | `undefined` | Maximum selectable date |
| step | `'day'\|'week'\|'month'\|'year'\|number` | `undefined` | Navigation step size |
| placeholder | string | `'Select date range'` | Display placeholder |
| disabled | boolean | `false` | Whether disabled |
| required | boolean | `false` | Whether required |
| clearable | boolean | `true` | Allow clearing selection |
| collapse | boolean | `false` | Icon-only on mobile |
| customPresets | array | `[]` | Additional preset ranges |
| format | string | auto | Date format string |

## Events
| Event | Detail | Description |
|-------|--------|-------------|
| change | `{ dateFrom: string, dateTo: string }` | When date range changes |

## Examples
```html
<!-- With step navigation (arrows shift by week) -->
<schmancy-date-range step="week"
  .dateFrom=${{label:'From', value:'2024-03-01'}}
  .dateTo=${{label:'To', value:'2024-03-07'}}>
</schmancy-date-range>

<!-- Collapsed on mobile, custom presets -->
<schmancy-date-range collapse
  .customPresets=${[{label:'Q1',dateFrom:'2024-01-01',dateTo:'2024-03-31'}]}>
</schmancy-date-range>
```

Built-in presets include Today, Yesterday, This Week, This Month, This Year, and more.
