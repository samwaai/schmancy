# Schmancy Surface - AI Reference

```js
// Basic Surface
<schmancy-surface
  elevation="0|1|2|3|4|5"
  rounded="none|sm|md|lg|xl|full"
  padding="none|xs|sm|md|lg|xl">
  Surface content goes here
</schmancy-surface>

// Surface with color
<schmancy-surface
  color="primary|secondary|tertiary|surface|background|error"
  theme="light|dark">
  Colored surface content
</schmancy-surface>

// Interactive surface
<schmancy-surface
  interactive
  @click=${handleClick}>
  Click me!
</schmancy-surface>

// Surface with border
<schmancy-surface
  bordered
  border-color="primary|secondary|tertiary|divider|error"
  border-width="thin|medium|thick"
  border-style="solid|dashed|dotted">
  Surface with border
</schmancy-surface>

// Surface with dimensions
<schmancy-surface
  width="300px"
  height="200px"
  min-width="200px"
  max-width="500px"
  min-height="100px"
  max-height="300px">
  Fixed size surface
</schmancy-surface>

// Surface Properties
elevation: number|string  // Shadow elevation (0-5)
rounded: string           // Border radius: "none", "sm", "md", "lg", "xl", "full"
padding: string           // Padding: "none", "xs", "sm", "md", "lg", "xl"
margin: string            // Margin: "none", "xs", "sm", "md", "lg", "xl"
color: string             // Background color (theme color or CSS value)
theme: string             // Theme: "light", "dark"
interactive: boolean      // Enable hover and active states
bordered: boolean         // Show border
borderColor: string       // Border color
borderWidth: string       // Border width: "thin", "medium", "thick"
borderStyle: string       // Border style: "solid", "dashed", "dotted"
width: string             // Width
height: string            // Height
minWidth: string          // Minimum width
maxWidth: string          // Maximum width
minHeight: string         // Minimum height
maxHeight: string         // Maximum height
fullWidth: boolean        // Take full width of parent
fullHeight: boolean       // Take full height of parent

// Surface Context
// For theme-aware surfaces and consistent styling
import { SurfaceContext } from 'schmancy/surface';

const surfaceContext = new SurfaceContext({
  elevation: 1,
  rounded: 'md',
  padding: 'md',
  theme: 'light'
});

// Examples
// Basic card-like surface
<schmancy-surface
  elevation="2"
  rounded="lg"
  padding="lg">
  <h3>Card Title</h3>
  <p>This is a basic card surface with elevation, rounded corners, and padding.</p>
</schmancy-surface>

// Interactive card
<schmancy-surface
  elevation="1"
  rounded="md"
  padding="md"
  interactive
  @click=${navigateToDetails}>
  <div style="display: flex; align-items: center; gap: 16px;">
    <schmancy-avatar
      src="path/to/avatar.jpg"
      size="large">
    </schmancy-avatar>
    
    <div>
      <h3>John Doe</h3>
      <p>Software Engineer</p>
    </div>
    
    <schmancy-icon
      icon="chevron-right"
      style="margin-left: auto;">
    </schmancy-icon>
  </div>
</schmancy-surface>

// Alert surfaces
<schmancy-surface
  color="primary"
  rounded="md"
  padding="md"
  bordered
  border-color="primary"
  style="--surface-color-opacity: 0.1;">
  <div style="display: flex; align-items: center; gap: 16px;">
    <schmancy-icon icon="info" color="primary"></schmancy-icon>
    <div>
      <h4>Information</h4>
      <p>This is an informational message.</p>
    </div>
  </div>
</schmancy-surface>

<schmancy-surface
  color="error"
  rounded="md"
  padding="md"
  bordered
  border-color="error"
  style="--surface-color-opacity: 0.1;">
  <div style="display: flex; align-items: center; gap: 16px;">
    <schmancy-icon icon="alert-triangle" color="error"></schmancy-icon>
    <div>
      <h4>Error</h4>
      <p>Something went wrong. Please try again.</p>
    </div>
  </div>
</schmancy-surface>

// Surface grid layout
<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;">
  <schmancy-surface
    elevation="1"
    rounded="md"
    padding="md">
    <h3>Card 1</h3>
    <p>Content for card 1.</p>
  </schmancy-surface>
  
  <schmancy-surface
    elevation="1"
    rounded="md"
    padding="md">
    <h3>Card 2</h3>
    <p>Content for card 2.</p>
  </schmancy-surface>
  
  <schmancy-surface
    elevation="1"
    rounded="md"
    padding="md">
    <h3>Card 3</h3>
    <p>Content for card 3.</p>
  </schmancy-surface>
</div>

// Dashboard panel
<schmancy-surface
  elevation="2"
  rounded="lg"
  padding="lg"
  height="300px">
  <div style="display: flex; flex-direction: column; height: 100%;">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
      <h3>Sales Overview</h3>
      <schmancy-dropdown>
        <schmancy-button slot="trigger" variant="tertiary" size="small">
          <span>This Week</span>
          <schmancy-icon slot="suffix" icon="chevron-down"></schmancy-icon>
        </schmancy-button>
        
        <schmancy-menu slot="content">
          <schmancy-menu-item value="day">Today</schmancy-menu-item>
          <schmancy-menu-item value="week">This Week</schmancy-menu-item>
          <schmancy-menu-item value="month">This Month</schmancy-menu-item>
          <schmancy-menu-item value="year">This Year</schmancy-menu-item>
        </schmancy-menu>
      </schmancy-dropdown>
    </div>
    
    <div style="flex: 1; display: flex; align-items: center; justify-content: center;">
      <!-- Chart or content would go here -->
      <p>Chart placeholder</p>
    </div>
  </div>
</schmancy-surface>

// Using surface context
<div .context=${surfaceContext}>
  <schmancy-surface>
    <h3>First Panel</h3>
    <p>This surface inherits settings from the context.</p>
  </schmancy-surface>
  
  <schmancy-surface>
    <h3>Second Panel</h3>
    <p>This surface also inherits settings from the context.</p>
  </schmancy-surface>
  
  <schmancy-surface elevation="3" rounded="xl">
    <h3>Custom Panel</h3>
    <p>This surface overrides some context settings.</p>
  </schmancy-surface>
</div>
```