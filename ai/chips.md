# Schmancy Chips - AI Reference

## 🎯 Chip Type Behavior Matrix

Understanding the behavioral differences between chip types is crucial for proper implementation:

| Chip Type | Has Selected State | Click Behavior | Primary Purpose | Remove Button |
|-----------|-------------------|----------------|-----------------|---------------|
| **Filter** | ✅ Yes (toggles) | Toggles selected state on/off | Filtering content, toggling options | ❌ No |
| **Assist** | ❌ No | Triggers an action (no state change) | Smart actions, automation, help | ❌ No |
| **Input** | ❌ No | No default behavior (custom action) | Representing user data/selections | ✅ Optional |
| **Suggestion** | ❌ No | Triggers an action (no state change) | Quick recommendations, shortcuts | ❌ No |

### ⚠️ Important Behavioral Notes

- **ONLY Filter chips have a selected state** - They toggle on/off to filter content
- **Assist/Suggestion chips trigger actions** - They don't change state, they perform operations
- **Input chips represent data** - They show user selections and can be removed
- **Default type is 'filter'** - For backward compatibility with existing code

### 🔧 Pure Schmancy Implementation

This is a pure Schmancy implementation that:
- ✅ **No Material Design imports** - Built entirely with Lit, Tailwind CSS, and RxJS
- ✅ **Full Material Design 3 compliance** - Maintains all MD3 behaviors and styling
- ✅ **Reactive architecture** - Uses RxJS for state management and event handling
- ✅ **Tailwind styling** - All styling done with Tailwind classes, no CSS-in-JS

## Material Web Aligned API

The schmancy chips component fully supports Material Design 3 chip specifications with all four chip types:

- **filter**: Toggle chips for filtering content (selectable) - default type
- **assist**: Action chips for prompting smart/automated actions
- **input**: Removable chips for user inputs and data
- **suggestion**: Chips for quick suggestions and recommendations

## Usage Examples

```js
// MATERIAL WEB COMPLIANT CHIP TYPES

// Assist Chip - For actions and navigation
<schmancy-chip type="assist" value="share">
  <schmancy-icon slot="icon">share</schmancy-icon>
  Share
</schmancy-chip>

// Filter Chip - Toggleable filters (default type for backward compatibility)
<schmancy-chip type="filter" value="starred" selected>
  <schmancy-icon slot="icon">star</schmancy-icon>
  Starred
</schmancy-chip>

// Input Chip - User inputs with optional remove button
<schmancy-chip type="input" value="john-doe" removable @remove=${handleRemove}>
  <schmancy-icon slot="icon">person</schmancy-icon>
  John Doe
</schmancy-chip>

// Suggestion Chip - Quick suggestions
<schmancy-chip type="suggestion" value="reply">
  <schmancy-icon slot="icon">reply</schmancy-icon>
  Reply
</schmancy-chip>

// ENHANCED PROPERTIES

// Elevated chips for more emphasis
<schmancy-chip type="assist" elevated>
  <schmancy-icon slot="icon">add</schmancy-icon>
  Create New
</schmancy-chip>

// Soft-disabled for partial interaction
<schmancy-chip type="filter" soft-disabled>
  Premium Only
</schmancy-chip>

// Avatar support for input chips
<schmancy-chip type="input" avatar removable>
  <img slot="icon" src="user.jpg" alt="User">
  Alice Smith
</schmancy-chip>

// BACKWARD COMPATIBLE USAGE (still works!)

// Simple text chip (defaults to filter type)
<schmancy-chip value="javascript">
  JavaScript
</schmancy-chip>

// Chip with icon in content (legacy style - still supported)
<schmancy-chip value="edit">
  <schmancy-icon>edit</schmancy-icon>
  Edit
</schmancy-chip>

// Icon slot usage (recommended for proper Material Web alignment)
<schmancy-chip value="star" selected>
  <schmancy-icon slot="icon">star</schmancy-icon>
  Starred
</schmancy-chip>

// Complex content with Tailwind classes
<schmancy-chip value="user1" class="flex items-center gap-2">
  <schmancy-avatar size="sm">JD</schmancy-avatar>
  <schmancy-typography type="body" token="sm">john.doe@example.com</schmancy-typography>
</schmancy-chip>

// CHIPS CONTAINER

// Single Selection Mode - Automatically detected from .value property
<schmancy-chips
  .value=${selectedValue}
  @change=${handleSelectionChange}>
  <schmancy-chip type="filter" value="1">Option 1</schmancy-chip>
  <schmancy-chip type="filter" value="2">Option 2</schmancy-chip>
  <schmancy-chip type="filter" value="3">Option 3</schmancy-chip>
</schmancy-chips>

// Multiple Selection Mode - Automatically detected from .values property
<schmancy-chips
  .values=${selectedValues}
  @change=${handleSelectionChange}>
  <schmancy-chip type="filter" value="red">Red</schmancy-chip>
  <schmancy-chip type="filter" value="green">Green</schmancy-chip>
  <schmancy-chip type="filter" value="blue">Blue</schmancy-chip>
</schmancy-chips>

// Layout-only Mode - No selection management when neither property is used
<schmancy-chips>
  <schmancy-chip type="assist" value="share">Share</schmancy-chip>
  <schmancy-chip type="assist" value="save">Save</schmancy-chip>
</schmancy-chips>

// Mixed chip types in container
<schmancy-chips @remove=${handleRemove}>
  <schmancy-chip type="input" value="tag1" removable>
    <schmancy-icon slot="icon">label</schmancy-icon>
    Important
  </schmancy-chip>
  <schmancy-chip type="assist" value="add">
    <schmancy-icon slot="icon">add</schmancy-icon>
    Add Tag
  </schmancy-chip>
</schmancy-chips>

// Horizontal scrolling chips
<schmancy-chips wrap="false">
  <schmancy-chip type="filter" value="mon">Monday</schmancy-chip>
  <schmancy-chip type="filter" value="tue">Tuesday</schmancy-chip>
  <schmancy-chip type="filter" value="wed">Wednesday</schmancy-chip>
  <schmancy-chip type="filter" value="thu">Thursday</schmancy-chip>
  <schmancy-chip type="filter" value="fri">Friday</schmancy-chip>
</schmancy-chips>
```

