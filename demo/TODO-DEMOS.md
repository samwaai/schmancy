# Demo Components TODO

> **New Grouped Structure**: Instead of individual component demos, we now group related components together for better discovery and understanding. Each group follows the successful navigation pattern established by area-demos and chip-demos, allowing users to explore related functionality in context.

## 🎯 Benefits of Grouped Structure

1. **Better User Experience** - Navigate related components together
2. **Contextual Learning** - See how components work together
3. **Shared Examples** - Complex forms/layouts using multiple components
4. **Reduced Navigation** - One entry point per feature group
5. **Maintainable** - Related code stays together

## 📁 New Grouped Demo Structure

```
demo/src/features/
├── forms-demos/           # All form components together
├── navigation-demos/      # All navigation patterns
├── data-display-demos/    # Tables, lists, trees, etc.
├── feedback-demos/        # Progress, loading, notifications
├── overlays-demos/        # Dialogs, sheets, modals
├── layout-demos/          # Layout components
├── actions-demos/         # Buttons, FABs
├── effects-demos/         # Animations, transitions
├── routing-demos/         # Area router, standard router
└── chip-demos/           # ✅ Already completed
```

## ✅ Priority 1: Forms & Inputs Group - ✅ Completed
**Path:** `demo/src/features/forms-demos/`

### Components to Include:
- **Select** - Dropdown selection
- **Checkbox** - Binary choices
- **Switch** - Toggle states
- **Input** - Text input fields
- **Textarea** - Multi-line input
- **Radio** - Single choice from multiple

### Demo Structure:
```
forms-demos/
├── index.ts           # Main navigation (demo-forms-demos)
├── overview.ts        # Forms introduction & principles
├── text-inputs.ts     # Input, textarea demos
├── selection.ts       # Select, radio, checkbox, switch
├── validation.ts      # Form validation patterns
└── examples.ts        # Complete form examples
```

**Why Priority 1:** Forms are fundamental to most applications

## ✅ Priority 2: Navigation Components Group - ✅ Completed
**Path:** `demo/src/features/navigation-demos/`

### Components to Include:
- **Tabs** - Tab navigation
- **Navigation Drawer** - Side panel navigation
- **Navigation Rail** - Compact navigation
- **Bottom Navigation** - Mobile navigation
- **Menu** - Contextual menus
- **Breadcrumb** - Path navigation

### Demo Structure:
```
navigation-demos/
├── index.ts           # Main navigation (demo-navigation-demos)
├── overview.ts        # Navigation patterns overview
├── tabs.ts            # Tab component variations
├── drawer.ts          # Drawer navigation patterns
├── rail.ts            # Rail navigation for desktop
├── mobile.ts          # Bottom navigation for mobile
├── menu.ts            # Dropdown and context menus
└── examples.ts        # Complete app navigation examples
```

## ✅ Priority 3: Data Display Group - ✅ Completed
**Path:** `demo/src/features/data-display-demos/`

### Components to Include:
- **Table** - Tabular data
- **List** - Item lists
- **Tree** - Hierarchical data
- **Avatar** - User images
- **Badge** - Status indicators
- **Tooltip** - Contextual information

### Demo Structure:
```
data-display-demos/
├── index.ts           # Main navigation (demo-data-display-demos)
├── overview.ts        # Data presentation principles
├── tables.ts          # Table component & variations
├── lists.ts           # List patterns & virtualisation
├── trees.ts           # Tree view & hierarchies
├── indicators.ts      # Avatars, badges, chips
└── examples.ts        # Complex data views
```

## 🟡 Priority 4: Feedback & Status Group
**Path:** `demo/src/features/feedback-demos/`

### Components to Include:
- **Progress** - Linear & circular progress
- **Loading/Busy** - Loading states
- **Snackbar** - Temporary messages
- **Tooltip** - Help text
- **Skeleton** - Loading placeholders

### Demo Structure:
```
feedback-demos/
├── index.ts           # Main navigation (demo-feedback-demos)
├── overview.ts        # Feedback principles
├── progress.ts        # Progress indicators
├── loading.ts         # Loading & skeleton states
├── messages.ts        # Snackbar & toast patterns
└── examples.ts        # Complete feedback flows
```

