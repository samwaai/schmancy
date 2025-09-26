# Schmancy Typography Component

A comprehensive typography component based on Material Design 3 principles with extended size variants for consistent text styling across your application.

## Overview

The `schmancy-typography` component provides:
- **Material Design 3 typography scale**: Complete implementation of MD3 typography tokens
- **Extended size variants**: Additional xs and xl sizes for more flexibility
- **Text utilities**: Alignment, weight, transform, and line clamping options
- **Semantic HTML**: Uses appropriate semantic elements based on typography type
- **Consistent spacing**: Harmonious line heights and font sizes
- **Accessibility**: Proper contrast and readable text sizing

## Installation

```typescript
import '@schmancy/typography'
// or
import { SchmancyTypography } from '@schmancy/typography'
```

## Basic Usage

```html
<schmancy-typography type="headline" token="lg">
  Main Page Heading
</schmancy-typography>

<schmancy-typography type="body" token="md">
  This is regular body text that provides information to users.
</schmancy-typography>

<schmancy-typography type="label" token="sm" weight="medium" transform="uppercase">
  Field Label
</schmancy-typography>
```

## Typography Scale

Based on Material Design 3 with extended variants:

### Display Typography
For large, impactful text like hero sections:

```html
<!-- Extra large display (72px) -->
<schmancy-typography type="display" token="xl">
  Hero Title
</schmancy-typography>

<!-- Large display (57px) -->
<schmancy-typography type="display" token="lg">
  Major Section Title
</schmancy-typography>

<!-- Medium display (45px) - Default -->
<schmancy-typography type="display" token="md">
  Page Title
</schmancy-typography>

<!-- Small display (36px) -->
<schmancy-typography type="display" token="sm">
  Section Header
</schmancy-typography>

<!-- Extra small display (28px) -->
<schmancy-typography type="display" token="xs">
  Card Title
</schmancy-typography>
```

### Headline Typography
For prominent headings:

```html
<!-- Extra large headline (36px) -->
<schmancy-typography type="headline" token="xl">
  Article Headline
</schmancy-typography>

<!-- Large headline (32px) -->
<schmancy-typography type="headline" token="lg">
  Section Headline
</schmancy-typography>

<!-- Medium headline (28px) - Default -->
<schmancy-typography type="headline" token="md">
  Subsection Headline
</schmancy-typography>

<!-- Small headline (24px) -->
<schmancy-typography type="headline" token="sm">
  Component Title
</schmancy-typography>

<!-- Extra small headline (20px) -->
<schmancy-typography type="headline" token="xs">
  Small Component Title
</schmancy-typography>
```

### Title Typography
For prominent but not dominant text:

```html
<!-- Extra large title (24px) -->
<schmancy-typography type="title" token="xl">
  Dialog Title
</schmancy-typography>

<!-- Large title (22px) -->
<schmancy-typography type="title" token="lg">
  Card Title
</schmancy-typography>

<!-- Medium title (16px) - Default -->
<schmancy-typography type="title" token="md">
  List Item Title
</schmancy-typography>

<!-- Small title (14px) -->
<schmancy-typography type="title" token="sm">
  Small Card Title
</schmancy-typography>

<!-- Extra small title (12px) -->
<schmancy-typography type="title" token="xs">
  Caption Title
</schmancy-typography>
```

### Body Typography
For readable text content:

```html
<!-- Extra large body (18px) -->
<schmancy-typography type="body" token="xl">
  Prominent paragraph text for important content.
</schmancy-typography>

<!-- Large body (16px) -->
<schmancy-typography type="body" token="lg">
  Standard paragraph text for general content.
</schmancy-typography>

<!-- Medium body (14px) - Default -->
<schmancy-typography type="body" token="md">
  Regular body text for descriptions and details.
</schmancy-typography>

<!-- Small body (12px) -->
<schmancy-typography type="body" token="sm">
  Secondary information and helper text.
</schmancy-typography>

<!-- Extra small body (10px) -->
<schmancy-typography type="body" token="xs">
  Fine print and minimal details.
</schmancy-typography>
```

### Label Typography
For UI labels and short text:

