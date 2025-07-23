# Schmancy Typography - AI Reference

```js
// Component Tag
<schmancy-typography
  type="display|headline|title|subtitle|label|body"      // Typography scale type
  token="xl|lg|md|sm|xs"                                 // Size token within type
  align?="left|center|justify|right"                     // Text alignment
  weight?="normal|medium|bold"                           // Font weight override
  transform?="uppercase|lowercase|capitalize|normal"     // Text transformation
  maxLines?="1|2|3|4|5|6"                               // Truncate with ellipsis
  class?="additional-tailwind-classes"                   // Additional styling
  @click=${handler}>                                     // Click handler
  <!-- Text content or HTML -->
</schmancy-typography>

// Import
import '@mhmo91/schmancy/typography'

// Typography Scale Reference (size/line-height)
// Display: xl (72/80), lg (57/64), md (45/52), sm (36/44), xs (28/36)
// Headline: xl (36/44), lg (32/40), md (28/36), sm (24/32), xs (20/28)
// Title: xl (24/32), lg (22/28), md (16/24), sm (14/20), xs (12/16)
// Subtitle: xl (20/28), lg (18/24), md (16/24), sm (14/20), xs (12/16)
// Label: xl (16/22), lg (14/20), md (12/16), sm (11/16), xs (10/14)
// Body: xl (18/28), lg (16/24), md (14/20), sm (12/16), xs (10/14)

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
<schmancy-typography type="headline" token="sm" class="mb-4 text-primary">
  Highlighted Section
</schmancy-typography>

// 7. Centered uppercase title
<schmancy-typography type="title" token="lg" align="center" transform="uppercase">
  Section Header
</schmancy-typography>

// 8. Clickable text
<schmancy-typography type="body" token="md" class="cursor-pointer hover:text-primary" @click="${handleClick}">
  Click me for more information
</schmancy-typography>

// 9. Truncated text with ellipsis
<schmancy-typography type="body" token="md" maxLines="2">
  This is a long description that will be truncated after two lines with an ellipsis if it exceeds the available space...
</schmancy-typography>

// 10. Multiple typography in a card
<schmancy-card class="p-6">
  <schmancy-typography type="headline" token="sm" class="block mb-2">
    Card Title
  </schmancy-typography>
  <schmancy-typography type="body" token="md" class="block mb-4 text-surface-onVariant">
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
Material Design 3 typography scale with 6 types, each with 5 sizes:

**Display** - Largest text for big statements (weight: 400)
- `xl`: 72px/80px line-height
- `lg`: 57px/64px line-height
- `md`: 45px/52px line-height
- `sm`: 36px/44px line-height
- `xs`: 28px/36px line-height

**Headline** - Section headers and important titles (weight: 400)
- `xl`: 36px/44px line-height
- `lg`: 32px/40px line-height
- `md`: 28px/36px line-height
- `sm`: 24px/32px line-height
- `xs`: 20px/28px line-height

**Title** - Smaller titles and subtitles (weight: 400)
- `xl`: 24px/32px line-height (weight: 400)
- `lg`: 22px/28px line-height (weight: 400)
- `md`: 16px/24px line-height (weight: 500)
- `sm`: 14px/20px line-height (weight: 500)
- `xs`: 12px/16px line-height (weight: 500)

**Subtitle** - Secondary headings (weight: 500)
- `xl`: 20px/28px line-height
- `lg`: 18px/24px line-height
- `md`: 16px/24px line-height
- `sm`: 14px/20px line-height
- `xs`: 12px/16px line-height

**Label** - UI labels and buttons (weight: 500)
- `xl`: 16px/22px line-height
- `lg`: 14px/20px line-height
- `md`: 12px/16px line-height
- `sm`: 11px/16px line-height
- `xs`: 10px/14px line-height

**Body** - Main content text (weight: 400)
- `xl`: 18px/28px line-height
- `lg`: 16px/24px line-height
- `md`: 14px/20px line-height
- `sm`: 12px/16px line-height
- `xs`: 10px/14px line-height

### Additional Properties

**Text Alignment** (`align`)
- `left`: Align text to the left
- `center`: Center the text
- `justify`: Justify text
- `right`: Align text to the right

**Font Weight** (`weight`)
- `normal`: 400 weight
- `medium`: 500 weight
- `bold`: 700 weight

**Text Transform** (`transform`)
- `uppercase`: Convert to uppercase
- `lowercase`: Convert to lowercase
- `capitalize`: Capitalize first letter of each word
- `normal`: No transformation

**Line Clamping** (`maxLines`)
- Truncates text after specified number of lines
- Adds ellipsis (...) at the end
- Values: 1-6 lines

### Theme Integration
Typography automatically inherits colors from the theme:
- Uses `color: var(--schmancy-sys-color-surface-on)` by default
- Respects surface container colors
- Can be overridden with Tailwind classes

### Implementation Details
- Uses Shadow DOM with encapsulated styles
- All typography values are hardcoded in the component
- Renders with `display: block` by default
- Font family inherits from parent
- All properties reflect to HTML attributes for CSS targeting

## Common Use Cases

1. **Page Layout**
   ```html
   <schmancy-typography type="display" token="md" class="block mb-4">
     Dashboard
   </schmancy-typography>
   <schmancy-typography type="body" token="lg" class="block text-surface-onVariant">
     Welcome back! Here's your activity summary.
   </schmancy-typography>
   ```

2. **Form Fields**
   ```html
   <schmancy-typography type="label" token="md" class="block mb-2">
     Username
   </schmancy-typography>
   <schmancy-input placeholder="Enter username"></schmancy-input>
   ```

3. **Data Display**
   ```html
   <schmancy-typography type="headline" token="md" class="block text-primary">
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
       <schmancy-typography type="body" token="sm" class="block text-surface-onVariant">
         Description of the first feature
       </schmancy-typography>
     </div>
   </div>
   ```