# Schmancy Busy - AI Reference

```js
// Basic Busy Indicator
<schmancy-busy
  active?
  size="small|medium|large"
  type="spinner|dots|bar"
  label="Loading..."
  overlay?
  fullscreen?>
</schmancy-busy>

// Spinner Component
<schmancy-spinner
  size="small|medium|large"
  color="primary|secondary|tertiary|currentColor">
</schmancy-spinner>

// Busy overlaying content
<div style="position: relative; height: 200px;">
  <div>
    Content that will be overlaid when loading
  </div>
  
  <schmancy-busy
    active=${isLoading}
    overlay>
  </schmancy-busy>
</div>

// Fullscreen busy indicator
<schmancy-busy
  active=${isLoading}
  fullscreen
  label="Loading application...">
</schmancy-busy>

// Busy Properties
active: boolean         // Whether the busy indicator is displayed
size: string            // Size: "small", "medium", "large"
type: string            // Indicator type: "spinner", "dots", "bar"
label: string           // Text to display
overlay: boolean        // Show as overlay on parent container
fullscreen: boolean     // Show as fullscreen overlay
color: string           // Color of the indicator
opacity: number         // Background opacity for overlay
persistent: boolean     // Prevent closing with escape key
delay: number           // Delay in ms before showing (to prevent flashing)
minDuration: number     // Minimum duration in ms to show

// Spinner Properties
size: string            // Size: "small" (16px), "medium" (24px), "large" (48px), or custom size
color: string           // Color: "primary", "secondary", "tertiary", "currentColor" or CSS color
thickness: number       // Thickness of the spinner stroke

// Examples
// Basic usage
<schmancy-busy active=${loading} label="Loading..."></schmancy-busy>

// Spinner with custom size and color
<schmancy-spinner size="32px" color="#ff5722"></schmancy-spinner>

// Busy indicator in a button
<schmancy-button ?disabled=${loading}>
  ${loading ? html`
    <schmancy-spinner size="small" slot="prefix"></schmancy-spinner>
    Loading...
  ` : html`
    Submit
  `}
</schmancy-button>

// Overlay on a card
<schmancy-card>
  <schmancy-card-content>
    <h3>User Details</h3>
    <div>
      <!-- User details content -->
    </div>
  </schmancy-card-content>
  
  <schmancy-busy
    active=${loadingUser}
    overlay
    label="Loading user...">
  </schmancy-busy>
</schmancy-card>

// Delayed busy indicator to prevent flashing for fast operations
<schmancy-busy
  active=${loading}
  delay="300"
  min-duration="500"
  label="Processing...">
</schmancy-busy>

// Busy indicator with different types
<div>
  <div>
    <h4>Spinner</h4>
    <schmancy-busy active type="spinner"></schmancy-busy>
  </div>
  
  <div>
    <h4>Dots</h4>
    <schmancy-busy active type="dots"></schmancy-busy>
  </div>
  
  <div>
    <h4>Bar</h4>
    <schmancy-busy active type="bar"></schmancy-busy>
  </div>
</div>

// Table with loading state
<div style="position: relative;">
  <schmancy-table>
    <!-- Table content -->
  </schmancy-table>
  
  <schmancy-busy
    active=${loadingData}
    overlay
    opacity="0.7"
    label="Loading data...">
  </schmancy-busy>
</div>

// Form with busy state
<schmancy-form @submit=${handleSubmit}>
  <schmancy-input
    name="username"
    label="Username"
    required
    ?disabled=${submitting}>
  </schmancy-input>
  
  <schmancy-input
    name="password"
    label="Password"
    type="password"
    required
    ?disabled=${submitting}>
  </schmancy-input>
  
  <schmancy-button
    type="submit"
    ?disabled=${submitting}>
    ${submitting ? html`
      <schmancy-spinner slot="prefix" size="small"></schmancy-spinner>
      Signing In...
    ` : html`
      Sign In
    `}
  </schmancy-button>
  
  <schmancy-busy
    active=${submitting}
    overlay
    opacity="0.3">
  </schmancy-busy>
</schmancy-form>

// Fullscreen loading with custom styling
<schmancy-busy
  active=${initialLoading}
  fullscreen
  label="Loading application..."
  style="--busy-backdrop-color: var(--color-primary); --busy-label-color: white;">
</schmancy-busy>

// Programmatic usage (service API)
import { $busy } from 'schmancy';

// Show busy indicator
$busy.show({
  label: 'Loading data...',
  fullscreen: true
});

// Hide busy indicator
$busy.hide();

// For async operations
async function fetchData() {
  $busy.show({ label: 'Fetching data...' });
  
  try {
    await api.getData();
  } finally {
    $busy.hide();
  }
}
```