# Schmancy Date Range Inline - AI Reference

```js
// Import
import '@schmancy/index'  // For all Schmancy components
// Or specific import: import '@schmancy/date-range-inline'

// Date Range Inline Component
<schmancy-date-range-inline
  type="date|datetime-local"                       // Input type (default: "date")
  .dateFrom="${{ label: string, value: string }}"  // Start date config (default: { label: 'From', value: '' })
  .dateTo="${{ label: string, value: string }}"    // End date config (default: { label: 'To', value: '' })
  minDate?="YYYY-MM-DD"                           // Minimum selectable date
  maxDate?="YYYY-MM-DD"                           // Maximum selectable date
  compact?                                        // Compact mode for smaller UI (default: false)
  autoCorrect?                                    // Auto-correct invalid ranges (default: true)
  minGap?="number"                                // Minimum gap between dates in days (default: 0)
  maxGap?="number"                                // Maximum gap between dates in days
  defaultGap?="number"                            // Default gap when auto-setting dates (default: 1)
  allowSameDate?                                  // Allow same date selection (default: false)
  disabled?                                       // Disable the component
  required?                                       // Mark as required field
  @change=${handleChange}>                        // Fires when range changes
</schmancy-date-range-inline>

// Events
@change  // CustomEvent<{ dateFrom: string, dateTo: string, isValid: boolean }>

// Component automatically provides:
// - Smart default dates (today to tomorrow)
// - Auto-correction of invalid ranges
// - Real-time validation
// - Minimum/maximum gap enforcement
```

## Key Features

### Smart Auto-Correction
- Automatically corrects invalid date ranges (e.g., end date before start date)
- Respects minimum and maximum gap constraints
- Provides intelligent defaults when no dates are set

### Validation
- Real-time validation with error messages
- Enforces date range constraints
- Validates against min/max date boundaries

### Flexible Configuration
- Support for both date and datetime-local inputs
- Customizable labels and gap constraints
- Compact mode for space-constrained layouts

## Usage Examples

### Basic Date Range
```html
<schmancy-date-range-inline
  @change=${(e) => {
    console.log('Range:', e.detail.dateFrom, 'to', e.detail.dateTo)
    console.log('Valid:', e.detail.isValid)
  }}>
</schmancy-date-range-inline>
```

### Event Booking
```html
<schmancy-date-range-inline
  .dateFrom="${{ label: 'Check-in', value: '' }}"
  .dateTo="${{ label: 'Check-out', value: '' }}"
  minDate="${new Date().toISOString().split('T')[0]}"  // Today or later
  minGap="1"                                           // At least 1 day stay
  maxGap="30"                                          // Maximum 30 days
  @change=${handleBookingDateChange}>
</schmancy-date-range-inline>
```

### Project Timeline
```html
<schmancy-date-range-inline
  type="datetime-local"
  .dateFrom="${{ label: 'Start Time', value: '' }}"
  .dateTo="${{ label: 'End Time', value: '' }}"
  defaultGap="7"                                       // Default 1 week
  allowSameDate="true"                                 // Allow same day events
  @change=${handleTimelineChange}>
</schmancy-date-range-inline>
```

### Compact Mode
```html
<div class="w-64">
  <schmancy-date-range-inline
    compact
    .dateFrom="${{ label: 'From', value: '2024-01-01' }}"
    .dateTo="${{ label: 'To', value: '2024-01-31' }}">
  </schmancy-date-range-inline>
</div>
```

### Vacation Planner
```html
<schmancy-form @submit=${handleVacationSubmit}>
  <schmancy-input
    label="Destination"
    name="destination"
    required>
  </schmancy-input>

  <schmancy-date-range-inline
    label="Travel Dates"
    .dateFrom="${{ label: 'Departure', value: '' }}"
    .dateTo="${{ label: 'Return', value: '' }}"
    minDate="${new Date().toISOString().split('T')[0]}"
    minGap="2"                                         // Minimum 2-day trip
    maxGap="365"                                       // Maximum 1 year
    required
    @change=${handleTravelDatesChange}>
  </schmancy-date-range-inline>

  <schmancy-button type="submit" variant="filled">
    Plan Vacation
  </schmancy-button>
</schmancy-form>
```

