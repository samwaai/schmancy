# Schmancy Card - AI Reference

```js
// Card Component
<schmancy-card
  type="elevated|filled|outlined"
  elevation="0|1|2|3|4|5">
  Card content
</schmancy-card>

// Properties
type: string          // "elevated", "filled", "outlined" (default: "elevated")
elevation: number     // Shadow depth 0-5 (default: 0)

// Card Types
"elevated"            // Surface with shadow, uses surface-low color
"filled"              // Filled background, uses surface-highest color
"outlined"            // Border outline, uses surface color

// Examples
// 1. Basic elevated card
<schmancy-card>
  <h3>Card Title</h3>
  <p>Card content goes here</p>
</schmancy-card>

// 2. Filled card with custom elevation
<schmancy-card type="filled" elevation="2">
  <schmancy-card-media>
    <img src="image.jpg" alt="Card image">
  </schmancy-card-media>
  <schmancy-card-content>
    <h3>Product Name</h3>
    <p>Product description</p>
  </schmancy-card-content>
  <schmancy-card-actions>
    <schmancy-button>Add to Cart</schmancy-button>
  </schmancy-card-actions>
</schmancy-card>

// 3. Outlined card
<schmancy-card type="outlined">
  <div style="padding: 16px;">
    <h4>Settings</h4>
    <p>Configure your preferences</p>
  </div>
</schmancy-card>

// 4. Interactive card with hover effect
<schmancy-card elevation="1">
  <a href="/details" style="text-decoration: none; color: inherit;">
    <div style="padding: 16px;">
      <h3>Click for Details</h3>
      <p>This card has hover elevation changes</p>
    </div>
  </a>
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
- Type and elevation properties reflect to HTML attributes
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
```html
<schmancy-card-content>
  <h3>Title</h3>
  <p>Description text</p>
</schmancy-card-content>
```

### Card Media  
```html
<schmancy-card-media>
  <img src="image.jpg" alt="Media">
</schmancy-card-media>
```

### Card Actions
```html
<schmancy-card-actions>
  <schmancy-button>Action 1</schmancy-button>
  <schmancy-button variant="text">Action 2</schmancy-button>
</schmancy-card-actions>
```

## Common Use Cases

1. **Product Cards**: E-commerce product display
   ```html
   <schmancy-card type="elevated">
     <schmancy-card-media>
       <img src="product.jpg" alt="Product">
     </schmancy-card-media>
     <schmancy-card-content>
       <h3>Product Name</h3>
       <p class="price">$29.99</p>
       <p class="description">Product description...</p>
     </schmancy-card-content>
     <schmancy-card-actions>
       <schmancy-button variant="filled">Add to Cart</schmancy-button>
       <schmancy-button variant="text">Details</schmancy-button>
     </schmancy-card-actions>
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
       <h4>Notification Settings</h4>
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
     <schmancy-card-media aspect-ratio="16:9">
       <img src="gallery-image.jpg" alt="Gallery">
     </schmancy-card-media>
     <schmancy-card-content>
       <p>Image caption or description</p>
     </schmancy-card-content>
   </schmancy-card>
   ```

5. **List Item Cards**: Clickable list items
   ```html
   <schmancy-card type="elevated" elevation="1">
     <a href="/user/123" style="display: flex; padding: 16px; align-items: center; text-decoration: none; color: inherit;">
       <schmancy-avatar src="user.jpg"></schmancy-avatar>
       <div style="margin-left: 16px; flex: 1;">
         <h4>User Name</h4>
         <p>user@example.com</p>
       </div>
       <schmancy-icon icon="chevron-right"></schmancy-icon>
     </a>
   </schmancy-card>
   ```