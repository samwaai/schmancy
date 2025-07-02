# Schmancy Surface - AI Reference

```js
// Surface Component
<schmancy-surface
  fill="all|width|height|auto"
  rounded="none|top|left|right|bottom|all"
  type="surface|surfaceDim|surfaceBright|containerLowest|containerLow|container|containerHigh|containerHighest"
  elevation="0|1|2|3|4|5">
  Content goes here
</schmancy-surface>

// Properties
fill: string          // "all", "width", "height", "auto" (default: "auto")
rounded: string       // Corner rounding: "none", "top", "left", "right", "bottom", "all" (default: "none")
type: string          // Surface color variant (default: "container")
elevation: number     // Shadow depth 0-5 (default: 0)

// Surface Types (background colors)
"surface"             // Default surface color
"surfaceDim"          // Dimmed surface
"surfaceBright"       // Bright surface
"containerLowest"     // Lowest container elevation
"containerLow"        // Low container elevation
"container"           // Standard container
"containerHigh"       // High container elevation
"containerHighest"    // Highest container elevation

// Examples
// 1. Basic surface
<schmancy-surface>
  Basic content
</schmancy-surface>

// 2. Elevated card
<schmancy-surface 
  elevation="2" 
  rounded="all"
  type="containerLow">
  <h3>Card Title</h3>
  <p>Card content</p>
</schmancy-surface>

// 3. Full-width surface
<schmancy-surface 
  fill="width"
  type="surfaceDim"
  elevation="1">
  Full width content
</schmancy-surface>

// 4. Dashboard panel
<schmancy-surface
  elevation="3"
  rounded="all"
  type="containerHighest"
  fill="all">
  <div class="dashboard-content">
    <!-- Content -->
  </div>
</schmancy-surface>
```

## Related Components
- **[Card](./card.md)**: Pre-styled surface for card layouts
- **[Sheet](./sheet.md)**: Modal surface overlay
- **[Dialog](./dialog.md)**: Elevated modal surface
- **[Layout](./layout.md)**: Layout components that often contain surfaces

## Technical Details

### CSS Host Styling
The component uses `:host` selectors for all styling:
- No wrapper elements - styles apply directly to the component
- Properties reflect to HTML attributes for CSS targeting
- Uses CSS custom properties from the theme system

### Theme Integration
```css
/* Background colors use theme variables */
--schmancy-sys-color-surface-default
--schmancy-sys-color-surface-dim
--schmancy-sys-color-surface-bright
--schmancy-sys-color-surface-lowest
--schmancy-sys-color-surface-low
--schmancy-sys-color-surface-container
--schmancy-sys-color-surface-high
--schmancy-sys-color-surface-highest

/* Text color */
--schmancy-sys-color-surface-on

/* Elevation shadows */
--schmancy-sys-elevation-1 through --schmancy-sys-elevation-5
```

### Context Provider
Surface provides its type to descendant components via Lit Context:
```js
import { SchmancySurfaceTypeContext } from '@schmancy/surface'
```

## Common Use Cases

1. **Content Cards**: Elevated surfaces for grouped content
   ```html
   <schmancy-surface elevation="2" rounded="all" type="containerLow">
     <h3>Feature Card</h3>
     <p>Description of the feature</p>
     <schmancy-button>Learn More</schmancy-button>
   </schmancy-surface>
   ```

2. **Page Sections**: Full-width background surfaces
   ```html
   <schmancy-surface fill="width" type="surfaceDim">
     <section class="hero-section">
       <h1>Welcome</h1>
       <p>Hero content here</p>
     </section>
   </schmancy-surface>
   ```

3. **Modal Backgrounds**: High elevation surfaces
   ```html
   <schmancy-surface 
     elevation="5" 
     rounded="all" 
     type="containerHighest">
     <div class="modal-content">
       <h2>Modal Title</h2>
       <p>Modal body content</p>
     </div>
   </schmancy-surface>
   ```

4. **Nested Surfaces**: Different elevation levels
   ```html
   <schmancy-surface type="surface" fill="all">
     <schmancy-surface 
       elevation="1" 
       rounded="all" 
       type="containerLow">
       <p>Nested content with different elevation</p>
     </schmancy-surface>
   </schmancy-surface>
   ```

5. **Sidebar Panels**: Directional rounding
   ```html
   <schmancy-surface 
     fill="height" 
     rounded="right" 
     elevation="2"
     type="containerHigh">
     <nav class="sidebar">
       <!-- Navigation items -->
     </nav>
   </schmancy-surface>
   ```