# Schmancy Typography - AI Reference

```js
// Component Tag
<schmancy-typography
  type="display|headline|title|label|body"                // Typography scale type
  token="lg|md|sm"                                        // Size token within type
  class?="additional-tailwind-classes"                    // Additional styling
  tag?="h1|h2|h3|h4|h5|h6|p|span|div"                   // HTML element (auto-determined by type/token)
  @click=${handler}>                                      // Click handler
  <!-- Text content or HTML -->
</schmancy-typography>

// Import
import '@mhmo91/schmancy/typography'

// Typography Scale Reference
// Display: lg (57/64), md (45/52), sm (36/44)
// Headline: lg (32/40), md (28/36), sm (24/32)
// Title: lg (22/28), md (16/24), sm (14/20)
// Label: lg (14/20), md (12/16), sm (11/16)
// Body: lg (16/24), md (14/20), sm (12/16)

// Examples
// 1. Page heading (Display)
<schmancy-typography type="display" token="lg">
  Welcome to Schmancy
</schmancy-typography>

// 2. Section heading (Headline)
<schmancy-typography type="headline" token="md">
  Getting Started
</schmancy-typography>

// 3. Card title
<schmancy-typography type="title" token="lg">
  User Profile Settings
</schmancy-typography>

// 4. Form label
<schmancy-typography type="label" token="md">
  Email Address
</schmancy-typography>

// 5. Body text
<schmancy-typography type="body" token="md">
  This is the main content paragraph with medium body text.
</schmancy-typography>

// 6. With additional styling
<schmancy-typography type="headline" token="sm" class="text-primary mb-4">
  Highlighted Section
</schmancy-typography>

// 7. Custom tag usage
<schmancy-typography type="display" token="md" tag="h1">
  Main Page Title
</schmancy-typography>

// 8. Clickable text
<schmancy-typography type="body" token="md" class="cursor-pointer hover:text-primary" @click="${handleClick}">
  Click me for more information
</schmancy-typography>

// 9. Mixed content with HTML
<schmancy-typography type="body" token="lg">
  This text contains <strong>bold</strong> and <em>italic</em> elements.
</schmancy-typography>

// 10. Multiple typography in a card
<schmancy-card class="p-6">
  <schmancy-typography type="headline" token="sm" class="mb-2 block">
    Card Title
  </schmancy-typography>
  <schmancy-typography type="body" token="md" class="text-surface-onVariant mb-4 block">
    This is a description that provides more context about the card content.
  </schmancy-typography>
  <schmancy-typography type="label" token="lg" class="text-primary">
    View Details →
  </schmancy-typography>
</schmancy-card>
```

## Related Components
- **[Card](./card.md)**: Often used within cards for titles and content
- **[Button](./button.md)**: Typography can be used within buttons for custom text
- **[Surface](./surface.md)**: Typography inherits color from surface containers
- **[Form](./form.md)**: Labels and helper text in forms
- **[Table](./table.md)**: Headers and cell content formatting

## Technical Details

### Typography Scale System
Material Design 3 typography scale with 5 scales, each with 3 sizes:

**Display** - Largest text for big statements
- `lg`: 57px/64px line-height
- `md`: 45px/52px line-height
- `sm`: 36px/44px line-height

**Headline** - Section headers and important titles
- `lg`: 32px/40px line-height
- `md`: 28px/36px line-height
- `sm`: 24px/32px line-height

**Title** - Smaller titles and subtitles
- `lg`: 22px/28px line-height
- `md`: 16px/24px line-height
- `sm`: 14px/20px line-height

**Label** - UI labels and buttons
- `lg`: 14px/20px line-height
- `md`: 12px/16px line-height
- `sm`: 11px/16px line-height

**Body** - Main content text
- `lg`: 16px/24px line-height
- `md`: 14px/20px line-height
- `sm`: 12px/16px line-height

### Automatic Tag Selection
The component automatically selects appropriate HTML tags:
- Display: `h1`, `h2`, `h3`
- Headline: `h3`, `h4`, `h5`
- Title: `h5`, `h6`, `p`
- Label: `span`
- Body: `p`

### Theme Integration
Typography automatically inherits colors from the theme:
- Uses `color: var(--schmancy-sys-color-surface-on)` by default
- Respects surface container colors
- Can be overridden with Tailwind classes

### CSS Custom Properties
The component uses Material Design 3 type scale tokens:
```css
--schmancy-sys-typescale-[type]-[token]-size
--schmancy-sys-typescale-[type]-[token]-line-height
--schmancy-sys-typescale-[type]-[token]-weight
--schmancy-sys-typescale-[type]-[token]-letter-spacing
```

## Common Use Cases

1. **Page Layout**
   ```html
   <schmancy-typography type="display" token="md" class="mb-4 block">
     Dashboard
   </schmancy-typography>
   <schmancy-typography type="body" token="lg" class="text-surface-onVariant block">
     Welcome back! Here's your activity summary.
   </schmancy-typography>
   ```

2. **Form Fields**
   ```html
   <schmancy-typography type="label" token="md" class="mb-2 block">
     Username
   </schmancy-typography>
   <schmancy-input placeholder="Enter username"></schmancy-input>
   ```

3. **Data Display**
   ```html
   <schmancy-typography type="headline" token="md" class="text-primary block">
     $1,234.56
   </schmancy-typography>
   <schmancy-typography type="label" token="sm" class="text-surface-onVariant">
     Total Revenue
   </schmancy-typography>
   ```

4. **List Items**
   ```html
   <div class="space-y-4">
     <div>
       <schmancy-typography type="title" token="md" class="block">
         Feature One
       </schmancy-typography>
       <schmancy-typography type="body" token="sm" class="text-surface-onVariant block">
         Description of the first feature
       </schmancy-typography>
     </div>
   </div>
   ```