## 🟡 Priority 5: Overlays & Modals Group
**Path:** `demo/src/features/overlays-demos/`

### Components to Include:
- **Dialog** - Modal dialogs
- **Sheet** - Bottom/side sheets
- **Notifications** - System notifications
- **Popover** - Contextual overlays

### Demo Structure:
```
overlays-demos/
├── index.ts           # Main navigation (demo-overlays-demos)
├── overview.ts        # Overlay patterns
├── dialogs.ts         # Dialog variations
├── sheets.ts          # Sheet components
├── notifications.ts   # Notification patterns
└── examples.ts        # Complex overlay interactions
```

## 🟢 Priority 6: Layout Components Group
**Path:** `demo/src/features/layout-demos/`

### Components to Include:
- **Drawer** - Layout drawer
- **Divider** - Content separators
- **Grid** - Grid layouts
- **Stack** - Stack layouts

### Demo Structure:
```
layout-demos/
├── index.ts           # Main navigation (demo-layout-demos)
├── overview.ts        # Layout principles
├── drawer.ts          # Drawer layouts
├── dividers.ts        # Divider usage
└── examples.ts        # Complete layouts
```

## 🟢 Priority 7: Actions Group
**Path:** `demo/src/features/actions-demos/`

### Components to Include:
- **Button** - All button variations
- **FAB** - Floating action buttons
- **Icon Button** - Icon-only buttons
- **Toggle Button** - Toggle state buttons

### Demo Structure:
```
actions-demos/
├── index.ts           # Main navigation (demo-actions-demos)
├── overview.ts        # Action principles
├── buttons.ts         # Button variations
├── fab.ts             # FAB patterns
└── examples.ts        # Action flows
```

## 🟢 Priority 8: Effects & Animations Group
**Path:** `demo/src/features/effects-demos/`

### Components to Include:
- **Animated Text** - Text animations
- **Typewriter** - Typewriter effect
- **Transitions** - Page transitions
- **Ripple** - Ripple effects

### Demo Structure:
```
effects-demos/
├── index.ts           # Main navigation (demo-effects-demos)
├── overview.ts        # Animation principles
├── text.ts            # Text animations
├── transitions.ts     # Transition effects
└── examples.ts        # Combined effects
```

## ✅ Completed Groups

### Forms & Inputs Group
**Path:** `demo/src/features/forms-demos/`
- ✅ Fully completed with navigation structure
- Comprehensive demos for all form components including:
  - Text inputs (Input, Textarea)
  - Selection controls (Select, Radio, Checkbox, Switch)
  - Form validation patterns
  - Complete form examples with real-world scenarios

### Navigation Components Group
**Path:** `demo/src/features/navigation-demos/`
- ✅ Fully completed with navigation structure
- Comprehensive demos for navigation patterns:
  - Tab navigation with various styles
  - Drawer navigation for desktop layouts
  - Navigation rail for compact navigation
  - Bottom navigation for mobile interfaces
  - Menu components for contextual actions
  - Complete navigation examples showing integration

### Data Display Group
**Path:** `demo/src/features/data-display-demos/`
- ✅ Fully completed with navigation structure
- Complete data presentation demos:
  - Table component with sorting, filtering, and pagination
  - List patterns with virtual scrolling
  - Tree view for hierarchical data
  - Indicators (Avatars, Badges, Tooltips)
  - Complex data view examples with real-world patterns

### Routing Group
**Path:** `demo/src/features/routing-demos/`
- **Area Router** (`area/`) - ✅ Completed with navigation structure
- **Standard Router** - To be added
- **Boat** - To be added

### Chip Group
**Path:** `demo/src/features/chip-demos/`
- ✅ Fully completed with navigation structure

## 📝 Main Group Component Template

Each group's `index.ts` manages navigation between different demo sections:

