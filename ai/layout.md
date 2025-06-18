# Schmancy Layout - AI Reference

## ⚠️ DEPRECATION NOTICE

The following layout components are **deprecated** and will be removed in a future version:
- `<schmancy-grid>` - Use Tailwind CSS grid classes instead
- `<schmancy-flex>` - Use Tailwind CSS flex classes instead  
- `<sch-flex>` - Use Tailwind CSS flex classes instead
- Layout base class - Use Tailwind utilities directly

### Migration Guide

```html
<!-- OLD (deprecated) -->
<schmancy-grid columns="3" gap="16px">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</schmancy-grid>

<!-- NEW (recommended) -->
<div class="grid grid-cols-3 gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>

<!-- OLD (deprecated) -->
<schmancy-flex direction="row" gap="16px" justify-content="space-between">
  <div>Left</div>
  <div>Right</div>
</schmancy-flex>

<!-- NEW (recommended) -->
<div class="flex flex-row gap-4 justify-between">
  <div>Left</div>
  <div>Right</div>
</div>
```

## Modern Layout Approach with Tailwind CSS

Instead of using deprecated layout components, use Tailwind CSS utilities directly:

### Grid Layouts
```html
<!-- Basic grid -->
<div class="grid grid-cols-3 gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>

<!-- Responsive grid -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  <div>Card 1</div>
  <div>Card 2</div>
  <div>Card 3</div>
  <div>Card 4</div>
</div>

<!-- Grid with template areas -->
<div class="grid grid-rows-[auto_1fr_auto] grid-cols-[250px_1fr] h-screen">
  <header class="col-span-2">Header</header>
  <aside>Sidebar</aside>
  <main>Content</main>
  <footer class="col-span-2">Footer</footer>
</div>
```

### Flex Layouts
```html
<!-- Basic flex -->
<div class="flex gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
  <div class="flex-1">Flexible Item</div>
</div>

<!-- Column direction with alignment -->
<div class="flex flex-col items-center gap-4">
  <h2>Title</h2>
  <p>Content</p>
  <button>Action</button>
</div>

<!-- Responsive flex -->
<div class="flex flex-col md:flex-row items-center md:justify-between gap-4">
  <div>Logo</div>
  <nav class="flex gap-2">
    <a href="#">Link 1</a>
    <a href="#">Link 2</a>
  </nav>
</div>
```

### Common Layout Patterns

```html
<!-- Form layout -->
<form class="flex flex-col gap-4 max-w-md mx-auto">
  <h2 class="text-2xl font-bold">Contact Form</h2>
  <schmancy-input label="Name"></schmancy-input>
  <schmancy-input label="Email"></schmancy-input>
  <schmancy-textarea label="Message"></schmancy-textarea>
  
  <div class="flex gap-2 justify-end">
    <schmancy-button variant="outlined">Cancel</schmancy-button>
    <schmancy-button variant="filled">Submit</schmancy-button>
  </div>
</form>

<!-- App layout -->
<div class="grid grid-rows-[auto_1fr] h-screen">
  <header class="border-b">
    <!-- Navigation -->
  </header>
  <div class="grid grid-cols-[250px_1fr]">
    <aside class="border-r">
      <!-- Sidebar -->
    </aside>
    <main class="overflow-auto p-4">
      <!-- Content -->
    </main>
  </div>
</div>

<!-- Card grid -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
  <schmancy-card>Card 1</schmancy-card>
  <schmancy-card>Card 2</schmancy-card>
  <schmancy-card>Card 3</schmancy-card>
</div>
```

### Useful Tailwind Classes

#### Grid
- `grid` - Display grid
- `grid-cols-{n}` - Number of columns
- `grid-rows-{n}` - Number of rows
- `gap-{size}` - Gap between items
- `col-span-{n}` - Column span
- `row-span-{n}` - Row span
- `place-items-{align}` - Align items
- `place-content-{align}` - Align content

#### Flex
- `flex` - Display flex
- `flex-row` / `flex-col` - Direction
- `flex-wrap` / `flex-nowrap` - Wrapping
- `items-{align}` - Align items
- `justify-{align}` - Justify content
- `gap-{size}` - Gap between items
- `flex-1` / `flex-none` - Flex grow/shrink

#### Spacing
- `p-{size}` - Padding
- `m-{size}` - Margin
- `space-x-{size}` - Horizontal spacing
- `space-y-{size}` - Vertical spacing

#### Sizing
- `w-{size}` - Width
- `h-{size}` - Height
- `min-w-{size}` - Min width
- `max-w-{size}` - Max width
- `min-h-{size}` - Min height
- `max-h-{size}` - Max height

## Non-Deprecated Components

### Scroll Container (if available)
```html
<schmancy-scroll
  direction="vertical|horizontal|both"
  scrollbar="auto|always|hover|none">
  <!-- Scrollable content -->
</schmancy-scroll>
```

For most cases, use Tailwind's overflow utilities instead:
```html
<div class="overflow-auto h-64">
  <!-- Scrollable content -->
</div>
```