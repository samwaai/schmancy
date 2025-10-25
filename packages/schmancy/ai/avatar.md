# Schmancy Avatar - AI Reference

```js
// Basic Avatar
<schmancy-avatar
  src="path/to/image.jpg"
  alt="User Name"
  size="x-small|small|medium|large|x-large">
</schmancy-avatar>

// Avatar with name initials
<schmancy-avatar
  name="John Doe"
  size="medium">
</schmancy-avatar>

// Avatar with icon
<schmancy-avatar
  icon="user"
  size="medium">
</schmancy-avatar>

// Avatar with custom size and color
<schmancy-avatar
  name="John Doe"
  size="48px"
  background-color="#6200ee"
  color="white">
</schmancy-avatar>

// Avatar with shape
<schmancy-avatar
  src="path/to/image.jpg"
  shape="circle|square|rounded">
</schmancy-avatar>

// Avatar Properties
src: string             // Image URL
alt: string             // Alt text for the image
name: string            // Name for generating initials
icon: string            // Icon name to display (if no src or name)
size: string            // Size: "x-small" (24px), "small" (32px), "medium" (40px), "large" (48px), "x-large" (56px), or custom size
shape: string           // Shape: "circle" (default), "square", "rounded"
backgroundColor: string // Background color for name and icon avatars
color: string           // Text/icon color
bordered: boolean       // Show border
badgeContent: string    // Content for the badge
badgeColor: string      // Color for the badge
fallback: string        // Fallback content if image fails to load
clickable: boolean      // Make avatar clickable with hover effect

// Avatar Events
@click              // Fires when avatar is clicked
@error              // Fires when image fails to load

// Examples
// Basic image avatar
<schmancy-avatar
  src="https://example.com/avatar.jpg"
  alt="Jane Smith"
  size="medium">
</schmancy-avatar>

// Name initials avatar
<schmancy-avatar
  name="John Doe"
  size="large">
</schmancy-avatar>

// Icon avatar
<schmancy-avatar
  icon="user"
  size="medium"
  background-color="var(--color-primary)"
  color="white">
</schmancy-avatar>

// Avatar with badge
<schmancy-avatar
  src="https://example.com/avatar.jpg"
  badge-content="3"
  badge-color="error">
</schmancy-avatar>

// Avatar with status indicator
<div style="position: relative;">
  <schmancy-avatar
    name="Jane Smith"
    size="large">
  </schmancy-avatar>
  
  <schmancy-badge
    dot
    variant="success"
    style="position: absolute; bottom: 0; right: 0; border: 2px solid white;">
  </schmancy-badge>
</div>

// Avatar group
<div style="display: flex;">
  <schmancy-avatar
    src="https://example.com/avatar1.jpg"
    size="medium"
    style="margin-right: -8px; border: 2px solid white;">
  </schmancy-avatar>
  
  <schmancy-avatar
    src="https://example.com/avatar2.jpg"
    size="medium"
    style="margin-right: -8px; border: 2px solid white;">
  </schmancy-avatar>
  
  <schmancy-avatar
    src="https://example.com/avatar3.jpg"
    size="medium"
    style="margin-right: -8px; border: 2px solid white;">
  </schmancy-avatar>
  
  <schmancy-avatar
    name="+5"
    size="medium"
    background-color="#e0e0e0"
    color="#757575"
    style="border: 2px solid white;">
  </schmancy-avatar>
</div>

// Clickable avatar for profile
<schmancy-avatar
  src="https://example.com/avatar.jpg"
  size="large"
  clickable
  @click=${openProfile}>
</schmancy-avatar>

// Avatar with fallback
<schmancy-avatar
  src="https://example.com/avatar.jpg"
  name="John Doe"
  fallback="JD"
  @error=${handleImageError}>
</schmancy-avatar>

// Square avatar
<schmancy-avatar
  src="https://example.com/avatar.jpg"
  shape="square"
  size="large">
</schmancy-avatar>

// Avatar in a list item
<schmancy-list-item>
  <schmancy-avatar
    slot="start"
    src="https://example.com/avatar.jpg"
    size="medium">
  </schmancy-avatar>
  
  <div slot="main">
    <div>John Doe</div>
    <div>Software Engineer</div>
  </div>
</schmancy-list-item>

// Avatar in a chat message
<div style="display: flex; margin-bottom: 16px;">
  <schmancy-avatar
    src="https://example.com/avatar.jpg"
    size="small"
    style="margin-right: 8px;">
  </schmancy-avatar>
  
  <div>
    <div><strong>Jane Smith</strong> <span style="color: #757575;">12:34 PM</span></div>
    <div>Hello! How are you doing today?</div>
  </div>
</div>
```