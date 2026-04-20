# Schmancy

A Web Component UI library built on Lit, RxJS, and Tailwind CSS. Surfaces are glass. Depth is light. Interactions are physics.

## Install

```bash
npm install @mhmo91/schmancy
```

```typescript
import '@mhmo91/schmancy'
import { magnetic, cursorGlow, gravity } from '@mhmo91/schmancy/directives'
```

## Quick Start

```html
<schmancy-theme color="#6200ee" scheme="auto">
  <schmancy-surface type="subtle" rounded="all" fill="all">
    <schmancy-button variant="filled">Click me</schmancy-button>
  </schmancy-surface>
</schmancy-theme>
```

## Design: Luminous Glass

Every surface is translucent glass. Depth = blur intensity. Elevation = colored glow. Interactions = spring physics.

| Surface | Opacity | Blur | Purpose |
|---------|---------|------|---------|
| `solid` | 92% | — | Dense glass, high readability |
| `subtle` | 78% | 8px | Frosted panel (default) |
| `glass` | 55% | 16px | Overlays, dialogs, dropdowns |
| `luminous` | 42% | 20px | Hero panels with glow halo |

## Components

### Surfaces & Layout
- [Surface](./ai/surface.md) — Glass depth system: solid, subtle, glass, luminous
- [Card](./ai/card.md) — Content containers with glow elevation and cursorGlow
- [Content Drawer](./ai/content-drawer.md) — Master-detail split panels
- [Divider](./ai/divider.md) — Visual separators

### Navigation
- [Tabs](./ai/tabs.md) — Tabbed interfaces
- [Navigation Bar](./ai/navigation-bar.md) — Bottom navigation (mobile)
- [Navigation Rail](./ai/navigation-rail.md) — Side navigation (desktop)
- [Nav Drawer](./ai/nav-drawer.md) — Slide-out navigation drawer
- [Steps](./ai/steps.md) — Multi-step process indicator
- [Area](./ai/area.md) — Client-side routing

### Overlays
- [Dialog](./ai/dialog.md) — Glass modal dialogs with cursorGlow
- [Sheet](./ai/sheet.md) — Side/bottom panels with glass backdrop
- [Notification](./ai/notification.md) — Toast notifications with type-colored glow
- [Menu](./ai/menu.md) — Context menus
- [Dropdown](./ai/dropdown.md) — Floating dropdown panels
- [Tooltip](./ai/tooltip.md) — Hover tooltips
- [Lightbox](./ai/lightbox.md) — Image gallery with FLIP animations

### Form Elements
- [Input](./ai/input.md) — Text input with luminous focus glow
- [Textarea](./ai/textarea.md) — Multi-line text input
- [Select](./ai/select.md) — Dropdown select
- [Autocomplete](./ai/autocomplete.md) — Searchable dropdown
- [Checkbox](./ai/checkbox.md) — Checkboxes
- [Radio Group](./ai/radio-group.md) — Radio buttons
- [Chips](./ai/chips.md) — Filter/input/suggestion chips with magnetic
- [Form](./ai/form.md) — Form container with validation
- [Date Range](./ai/date-range.md) — Date pickers

### Interactive Elements
- [Button](./ai/button.md) — Buttons with magnetic + glow hover
- [List](./ai/list.md) — Interactive lists with glass hover
- [Details](./ai/details.md) — Expandable sections with magnetic summary
- [Table](./ai/table.md) — Data tables
- [Tree](./ai/tree.md) — Hierarchical tree view

### Feedback
- [Progress](./ai/progress.md) — Linear progress bar
- [Busy](./ai/busy.md) — Loading overlays
- [Badge](./ai/badge.md) — Status indicators

### Display
- [Typography](./ai/typography.md) — Text styling system
- [Icons](./ai/icons.md) — Material Symbols
- [Avatar](./ai/avatar.md) — Profile images with fallback initials
- [Code Highlight](./ai/code-highlight.md) — Syntax highlighting

## Directives

19 Lit directives that snap onto any element. [Full reference →](./ai/directives.md)

**Physics:** `magnetic`, `cursorGlow`, `livingBorder`, `gravity`, `depthOfField`, `longPress`
**Effects:** `nebula`, `liquid`, `ripple`
**Text:** `animateText`, `cycleText`, `typewriter`
**Visibility:** `reveal`, `intersect`
**Interaction:** `drag`, `drop`, `color`

## System

- [Theme](./ai/theme.md) — Color theming + dark/light mode
- [Store](./ai/store.md) — Reactive state management with persistence
- [Mixins](./ai/mixins.md) — $LitElement base mixin with RxJS lifecycle
- [Animation](./ai/animation.md) — Blackbird spring physics system

## Tech Stack

[Lit](https://lit.dev) · [RxJS](https://rxjs.dev) · [Tailwind CSS v4](https://tailwindcss.com) · [Blackbird](./src/utils/animation.ts)
