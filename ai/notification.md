# Schmancy Notification - AI Reference

```js
// Notification Service API
import { $notification } from '@mhmo91/schmancy';

// Display notification methods
$notification.info(message?, options?) -> string    // Returns notification ID
$notification.success(message?, options?) -> string
$notification.warning(message?, options?) -> string
$notification.error(message?, options?) -> string

// Custom notification
$notification.notify({
  message: string,
  type?: 'info'|'success'|'warning'|'error',
  title?: string,
  duration?: number,      // milliseconds, default 1000 (1 second)
  closable?: boolean,     // default true
  playSound?: boolean,    // default true
  id?: string            // custom ID
}) -> string             // Returns notification ID

// Notification Container Component
<sch-notification-container
  position="top-right|top-left|bottom-right|bottom-left|top-center|bottom-center"
  max-visible-notifications="2"     // Max number shown at once (default: 2)
  play-sound="true|false"          // Enable/disable sounds (default: false)
  audio-volume="0.1">               // Volume level 0-1 (default: 0.1)
</sch-notification-container>

// Individual Notification Component (used internally)
<sch-notification
  title="Title"
  message="Message text"
  type="info|success|warning|error"
  duration="5000"                   // Auto-close after ms (0 = no auto-close)
  closable="true"
  play-sound="true"
  @close>                          // Fired when notification closes
</sch-notification>

// Examples
// Basic usage
$notification.success("Operation completed successfully");

// Without message (just icon)
$notification.success();

// With options
$notification.error("Failed to save changes", {
  title: "Error",
  duration: 10000,
  closable: true
});

// Custom notification
$notification.notify({
  type: "info",
  message: "Custom message",
  title: "Information",
  duration: 0, // won't auto-close
  playSound: false
});

// Programmatic control
const notificationId = $notification.info("Processing...", { duration: 0 });
// Later, to remove it:
const container = document.querySelector('sch-notification-container');
container.removeNotification(notificationId);

// Setup notification container
// Add this once in your app layout:
<sch-notification-container 
  position="top-right"
  max-visible-notifications="3"
  play-sound="true">
</sch-notification-container>
```