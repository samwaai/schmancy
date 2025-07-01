# Schmancy Date Range - AI Reference

```js
// Component Tag
<schmancy-date-range
  type="date|datetime-local"                            // Input type (default: "date")
  .dateFrom="${{ label: string, value: string }}"      // Start date config (default: { label: 'From', value: '' })
  .dateTo="${{ label: string, value: string }}"        // End date config (default: { label: 'To', value: '' })
  minDate?="string"                                     // Minimum selectable date
  maxDate?="string"                                     // Maximum selectable date
  .customPresets?="${Array<Preset>}"                    // Custom preset ranges
  format?="string"                                      // Date format (auto-detected by type)
  disabled?                                             // Disable the component
  required?                                             // Mark as required field
  placeholder?="string"                                 // Placeholder text (default: "Select date range")
  clearable?                                            // Show clear button (default: true)
  @change=${handler}>                                   // Fires when range changes
</schmancy-date-range>

// Import
import '@mhmo91/schmancy/date-range'

// Types
interface Preset {
  label: string
  dateFrom: string
  dateTo: string
}

interface DateRangeChangeEvent {
  detail: {
    dateFrom: string
    dateTo: string
  }
}

// Examples
// 1. Basic date range
<schmancy-date-range 
  .dateFrom="${{ label: 'Start', value: '2024-01-01' }}"
  .dateTo="${{ label: 'End', value: '2024-12-31' }}"
  @change="${(e) => console.log(e.detail)}"
></schmancy-date-range>

// 2. DateTime range with constraints
<schmancy-date-range
  type="datetime-local"
  .dateFrom="${{ label: 'Event Start', value: '2024-03-15T09:00' }}"
  .dateTo="${{ label: 'Event End', value: '2024-03-15T17:00' }}"
  minDate="2024-01-01T00:00"
  maxDate="2024-12-31T23:59"
></schmancy-date-range>

// 3. With custom presets
<schmancy-date-range 
  .customPresets="${[
    { label: 'Last Sprint', dateFrom: '2024-01-01', dateTo: '2024-01-14' },
    { label: 'Current Sprint', dateFrom: '2024-01-15', dateTo: '2024-01-28' },
    { label: 'Holiday Season', dateFrom: '2023-11-24', dateTo: '2024-01-02' }
  ]}"
  @change="${updateAnalytics}"
></schmancy-date-range>

// 4. Form integration
<schmancy-form @submit="${handleSubmit}">
  <schmancy-date-range
    name="project-timeline"
    required
    .dateFrom="${{ label: 'Project Start', value: '' }}"
    .dateTo="${{ label: 'Project End', value: '' }}"
  ></schmancy-date-range>
  <schmancy-button type="submit" variant="filled">Submit</schmancy-button>
</schmancy-form>

// 5. Booking system example
<schmancy-date-range
  .dateFrom="${{ label: 'Check-in', value: '' }}"
  .dateTo="${{ label: 'Check-out', value: '' }}"
  minDate="${new Date().toISOString().split('T')[0]}"
  required
  placeholder="Select your travel dates"
></schmancy-date-range>

// 6. Analytics dashboard with navigation
<schmancy-date-range
  .dateFrom="${{ label: 'Period Start', value: startDate }}"
  .dateTo="${{ label: 'Period End', value: endDate }}"
  @change="${(e) => updateDashboard(e.detail)}"
></schmancy-date-range>
```

## Related Components
- **[Input](./input.md)**: Base input component for single date selection
- **[Dialog](./dialog.md)**: Used internally for date picker modal
- **[Button](./button.md)**: Navigation and action buttons
- **[Surface](./surface.md)**: Container for dropdown interface
- **[Form](./form.md)**: Form integration and validation
- **[Icon](./icon.md)**: Navigation arrows and UI elements

## Technical Details

### Built-in Preset Categories
The component includes intelligent presets organized by time period:

**Days**: Today, Yesterday, Last 7/14/30/60/90 Days
**Weeks**: This Week, Last Week, Last 2/4 Weeks  
**Months**: This Month, Last Month, Last 3/6 Months
**Quarters**: This Quarter, Last Quarter, Last 2/4 Quarters
**Years**: This Year, Last Year, Year to Date
**Hours** (datetime-local only): Last 12/24 Hours

### Smart Navigation Features
- Arrow buttons intelligently shift ranges based on detected period type
- Preserves full period boundaries (weeks start on Monday, months on 1st)
- Automatically detects and maintains preset selections
- Keyboard shortcuts for power users

### Keyboard Shortcuts
- `PageUp`: Navigate to previous date range
- `PageDown`: Navigate to next date range
- `Ctrl+Home`: Jump to start of current month
- `Ctrl+End`: Jump to end of current month
- `Escape`: Close date picker dialog

### Dialog Integration
Uses `$dialog.component()` service to display picker in modal. Automatically finds nearest `schmancy-theme` component for proper theming context.

### Date Validation
- Ensures dateFrom is before dateTo
- Respects min/max date constraints
- Handles invalid input gracefully
- Validates format based on type

### Performance Optimizations
- Memoized preset calculations
- Efficient RxJS event handling
- Minimal re-renders through reactive state
- Lazy-loaded dialog content

## Common Use Cases

1. **Analytics Dashboard**
   ```html
   <schmancy-date-range
     .customPresets="${analyticsPresets}"
     @change="${refreshDashboard}"
   ></schmancy-date-range>
   ```

2. **Booking/Reservation System**
   ```html
   <schmancy-date-range
     .dateFrom="${{ label: 'Check-in', value: '' }}"
     .dateTo="${{ label: 'Check-out', value: '' }}"
     minDate="${today}"
     required
   ></schmancy-date-range>
   ```

3. **Report Generation**
   ```html
   <schmancy-date-range
     type="datetime-local"
     .dateFrom="${{ label: 'Report Start', value: lastMonth }}"
     .dateTo="${{ label: 'Report End', value: today }}"
     @change="${generateReport}"
   ></schmancy-date-range>
   ```

4. **Event Scheduling**
   ```html
   <schmancy-date-range
     type="datetime-local"
     placeholder="Select event duration"
     required
     @change="${updateEventSchedule}"
   ></schmancy-date-range>
   ```