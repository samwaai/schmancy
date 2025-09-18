# Demo Components TODO

## Components that need demo rewrite

These components have existing demo files but need to be rewritten following the new navigation-based structure with separate demo components:

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
- [x] Area Router (`demo/src/features/area/`) - ✅ Completed with new structure
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
- [x] Chip - ✅ Completed with new structure
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

## New Demo Structure (Navigation-based)

### File Structure
```
demo/src/features/
└── component-name/
    ├── index.ts           # Main demos component with navigation
    ├── overview.ts        # Overview demo
    ├── basic.ts           # Basic usage demo
    ├── params.ts          # Parameters demo
    └── examples.ts        # Additional examples
```

### Main Demos Component Template

The main component (`index.ts`) manages navigation between different demo sections:

```typescript
import { area, SchmancyArea } from '@mhmo91/schmancy'
import { $LitElement } from '@mixins/index'
import { css, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { DemoComponentOverview } from './overview'
import { DemoComponentBasic } from './basic'
import { DemoComponentParams } from './params'
import { DemoComponentExamples } from './examples'

@customElement('demo-component-demos')
export class DemoComponentDemos extends $LitElement(css`
  :host {
    display: block;
    height: 100%;
  }
`) {
  @state() activeDemo = 'overview'

  // Map of demo components - IMPORTANT: Use actual class references, not strings
  private demos = {
    overview: DemoComponentOverview,
    basic: DemoComponentBasic,
    params: DemoComponentParams,
    examples: DemoComponentExamples,
  }

  connectedCallback(): void {
    super.connectedCallback()
    // Subscribe to area changes to track active demo
    area.active$.subscribe(active => {
      if (active?.area === 'component-demo') {
        // Extract demo name from component class
        const componentName = Object.entries(this.demos).find(
          ([_, component]) => active.component instanceof component
        )?.[0]
        if (componentName) {
          this.activeDemo = componentName
        }
      }
    })
  }

  private navigateToDemo(demoName: keyof typeof this.demos) {
    const DemoClass = this.demos[demoName]
    area.push({
      component: new DemoClass(),  // Instantiate the class
      area: 'component-demo'
    })
  }

  render() {
    return html`
      <schmancy-nav-drawer>
        <schmancy-list slot="nav">
          <schmancy-list-item
            .selected=${this.activeDemo === 'overview'}
            @click=${() => this.navigateToDemo('overview')}
          >
            <schmancy-icon slot="start">info</schmancy-icon>
            Overview
          </schmancy-list-item>

          <schmancy-list-item
            .selected=${this.activeDemo === 'basic'}
            @click=${() => this.navigateToDemo('basic')}
          >
            <schmancy-icon slot="start">widgets</schmancy-icon>
            Basic Usage
          </schmancy-list-item>

          <schmancy-list-item
            .selected=${this.activeDemo === 'params'}
            @click=${() => this.navigateToDemo('params')}
          >
            <schmancy-icon slot="start">tune</schmancy-icon>
            Parameters
          </schmancy-list-item>

          <schmancy-list-item
            .selected=${this.activeDemo === 'examples'}
            @click=${() => this.navigateToDemo('examples')}
          >
            <schmancy-icon slot="start">code</schmancy-icon>
            Examples
          </schmancy-list-item>
        </schmancy-list>

        <div slot="content" class="h-full overflow-auto">
          <schmancy-area
            name="component-demo"
            .routes=${[
              { path: '', component: new DemoComponentOverview(), isDefault: true },
            ]}
          ></schmancy-area>
        </div>
      </schmancy-nav-drawer>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'demo-component-demos': DemoComponentDemos
  }
}
```

### Individual Demo Component Template

Each individual demo (`overview.ts`, `basic.ts`, etc.) follows this structure:

```typescript
import { $LitElement } from '@mixins/index'
import { html } from 'lit'
import { customElement } from 'lit/decorators.js'
import '../../shared/installation-section'

@customElement('demo-component-overview')
export class DemoComponentOverview extends $LitElement() {
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
            ${`import '@mhmo91/schmancy/component-name'`}
          </schmancy-code-preview>
        </div>

