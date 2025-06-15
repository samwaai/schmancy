# Demo Components TODO

## Components that need demo rewrite

These components have existing demo files but need to be rewritten following the new structure (Installation → Import → API → Examples):

### Layout & Navigation
- [ ] Tabs (`demo/src/features/tabs.ts`)
- [ ] Drawer (`demo/src/features/drawer-content.ts`)
- [ ] Sheet (`demo/src/features/sheet/sheet.ts`)

### Data Display
- [ ] Table (`demo/src/features/table.ts`)
- [ ] List (`demo/src/features/list.ts`)
- [ ] Tree (`demo/src/features/tree.ts`)
- [ ] Avatar (`demo/src/features/avatar.ts`)
- [ ] Badges (`demo/src/features/badges.ts`)

### Feedback & Overlays
- [ ] Dialog (`demo/src/features/dialog-showcase.ts`)
- [ ] Notifications (`demo/src/features/notifications.ts`)
- [ ] Loading/Busy (`demo/src/features/busy.ts`)

### Navigation
- [ ] Area Router (`demo/src/features/area-showcase.ts`)
- [ ] Router (`demo/src/features/router.ts`)
- [ ] Boat (`demo/src/features/boat.ts`)

### Animation & Effects
- [ ] Animated Text (`demo/src/features/animated-text.ts`)
- [ ] Typewriter (`demo/src/features/typewriter.ts`)

## Components that need new demos

These components exist in the library but don't have demo files yet:

### Forms
- [ ] Checkbox
- [ ] Switch
- [ ] Select

### Layout
- [ ] Divider

### Data Display
- [ ] Chip
- [ ] Progress

### Navigation
- [ ] Menu
- [ ] Navigation Drawer
- [ ] Navigation Rail
- [ ] Bottom Navigation

### Feedback
- [ ] Tooltip
- [ ] Snackbar

### Actions
- [ ] Fab (Floating Action Button)

## Demo Structure Template

Each demo should follow this structure:

```typescript
import { $LitElement } from '@mixins/index'
import { html } from 'lit'
import { customElement } from 'lit/decorators.js'
import '../shared/installation-section'

@customElement('demo-component')
export class DemoComponent extends $LitElement() {
  render() {
    return html`
      <schmancy-surface class="p-8">
        <!-- Component Title -->
        <schmancy-typography type="display" token="lg" class="mb-4 block">
          Component Name
        </schmancy-typography>
        <schmancy-typography type="body" token="lg" class="mb-8 text-surface-onVariant block">
          Brief description of what the component does.
        </schmancy-typography>

        <!-- Installation -->
        <installation-section></installation-section>

        <!-- Import -->
        <div class="mb-8">
          <schmancy-typography type="title" token="lg" class="mb-4 block">Import</schmancy-typography>
          <schmancy-code-preview language="javascript">
            import '@mhmo91/schmancy/component-name'
          </schmancy-code-preview>
        </div>

        <!-- API Reference -->
        <div class="mb-12">
          <schmancy-typography type="title" token="lg" class="mb-4 block">API Reference</schmancy-typography>
          <!-- API table here -->
        </div>

        <!-- Examples -->
        <div>
          <schmancy-typography type="title" token="lg" class="mb-6 block">Examples</schmancy-typography>
          <schmancy-grid gap="lg" class="w-full">
            <!-- Example code previews here -->
          </schmancy-grid>
        </div>
      </schmancy-surface>
    `
  }
}
```