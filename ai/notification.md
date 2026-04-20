# $notify

> Notification service with type-colored luminous glow, progress bar countdown, and arc-path entry animation.

## Usage
```typescript
import { $notify } from '@mhmo91/schmancy'

$notify.success('Item saved')
$notify.error('Failed to connect')
```

## $notify API
| Method | Returns | Description |
|--------|---------|-------------|
| `success(message?, options?)` | `string` (id) | Green glow, 1.5s duration |
| `error(message?, options?)` | `string` (id) | Red glow, 2.5s duration |
| `warning(message?, options?)` | `string` (id) | Orange glow, 2.5s duration |
| `info(message?, options?)` | `string` (id) | Blue glow, 2s duration |
| `show(options)` | `string` (id) | Full options control |
| `persistent(message, options?)` | `string` (id) | No auto-dismiss (duration: 0) |
| `customDuration(msg, ms, options?)` | `string` (id) | Custom duration in ms |
| `dismiss(id?)` | `void` | Dismiss by id or most recent |
| `update(id, options)` | `void` | Update existing notification content |

## Options
| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `message` | `string` | required | Notification body text |
| `title` | `string` | `undefined` | Optional title line |
| `type` | `'info' \| 'success' \| 'warning' \| 'error'` | `'info'` | Notification type |
| `duration` | `number` | Type-specific | Auto-dismiss ms (0 = persistent) |
| `closable` | `boolean` | `true` | Show close button |
| `playSound` | `boolean` | `true` | Play type-specific sound |
| `showProgress` | `boolean` | `false` | Show indeterminate progress bar |

## Physics
- Type-colored luminous glow shadow (18% intensity, 28% on hover)
- Arc-path entry animation from last click position to top-right corner
- Hover: glow intensifies + `translateY(-2px)` lift
- Progress bar shows countdown timer; pauses on hover
- Only one notification visible at a time (replaces previous)

## Examples
```typescript
// Success with title
$notify.success('Changes saved', { title: 'Success' })

// Persistent loading indicator
const id = $notify.persistent('Processing...', { showProgress: true })
// Later: dismiss it
$notify.dismiss(id)

// Error with longer duration
$notify.error('Connection lost', { duration: 5000 })

// Update existing notification
const nid = $notify.info('Uploading...')
$notify.update(nid, { message: 'Upload complete', type: 'success' })
```
