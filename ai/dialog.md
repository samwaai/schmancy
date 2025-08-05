# Schmancy Dialog - AI Reference

## Quick Start

### Service API (Recommended)
```js
import { $dialog } from '@mhmo91/schmancy'

// Simple confirmation
const confirmed = await $dialog.ask("Save changes?")

// Confirmation with options
const confirmed = await $dialog.confirm({
  title: "Delete Item",
  message: "This action cannot be undone.",
  confirmText: "Delete",
  confirmColor: "error"  // Makes button red
})

// Custom component dialog
const result = await $dialog.component(html`
  <div class="p-4">
    <schmancy-input label="Name"></schmancy-input>
  </div>
`)

// Dismiss/close active dialog
$dialog.dismiss()  // or $dialog.close()
```

### Component API (Low-level)
```js
// In Lit component template
html`<schmancy-dialog id="myDialog">
  <div class="p-4">Content here</div>
</schmancy-dialog>`

// In Lit component class
@query('#myDialog') dialog!: SchmancyDialog

// Show dialog (returns promise)
const result = await this.dialog.show()        // Centered
const result = await this.dialog.show(event)   // At click position
const result = await this.dialog.show({x, y})  // At coordinates

// Hide dialog
this.dialog.hide(true)   // Resolve with true
this.dialog.hide(false)  // Resolve with false
```

## Service Methods

### $dialog.confirm(options)
Shows a confirmation dialog with title, message, and buttons.

```js
options = {
  title?: string,              // Dialog title
  subtitle?: string,           // Subtitle below title
  message?: string,            // Main message
  confirmText?: string,        // Confirm button text (default: "Confirm")
  cancelText?: string,         // Cancel button text (default: "Cancel")
  variant?: "default"|"danger",// Style variant
  confirmColor?: "primary"|"error"|"warning"|"success", // Button color
  position?: {x,y}|Event,      // Position (default: centered)
  width?: string,              // Dialog width (default: "360px")
  content?: TemplateResult,    // Custom content (replaces message)
  onConfirm?: Function,        // Confirm callback
  onCancel?: Function,         // Cancel callback
  targetContainer?: HTMLElement // Where to append dialog
}
```

### $dialog.ask(message, event?)
Simple confirmation with just a message.

### $dialog.danger(options)
Confirmation dialog with danger styling (same options as confirm, variant forced to "danger").

### $dialog.component(content, options?)
Shows dialog with custom content, no built-in buttons or title.

```js
content = TemplateResult | HTMLElement | (() => TemplateResult|HTMLElement)
options = {
  position?: {x,y}|Event,
  width?: string,
  targetContainer?: HTMLElement
}
```

### $dialog.dismiss()
Dismisses the most recently opened dialog. Returns true if a dialog was dismissed.

### $dialog.close()
Alias for `$dialog.dismiss()`. Closes the most recently opened dialog. Returns true if a dialog was closed.

## Component Structure

### schmancy-dialog
Basic dialog container without built-in UI.
- Shows overlay and positioned container
- Handles positioning (centered or at coordinates)
- Emits `close` event
- CSS variable: `--dialog-width`

### confirm-dialog
Extended dialog with title, message, and action buttons.
- All features of schmancy-dialog
- Built-in form with confirm/cancel buttons
- Supports custom content via slot
- Button colors based on `confirmColor` property

## Positioning

Dialogs can be positioned:
1. **Centered** (default) - Centers in viewport with slight upward shift
2. **At event** - Opens at click/touch position
3. **At coordinates** - Opens at specific {x, y}

Positioning automatically adjusts to stay within viewport using Floating UI.

## Examples

### Delete confirmation with red button
```js
const confirmed = await $dialog.confirm({
  title: "Delete Transaction",
  message: "Are you sure you want to delete this transaction?",
  confirmText: "Delete",
  confirmColor: "error"
})
```

### Form in dialog
```js
const result = await $dialog.component(html`
  <schmancy-form class="p-4">
    <schmancy-input label="Email" type="email" required></schmancy-input>
    <schmancy-input label="Password" type="password" required></schmancy-input>
    <div class="flex gap-2 mt-4">
      <schmancy-button @click=${() => $dialog.close()}>Cancel</schmancy-button>
      <schmancy-button type="submit">Login</schmancy-button>
    </div>
  </schmancy-form>
`)
```

### Context menu at click position
```js
// In Lit component
async handleContextMenu(e: MouseEvent) {
  const action = await $dialog.component(html`
    <schmancy-list>
      <schmancy-list-item @click=${() => $dialog.dismiss()}>Edit</schmancy-list-item>
      <schmancy-list-item @click=${() => $dialog.dismiss()}>Delete</schmancy-list-item>
    </schmancy-list>
  `, { position: e, width: '200px' })
  
  console.log('Selected:', action)
}

render() {
  return html`
    <schmancy-button @click=${this.handleContextMenu}>Options</schmancy-button>
  `
}
```

## Important Notes

1. **Service is singleton** - All dialogs managed centrally
2. **Auto-cleanup** - Dialogs removed from DOM after closing
3. **Theme-aware** - Dialogs attach to nearest `<schmancy-theme>` element
4. **Stacking** - Multiple dialogs stack with proper z-index
5. **Responsive** - Dialogs resize and reposition on viewport changes
6. **Keyboard** - ESC key triggers cancel (via overlay click)