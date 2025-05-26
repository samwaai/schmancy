# Date Range Component

A sophisticated date range selector that supports both date and datetime selection with presets, manual input, and intelligent range navigation.

## Quick Start

```html
<!-- Basic date range selector -->
<schmancy-date-range 
  .dateFrom="${{ label: 'Start', value: '2024-01-01' }}"
  .dateTo="${{ label: 'End', value: '2024-12-31' }}"
></schmancy-date-range>

<!-- DateTime selector with custom presets -->
<schmancy-date-range 
  type="datetime-local"
  .customPresets="${[
    { label: 'Last Sprint', dateFrom: '2024-01-01', dateTo: '2024-01-14' }
  ]}"
></schmancy-date-range>
```

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `type` | `'date' \| 'datetime-local'` | `'date'` | Date input type |
| `dateFrom` | `{ label: string, value: string }` | `{ label: 'From', value: '' }` | Start date configuration |
| `dateTo` | `{ label: string, value: string }` | `{ label: 'To', value: '' }` | End date configuration |
| `minDate` | `string` | - | Minimum selectable date |
| `maxDate` | `string` | - | Maximum selectable date |
| `customPresets` | `Array<{ label, dateFrom, dateTo }>` | `[]` | Custom preset ranges |
| `format` | `string` | - | Date format (defaults based on type) |
| `disabled` | `boolean` | `false` | Disable the component |
| `required` | `boolean` | `false` | Mark as required field |
| `placeholder` | `string` | `'Select date range'` | Placeholder text |
| `clearable` | `boolean` | `true` | Show clear button |

## Events

### change
Fired when date range changes.

```typescript
interface DateRangeChangeEvent {
  detail: {
    dateFrom: string;
    dateTo: string;
  }
}
```

## Examples

### With Form Integration
```html
<schmancy-form>
  <schmancy-date-range
    name="project-timeline"
    required
    .dateFrom="${{ label: 'Project Start', value: '' }}"
    .dateTo="${{ label: 'Project End', value: '' }}"
    @change="${(e) => console.log('Timeline:', e.detail)}"
  ></schmancy-date-range>
</schmancy-form>
```

### Analytics Dashboard
```html
<!-- Date range for analytics with custom presets -->
<schmancy-date-range
  .customPresets="${[
    { label: 'Holiday Season', dateFrom: '2023-11-24', dateTo: '2024-01-02' },
    { label: 'Q4 2023', dateFrom: '2023-10-01', dateTo: '2023-12-31' }
  ]}"
  @change="${updateAnalytics}"
></schmancy-date-range>
```

### DateTime Range for Events
```html
<schmancy-date-range
  type="datetime-local"
  .dateFrom="${{ label: 'Event Start', value: '2024-03-15T09:00' }}"
  .dateTo="${{ label: 'Event End', value: '2024-03-15T17:00' }}"
  minDate="2024-01-01T00:00"
></schmancy-date-range>
```

## Features

### Built-in Presets
The component includes intelligent preset categories:
- **Days**: Today, Yesterday, Last 7/30/90 Days
- **Weeks**: This Week, Last Week
- **Months**: This Month, Last Month
- **Quarters**: This Quarter, Last Quarter
- **Years**: This Year, Last Year, Year to Date
- **Hours** (datetime-local): Last 12/24 Hours

### Smart Navigation
- Arrow buttons shift ranges intelligently based on duration
- Maintains full period boundaries (weeks, months, quarters)
- Automatically detects and preserves preset selections

### Responsive Dropdown
- Floating UI positioning with automatic adjustments
- Categorized preset display
- Manual date inputs with validation

## Styling

The component uses semantic color tokens and supports theming:

```css
schmancy-date-range {
  --animation-duration: 200ms;
  --dropdown-min-width: 16rem;
  --dropdown-max-width: 24rem;
}
```

## Accessibility

- Full keyboard navigation support
- ARIA labels and roles
- Focus management
- Screen reader announcements

## Related Components

- [Input](./input.md) - For single date inputs
- [Form](./form.md) - Form integration
- [Button](./button.md) - Used for triggers and actions
- [Surface](./surface.md) - Dropdown container

## Best Practices

1. **Validation**: Always validate date ranges on the backend
2. **Timezones**: Consider timezone handling for datetime-local inputs
3. **Presets**: Add domain-specific presets for better UX
4. **Loading States**: Show loading indicators when fetching data based on range changes