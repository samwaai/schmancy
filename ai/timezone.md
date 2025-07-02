# Schmancy Timezone Select - AI Reference

## Quick Start

```typescript
import '@mhmo91/schmancy/extra/timezone'
```

## Component Overview

A timezone selection component with autocomplete functionality, providing a comprehensive list of global timezones with UTC offsets and region information.

## API

```typescript
// Timezone Select Component
<schmancy-select-timezones
  value?="string"                    // Selected timezone ID
  label?="string"                    // Label text (default: "Timezone")
  hint?="string"                     // Helper text (default: "Please select a timezone")
  placeholder?="string"              // Placeholder (default: "Select a timezone")
  name?="string"                     // Form field name
  required?="boolean"                // Required field
  @change=${handleChange}>           // Selection change event
</schmancy-select-timezones>

// Component Properties
value: string         // Timezone identifier (e.g., "America/New_York")
label: string        // Field label
hint: string         // Helper text below field
placeholder: string  // Placeholder text
name: string         // Form field name
required: boolean    // Required validation

// Events
@change  // Fires when timezone selection changes

// Methods
checkValidity() -> boolean      // Validate selection
reportValidity() -> boolean     // Report validation state
setCustomValidity(message) -> void  // Set custom error
```

## Examples

### Basic Usage

```typescript
// Simple timezone selector
<schmancy-select-timezones 
  @change=${(e) => console.log('Selected:', e.detail.value)}>
</schmancy-select-timezones>

// With initial value
<schmancy-select-timezones 
  value="America/New_York"
  @change=${handleTimezoneChange}>
</schmancy-select-timezones>

// Required field
<schmancy-select-timezones 
  required
  name="timezone"
  label="Your Timezone"
  hint="Used for scheduling">
</schmancy-select-timezones>
```

### Form Integration

```typescript
// User preferences form
<schmancy-form @submit=${handleSavePreferences}>
  <schmancy-select-timezones 
    name="timezone" 
    value=${this.userTimezone}
    required>
  </schmancy-select-timezones>
  
  <schmancy-select-countries 
    name="country" 
    value=${this.userCountry}>
  </schmancy-select-countries>
  
  <schmancy-button type="submit" variant="filled">
    Save Preferences
  </schmancy-button>
</schmancy-form>
```

### Real-World Examples

```typescript
// Meeting scheduler with timezone
class MeetingScheduler extends LitElement {
  @state() selectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  @state() meetingTime = '';
  
  render() {
    return html`
      <schmancy-surface class="p-6">
        <schmancy-typography type="headline" token="sm" class="mb-4 block">
          Schedule Meeting
        </schmancy-typography>
        
        <schmancy-form @submit=${this.scheduleMeeting}>
          <div class="space-y-4">
            <schmancy-input 
              type="datetime-local"
              label="Meeting Time"
              name="time"
              required
              @change=${(e) => this.meetingTime = e.detail.value}>
            </schmancy-input>
            
            <schmancy-select-timezones 
              name="timezone"
              value=${this.selectedTimezone}
              @change=${this.handleTimezoneChange}>
            </schmancy-select-timezones>
            
            <div class="bg-surface-container p-3 rounded">
              <schmancy-typography type="body" token="sm">
                ${this.getLocalTimeDisplay()}
              </schmancy-typography>
            </div>
          </div>
          
          <schmancy-button type="submit" variant="filled" class="mt-4">
            Schedule
          </schmancy-button>
        </schmancy-form>
      </schmancy-surface>
    `
  }
  
  getLocalTimeDisplay() {
    if (!this.meetingTime || !this.selectedTimezone) return '';
    // Convert to different timezones for display
    const date = new Date(this.meetingTime);
    return `Local time: ${date.toLocaleString('en-US', { 
      timeZone: this.selectedTimezone 
    })}`;
  }
}

// User profile with auto-detection
class UserProfile extends LitElement {
  @state() detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  
  connectedCallback() {
    super.connectedCallback();
    // Auto-detect user's timezone
    this.requestUpdate();
  }
  
  render() {
    return html`
      <div class="space-y-4">
        <schmancy-typography type="body" token="sm" class="text-surface-onVariant">
          Detected timezone: ${this.detectedTimezone}
        </schmancy-typography>
        
        <schmancy-select-timezones 
          value=${this.detectedTimezone}
          label="Confirm your timezone"
          hint="We'll use this for notifications and scheduling"
          @change=${this.updateTimezone}>
        </schmancy-select-timezones>
        
        <schmancy-button 
          variant="filled" 
          @click=${this.saveProfile}>
          Save Profile
        </schmancy-button>
      </div>
    `
  }
}
```

## Timezone Data Structure

Each timezone in the dataset includes:

```typescript
interface Timezone {
  text: string;   // Display text with offset (e.g., "(UTC-05:00) Eastern Time")
  value: string;  // Timezone ID (e.g., "America/New_York")
  offset: string; // UTC offset (e.g., "-05:00")
  abbr: string;   // Abbreviation (e.g., "EST")
}

// Example:
{
  text: "(UTC-05:00) Eastern Time (US & Canada)",
  value: "America/New_York",
  offset: "-05:00",
  abbr: "EST"
}
```

## Features

- **Comprehensive List**: All global timezones with regions
- **UTC Offsets**: Visual offset display for easy identification
- **Search**: Filter by timezone name, city, or offset
- **Auto-detection**: Can detect user's current timezone
- **Daylight Saving**: Handles DST automatically
- **Form Integration**: Works with native forms
- **Grouped Display**: Timezones grouped by offset

## Common Use Cases

1. **User Preferences**: Setting user's default timezone
2. **Event Scheduling**: Selecting timezone for meetings/events
3. **Notifications**: Configuring notification delivery times
4. **Reports**: Setting timezone for data analysis
5. **International Apps**: Multi-timezone support

## Accessibility

- Proper ARIA labels and roles
- Keyboard navigation support
- Screen reader friendly
- High contrast mode support
- Clear visual indicators

## Best Practices

1. **Auto-Detection**: Pre-select user's detected timezone
2. **Display Format**: Show both offset and name
3. **Validation**: Use required for mandatory fields
4. **Updates**: Handle timezone database updates
5. **DST Handling**: Account for daylight saving changes

## Common Pitfalls

- **ID vs Display**: Value is timezone ID, not display text
- **DST Changes**: Offsets may vary with daylight saving
- **Browser Support**: Intl API availability varies
- **Historical Data**: Past dates may have different offsets

## Related Components

- **[Autocomplete](./autocomplete.md)**: Base component
- **[Countries](./countries.md)**: Often used together
- **[Form](./form.md)**: Form integration
- **[Date Range](./date-range.md)**: Date/time selection

## TypeScript Interface

```typescript
interface SchmancySelectTimezonesElement extends HTMLElement {
  value: string;
  label: string;
  hint: string;
  placeholder: string;
  name: string;
  required: boolean;
  checkValidity(): boolean;
  reportValidity(): boolean;
  setCustomValidity(message: string): void;
}

// Change event
interface TimezoneChangeEvent extends CustomEvent {
  detail: {
    value: string;  // Timezone ID
  };
}

// Utility functions
const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
```