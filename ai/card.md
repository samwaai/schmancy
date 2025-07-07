# Schmancy Card - AI Reference

Material Design 3 card components with optimized performance and clean API.

```html
<!-- Card Component -->
<schmancy-card
  type="elevated|filled|outlined"
  elevation="0|1|2|3|4|5">
  Card content
</schmancy-card>

<!-- Properties -->
type: string          // "elevated", "filled", "outlined" (default: "elevated")
elevation: number     // Shadow depth 0-5 (default: 0, overrides type defaults)

<!-- Card Types -->
"elevated"            // Surface with shadow, uses surface-low color
"filled"              // Filled background, uses surface-highest color
"outlined"            // Border outline, uses surface-default color

<!-- Examples -->
<!-- 1. Basic elevated card -->
<schmancy-card>
  <h3>Card Title</h3>
  <p>Card content goes here</p>
</schmancy-card>

<!-- 2. Complete card structure -->
<schmancy-card type="filled" elevation="2">
  <schmancy-card-media src="image.jpg" fit="cover" alt="Product"></schmancy-card-media>
  <schmancy-card-content>
    <span slot="headline">Product Name</span>
    <span slot="subhead">$29.99</span>
    Product description goes here...
  </schmancy-card-content>
  <schmancy-card-action>
    <schmancy-button variant="filled">Add to Cart</schmancy-button>
  </schmancy-card-action>
</schmancy-card>

<!-- 3. Outlined card -->
<schmancy-card type="outlined">
  <schmancy-card-content>
    <span slot="headline">Settings</span>
    Configure your preferences here
  </schmancy-card-content>
</schmancy-card>
```

## Related Components
- **[Surface](./surface.md)**: Base container component with more options
- **[Card Content](./card.md#content)**: Structured content area
- **[Card Media](./card.md#media)**: Media container for cards
- **[Card Actions](./card.md#actions)**: Action button container

## Technical Details

### CSS Host Styling
The component uses `:host` selectors for all styling:
- No wrapper elements - clean component boundary
- CSS attribute selectors work with the properties
- Automatic hover states for elevated and outlined types

### Theme Integration
```css
/* Type-based colors */
type="elevated"  -> --schmancy-sys-color-surface-low
type="filled"    -> --schmancy-sys-color-surface-highest  
type="outlined"  -> --schmancy-sys-color-surface-default

/* Outline color */
--schmancy-sys-color-outlineVariant

/* Elevation shadows */
--schmancy-sys-elevation-1 through --schmancy-sys-elevation-5
```

### Hover Behavior
- Elevated cards: elevation 1 → 2 on hover
- Filled cards: no elevation → 1 on hover
- Outlined cards: no elevation → 1 on hover

## Card Sub-components

### Card Content
Structured content area with headline and subhead slots.

```html
<schmancy-card-content>
  <span slot="headline">Main Title</span>
  <span slot="subhead">Subtitle or metadata</span>
  Body content goes here...
</schmancy-card-content>

<!-- Properties -->
- Automatic padding and spacing
- Headline uses surface-on color
- Subhead and body use surface-onVariant color
```

### Card Media  
Media container with object-fit control.

```html
<!-- With src attribute -->
<schmancy-card-media 
  src="image.jpg" 
  fit="contain|cover|fill|none|scale-down"
  alt="Description">
</schmancy-card-media>

<!-- With slotted content -->
<schmancy-card-media fit="cover">
  <img src="image.jpg" alt="Media">
</schmancy-card-media>

<!-- Properties -->
src: string           // Image source URL
fit: string           // Object fit mode (default: "contain")
alt: string           // Alt text for accessibility
```

### Card Action
Action area for buttons, positioned at bottom.

```html
<schmancy-card-action>
  <schmancy-button variant="filled">Primary</schmancy-button>
  <schmancy-button variant="text">Secondary</schmancy-button>
</schmancy-card-action>

<!-- Properties -->
- Flex layout with right alignment
- Automatic spacing between buttons
- Padding on all sides
```

## Common Use Cases

1. **Product Cards**: E-commerce product display
   ```html
   <schmancy-card type="elevated">
     <schmancy-card-media src="product.jpg" fit="cover" alt="Product"></schmancy-card-media>
     <schmancy-card-content>
       <span slot="headline">Product Name</span>
       <span slot="subhead">$29.99</span>
       Premium quality product with excellent features...
     </schmancy-card-content>
     <schmancy-card-action>
       <schmancy-button variant="filled">Add to Cart</schmancy-button>
       <schmancy-button variant="text">Details</schmancy-button>
     </schmancy-card-action>
   </schmancy-card>
   ```

2. **Info Cards**: Dashboard or stats display
   ```html
   <schmancy-card type="filled" elevation="0">
     <div style="padding: 24px;">
       <schmancy-icon icon="users" size="32"></schmancy-icon>
       <h2>1,234</h2>
       <p>Active Users</p>
     </div>
   </schmancy-card>
   ```

3. **Settings Cards**: Options or configuration
   ```html
   <schmancy-card type="outlined">
     <schmancy-card-content>
       <span slot="headline">Notification Settings</span>
       <schmancy-form>
         <schmancy-checkbox>Email notifications</schmancy-checkbox>
         <schmancy-checkbox>Push notifications</schmancy-checkbox>
       </schmancy-form>
     </schmancy-card-content>
   </schmancy-card>
   ```

4. **Media Cards**: Image galleries
   ```html
   <schmancy-card elevation="2">
     <schmancy-card-media src="gallery.jpg" fit="cover" alt="Gallery"></schmancy-card-media>
     <schmancy-card-content>
       <span slot="subhead">Photo by Artist Name</span>
       Beautiful landscape captured at sunset
     </schmancy-card-content>
   </schmancy-card>
   ```

5. **Article Cards**: Blog or news items
   ```html
   <schmancy-card type="outlined">
     <schmancy-card-content>
       <schmancy-typography type="label" token="sm" class="text-primary-default block mb-2">
         TECHNOLOGY
       </schmancy-typography>
       <span slot="headline">The Future of Web Development</span>
       <span slot="subhead">5 min read • March 15, 2024</span>
       Explore the latest trends in web development...
     </schmancy-card-content>
     <schmancy-card-action>
       <schmancy-button variant="text">Read More</schmancy-button>
       <schmancy-button variant="text">
         <schmancy-icon>share</schmancy-icon>
       </schmancy-button>
     </schmancy-card-action>
   </schmancy-card>
   ```

## Performance Notes

All card components use :host styling for optimal performance:
- No wrapper elements or runtime class manipulation
- CSS-only hover states and transitions
- Efficient use of CSS custom properties
- Minimal JavaScript overhead

## Migration Guide

If upgrading from older versions:
1. Replace `<schmancy-card-actions>` with `<schmancy-card-action>`
2. Update card-content to use slots for headline/subhead
3. Card-media now supports direct src attribute
4. All components use :host styling (no wrapper divs)