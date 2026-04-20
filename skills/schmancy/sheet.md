# schmancy-sheet / sheet

> Side/bottom panel with glass backdrop, luminous edge glow, and spring entry animation. Use `sheet` service for imperative usage.

## Usage
```typescript
import { sheet } from '@mhmo91/schmancy'

sheet.push({
  component: MyComponent,       // Component class or tag name
  position: SchmancySheetPosition.Side,
  props: { itemId: '123' },     // Passed to component
})
```

## sheet API
| Method | Description |
|--------|-------------|
| `push(config)` | Open a sheet with component content |
| `dismiss(uid?)` | Close sheet by uid, or most recent |
| `closeAll()` | Close all open sheets |
| `isOpen(uid)` | Check if sheet with uid is open |

## SheetConfig
| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `component` | `ComponentType` | required | Component class or lazy loader |
| `uid` | `string` | Auto-generated | Unique identifier for the sheet |
| `position` | `SchmancySheetPosition` | Auto (side on desktop, bottom on mobile) | `Side` or `Bottom` |
| `persist` | `boolean` | `false` | Keep DOM after close |
| `lock` | `boolean` | `false` | Prevent ESC and overlay click dismiss |
| `props` | `Record<string, unknown>` | `undefined` | Properties passed to component |
| `close` | `() => void` | `undefined` | Close callback |

## Component Properties (schmancy-sheet)
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `open` | `boolean` | `false` | Open state |
| `position` | `'side' \| 'bottom'` | `'side'` | Panel position |
| `persist` | `boolean` | `false` | Keep in DOM after close |
| `lock` | `boolean` | `false` | Disable dismiss via ESC/overlay |
| `handleHistory` | `boolean` | `true` | Handle browser back button |

## Events
| Event | Description |
|-------|-------------|
| `close` | Fired when sheet closes |

## Physics
- Glass backdrop: `backdrop-blur-lg` + `backdrop-saturate-150`
- Luminous edge glow on panel (primary color, 15% intensity)
- Spring entry: `scale(0.95)` to `scale(1)` with Blackbird easing
- Side: slides from right; Bottom: slides from bottom
- Background siblings set to `inert` while open
- Stacks with dialogs via shared `overlayStack` z-index manager

## Examples
```typescript
import { sheet, SchmancySheetPosition } from '@mhmo91/schmancy'

// Open side sheet
sheet.push({
  component: UserEditor,
  props: { userId: '456' },
})

// Locked bottom sheet
sheet.push({
  component: PaymentForm,
  position: SchmancySheetPosition.Bottom,
  lock: true,
})

// Dismiss programmatically
sheet.dismiss()
```
