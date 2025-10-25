# Schmancy Tabs Component

A versatile tab system with support for both traditional tab switching and scroll-based navigation modes.

## Overview

The Schmancy tabs system provides two distinct modes:
- **Traditional tabs**: Click to switch between tab content panels
- **Scroll navigation**: Automatically updates active tab based on scroll position
- **Responsive design**: Adapts to different screen sizes with overflow handling
- **Context-aware**: Uses Lit context for coordinated tab-content communication
- **TypeScript support**: Complete type safety with proper interfaces

## Installation

```typescript
import '@schmancy/tabs'
// or
import { SchmancyTabGroup, SchmancyTab } from '@schmancy/tabs'
```

## Basic Usage

### Traditional Tab Mode (Default)

```html
<schmancy-tab-group activeTab="overview">
  <schmancy-tab label="Overview" value="overview">
    <div class="p-4">
      <h2>Project Overview</h2>
      <p>This is the overview content of the project.</p>
    </div>
  </schmancy-tab>

  <schmancy-tab label="Details" value="details">
    <div class="p-4">
      <h2>Project Details</h2>
      <p>Detailed information about the project specifications.</p>
    </div>
  </schmancy-tab>

  <schmancy-tab label="Settings" value="settings">
    <div class="p-4">
      <h2>Project Settings</h2>
      <p>Configure your project settings here.</p>
    </div>
  </schmancy-tab>
</schmancy-tab-group>
```

### Scroll Navigation Mode

Perfect for long-form content with automatic tab highlighting based on scroll position:

```html
<schmancy-tab-group mode="scroll" activeTab="introduction">
  <schmancy-tab label="Introduction" value="introduction">
    <section class="min-h-screen p-8">
      <h1>Introduction</h1>
      <p>Long content section that spans the viewport...</p>
    </section>
  </schmancy-tab>

  <schmancy-tab label="Getting Started" value="getting-started">
    <section class="min-h-screen p-8">
      <h1>Getting Started</h1>
      <p>Another long content section...</p>
    </section>
  </schmancy-tab>

  <schmancy-tab label="Advanced" value="advanced">
    <section class="min-h-screen p-8">
      <h1>Advanced Topics</h1>
      <p>Advanced content section...</p>
    </section>
  </schmancy-tab>
</schmancy-tab-group>
```

## Properties

### SchmancyTabGroup

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `mode` | `'tabs' \| 'scroll'` | `'tabs'` | Tab behavior mode |
| `activeTab` | `string` | `undefined` | Currently active tab value |
| `rounded` | `boolean` | `true` | Whether tab navigation has rounded corners |

### SchmancyTab

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `label` | `string` | `undefined` | Display label for the tab |
| `value` | `string` | `undefined` | Unique identifier for the tab |
| `active` | `boolean` | `false` | Whether this tab is currently active |

## Types

```typescript
type TSchmancyTabsMode = 'scroll' | 'tabs'

interface TabChangedEvent extends CustomEvent {
  detail: string // The active tab value
}
```

## Events

### tab-changed

The tab group dispatches a `tab-changed` event when the active tab changes:

```typescript
// Event handling
tabGroup.addEventListener('tab-changed', (e: TabChangedEvent) => {
  console.log('Active tab:', e.detail)

  // Update URL or perform other actions based on tab change
  if (history.replaceState) {
    history.replaceState(null, null, `#${e.detail}`)
  }
})
```

## Advanced Examples

### Documentation Site Navigation

```html
<schmancy-tab-group mode="scroll" class="h-screen">
  <schmancy-tab label="API Reference" value="api">
    <div class="p-8">
      <h1>API Reference</h1>
      <div class="space-y-6">
        <section id="properties">
          <h2>Properties</h2>
          <!-- Properties documentation -->
        </section>
        <section id="methods">
          <h2>Methods</h2>
          <!-- Methods documentation -->
        </section>
      </div>
    </div>
  </schmancy-tab>

  <schmancy-tab label="Examples" value="examples">
    <div class="p-8">
      <h1>Examples</h1>
      <div class="space-y-8">
        <!-- Example content -->
      </div>
    </div>
  </schmancy-tab>

  <schmancy-tab label="Changelog" value="changelog">
    <div class="p-8">
      <h1>Changelog</h1>
      <!-- Changelog content -->
    </div>
  </schmancy-tab>
</schmancy-tab-group>
```

### Dashboard with Tab Persistence

```typescript
@customElement('dashboard-tabs')
export class DashboardTabs extends LitElement {
  @state() private activeTab = 'dashboard'

  connectedCallback() {
    super.connectedCallback()

    // Restore active tab from URL or localStorage
    const urlHash = window.location.hash.slice(1)
    const savedTab = localStorage.getItem('dashboard-active-tab')
    this.activeTab = urlHash || savedTab || 'dashboard'
  }

  handleTabChanged(e: TabChangedEvent) {
    this.activeTab = e.detail
    localStorage.setItem('dashboard-active-tab', e.detail)
    history.replaceState(null, null, `#${e.detail}`)
  }

