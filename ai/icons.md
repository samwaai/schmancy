# Schmancy Icons - AI Reference

```js
// Basic Icon
<schmancy-icon
  icon="icon-name"
  size="small|medium|large|x-large"
  color="primary|secondary|success|warning|danger|info|currentColor">
</schmancy-icon>

// Icon with custom size
<schmancy-icon
  icon="home"
  size="24px">
</schmancy-icon>

// Icon with custom color
<schmancy-icon
  icon="star"
  color="#f5a623">
</schmancy-icon>

// Icon Properties
icon: string         // Icon name to display
size: string         // Size: "small" (16px), "medium" (24px), "large" (32px), "x-large" (48px), or custom size
color: string        // Color: semantic colors, CSS color values, or "currentColor"
rotate: number       // Rotation in degrees
flip: string         // Flip transformation: "horizontal", "vertical", "both"
spin: boolean        // Apply a spinning animation
clickable: boolean   // Make icon clickable with hover effects

// Icon Events
@click   // Fires when icon is clicked

// Available Icons
// The library includes a comprehensive set of icons. Some common ones:
// - UI Actions: "add", "remove", "edit", "delete", "search", "close", "check", "menu"
// - Navigation: "home", "back", "forward", "up", "down", "download", "upload"
// - Communication: "mail", "chat", "phone", "notification", "share"
// - Media: "play", "pause", "stop", "volume", "camera", "image"
// - Objects: "file", "folder", "document", "calendar", "clock", "location"
// - Social: "user", "group", "like", "star", "settings"
// - Alerts: "info", "warning", "error", "success"
// - Arrows: "arrow-up", "arrow-right", "arrow-down", "arrow-left"
// - Chevrons: "chevron-up", "chevron-right", "chevron-down", "chevron-left"

// Examples
// Basic icon usage
<schmancy-icon icon="home"></schmancy-icon>

// Icons with different sizes
<div>
  <schmancy-icon icon="star" size="small"></schmancy-icon>
  <schmancy-icon icon="star" size="medium"></schmancy-icon>
  <schmancy-icon icon="star" size="large"></schmancy-icon>
  <schmancy-icon icon="star" size="x-large"></schmancy-icon>
  <schmancy-icon icon="star" size="64px"></schmancy-icon>
</div>

// Icons with different colors
<div>
  <schmancy-icon icon="info" color="info"></schmancy-icon>
  <schmancy-icon icon="check" color="success"></schmancy-icon>
  <schmancy-icon icon="warning" color="warning"></schmancy-icon>
  <schmancy-icon icon="error" color="danger"></schmancy-icon>
  <schmancy-icon icon="help" color="primary"></schmancy-icon>
  <schmancy-icon icon="settings" color="secondary"></schmancy-icon>
  <schmancy-icon icon="star" color="#f5a623"></schmancy-icon>
</div>

// Icon in a button
<schmancy-button>
  <schmancy-icon slot="prefix" icon="download"></schmancy-icon>
  Download
</schmancy-button>

<schmancy-icon-button icon="edit"></schmancy-icon-button>

// Icon with rotation and flip
<div>
  <schmancy-icon icon="arrow-right" rotate="45"></schmancy-icon>
  <schmancy-icon icon="arrow-right" rotate="90"></schmancy-icon>
  <schmancy-icon icon="arrow-right" rotate="180"></schmancy-icon>
  <schmancy-icon icon="arrow-right" rotate="270"></schmancy-icon>
  <schmancy-icon icon="arrow-right" flip="horizontal"></schmancy-icon>
  <schmancy-icon icon="arrow-right" flip="vertical"></schmancy-icon>
</div>

// Spinning icon
<schmancy-icon icon="refresh" spin></schmancy-icon>

// Loading state with icon
<div>
  <schmancy-icon icon="refresh" spin></schmancy-icon>
  <span>Loading...</span>
</div>

// Icon in form fields
<schmancy-input>
  <schmancy-icon slot="prefix" icon="search"></schmancy-icon>
</schmancy-input>

<schmancy-input type="password">
  <schmancy-icon 
    slot="suffix" 
    icon=${passwordVisible ? "eye-off" : "eye"}
    clickable
    @click=${togglePasswordVisibility}>
  </schmancy-icon>
</schmancy-input>

// Navigation menu with icons
<schmancy-list interactive>
  <schmancy-list-item>
    <schmancy-icon slot="start" icon="home"></schmancy-icon>
    Home
  </schmancy-list-item>
  <schmancy-list-item>
    <schmancy-icon slot="start" icon="user"></schmancy-icon>
    Profile
  </schmancy-list-item>
  <schmancy-list-item>
    <schmancy-icon slot="start" icon="settings"></schmancy-icon>
    Settings
  </schmancy-list-item>
  <schmancy-list-item>
    <schmancy-icon slot="start" icon="help"></schmancy-icon>
    Help
  </schmancy-list-item>
</schmancy-list>

// Status indicators with icons
<div>
  <div style="display: flex; align-items: center; gap: 8px;">
    <schmancy-icon icon="check-circle" color="success"></schmancy-icon>
    <span>Completed</span>
  </div>
  <div style="display: flex; align-items: center; gap: 8px;">
    <schmancy-icon icon="clock" color="warning"></schmancy-icon>
    <span>Pending</span>
  </div>
  <div style="display: flex; align-items: center; gap: 8px;">
    <schmancy-icon icon="x-circle" color="danger"></schmancy-icon>
    <span>Failed</span>
  </div>
</div>
```