```html
<!-- Extra large label (16px) -->
<schmancy-typography type="label" token="xl">
  Prominent Button Label
</schmancy-typography>

<!-- Large label (14px) -->
<schmancy-typography type="label" token="lg">
  Button Label
</schmancy-typography>

<!-- Medium label (12px) - Default -->
<schmancy-typography type="label" token="md">
  Input Label
</schmancy-typography>

<!-- Small label (11px) -->
<schmancy-typography type="label" token="sm">
  Tag Label
</schmancy-typography>

<!-- Extra small label (10px) -->
<schmancy-typography type="label" token="xs">
  Status Label
</schmancy-typography>
```

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `type` | `'display' \| 'headline' \| 'title' \| 'subtitle' \| 'body' \| 'label'` | `'body'` | Typography category from Material Design 3 |
| `token` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Size variant within the typography type |
| `align` | `'left' \| 'center' \| 'right' \| 'justify'` | `undefined` | Text alignment |
| `weight` | `'normal' \| 'medium' \| 'bold'` | `undefined` | Font weight override |
| `transform` | `'uppercase' \| 'lowercase' \| 'capitalize' \| 'normal'` | `undefined` | Text transform |
| `maxLines` | `1 \| 2 \| 3 \| 4 \| 5 \| 6` | `undefined` | Maximum lines with ellipsis overflow |

## Text Utilities

### Text Alignment

```html
<schmancy-typography type="body" token="md" align="center">
  Centered text content
</schmancy-typography>

<schmancy-typography type="body" token="md" align="right">
  Right-aligned text
</schmancy-typography>

<schmancy-typography type="body" token="md" align="justify">
  Justified text that fills the entire width of the container.
</schmancy-typography>
```

### Font Weight

```html
<schmancy-typography type="body" token="md" weight="normal">
  Normal weight text (400)
</schmancy-typography>

<schmancy-typography type="body" token="md" weight="medium">
  Medium weight text (500)
</schmancy-typography>

<schmancy-typography type="body" token="md" weight="bold">
  Bold weight text (700)
</schmancy-typography>
```

### Text Transform

```html
<schmancy-typography type="label" token="sm" transform="uppercase">
  Uppercase Label
</schmancy-typography>

<schmancy-typography type="body" token="md" transform="capitalize">
  Capitalize each word
</schmancy-typography>

<schmancy-typography type="body" token="md" transform="lowercase">
  lowercase text
</schmancy-typography>
```

### Line Clamping

Limit text to specific number of lines with ellipsis:

```html
<schmancy-typography type="body" token="md" max-lines="2">
  This text will be limited to exactly two lines and will show an ellipsis if it exceeds that length.
</schmancy-typography>

<schmancy-typography type="body" token="sm" max-lines="3">
  For longer descriptions that need to be truncated at three lines to maintain consistent card heights.
</schmancy-typography>
```

## Advanced Examples

### Card Content Layout

```html
<div class="card">
  <schmancy-typography type="headline" token="sm" weight="medium">
    Product Card Title
  </schmancy-typography>

  <schmancy-typography type="body" token="md" max-lines="3" class="mt-2">
    This is the product description that will be limited to three lines to maintain consistent card heights across the grid layout.
  </schmancy-typography>

  <div class="mt-4 flex justify-between items-center">
    <schmancy-typography type="title" token="lg" weight="bold">
      $24.99
    </schmancy-typography>

    <schmancy-typography type="label" token="sm" transform="uppercase" weight="medium">
      In Stock
    </schmancy-typography>
  </div>
</div>
```

### Article Layout

```html
<article>
  <schmancy-typography type="display" token="sm" weight="bold" class="mb-4">
    The Future of Web Components
  </schmancy-typography>

  <schmancy-typography type="body" token="sm" class="mb-6 text-gray-600">
    Published on March 15, 2024 by Jane Developer
  </schmancy-typography>

  <schmancy-typography type="body" token="lg" class="mb-6 leading-relaxed">
    Web components represent a fundamental shift in how we build and maintain user interfaces...
  </schmancy-typography>

  <schmancy-typography type="headline" token="xs" weight="medium" class="mt-8 mb-4">
    Implementation Benefits
  </schmancy-typography>

  <schmancy-typography type="body" token="md" class="mb-4">
    The benefits of using web components include encapsulation, reusability, and framework independence.
  </schmancy-typography>
</article>
```