  render() {
    return html`
      <schmancy-tab-group
        .activeTab=${this.activeTab}
        @tab-changed=${this.handleTabChanged}
      >
        <schmancy-tab label="Dashboard" value="dashboard">
          <dashboard-overview></dashboard-overview>
        </schmancy-tab>

        <schmancy-tab label="Analytics" value="analytics">
          <analytics-charts></analytics-charts>
        </schmancy-tab>

        <schmancy-tab label="Users" value="users">
          <user-management></user-management>
        </schmancy-tab>

        <schmancy-tab label="Settings" value="settings">
          <app-settings></app-settings>
        </schmancy-tab>
      </schmancy-tab-group>
    `
  }
}
```

### Mobile-Responsive Tabs

```html
<schmancy-tab-group class="w-full">
  <schmancy-tab label="Posts" value="posts">
    <div class="grid gap-4 p-4">
      <article class="bg-white rounded-lg shadow p-6">
        <h3>Latest Posts</h3>
        <!-- Post content -->
      </article>
    </div>
  </schmancy-tab>

  <schmancy-tab label="Photos" value="photos">
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      <!-- Photo grid -->
    </div>
  </schmancy-tab>

  <schmancy-tab label="About" value="about">
    <div class="max-w-2xl mx-auto p-4">
      <!-- About content -->
    </div>
  </schmancy-tab>
</schmancy-tab-group>

<style>
  schmancy-tab-group {
    /* Tab navigation becomes scrollable on mobile */
    --tab-nav-overflow: auto;
  }

  @media (max-width: 768px) {
    schmancy-tab-group {
      /* Smaller tab padding on mobile */
      --tab-padding: 0.5rem 0.75rem;
    }
  }
</style>
```

### Programmatic Tab Control

```typescript
// Get tab group reference
const tabGroup = document.querySelector('schmancy-tab-group')

// Change active tab programmatically
tabGroup.activeTab = 'settings'

// Listen for tab changes
tabGroup.addEventListener('tab-changed', (e) => {
  console.log('Tab changed to:', e.detail)

  // Trigger specific actions based on tab
  switch (e.detail) {
    case 'analytics':
      loadAnalyticsData()
      break
    case 'users':
      refreshUserList()
      break
    case 'settings':
      initializeSettingsForm()
      break
  }
})

// Dynamically add tabs
function addTab(label: string, value: string, content: TemplateResult) {
  const tab = document.createElement('schmancy-tab')
  tab.label = label
  tab.value = value
  tab.appendChild(content)
  tabGroup.appendChild(tab)
}
```

## Styling and Customization

### CSS Custom Properties

```css
schmancy-tab-group {
  /* Tab navigation styling */
  --tab-bg: var(--md-sys-color-surface);
  --tab-text: var(--md-sys-color-on-surface);
  --tab-active-text: var(--md-sys-color-primary);
  --tab-active-border: var(--md-sys-color-primary);

  /* Spacing and sizing */
  --tab-padding: 0.75rem 1rem;
  --tab-border-radius: 9999px; /* rounded-full */

  /* Scroll mode specific */
  --scroll-nav-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

/* Custom tab styling */
schmancy-tab-group::part(navigation) {
  background: linear-gradient(to right, #f3f4f6, #e5e7eb);
}

schmancy-tab-group::part(tab-button) {
  transition: all 0.2s ease;
}

schmancy-tab-group::part(tab-button):hover {
  transform: translateY(-1px);
}
```

### Mode-Specific Styling

```css
/* Traditional tabs mode */
schmancy-tab-group[mode="tabs"] {
  --tab-nav-position: static;
  --tab-nav-shadow: none;
}

/* Scroll navigation mode */
schmancy-tab-group[mode="scroll"] {
  --tab-nav-position: sticky;
  --tab-nav-top: 0;
  --tab-nav-z-index: 50;
  --tab-nav-shadow: var(--scroll-nav-shadow);
}
```

## Accessibility Features

### Keyboard Navigation
- **Tab**: Navigate between tab buttons
- **Arrow Keys**: Move between tabs within the group
- **Enter/Space**: Activate focused tab
- **Home**: Jump to first tab
- **End**: Jump to last tab

### ARIA Attributes
The component automatically manages ARIA attributes:
- `role="tablist"` on the tab navigation
- `role="tab"` on each tab button
- `role="tabpanel"` on tab content
- `aria-selected` state management
- `aria-controls` linking tabs to content
- `aria-labelledby` for content-tab association

### Screen Reader Support
Full screen reader compatibility with proper announcements for:
- Tab labels and descriptions
- Active tab changes
- Number of available tabs
- Tab activation instructions

## Browser Support

The component uses modern web standards and requires browsers that support:
- Custom Elements v1
- Shadow DOM v1
- ES2015+
- CSS Custom Properties
- Intersection Observer (for scroll mode)

For older browsers, consider using appropriate polyfills.

## Performance Considerations

### Scroll Mode Optimization
- Uses throttled scroll events (1000ms) to prevent excessive updates
- Intersection Observer for efficient viewport detection
- Automatic cleanup of event listeners on component disconnect

### Large Tab Sets
- Tab navigation becomes horizontally scrollable when needed
- Virtual scrolling for content areas with many tabs
- Lazy loading of tab content on first activation

## Related Components

- `schmancy-button` - Used internally for tab navigation buttons
- `schmancy-typography` - Used for tab label styling
- `schmancy-nav-drawer` - Alternative navigation for mobile layouts
