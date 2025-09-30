# Option Component

A versatile option element designed for use with select dropdowns and autocomplete components, providing accessible and interactive selection items.

## Quick Start

```html
<!-- Basic option -->
<schmancy-option value="1">Option One</schmancy-option>

<!-- Option with custom label -->
<schmancy-option value="us">United States</schmancy-option>

<!-- Option with icon -->
<schmancy-option value="email" icon="✉️">Email Notifications</schmancy-option>
```

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `value` | `string` | `''` | The value when selected |
| `label` | `string` | `''` | Display label (defaults to text content) |
| `selected` | `boolean` | `false` | Whether option is selected |
| `disabled` | `boolean` | `false` | Whether option is disabled |
| `group` | `string` | `''` | Optional group name |
| `icon` | `string` | `''` | Optional icon/emoji |

## Events

### option-select
Fired when option is clicked or selected via keyboard.

```typescript
interface OptionSelectEvent {
  detail: {
    value: string;
  }
}
```

## Examples

### In Select Component
```html
<schmancy-select placeholder="Choose country">
  <schmancy-option value="us" icon="🇺🇸">United States</schmancy-option>
  <schmancy-option value="uk" icon="🇬🇧">United Kingdom</schmancy-option>
  <schmancy-option value="ca" icon="🇨🇦">Canada</schmancy-option>
  <schmancy-option value="au" icon="🇦🇺">Australia</schmancy-option>
</schmancy-select>
```

### Grouped Options
```html
<schmancy-select>
  <!-- North America -->
  <schmancy-option value="us" group="North America">United States</schmancy-option>
  <schmancy-option value="ca" group="North America">Canada</schmancy-option>
  <schmancy-option value="mx" group="North America">Mexico</schmancy-option>
  
  <!-- Europe -->
  <schmancy-option value="uk" group="Europe">United Kingdom</schmancy-option>
  <schmancy-option value="de" group="Europe">Germany</schmancy-option>
  <schmancy-option value="fr" group="Europe">France</schmancy-option>
</schmancy-select>
```

### With Status Indicators
```html
<schmancy-autocomplete>
  <schmancy-option value="active" icon="🟢">Active</schmancy-option>
  <schmancy-option value="pending" icon="🟡">Pending</schmancy-option>
  <schmancy-option value="inactive" icon="🔴">Inactive</schmancy-option>
  <schmancy-option value="archived" icon="📦" disabled>Archived</schmancy-option>
</schmancy-autocomplete>
```

### Dynamic Options
```html
${users.map(user => html`
  <schmancy-option 
    value="${user.id}"
    label="${user.name}"
    ?disabled="${!user.active}"
  >
    <span class="flex items-center gap-2">
      <schmancy-avatar size="xs" name="${user.name}"></schmancy-avatar>
      <span>
        <div>${user.name}</div>
        <div class="text-xs opacity-70">${user.email}</div>
      </span>
    </span>
  </schmancy-option>
`)}
```

## Features

### Automatic Value Assignment
- If no value is provided, uses text content
- If no label is provided, uses text content or value

### Keyboard Navigation
- `Space` or `Enter` to select
- Full keyboard accessibility

### Visual States
- Hover highlighting
- Selected state with checkmark
- Disabled state with reduced opacity
- Focus ring for keyboard navigation

### Unique IDs
Automatically generates unique IDs for accessibility if not provided.

## Styling

The component uses semantic design tokens:

```css
/* Default state */
.hover:bg-surface-high

/* Selected state */
.bg-primary-container
.text-primary-onContainer

/* Custom styling */
schmancy-option {
  --option-padding-y: 0.5rem;
  --option-padding-x: 0.75rem;
  --option-border-radius: 0.25rem;
}
```

## Accessibility

- `role="option"` for semantic meaning
- `aria-selected` state management
- `aria-disabled` for disabled options
- Keyboard event handling
- Focus management

## Integration

Options are designed to work seamlessly with:
- `schmancy-select` - Dropdown selection
- `schmancy-autocomplete` - Filtered selection
- Custom dropdown components

## Best Practices

1. **Clear Values**: Use meaningful, unique values
2. **Icons**: Use icons to improve scannability
3. **Groups**: Group related options together
4. **Labels**: Provide clear, concise labels
5. **Disabled State**: Clearly indicate why options are disabled

## Related Components

- [Select](./select.md) - Dropdown selector
- [Autocomplete](./autocomplete.md) - Searchable selector
- [List](./list.md) - Similar list item pattern
- [Menu](./menu.md) - Menu items

## Use Cases

1. **Form Selects**: Country, state, category selection
2. **Settings**: Preference options
3. **Filters**: Data filtering options
4. **Status Selection**: Workflow states
5. **User Selection**: Team member pickers