# Schmancy Notification - AI Reference

## Core Notification Service

```js
import { $notify } from '@schmancy/index'
// Or specific import: import { $notify } from '@schmancy/notification'

// Display notification methods
$notify.info(message?, options?) -> string    // Returns notification ID
$notify.success(message?, options?) -> string
$notify.warning(message?, options?) -> string
$notify.error(message?, options?) -> string

// Custom notification
$notify.show({
  message: string,
  type?: 'info'|'success'|'warning'|'error',
  title?: string,
  duration?: number,      // milliseconds, default 1000
  closable?: boolean,     // default true
  playSound?: boolean,    // default true
  showProgress?: boolean, // show progress bar
  id?: string            // custom ID
}) -> string

// Dismiss notifications
$notify.dismiss(id?)     // Dismisses specific notification or latest if no ID

// Update notification content
$notify.update(id, options)  // Update existing notification

// Persistent notification
$notify.persistent(message, options)  // Won't auto-dismiss (duration: 0)

// Custom duration
$notify.customDuration(message, duration, options)
```

## API Integration with notify()

The `notify()` operator wraps observables with automatic notification lifecycle management.

```js
import { notify } from '@schmancy/index'
// Or specific import: import { notify } from '@schmancy/notification'

// Basic usage - minimal configuration
someApiCall().pipe(
  notify({
    loadingMessage: 'Loading data...',
    successMessage: 'Data loaded!',
    errorMessage: 'Failed to load'
  })
).subscribe()

// With custom durations
saveData().pipe(
  notify({
    loadingMessage: 'Saving...',
    successMessage: 'Saved!',
    successDuration: 5000,  // Success stays 5 seconds
    errorMessage: 'Save failed',
    errorDuration: 0        // Error is persistent
  })
).subscribe()

// Full configuration
uploadFile().pipe(
  notify({
    // Loading state
    loadingMessage: 'Uploading file...',
    loadingType: 'info',
    
    // Success state
    successMessage: 'Upload complete!',
    successType: 'success',
    successDuration: 3000,
    
    // Error state
    errorMessage: (err) => `Upload failed: ${err.message}`,
    errorType: 'error',
    errorDuration: 10000,
    
    // Options
    autoDismissLoading: true
  })
).subscribe()

// With progress tracking
// Automatically detects { progress: number } or { loaded, total } in emissions
fileUpload().pipe(
  notify({
    loadingMessage: 'Uploading...',  // Updates to "Uploading... (50%)"
    successMessage: 'Upload complete!',
    errorMessage: 'Upload failed'
  })
).subscribe()
```

### notify() Options

| Option | Type | Description |
|--------|------|-------------|
| `loadingMessage` | string | Message during loading |
| `loadingType` | NotificationType | Type for loading notification |
| `successMessage` | string | Message on success |
| `successType` | NotificationType | Type for success notification |
| `successDuration` | number | Duration for success (ms, 0 = persistent) |
| `errorMessage` | string \| (err) => string | Message on error |
| `errorType` | NotificationType | Type for error notification |
| `errorDuration` | number | Duration for error (ms, 0 = persistent) |
| `autoDismissLoading` | boolean | Auto-dismiss loading on complete |

## Components

### Notification Container

```html
<schmancy-notification-container
  position="top-right|top-left|bottom-right|bottom-left|top-center|bottom-center"
  max-visible-notifications="2"
  play-sound="true|false"
  audio-volume="0.1">
</schmancy-notification-container>
```

### Individual Notification (used internally)

```html
<schmancy-notification
  title="Title"
  message="Message text"
  type="info|success|warning|error"
  duration="5000"
  closable="true"
  play-sound="true"
  show-progress="false"
  @close>
</schmancy-notification>
```

## Examples

```js
// Basic notifications
$notify.success("Operation completed")
$notify.error("Failed to save", { duration: 5000 })
$notify.info() // Just icon, no message

// Persistent notification
const id = $notify.persistent("Processing...")
// Later: $notify.dismiss(id)

// API with loading state
fetchData().pipe(
  notify({
    loadingMessage: 'Fetching...',
    successMessage: 'Data loaded!',
    errorMessage: 'Failed'
  })
).subscribe()

// File upload with progress
upload(file).pipe(
  notify({
    loadingMessage: 'Uploading file...',
    successMessage: 'Upload complete!',
    successDuration: 3000,
    errorMessage: (err) => `Upload failed: ${err.message}`,
    errorDuration: 0  // Persistent error
  })
).subscribe()
```

## Setup

Add the notification container once in your app layout:

```html
<schmancy-notification-container
  position="top-right"
  max-visible-notifications="3"
  play-sound="true">
</schmancy-notification-container>
```

## Progress Indication

- Notifications automatically show a progress bar when `duration > 0` (countdown)
- When using `notify()` operator, shows indeterminate progress during loading
- Detects progress in observable emissions:
  - `{ progress: 50 }` - Shows "Loading... (50%)"
  - `{ loaded: 500, total: 1000 }` - Shows "Loading... (50%)"