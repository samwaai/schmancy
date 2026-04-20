# schmancy-dialog / $dialog

> Dialog with glass surface, cursorGlow, and mobile bottom-sheet adaptation. Use `$dialog` service for imperative usage.

## Usage
```typescript
import { $dialog } from '@mhmo91/schmancy'

// Confirm dialog
const confirmed = await $dialog.confirm({
  title: 'Delete item?',
  message: 'This cannot be undone.',
  confirmText: 'Delete',
  cancelText: 'Cancel',
  variant: 'danger',
})

// Component dialog (renders any template/element)
await $dialog.component(html`<my-editor .data=${item}></my-editor>`)
```

## $dialog API
| Method | Returns | Description |
|--------|---------|-------------|
| `confirm(options)` | `Promise<boolean>` | Show confirm dialog with title/message/buttons |
| `ask(message, event?)` | `Promise<boolean>` | Quick confirm with just a message |
| `danger(options)` | `Promise<boolean>` | Confirm with danger variant |
| `component(content, options?)` | `Promise<boolean>` | Show any template/element as dialog |
| `prompt(options)` | `Promise<string \| null>` | Input dialog, returns value or null |
| `dismiss()` | `boolean` | Dismiss topmost dialog |

## Confirm Options
| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `title` | `string` | `undefined` | Dialog title |
| `subtitle` | `string` | `undefined` | Subtitle below title |
| `message` | `string` | `undefined` | Body message |
| `confirmText` | `string` | `'Confirm'` | Confirm button label |
| `cancelText` | `string` | `'Cancel'` | Cancel button label |
| `variant` | `'default' \| 'danger'` | `'default'` | Button color scheme |
| `position` | `{x,y} \| MouseEvent` | Last click | Animation origin |
| `content` | `TemplateResult \| HTMLElement` | `undefined` | Custom content in body |

## Physics
- **cursorGlow** on dialog surface (radius: 250, intensity: 0.1)
- Glass surface with `backdrop-blur-lg` and `backdrop-saturate-150`
- Luminous glow shadow around dialog container
- Mobile: renders as bottom sheet with drag handle and swipe dismiss

## Examples
```typescript
// Quick ask
if (await $dialog.ask('Remove this entry?', event)) {
  removeEntry()
}

// Prompt for input
const name = await $dialog.prompt({
  title: 'Rename',
  label: 'New name',
  defaultValue: currentName,
})

// Custom component dialog
await $dialog.component(
  html`<user-profile-editor .user=${user}></user-profile-editor>`,
  { position: event }
)
```