### Dashboard Statistics

```html
<div class="stats-grid">
  <div class="stat-card">
    <schmancy-typography type="display" token="md" weight="bold" align="center">
      1,247
    </schmancy-typography>
    <schmancy-typography type="label" token="md" align="center" class="mt-2">
      Total Users
    </schmancy-typography>
  </div>

  <div class="stat-card">
    <schmancy-typography type="display" token="md" weight="bold" align="center">
      $12,459
    </schmancy-typography>
    <schmancy-typography type="label" token="md" align="center" class="mt-2">
      Revenue
    </schmancy-typography>
  </div>
</div>
```

### Form Labels and Help Text

```html
<div class="form-field">
  <schmancy-typography type="label" token="lg" weight="medium" class="mb-2">
    Email Address
  </schmancy-typography>

  <input type="email" class="form-input" />

  <schmancy-typography type="body" token="sm" class="mt-1 text-gray-600">
    We'll never share your email with anyone else.
  </schmancy-typography>
</div>
```

## Styling and Customization

### CSS Custom Properties

While the component provides comprehensive built-in styling, you can customize it further:

```css
schmancy-typography {
  /* Override default font family */
  font-family: 'Custom Font', -apple-system, BlinkMacSystemFont, sans-serif;

  /* Add custom letter spacing */
  letter-spacing: 0.025em;

  /* Custom color (use Tailwind classes preferably) */
  color: var(--custom-text-color);
}

/* Type-specific customizations */
schmancy-typography[type="display"] {
  /* Custom display font */
  font-family: 'Display Font', serif;
}

schmancy-typography[type="label"] {
  /* Slightly tighter letter spacing for labels */
  letter-spacing: 0.02em;
}
```

### Responsive Typography

```html
<!-- Responsive sizing using Tailwind classes -->
<schmancy-typography
  type="headline"
  token="md"
  class="md:text-4xl lg:text-5xl"
>
  Responsive Headline
</schmancy-typography>

<!-- Different typography on different screens -->
<div class="hidden md:block">
  <schmancy-typography type="display" token="lg">
    Desktop Display Text
  </schmancy-typography>
</div>

<div class="md:hidden">
  <schmancy-typography type="headline" token="md">
    Mobile Headline Text
  </schmancy-typography>
</div>
```

## Accessibility Features

### Semantic Structure
The component automatically uses appropriate semantic HTML based on context:
- Proper font sizes that meet WCAG guidelines
- Sufficient contrast ratios when using design system colors
- Readable line heights and spacing

### Screen Reader Support
- Text content is fully accessible to screen readers
- Proper text semantics preserved
- No interfering styling with assistive technologies

### Visual Accessibility
- All typography variants meet WCAG AA contrast requirements
- Font sizes are designed to be readable across different devices
- Line heights provide comfortable reading experience

## Browser Support

The component uses modern web standards and requires browsers that support:
- Custom Elements v1
- CSS Custom Properties
- CSS Flexbox
- Text overflow ellipsis
- Webkit line clamp (for max-lines feature)

## Typography Guidelines

### When to Use Each Type

- **Display**: Hero sections, landing page titles, major announcements
- **Headline**: Article titles, section headers, important UI headings
- **Title**: Card titles, dialog headers, navigation items
- **Subtitle**: Extended title variant for enhanced hierarchy
- **Body**: Paragraphs, descriptions, general content text
- **Label**: Button text, form labels, UI element labels

### Best Practices

1. **Hierarchy**: Use typography types to establish clear visual hierarchy
2. **Consistency**: Stick to the design system tokens for consistent spacing
3. **Readability**: Choose appropriate line lengths and spacing for content
4. **Performance**: Use semantic HTML structure for better SEO and accessibility
5. **Responsive**: Consider how typography scales across different screen sizes

## Related Components

- `schmancy-button` - Uses typography for button labels
- `schmancy-input` - Uses typography for labels and help text
- `schmancy-card` - Typography for card content structure
