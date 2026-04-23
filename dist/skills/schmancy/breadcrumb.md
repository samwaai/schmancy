# schmancy-breadcrumb

> Breadcrumb navigation with auto-inserted separators and ARIA landmark semantics.

## Usage
```html
<schmancy-breadcrumb>
  <schmancy-breadcrumb-item href="/">Home</schmancy-breadcrumb-item>
  <schmancy-breadcrumb-item href="/projects">Projects</schmancy-breadcrumb-item>
  <schmancy-breadcrumb-item current>Dashboard</schmancy-breadcrumb-item>
</schmancy-breadcrumb>
```

## schmancy-breadcrumb

Container. Renders a `<nav aria-label="Breadcrumb">` and inserts a separator element between each slotted item.

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| separator | string | `'/'` | Character or string rendered between items. Hidden from assistive tech via `aria-hidden="true"`. |

| Part | Description |
|------|-------------|
| separator | Each inserted separator element. Style bulk via `schmancy-breadcrumb::part(separator)`. |

The host sets `aria-label="Breadcrumb"` on connection if none was already set.

## schmancy-breadcrumb-item

Individual crumb. Renders as `<a>` when `href` is set, otherwise `<span>`.

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| href | string | `''` | When set (and `current` is false), renders as an anchor. |
| current | boolean | `false` | Marks this item as `aria-current="page"`. Renders as a plain `<span>` even if `href` is set. |

## Examples
```html
<!-- Custom separator -->
<schmancy-breadcrumb separator="›">
  <schmancy-breadcrumb-item href="/">Home</schmancy-breadcrumb-item>
  <schmancy-breadcrumb-item href="/docs">Docs</schmancy-breadcrumb-item>
  <schmancy-breadcrumb-item current>API</schmancy-breadcrumb-item>
</schmancy-breadcrumb>
```

```html
<!-- Two-level (just two crumbs) -->
<schmancy-breadcrumb>
  <schmancy-breadcrumb-item href="/users">Users</schmancy-breadcrumb-item>
  <schmancy-breadcrumb-item current>Jane Doe</schmancy-breadcrumb-item>
</schmancy-breadcrumb>
```
