# Schmancy Menu - AI Reference

## Overview

The menu component provides context menus and dropdown menus using the `$dialog` service for positioning. Menus are portaled to `document.body` for proper z-index handling and work correctly in complex layouts (tables, virtualizers, overflow containers).

## Architecture

- **Positioning**: Uses `$dialog.component()` with mouse event position
- **Portal Pattern**: Menu items are temporarily moved to dialog at `document.body` level
- **Fixed Positioning**: Menus stay fixed to viewport and don't scroll with content
- **Auto-close**: Menus close on item click or when clicking outside

## Basic Usage

```js
// Basic Menu
<schmancy-menu>
  <schmancy-menu-item @click=${() => console.log('Item 1')}>Item 1</schmancy-menu-item>
  <schmancy-menu-item @click=${() => console.log('Item 2')}>Item 2</schmancy-menu-item>
  <schmancy-menu-item @click=${() => console.log('Item 3')}>Item 3</schmancy-menu-item>
</schmancy-menu>

// Menu with icons
<schmancy-menu>
  <schmancy-menu-item @click=${handleCopy}>
    <schmancy-icon slot="leading">content_copy</schmancy-icon>
    Copy
  </schmancy-menu-item>

  <schmancy-menu-item @click=${handleCut}>
    <schmancy-icon slot="leading">content_cut</schmancy-icon>
    Cut
  </schmancy-menu-item>

  <schmancy-menu-item @click=${handlePaste}>
    <schmancy-icon slot="leading">content_paste</schmancy-icon>
    Paste
  </schmancy-menu-item>
</schmancy-menu>

// Menu with custom trigger button
<schmancy-menu>
  <schmancy-button slot="button" variant="filled">
    Actions
  </schmancy-button>
  <schmancy-menu-item @click=${() => console.log('Edit')}>
    Edit
  </schmancy-menu-item>
  <schmancy-menu-item @click=${() => console.log('Delete')}>
    Delete
  </schmancy-menu-item>
</schmancy-menu>

// Default icon button trigger (no button slot provided)
<schmancy-menu>
  <schmancy-menu-item @click=${handleAction1}>Action 1</schmancy-menu-item>
  <schmancy-menu-item @click=${handleAction2}>Action 2</schmancy-menu-item>
</schmancy-menu>
```

## API Reference

### Menu Component

**Slots:**
- `button` - Custom trigger button (defaults to icon button with more_vert if not provided)
- `default` - Menu items (use schmancy-menu-item components)

**Positioning:**
- Automatically positioned using $dialog service
- Fixed to viewport (doesn't scroll with content)
- Portaled to document.body for proper stacking
- Works in complex layouts (tables, virtualizers, etc.)

### Menu Item Component

**Slots:**
- `leading` - Icon or content before the text
- `trailing` - Icon or content after the text
- `default` - Main content

**Events:**
- `schmancy-menu-item-click` - Fired when clicked (bubbles up, auto-closes menu)

## Real-World Examples

### Menu in Table Header (sorting)
```js
<schmancy-menu>
  <schmancy-icon-button slot="button" size="sm">
    ${sortDirection === 'asc' ? 'arrow_upward' : 'arrow_downward'}
  </schmancy-icon-button>
  ${sortOptions.map(opt => html`
    <schmancy-menu-item @click=${() => handleSort(opt.value)}>
      ${opt.active ? html`<schmancy-icon slot="start">check</schmancy-icon>` : ''}
      ${opt.label}
      ${opt.active ? html`<schmancy-icon slot="end">${direction}</schmancy-icon>` : ''}
    </schmancy-menu-item>
  `)}
</schmancy-menu>
```

### Menu in Virtualized List/Table
Works correctly in lit-virtualizer, overflow containers, and complex layouts:
```js
<lit-virtualizer .items=${items} .renderItem=${item => html`
  <div class="table-row">
    <span>${item.name}</span>
    <schmancy-menu>
      <schmancy-menu-item @click=${() => edit(item)}>Edit</schmancy-menu-item>
      <schmancy-menu-item @click=${() => delete(item)}>Delete</schmancy-menu-item>
    </schmancy-menu>
  </div>
`}></lit-virtualizer>
```

### Menu in Cards
```js
<schmancy-surface type="container" class="p-6">
  <div class="flex justify-between items-start">
    <h3>Card Title</h3>
    <schmancy-menu>
      <schmancy-menu-item @click=${handleShare}>
        <schmancy-icon slot="leading">share</schmancy-icon>
        Share
      </schmancy-menu-item>
      <schmancy-menu-item @click=${handleEdit}>
        <schmancy-icon slot="leading">edit</schmancy-icon>
        Edit
      </schmancy-menu-item>
      <schmancy-menu-item @click=${handleDelete}>
        <schmancy-icon slot="leading">delete</schmancy-icon>
        Delete
      </schmancy-menu-item>
    </schmancy-menu>
  </div>
</schmancy-surface>
```

## Implementation Notes

- Menu items are temporarily moved to dialog container when opened
- Items are moved back to original location when menu closes
- All event handlers remain functional during the move
- Menu positioning is handled by $dialog service using floating-ui
- No need to manage z-index or positioning manually
```