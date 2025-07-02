# Schmancy Dialog - AI Reference

```js
// Basic Dialog Component
<schmancy-dialog
  uid?="string">                             // Unique identifier for dialog instance
  <!-- Dialog content goes here -->
  <div>Dialog content</div>
</schmancy-dialog>

// Dialog Component Methods
dialog.show(position?) -> Promise<boolean>   // Show dialog, optionally at a specific position
dialog.hide(result?) -> void                 // Hide dialog with optional result (true/false)

// Position can be:
// - Undefined: Centers dialog in viewport
// - Coordinates: { x: number, y: number }
// - MouseEvent: Uses click coordinates
// - TouchEvent: Uses touch coordinates

// Dialog Events
@close   // Fires when dialog is closed

// CSS Variables
--dialog-width: 360px                        // Controls dialog width

// Confirm Dialog Component (used internally by service)
<confirm-dialog
  title?="string"                            // Dialog title
  subtitle?="string"                         // Dialog subtitle  
  message?="string"                          // Dialog message
  confirm-text?="string"                     // Confirm button text (default: "Confirm")
  cancel-text?="string"                      // Cancel button text (default: "Cancel")
  variant?="default|danger"                  // Dialog variant (default: "default")
  confirm-color?="primary|error|warning|success">  // Confirm button color
  <div slot="content">Custom content</div>
</confirm-dialog>

// Service API (higher-level abstraction)
$dialog.confirm({
  title?,
  subtitle?,
  message?,
  confirmText?,
  cancelText?,
  variant?: "default"|"danger",
  confirmColor?: "primary"|"error"|"warning"|"success",  // Button color for confirm action
  position?: {x,y}|MouseEvent|TouchEvent,
  width?: string,
  content?: TemplateResult|HTMLElement|Function,
  onConfirm?: Function,
  onCancel?: Function,
  targetContainer?: HTMLElement              // Container to append dialog to (defaults to document.body)
}) -> Promise<boolean>

$dialog.ask(message, event?) -> Promise<boolean>
$dialog.danger({...options}) -> Promise<boolean>
$dialog.component(content, options?) -> Promise<boolean>
$dialog.dismiss() -> boolean                 // Dismiss most recently opened dialog

// Examples
// Basic dialog usage
const dialog = document.querySelector('schmancy-dialog');
// Show dialog centered
const result = await dialog.show();
// Show dialog at specific coordinates
const result = await dialog.show({ x: 100, y: 200 });
// Show dialog at click position
button.addEventListener('click', async (e) => {
  const result = await dialog.show(e);
  console.log('Dialog result:', result);
});

// Manually hiding dialog
dialog.hide(true);  // Hide with positive result
dialog.hide(false); // Hide with negative result

// Dialog with confirm/cancel buttons
<schmancy-dialog id="confirmDialog">
  <div style="padding: 16px;">
    <h3>Confirm Action</h3>
    <p>Are you sure you want to proceed?</p>
    <div style="display: flex; justify-content: flex-end; gap: 8px; margin-top: 16px;">
      <schmancy-button variant="text" @click=${() => dialog.hide(false)}>
        Cancel
      </schmancy-button>
      <schmancy-button variant="filled" @click=${() => dialog.hide(true)}>
        Confirm
      </schmancy-button>
    </div>
  </div>
</schmancy-dialog>

// Using the dialog service
// Simple confirmation
const confirmed = await $dialog.ask("Save changes?", event);

// Confirmation with custom options
const confirmed = await $dialog.confirm({
  title: "Confirm Deletion",
  message: "Are you sure you want to delete this item? This action cannot be undone.",
  confirmText: "Delete",
  cancelText: "Cancel",
  variant: "danger",
  position: event
});

// Confirmation with colored button
const confirmed = await $dialog.confirm({
  title: "Delete Transaction",
  message: `Are you sure you want to delete this transaction of ${amount} units?`,
  confirmText: "Delete",
  cancelText: "Cancel",
  confirmColor: "error",  // Makes confirm button red
});

// Dialog with custom content
const result = await $dialog.component(html`
  <div>
    <schmancy-input id="nameInput" label="Your Name"></schmancy-input>
  </div>
`, {
  title: "Enter Name",
  confirmText: "Submit",
  onConfirm: () => {
    const value = document.getElementById("nameInput").value;
    return value ? true : false;
  }
});

// Dialog for dangerous actions
const confirmed = await $dialog.danger({
  title: "Warning",
  message: "You are about to delete your account. This action is permanent.",
  confirmText: "Delete Account",
  position: event
});
```