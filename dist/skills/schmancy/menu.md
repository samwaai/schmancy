# schmancy-menu

> Context menu that opens a dialog with menu items positioned at the click location.

## Usage
```html
<schmancy-menu>
  <schmancy-button slot="trigger">Actions</schmancy-button>
  <schmancy-menu-item @click=${() => edit()}>Edit</schmancy-menu-item>
  <schmancy-menu-item @click=${() => remove()}>Delete</schmancy-menu-item>
</schmancy-menu>
```

## Slots
| Slot | Description |
|------|-------------|
| trigger | Button that opens the menu (clicks open dialog) |
| button | Legacy alias for trigger |
| default | Menu items or custom content |

## schmancy-menu-item
Auto-dismisses the dialog when clicked. Renders as a `schmancy-list-item` internally.

## Examples
```html
<!-- With icon button trigger -->
<schmancy-menu>
  <schmancy-icon-button slot="trigger">more_vert</schmancy-icon-button>
  <schmancy-menu-item @click=${() => duplicate()}>Duplicate</schmancy-menu-item>
  <schmancy-menu-item @click=${() => archive()}>Archive</schmancy-menu-item>
</schmancy-menu>

<!-- Default trigger (three-dot icon button) -->
<schmancy-menu>
  <schmancy-menu-item @click=${() => share()}>Share</schmancy-menu-item>
</schmancy-menu>
```

Uses `$dialog.component()` internally. Menu items auto-dismiss the dialog. Custom components in the default slot must call `$dialog.dismiss()` manually.