## Component Properties

### schmancy-chip

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `type` | `'assist' \| 'filter' \| 'input' \| 'suggestion'` | `'filter'` | Chip type (Material Web spec) |
| `value` | `string` | `''` | Value for selection/identification |
| `selected` | `boolean` | `false` | Whether chip is selected (ONLY applies to filter chips) |
| `label` | `string` | `''` | Text label (alternative to slot content) |
| `icon` | `string` | `''` | Legacy emoji/icon support |
| `avatar` | `boolean` | `false` | Enable avatar mode (input chips) |
| `elevated` | `boolean` | `false` | Add elevation shadow |
| `soft-disabled` | `boolean` | `false` | Partial disable state |
| `removable` | `boolean` | `false` | Show remove button (input chips) |
| `readOnly` | `boolean` | `false` | Make chip non-interactive |
| `disabled` | `boolean` | `false` | Fully disable chip |

### schmancy-chips

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `multi` | `boolean` | `false` | **[Deprecated]** Use `.values` for multi-selection or `.value` for single-selection |
| `value` | `string` | `''` | Selected value (automatically enables single-selection mode) |
| `values` | `string[]` | `[]` | Selected values (automatically enables multi-selection mode) |
| `wrap` | `boolean` | `true` | Whether chips wrap to new lines |

#### 🎯 Automatic Mode Detection

The `schmancy-chips` container now **automatically detects** the selection mode based on which property you use:

- **`.values` array** → Automatically enables **multi-selection mode**
- **`.value` string** → Automatically enables **single-selection mode**
- **Neither property** → Layout-only mode (no selection management)

The deprecated `multi` property is kept for backward compatibility but is no longer needed.

## Events

### schmancy-chip Events

- `@change` - Fires when selection changes (ONLY for filter chips)
  - Detail: `{ value: string, selected: boolean }`
  - Note: Only filter chips emit this event when toggling selected state
- `@remove` - Fires when remove button clicked (ONLY for input chips with `removable` prop)
  - Detail: `{ value: string }`
  - Note: Requires `type="input"` and `removable` property
- `@click` - Standard click event (all chip types)
  - For assist/suggestion chips: Use this to trigger actions
  - For filter chips: Internally handled to toggle selection
  - For input chips: Use for custom click handling

### schmancy-chips Events

- `@change` - Fires when selection changes
  - Detail: `string` (single mode) or `string[]` (multi mode)
- `@remove` - Bubbled from child chip remove events
  - Detail: `{ value: string }`

## Slots

### Icon Slot (Recommended)
Use the `icon` slot for proper Material Web icon alignment:

```html
<schmancy-chip value="star">
  <schmancy-icon slot="icon">star</schmancy-icon>
  Starred
</schmancy-chip>
```

### Default Slot
The default slot accepts any content, including text, icons, and complex layouts:

```html
<schmancy-chip value="complex">
  <div class="flex items-center gap-2">
    <schmancy-avatar size="sm">JD</schmancy-avatar>
    <span>John Doe</span>
    <schmancy-badge>5</schmancy-badge>
  </div>
</schmancy-chip>
```

## Real-World Examples

