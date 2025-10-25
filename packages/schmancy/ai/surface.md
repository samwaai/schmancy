# Schmancy Surface - AI Reference

```js
// Surface Component
<schmancy-surface
  fill="all|width|height|auto"
  rounded="none|top|left|right|bottom|all"
  type="surface|surfaceDim|surfaceBright|containerLowest|containerLow|container|containerHigh|containerHighest|glass|glassOforim|transparent|primary|primaryContainer|secondary|secondaryContainer|tertiary|tertiaryContainer|error|errorContainer"
  elevation="0|1|2|3|4|5">
  Content goes here
</schmancy-surface>

// Properties
fill: string          // "all", "width", "height", "auto" (default: "auto")
rounded: string       // Corner rounding: "none", "top", "left", "right", "bottom", "all" (default: "none")
type: string          // Surface color variant (default: "container")
elevation: number     // Shadow depth 0-5 (default: 0)

// Surface Types (19 total variants)

// Neutral Surfaces (8 types) - for general backgrounds
"surface"             // Default surface color
"surfaceDim"          // Dimmed surface
"surfaceBright"       // Bright surface
"containerLowest"     // Lowest container elevation
"containerLow"        // Low container elevation
"container"           // Standard container (default)
"containerHigh"       // High container elevation
"containerHighest"    // Highest container elevation

// Glass Effects (3 types) - for modern glassmorphism
"glass"               // Standard glass effect with backdrop blur
"glassOforim"         // Enhanced glass with stronger blur effect
"transparent"         // Fully transparent background

// State-Based Surfaces (8 types) - for selection/semantic meaning
"primary"             // High emphasis primary (selected/active states)
"primaryContainer"    // Lower emphasis primary container
"secondary"           // High emphasis secondary
"secondaryContainer"  // Lower emphasis secondary container
"tertiary"            // High emphasis tertiary
"tertiaryContainer"   // Lower emphasis tertiary container
"error"               // High emphasis error state
"errorContainer"      // Lower emphasis error container

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

// 5. Glass effect surface
<schmancy-surface
  type="glass"
  rounded="all"
  elevation="2"
  class="p-6">
  Modern glassmorphism card
</schmancy-surface>

// 6. Selected state (interactive list item)
<schmancy-surface
  type=${isSelected ? 'primaryContainer' : 'containerHighest'}
  rounded="all"
  class="cursor-pointer p-4">
  Selectable item
</schmancy-surface>

// 7. Error message container
<schmancy-surface
  type="errorContainer"
  rounded="all"
  class="p-4">
  <p>Validation error message</p>
</schmancy-surface>

// 8. Transparent overlay
<schmancy-surface
  type="transparent"
  fill="all"
  class="absolute inset-0">
  Transparent overlay content
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
import { SchmancySurfaceTypeContext } from '@schmancy/index'
// Or specific import: import { SchmancySurfaceTypeContext } from '@schmancy/surface'
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

6. **Glass Effect Cards**: Modern glassmorphism
   ```html
   <schmancy-surface
     type="glass"
     elevation="3"
     rounded="all"
     class="p-6">
     <h3>Premium Feature</h3>
     <p>Glass effect with backdrop blur</p>
   </schmancy-surface>
   ```

7. **Selected List Items**: Selection states
   ```html
   <schmancy-surface
     type=${item.selected ? 'primaryContainer' : 'containerHighest'}
     rounded="all"
     class="cursor-pointer p-4 transition-all hover:scale-[1.01]"
     @click=${() => toggleSelection(item)}>
     ${item.name}
   </schmancy-surface>
   ```

8. **Error/Warning Messages**: Semantic containers
   ```html
   <!-- Error message -->
   <schmancy-surface type="errorContainer" rounded="all" class="p-4 mb-4">
     <strong>Error:</strong> Please fix the validation errors
   </schmancy-surface>

   <!-- Info message -->
   <schmancy-surface type="primaryContainer" rounded="all" class="p-4">
     <strong>Info:</strong> Your changes have been saved
   </schmancy-surface>
   ```

9. **Transparent Overlays**: Modal backgrounds
   ```html
   <schmancy-surface
     type="transparent"
     fill="all"
     class="absolute inset-0 flex items-center justify-center">
     <schmancy-surface type="glass" elevation="5" rounded="all" class="p-8">
       <h2>Modal Content</h2>
       <p>Transparent overlay with glass modal</p>
     </schmancy-surface>
   </schmancy-surface>
   ```

10. **Interactive Cards**: Hover states with type switching
    ```html
    <schmancy-surface
      type=${isHovered ? 'secondaryContainer' : 'container'}
      elevation="2"
      rounded="all"
      class="p-6 transition-all cursor-pointer"
      @mouseenter=${() => setHovered(true)}
      @mouseleave=${() => setHovered(false)}>
      Hover me!
    </schmancy-surface>
    ```