        <!-- API Reference -->
        <div class="mb-12">
          <schmancy-typography type="title" token="lg" class="mb-4 block">API Reference</schmancy-typography>
          <!-- API table here -->
        </div>

        <!-- Quick Example -->
        <div>
          <schmancy-typography type="title" token="lg" class="mb-6 block">Quick Example</schmancy-typography>
          <schmancy-code-preview language="html">
            ${`<schmancy-component>Content</schmancy-component>`}
          </schmancy-code-preview>
        </div>
      </schmancy-surface>
    `
  }
}

// IMPORTANT: Export the class with a named export
export { DemoComponentOverview }
```

## Key Differences from Old Structure

### Old Structure (Single File)
- All demos in one large component file
- Linear scrolling through examples
- No navigation between sections

### New Structure (Navigation-based)
- **Separate files for each demo section** in a folder
- **Navigation drawer** for switching between demos
- **Area routing** for demo navigation
- **Better organization** and maintainability
- **Consistent user experience** across all component demos

## Important Implementation Notes

### 1. Class References vs Strings
```typescript
// ✅ CORRECT - Use actual class references
import { DemoComponentOverview } from './overview'
area.push({ component: new DemoComponentOverview(), area: 'demo' })

// ❌ WRONG - Don't use string imports or dynamic imports in navigation
area.push({ component: './overview', area: 'demo' })
```

### 2. Named Exports
Each demo component MUST have a named export:
```typescript
// ✅ CORRECT
export class DemoComponentOverview extends $LitElement() { }
export { DemoComponentOverview }

// ❌ WRONG - Default exports won't work with the import structure
export default class DemoComponentOverview { }
```

### 3. Demo Component Naming Convention
- Main component: `demo-[component]-demos` (e.g., `demo-chip-demos`)
- Individual demos: `demo-[component]-[section]` (e.g., `demo-chip-overview`)
- Class names: `Demo[Component][Section]` (e.g., `DemoChipOverview`)

### 4. Navigation State Management
The main demos component tracks the active demo by subscribing to area changes:
```typescript
area.active$.subscribe(active => {
  if (active?.area === 'component-demo') {
    // Update activeDemo state for navigation highlighting
  }
})
```

### 5. File Organization
```
demo/src/features/
├── chip/
│   ├── index.ts          # DemoChipDemos
│   ├── overview.ts       # DemoChipOverview
│   ├── basic.ts          # DemoChipBasic
│   ├── params.ts         # DemoChipParams
│   └── examples.ts       # DemoChipExamples
├── area/
│   ├── index.ts          # DemoAreaDemos
│   ├── overview.ts       # DemoAreaOverview
│   ├── basic.ts          # DemoAreaBasic
│   └── params.ts         # DemoAreaParams
```

## Migration Checklist

When converting an existing demo to the new structure:

1. [ ] Create a new folder for the component in `demo/src/features/`
2. [ ] Split the existing demo into logical sections (overview, basic, params, examples)
3. [ ] Create separate files for each section with proper class names and exports
4. [ ] Create the main `index.ts` with navigation drawer and area routing
5. [ ] Import all demo classes in the main component (not strings)
6. [ ] Set up navigation items with appropriate icons
7. [ ] Configure area routing with the overview as default
8. [ ] Update the demo entry in the main app navigation
9. [ ] Test navigation between all demo sections
10. [ ] Verify all code examples render correctly
11. [ ] Update this TODO list to mark the component as completed

## Best Practices

### Code Examples
- Use template literals with `${}` for code snippets to avoid escaping issues
- Include both HTML and JavaScript examples where relevant
- Show real-world usage patterns, not just basic syntax

### API Documentation
- Create comprehensive tables for all properties, methods, and events
- Include type information and default values
- Add descriptions that explain when and why to use each option

### Demo Content
- Start with the simplest possible example in the overview
- Progress from basic to advanced usage
- Include common patterns and best practices
- Show edge cases and error handling where relevant

### Navigation Icons
Choose meaningful Material Icons for navigation items:
- `info` - Overview/Introduction
- `widgets` - Basic usage/Components
- `tune` - Parameters/Configuration
- `code` - Advanced examples
- `settings` - Configuration/Options
- `palette` - Styling/Theming
- `build` - Composition/Building blocks