### Tag Input with Remove
```js
<schmancy-chips @remove=${handleTagRemove}>
  ${tags.map(tag => html`
    <schmancy-chip
      type="input"
      value=${tag.id}
      removable>
      <schmancy-icon slot="icon">label</schmancy-icon>
      ${tag.name}
    </schmancy-chip>
  `)}
  <schmancy-chip type="assist" value="add" @click=${addTag}>
    <schmancy-icon slot="icon">add</schmancy-icon>
    Add Tag
  </schmancy-chip>
</schmancy-chips>
```

### Filter Bar with Multiple Types
```js
<schmancy-chips .values=${activeFilters}>
  <schmancy-chip type="filter" value="in-stock">
    <schmancy-icon slot="icon">inventory</schmancy-icon>
    In Stock
  </schmancy-chip>
  <schmancy-chip type="filter" value="on-sale">
    <schmancy-icon slot="icon">sell</schmancy-icon>
    On Sale
  </schmancy-chip>
  <schmancy-chip type="filter" value="free-shipping">
    <schmancy-icon slot="icon">local_shipping</schmancy-icon>
    Free Shipping
  </schmancy-chip>
</schmancy-chips>
```

### User Selection with Avatars
```js
<schmancy-chips>
  ${users.map(user => html`
    <schmancy-chip
      type="input"
      value=${user.id}
      avatar
      removable>
      <img slot="icon" src=${user.avatar} alt=${user.name}>
      ${user.name}
    </schmancy-chip>
  `)}
</schmancy-chips>
```

### Action Chips
```js
<div class="flex gap-2">
  <schmancy-chip type="assist" elevated @click=${handleShare}>
    <schmancy-icon slot="icon">share</schmancy-icon>
    Share
  </schmancy-chip>
  <schmancy-chip type="assist" @click=${handleBookmark}>
    <schmancy-icon slot="icon">bookmark</schmancy-icon>
    Save
  </schmancy-chip>
  <schmancy-chip type="assist" @click=${handlePrint}>
    <schmancy-icon slot="icon">print</schmancy-icon>
    Print
  </schmancy-chip>
</div>
```

### Suggestion Chips
```js
<schmancy-chips>
  <schmancy-chip type="suggestion" value="recently-viewed">
    <schmancy-icon slot="icon">history</schmancy-icon>
    Recently Viewed
  </schmancy-chip>
  <schmancy-chip type="suggestion" value="recommended">
    <schmancy-icon slot="icon">thumb_up</schmancy-icon>
    Recommended
  </schmancy-chip>
  <schmancy-chip type="suggestion" value="trending">
    <schmancy-icon slot="icon">trending_up</schmancy-icon>
    Trending
  </schmancy-chip>
</schmancy-chips>
```

## Common Mistakes to Avoid

### ❌ Trying to use `selected` on non-filter chips
```js
// WRONG - Only filter chips support selected state
<schmancy-chip type="assist" selected>Help</schmancy-chip>
<schmancy-chip type="input" selected>Tag</schmancy-chip>
<schmancy-chip type="suggestion" selected>Tip</schmancy-chip>

// CORRECT - Only use selected with filter type
<schmancy-chip type="filter" selected>Active Filter</schmancy-chip>
```

### ❌ Expecting state changes from assist/suggestion chips
```js
// WRONG - Expecting assist chip to maintain state
<schmancy-chip type="assist" @change=${handleChange}>
  Share
</schmancy-chip>

// CORRECT - Use click event for actions
<schmancy-chip type="assist" @click=${handleShare}>
  Share
</schmancy-chip>
```

### ❌ Using remove button on non-input chips
```js
// WRONG - Only input chips support removable
<schmancy-chip type="filter" removable>Filter</schmancy-chip>
<schmancy-chip type="assist" removable>Action</schmancy-chip>

// CORRECT - Use removable only with input type
<schmancy-chip type="input" removable @remove=${handleRemove}>
  User Tag
</schmancy-chip>
```

## Migration Guide

### From Legacy to Material Web API

```js
// OLD (still works for backward compatibility)
<schmancy-chip value="star" selected icon="">
  <schmancy-icon>star</schmancy-icon>
  Starred
</schmancy-chip>

// NEW (Material Web compliant)
<schmancy-chip type="filter" value="star" selected>
  <schmancy-icon slot="icon">star</schmancy-icon>
  Starred
</schmancy-chip>
```

### Key Changes
1. Add `type` property to explicitly set chip behavior
2. Use `slot="icon"` for icons to ensure proper placement
3. Use `removable` property for input chips with remove functionality
4. Use `elevated` for visual emphasis
5. Use `soft-disabled` for partial interaction states

All existing code continues to work - the default type is `'filter'` for backward compatibility.