```typescript
import { area, SchmancyArea } from '@mhmo91/schmancy'
import { $LitElement } from '@mixins/index'
import { css, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
// Import all demo components
import { DemoFormsOverview } from './overview'
import { DemoFormsTextInputs } from './text-inputs'
import { DemoFormsSelection } from './selection'
import { DemoFormsValidation } from './validation'
import { DemoFormsExamples } from './examples'

@customElement('demo-forms-demos')
export class DemoFormsDemos extends $LitElement(css`
  :host {
    display: block;
    height: 100%;
  }
`) {
  @state() activeDemo = 'overview'

  // Map of demo components for the group
  private demos = {
    overview: DemoFormsOverview,
    'text-inputs': DemoFormsTextInputs,
    selection: DemoFormsSelection,
    validation: DemoFormsValidation,
    examples: DemoFormsExamples,
  }

  connectedCallback(): void {
    super.connectedCallback()
    // Track active demo for navigation highlighting
    area.active$.subscribe(active => {
      if (active?.area === 'forms-demo') {
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
      component: new DemoClass(),
      area: 'forms-demo'
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
            .selected=${this.activeDemo === 'text-inputs'}
            @click=${() => this.navigateToDemo('text-inputs')}
          >
            <schmancy-icon slot="start">edit</schmancy-icon>
            Text Inputs
          </schmancy-list-item>

          <schmancy-list-item
            .selected=${this.activeDemo === 'selection'}
            @click=${() => this.navigateToDemo('selection')}
          >
            <schmancy-icon slot="start">check_box</schmancy-icon>
            Selection Controls
          </schmancy-list-item>

          <schmancy-list-item
            .selected=${this.activeDemo === 'validation'}
            @click=${() => this.navigateToDemo('validation')}
          >
            <schmancy-icon slot="start">fact_check</schmancy-icon>
            Validation
          </schmancy-list-item>

          <schmancy-list-item
            .selected=${this.activeDemo === 'examples'}
            @click=${() => this.navigateToDemo('examples')}
          >
            <schmancy-icon slot="start">code</schmancy-icon>
            Complete Examples
          </schmancy-list-item>
        </schmancy-list>

        <div slot="content" class="h-full overflow-auto">
          <schmancy-area
            name="forms-demo"
            .routes=${[
              { path: '', component: new DemoFormsOverview(), isDefault: true },
            ]}
          ></schmancy-area>
        </div>
      </schmancy-nav-drawer>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'demo-forms-demos': DemoFormsDemos
  }
}
```

## 📝 Individual Demo Component Template

Each demo section follows this structure:

```typescript
import { $LitElement } from '@mixins/index'
import { html } from 'lit'
import { customElement } from 'lit/decorators.js'
import '../../shared/installation-section'

@customElement('demo-forms-text-inputs')
export class DemoFormsTextInputs extends $LitElement() {
  render() {
    return html`
      <schmancy-surface class="p-8">
        <!-- Section Title -->
        <schmancy-typography type="display" token="lg" class="mb-4 block">
          Text Input Components
        </schmancy-typography>

        <schmancy-typography type="body" token="lg" class="mb-8 text-surface-onVariant block">
          Text input fields for collecting user input, including standard inputs,
          textareas, and specialized formats.
        </schmancy-typography>

        <!-- Basic Input Demo -->
        <div class="mb-12">
          <schmancy-typography type="title" token="lg" class="mb-6 block">
            Basic Input
          </schmancy-typography>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- Live Demo -->
            <div>
              <schmancy-input
                label="Name"
                placeholder="Enter your name"
                helper="Full name as it appears on ID"
              ></schmancy-input>
            </div>

            <!-- Code -->
            <schmancy-code-preview language="html">
              ${`<schmancy-input
  label="Name"
  placeholder="Enter your name"
  helper="Full name as it appears on ID"
></schmancy-input>`}
            </schmancy-code-preview>
          </div>
        </div>

        <!-- Textarea Demo -->
        <div class="mb-12">
          <schmancy-typography type="title" token="lg" class="mb-6 block">
            Textarea
          </schmancy-typography>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- Live Demo -->
            <div>
              <schmancy-textarea
                label="Description"
                placeholder="Enter description"
                rows="4"
              ></schmancy-textarea>
            </div>

            <!-- Code -->
            <schmancy-code-preview language="html">
              ${`<schmancy-textarea
  label="Description"
  placeholder="Enter description"
  rows="4"
></schmancy-textarea>`}
            </schmancy-code-preview>
          </div>
        </div>

        <!-- Multiple Components Working Together -->
        <div>
          <schmancy-typography type="title" token="lg" class="mb-6 block">
            Form Example with Multiple Inputs
          </schmancy-typography>

          <schmancy-surface type="filled" class="p-6">
            <form class="space-y-4">
              <schmancy-input label="Email" type="email" required></schmancy-input>
              <schmancy-input label="Password" type="password" required></schmancy-input>
              <schmancy-textarea label="Comments" rows="3"></schmancy-textarea>
              <schmancy-button type="filled">Submit</schmancy-button>
            </form>
          </schmancy-surface>
        </div>
      </schmancy-surface>
    `
  }
}

// IMPORTANT: Named export for import in index.ts
export { DemoFormsTextInputs }
```

