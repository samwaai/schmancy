# Schmancy Icons - AI Reference

Modern Material Symbols icon component with variable font properties for dynamic icon styling.

```js
// Component Tag
<schmancy-icon
  fill="0-1"
  weight="100-700"
  grade="-50-200"
  variant="outlined|rounded|sharp">
  icon-name
</schmancy-icon>

// Examples
// 1. Basic icon (outlined style by default)
<schmancy-icon>home</schmancy-icon>

// 2. Filled vs Outlined
<schmancy-icon fill="0">favorite</schmancy-icon>    // Outlined heart
<schmancy-icon fill="1">favorite</schmancy-icon>    // Filled heart

// 3. Icon weight variations
<schmancy-icon weight="100">search</schmancy-icon>  // Thin
<schmancy-icon weight="400">search</schmancy-icon>  // Regular (default)
<schmancy-icon weight="700">search</schmancy-icon>  // Bold

// 4. Icon variants
<schmancy-icon variant="outlined">settings</schmancy-icon>  // Default
<schmancy-icon variant="rounded">settings</schmancy-icon>   // Rounded style
<schmancy-icon variant="sharp">settings</schmancy-icon>     // Sharp corners

// 5. Grade variations (visual weight)
<schmancy-icon grade="-25">notifications</schmancy-icon>  // Lighter
<schmancy-icon grade="0">notifications</schmancy-icon>    // Normal (default)
<schmancy-icon grade="200">notifications</schmancy-icon>  // Heavier

// 6. Combined properties
<schmancy-icon fill="1" weight="300" variant="rounded">
  star
</schmancy-icon>

// 7. Icon sizing (via CSS)
<schmancy-icon style="--schmancy-icon-size: 16px;">home</schmancy-icon>
<schmancy-icon style="--schmancy-icon-size: 32px;">home</schmancy-icon>
<schmancy-icon style="--schmancy-icon-size: 48px;">home</schmancy-icon>

// 8. Icons in buttons
<schmancy-button>
  <schmancy-icon slot="icon">download</schmancy-icon>
  Download
</schmancy-button>

<schmancy-button variant="filled">
  <schmancy-icon slot="icon" fill="1">add</schmancy-icon>
  Add Item
</schmancy-button>

// 9. Icons in list items
<schmancy-list-item>
  <schmancy-icon slot="start">folder</schmancy-icon>
  Documents
</schmancy-list-item>

<schmancy-list-item>
  <schmancy-icon slot="start" fill="1">star</schmancy-icon>
  Favorites
</schmancy-list-item>

// 10. Icon transitions (smooth property changes)
<schmancy-icon
  fill=${isLiked ? "1" : "0"}
  weight=${isLiked ? "700" : "400"}>
  favorite
</schmancy-icon>

// 11. Navigation icons
<schmancy-navigation-rail>
  <schmancy-icon slot="icon" fill=${activeTab === 'home' ? "1" : "0"}>
    home
  </schmancy-icon>
  <schmancy-icon slot="icon" fill=${activeTab === 'search' ? "1" : "0"}>
    search
  </schmancy-icon>
  <schmancy-icon slot="icon" fill=${activeTab === 'settings' ? "1" : "0"}>
    settings
  </schmancy-icon>
</schmancy-navigation-rail>

// 12. Status indicators
<div class="flex items-center gap-2">
  <schmancy-icon fill="1" class="text-success">check_circle</schmancy-icon>
  <span>Success</span>
</div>

<div class="flex items-center gap-2">
  <schmancy-icon fill="1" class="text-warning">warning</schmancy-icon>
  <span>Warning</span>
</div>

<div class="flex items-center gap-2">
  <schmancy-icon fill="1" class="text-error">error</schmancy-icon>
  <span>Error</span>
</div>

// 13. Form field icons
<schmancy-input>
  <schmancy-icon slot="prefix">search</schmancy-icon>
</schmancy-input>

<schmancy-input type="password">
  <schmancy-icon slot="suffix" fill=${showPassword ? "1" : "0"}>
    ${showPassword ? 'visibility_off' : 'visibility'}
  </schmancy-icon>
</schmancy-input>

// 14. Animated icon state
<schmancy-icon
  @click=${() => this.toggleBookmark()}
  fill=${this.isBookmarked ? "1" : "0"}
  weight=${this.isBookmarked ? "700" : "400"}
  style="cursor: pointer; transition: all 0.2s;">
  bookmark
</schmancy-icon>
```

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `fill` | `number` | `0` | Fill value (0 = outlined, 1 = filled) |
| `weight` | `number` | `400` | Stroke weight (100-700) |
| `grade` | `number` | `0` | Visual grade/weight (-50 to 200) |
| `variant` | `string` | `'outlined'` | Icon style variant: 'outlined', 'rounded', or 'sharp' |

