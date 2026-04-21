# schmancy-kbd

> Render a keyboard shortcut hint. Semantically a `<kbd>` element; visually styled as a pressed key.

## Usage
```html
Press <schmancy-kbd>⌘</schmancy-kbd> + <schmancy-kbd>K</schmancy-kbd> to search.
```

## Properties
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| size | `'sm'\|'md'` | `'md'` | Smaller variant for inline text. |

## Parts
| Part | Description |
|------|-------------|
| base | The inner native `<kbd>` element. |

## Examples
```html
<!-- Inline combo -->
<schmancy-typography>
  <schmancy-kbd size="sm">Shift</schmancy-kbd>
  +
  <schmancy-kbd size="sm">Tab</schmancy-kbd>
  to move backwards
</schmancy-typography>
```

```html
<!-- Command palette shortcut -->
<div class="flex items-center gap-2">
  Open command palette
  <span>
    <schmancy-kbd>⌘</schmancy-kbd>
    <schmancy-kbd>K</schmancy-kbd>
  </span>
</div>
```