## 🔄 Migration from Old to Grouped Structure

### Old Structure (Individual Components)
- Each component had its own demo folder
- Lots of navigation entries in the main menu
- Hard to see relationships between components
- Duplicated examples across related components

### New Grouped Structure (Feature Groups)
- Related components grouped in one demo
- Single navigation entry per feature group
- Clear relationships and interactions shown
- Shared examples demonstrating integration

## 🛠️ Implementation Guidelines for Grouped Structure

### 1. Naming Conventions for Groups
```typescript
// Group folder naming (kebab-case with -demos suffix)
forms-demos/
navigation-demos/
data-display-demos/

// Main group component
@customElement('demo-forms-demos')
export class DemoFormsDemos { }

// Individual demo components within group
@customElement('demo-forms-text-inputs')
export class DemoFormsTextInputs { }
```

### 2. Navigation Area Names
Each group uses its own area name for routing:
```typescript
// In group's index.ts
<schmancy-area name="forms-demo">  // Note: singular for area name

// In navigation
area.push({
  component: new DemoFormsTextInputs(),
  area: 'forms-demo'  // Matches area name
})
```

### 3. Group Component Organization
```
forms-demos/
├── index.ts           # Navigation hub - imports all demos
├── overview.ts        # Group introduction & principles
├── [feature-1].ts     # Specific feature demos
├── [feature-2].ts     # Another feature
├── validation.ts      # Cross-cutting concerns
└── examples.ts        # Complete, real-world examples
```

### 4. Shared Examples Pattern
Groups enable powerful shared examples:
```typescript
// In examples.ts - show multiple components working together
@customElement('demo-forms-examples')
export class DemoFormsExamples extends $LitElement() {
  render() {
    return html`
      <!-- Complete Registration Form -->
      <div class="example">
        <schmancy-input label="Email" type="email"></schmancy-input>
        <schmancy-input label="Password" type="password"></schmancy-input>
        <schmancy-select label="Country">
          <schmancy-option>USA</schmancy-option>
          <schmancy-option>Canada</schmancy-option>
        </schmancy-select>
        <schmancy-checkbox>Accept terms</schmancy-checkbox>
        <schmancy-button>Register</schmancy-button>
      </div>
    `
  }
}
```

### 5. Cross-References Between Groups
Link to related groups when relevant:
```typescript
// In navigation-demos overview
html`
  <schmancy-typography>
    See also: <a href="#" @click=${() => this.navigateToGroup('forms-demos')}>
      Form Components
    </a> for input controls used in navigation.
  </schmancy-typography>
`
```

## 📋 Migration Checklist for Creating Grouped Demos

When creating a new group demo:

1. [ ] **Plan the Group Structure**
   - Identify all related components to include
   - Define logical sections (overview, features, validation, examples)
   - Plan shared examples showing integration

2. [ ] **Create Group Folder**
   - Name with `-demos` suffix (e.g., `forms-demos/`)
   - Create files for each section
   - Ensure all files have named exports