## CSS Custom Properties

| Property | Default | Description |
|----------|---------|-------------|
| `--schmancy-icon-size` | `24px` | Icon size |
| `--schmancy-icon-fill` | `0` | Fill value |
| `--schmancy-icon-weight` | `400` | Weight value |
| `--schmancy-icon-grade` | `0` | Grade value |
| `--schmancy-icon-opsz` | `24` | Optical size |

## Material Symbols

This component uses Google's Material Symbols variable font, which provides:
- **3 variants**: Outlined, Rounded, Sharp
- **Variable properties**: Continuously adjustable fill, weight, and grade
- **2000+ icons**: Comprehensive icon library
- **Smooth transitions**: Animated property changes
- **Automatic font loading**: Fonts are loaded automatically when component is used

## Icon Names

Icons use Material Symbols naming convention. Common icons include:

### Navigation
- `home`, `arrow_back`, `arrow_forward`, `menu`, `close`, `more_vert`, `more_horiz`

### Actions
- `search`, `add`, `remove`, `edit`, `delete`, `save`, `share`, `download`, `upload`

### Communication
- `mail`, `chat`, `call`, `notifications`, `send`, `inbox`, `drafts`

### Media
- `play_arrow`, `pause`, `stop`, `skip_next`, `skip_previous`, `volume_up`, `mic`

### Status
- `check`, `close`, `error`, `warning`, `info`, `check_circle`, `cancel`

### Objects
- `folder`, `description`, `article`, `image`, `movie`, `music_note`, `code`

### User
- `person`, `group`, `face`, `account_circle`, `settings`, `logout`

Full icon list: https://fonts.google.com/icons

## Common Patterns

### Toggle Icons
```html
<!-- Like/Unlike -->
<schmancy-icon
  fill=${isLiked ? "1" : "0"}
  weight=${isLiked ? "700" : "400"}
  @click=${this.toggleLike}>
  favorite
</schmancy-icon>

<!-- Bookmark -->
<schmancy-icon fill=${isBookmarked ? "1" : "0"}>
  bookmark
</schmancy-icon>

<!-- Star Rating -->
<schmancy-icon fill=${rating >= 1 ? "1" : "0"}>star</schmancy-icon>
<schmancy-icon fill=${rating >= 2 ? "1" : "0"}>star</schmancy-icon>
<schmancy-icon fill=${rating >= 3 ? "1" : "0"}>star</schmancy-icon>
```

### Contextual Icons
```html
<!-- Success state -->
<schmancy-icon fill="1" class="text-success">check_circle</schmancy-icon>

<!-- Error state -->
<schmancy-icon fill="1" class="text-error">error</schmancy-icon>

<!-- Warning state -->
<schmancy-icon fill="1" class="text-warning">warning</schmancy-icon>

<!-- Info state -->
<schmancy-icon fill="0" class="text-info">info</schmancy-icon>
```

### Size Variations
```html
<!-- Small (16px) -->
<schmancy-icon style="--schmancy-icon-size: 16px;">home</schmancy-icon>

<!-- Default (24px) -->
<schmancy-icon>home</schmancy-icon>

<!-- Large (32px) -->
<schmancy-icon style="--schmancy-icon-size: 32px;">home</schmancy-icon>

<!-- Extra Large (48px) -->
<schmancy-icon style="--schmancy-icon-size: 48px;">home</schmancy-icon>
```

## Accessibility

- Icons are automatically marked with `aria-hidden="true"` for decorative use
- For interactive icons, provide `aria-label` or `aria-labelledby`
- For informational icons, include screen reader text:
  ```html
  <schmancy-icon aria-label="Warning">warning</schmancy-icon>
  ```

## Related Components
- **[Button](./button.md)**: Icons commonly used in buttons
- **[List](./list.md)**: Icons in list items
- **[Input](./input.md)**: Icons in form fields
- **[Chips](./chips.md)**: Icons in chip components