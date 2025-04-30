# Schmancy Dialog - AI Reference

```js
// Service API
$dialog.confirm({
  title?,
  message?,
  confirmText?,
  cancelText?,
  variant?: "default"|"danger",
  position: {x,y}|MouseEvent|TouchEvent,
  width?: string,
  content?: TemplateResult|HTMLElement|Function,
  onConfirm?: Function,
  onCancel?: Function
}) -> Promise<boolean>

$dialog.ask(message, event?) -> Promise<boolean>
$dialog.danger({...options}) -> Promise<boolean>
$dialog.component(content, options?) -> Promise<boolean>

// Component API
<confirm-dialog
  title?
  message?
  confirm-text?
  cancel-text?
  variant="default|danger"
  active?
  @confirm
  @cancel>
  <div slot="content">Custom content</div>
</confirm-dialog>

// Component methods
dialog.show(position) -> Promise<boolean>
dialog.hide(confirmed?) -> void

// Static helpers
ConfirmDialog.confirm({title?, message?, confirmText?, cancelText?, variant?, position, width?}) -> Promise<boolean>
ConfirmDialog.ask(event, message) -> Promise<boolean>

// Examples
// Simple
const confirmed = await $dialog.ask("Save changes?", event);

// Custom content
$dialog.component(html`<schmancy-input id="nameInput"></schmancy-input>`, {
  title: "Enter name",
  onConfirm: () => document.getElementById("nameInput").value
});
```