3. [ ] **Build Main Navigation Component**
   - Create `index.ts` with navigation drawer
   - Import all demo components (use classes, not strings)
   - Set up area routing with unique area name
   - Add navigation items with appropriate icons

4. [ ] **Develop Individual Demos**
   - Start with overview explaining the group's purpose
   - Create focused demos for each component type
   - Build shared examples showing components together
   - Include validation/error handling patterns

5. [ ] **Update Main App Navigation**
   - Add single entry for the group
   - Use appropriate icon for the feature group
   - Update routing to load group's index component

6. [ ] **Test & Verify**
   - Test navigation between all sections
   - Verify all components render correctly
   - Check code examples are accurate
   - Test responsive behavior

7. [ ] **Documentation**
   - Update this TODO list marking group as completed
   - Add any special notes about the components
   - Document any known issues or limitations

## 🎨 Best Practices for Grouped Demos

### Group Organization
- **Overview First** - Always start with principles and introduction
- **Progressive Complexity** - Simple → Advanced → Real-world
- **Show Relationships** - Demonstrate how components work together
- **Cross-cutting Concerns** - Include validation, accessibility, performance

### Effective Demos
- **Live + Code** - Show working component beside its code
- **Interactive** - Let users modify properties and see results
- **Real-world** - Include practical, production-ready examples
- **Error States** - Show validation and error handling

### Code Examples
```typescript
// Use side-by-side layout for demos
<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
  <div>
    <!-- Live component -->
    <schmancy-input label="Name"></schmancy-input>
  </div>
  <schmancy-code-preview language="html">
    ${`<schmancy-input label="Name"></schmancy-input>`}
  </schmancy-code-preview>
</div>
```

### Navigation Icons for Groups
- 📝 `edit` - Forms & Inputs
- 🧭 `navigation` - Navigation Components
- 📊 `table_chart` - Data Display
- 💬 `feedback` - Feedback & Status
- 🎭 `layers` - Overlays & Modals
- 📐 `dashboard` - Layout Components
- ⚡ `touch_app` - Actions & Buttons
- ✨ `animation` - Effects & Animations

### Shared Examples Template
```typescript
// In examples.ts - demonstrate real-world usage
@customElement('demo-[group]-examples')
export class Demo[Group]Examples extends $LitElement() {
  render() {
    return html`
      <schmancy-surface class="p-8">
        <!-- Complete User Registration Form -->
        <schmancy-typography type="display" token="md" class="mb-6">
          Complete Registration Flow
        </schmancy-typography>

        <!-- Show multiple components working together -->
        <form class="space-y-6">
          <!-- Personal Information Section -->
          <div class="space-y-4">
            <schmancy-input label="Full Name" required></schmancy-input>
            <schmancy-input label="Email" type="email" required></schmancy-input>
          </div>

          <!-- Preferences Section -->
          <div class="space-y-4">
            <schmancy-select label="Country">
              <schmancy-option>United States</schmancy-option>
              <schmancy-option>Canada</schmancy-option>
            </schmancy-select>
            <schmancy-checkbox>Subscribe to newsletter</schmancy-checkbox>
          </div>

          <!-- Actions -->
          <div class="flex gap-4">
            <schmancy-button type="text">Cancel</schmancy-button>
            <schmancy-button type="filled">Register</schmancy-button>
          </div>
        </form>

        <!-- Explanation of the example -->
        <schmancy-typography class="mt-8 text-surface-onVariant">
          This example demonstrates form components working together with
          proper spacing, validation, and user interaction patterns.
        </schmancy-typography>
      </schmancy-surface>
    `
  }
}
```

## 🚀 Quick Start for New Group

To create a new group demo, copy this starter structure:

```bash
# Create group folder
mkdir demo/src/features/[group]-demos

# Create files
touch demo/src/features/[group]-demos/index.ts
touch demo/src/features/[group]-demos/overview.ts
touch demo/src/features/[group]-demos/examples.ts
```

Then use the templates above to build your grouped demo!