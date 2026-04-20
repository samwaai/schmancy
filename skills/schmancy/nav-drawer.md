# schmancy-nav-drawer

> Responsive navigation drawer that switches between push (desktop) and overlay (mobile) modes.

## Usage
```html
<schmancy-nav-drawer breakpoint="md">
  <schmancy-nav-drawer-navbar>
    <!-- Navigation rail or sidebar content -->
  </schmancy-nav-drawer-navbar>
  <schmancy-nav-drawer-content>
    <!-- Main content area -->
  </schmancy-nav-drawer-content>
</schmancy-nav-drawer>
```

## Properties (schmancy-nav-drawer)
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| breakpoint | `'sm'\|'md'\|'lg'\|'xl'` | `'md'` | Responsive breakpoint for push/overlay switch |
| open | `'open'\|'close'` | auto | Drawer state |
| fullscreen | boolean | `false` | Fullscreen mode (hides sidebar) |

## Child Components
| Component | Description |
|-----------|-------------|
| `schmancy-nav-drawer-navbar` | Sidebar container (auto-hides in overlay mode) |
| `schmancy-nav-drawer-content` | Main content area (fills remaining space) |

## Behavior
- Above breakpoint: push mode (sidebar pushes content)
- Below breakpoint: overlay mode (sidebar overlays content)
- Toggle via `SchmancyEvents.NavDrawer_toggle` event
- Grid layout: `auto 1fr` columns

## Examples
```html
<schmancy-nav-drawer breakpoint="lg">
  <schmancy-nav-drawer-navbar>
    <schmancy-navigation-rail activeIndex="0">
      <schmancy-navigation-rail-item icon="home" label="Home">
      </schmancy-navigation-rail-item>
    </schmancy-navigation-rail>
  </schmancy-nav-drawer-navbar>
  <schmancy-nav-drawer-content>
    <schmancy-area name="main" default="home-page">
      <schmancy-route when="home-page" .component=${lazy(() => import('./home'))}>
      </schmancy-route>
    </schmancy-area>
  </schmancy-nav-drawer-content>
</schmancy-nav-drawer>
```
