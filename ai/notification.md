# Schmancy Notification - AI Reference

```js
// Notification Service API
import { $notification } from 'schmancy';

// Display notification methods
$notification.info(message, options?) -> NotificationRef
$notification.success(message, options?) -> NotificationRef
$notification.warning(message, options?) -> NotificationRef
$notification.error(message, options?) -> NotificationRef

// Custom notification
$notification.show({
  message: string,
  type: 'info'|'success'|'warning'|'error',
  title?: string,
  duration?: number, // milliseconds, default 5000
  closable?: boolean, // default true
  actions?: [{
    label: string,
    onClick: Function
  }],
  position?: 'top-right'|'top-left'|'bottom-right'|'bottom-left'|'top'|'bottom',
  onClose?: Function
}) -> NotificationRef

// NotificationRef object
{
  close(): void,  // Programmatically close the notification
  id: string      // Unique ID of the notification
}

// Notification Container Component
<schmancy-notification-container
  position="top-right|top-left|bottom-right|bottom-left|top|bottom"
  max-count="5">
</schmancy-notification-container>

// Notification Outlet (place notifications in specific locations)
<schmancy-notification-outlet name="custom-location"></schmancy-notification-outlet>
// Use with:
$notification.show({ message: "Alert", outlet: "custom-location" });

// Notification Audio
$notification.setAudio(type, audioUrl) // Configure audio for notification types

// Examples
// Basic usage
$notification.success("Operation completed successfully");

// With options
$notification.error("Failed to save changes", {
  title: "Error",
  duration: 10000,
  closable: true
});

// With actions
$notification.info("New update available", {
  actions: [
    {
      label: "Update Now",
      onClick: () => performUpdate()
    },
    {
      label: "Remind Later",
      onClick: () => scheduleReminder()
    }
  ]
});

// Custom notification
$notification.show({
  type: "info",
  message: "Custom message with HTML content",
  title: "Information",
  duration: 0, // won't auto-close
  position: "bottom",
  actions: [{
    label: "Dismiss",
    onClick: (ref) => ref.close()
  }]
});

// With HTML content (using lit-html)
$notification.info(html`
  <div>
    <strong>Hello</strong>
    <p>This is a notification with <em>HTML</em> content</p>
  </div>
`);
```