### Custom Validation
```html
<schmancy-date-range-inline
  .dateFrom="${{ label: 'Start', value: '' }}"
  .dateTo="${{ label: 'End', value: '' }}"
  autoCorrect="false"                                  // Disable auto-correction
  @change=${(e) => {
    if (!e.detail.isValid) {
      // Handle validation errors manually
      console.error('Invalid date range selected')
    } else {
      // Process valid range
      updateDateRange(e.detail.dateFrom, e.detail.dateTo)
    }
  }}>
</schmancy-date-range-inline>
```

## Programmatic Control

```typescript
// Get component reference
const dateRange = document.querySelector('schmancy-date-range-inline')

// Set dates programmatically
dateRange.dateFrom = { label: 'Start', value: '2024-06-01' }
dateRange.dateTo = { label: 'End', value: '2024-06-15' }

// Listen for changes
dateRange.addEventListener('change', (e) => {
  const { dateFrom, dateTo, isValid } = e.detail
  if (isValid) {
    // Handle valid date range
    saveBooking(dateFrom, dateTo)
  }
})
```

## Auto-Correction Behavior

When `autoCorrect` is enabled (default), the component will:

1. **Swap dates** if end date is before start date
2. **Enforce minimum gap** by adjusting the end date
3. **Respect maximum gap** by constraining the end date
4. **Apply date boundaries** from minDate/maxDate properties

```html
<!-- Example: User selects end date before start date -->
<schmancy-date-range-inline
  .dateFrom="${{ label: 'From', value: '2024-06-15' }}"
  .dateTo="${{ label: 'To', value: '2024-06-10' }}"
  autoCorrect="true">
  <!-- Component automatically corrects to: From: 2024-06-10, To: 2024-06-15 -->
</schmancy-date-range-inline>
```

## Validation States

The component provides detailed validation information:

```typescript
// Listen for validation changes
dateRange.addEventListener('change', (e) => {
  const { dateFrom, dateTo, isValid } = e.detail

  if (isValid) {
    console.log('✅ Valid range selected')
  } else {
    console.log('❌ Invalid range - check constraints')
  }
})
```

## Integration with Forms

```html
<schmancy-form @submit=${handleSubmit}>
  <schmancy-date-range-inline
    name="dateRange"
    label="Select Date Range"
    required
    .dateFrom="${{ label: 'Start Date', value: this.booking.startDate }}"
    .dateTo="${{ label: 'End Date', value: this.booking.endDate }}"
    @change=${(e) => {
      this.booking = {
        ...this.booking,
        startDate: e.detail.dateFrom,
        endDate: e.detail.dateTo,
        isValidRange: e.detail.isValid
      }
    }}>
  </schmancy-date-range-inline>

  <schmancy-button
    type="submit"
    variant="filled"
    ?disabled=${!this.booking.isValidRange}>
    Submit Booking
  </schmancy-button>
</schmancy-form>
```

## Styling and Theming

The component inherits from `SchmancyFormField` and supports all standard form field theming:

```css
/* Custom styling */
schmancy-date-range-inline {
  --field-border-color: var(--schmancy-sys-color-primary-default);
  --field-focus-color: var(--schmancy-sys-color-secondary-default);
}

/* Compact mode adjustments */
schmancy-date-range-inline[compact] {
  --field-padding: 0.5rem;
  --field-font-size: 0.875rem;
}
```

## Related Components

- **[Date Range](./date-range.md)** - Dropdown-style date range picker
- **[Input](./input.md)** - Base input component for single dates
- **[Form](./form.md)** - Form integration and validation
- **[Calendar](./calendar.md)** - Full calendar view for date selection

## Common Use Cases

1. **Booking Systems** - Hotel, flight, car rental date ranges
2. **Project Management** - Task and milestone date ranges
3. **Event Planning** - Event start and end times
4. **Report Generation** - Date range filtering
5. **Vacation Planning** - Travel date selection
6. **Analytics Dashboards** - Time period selection
7. **Subscription Management** - Billing period configuration