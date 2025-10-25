# Navigation Drawer Component

A responsive navigation drawer system that adapts between overlay and push modes based on screen size, providing flexible app navigation patterns.

## Quick Start

```html
<!-- Basic navigation drawer -->
<schmancy-nav-drawer>
  <schmancy-nav-drawer-navbar>
    <nav>
      <schmancy-list>
        <schmancy-list-item>Dashboard</schmancy-list-item>
        <schmancy-list-item>Settings</schmancy-list-item>
      </schmancy-list>
    </nav>
  </schmancy-nav-drawer-navbar>
  
  <schmancy-nav-drawer-content>
    <schmancy-nav-drawer-appbar>
      <h1>My App</h1>
    </schmancy-nav-drawer-appbar>
    <main>
      <!-- Page content -->
    </main>
  </schmancy-nav-drawer-content>
</schmancy-nav-drawer>
```

## Components

### schmancy-nav-drawer
The root container that manages drawer state and responsive behavior.

**Properties:**
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `fullscreen` | `boolean` | `false` | Hide drawer in fullscreen mode |
| `breakpoint` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Responsive breakpoint |
| `open` | `'open' \| 'close'` | - | Drawer state |

### schmancy-nav-drawer-navbar
The navigation sidebar component.

**Properties:**
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `width` | `string` | `'320px'` | Drawer width |

### schmancy-nav-drawer-content
Container for main content area.

### schmancy-nav-drawer-appbar
Optional app bar for the content area.

## Examples

### Complete App Layout
```html
<schmancy-nav-drawer breakpoint="lg">
  <!-- Navigation Sidebar -->
  <schmancy-nav-drawer-navbar width="280px">
    <div class="p-4">
      <h2 class="text-xl font-bold mb-4">My App</h2>
    </div>
    
    <schmancy-list>
      <schmancy-list-item @click="${() => navigate('/dashboard')}">
        <schmancy-icon slot="start">dashboard</schmancy-icon>
        Dashboard
      </schmancy-list-item>
      
      <schmancy-list-item @click="${() => navigate('/users')}">
        <schmancy-icon slot="start">people</schmancy-icon>
        Users
      </schmancy-list-item>
      
      <schmancy-divider class="my-2"></schmancy-divider>
      
      <schmancy-list-item @click="${() => navigate('/settings')}">
        <schmancy-icon slot="start">settings</schmancy-icon>
        Settings
      </schmancy-list-item>
    </schmancy-list>
  </schmancy-nav-drawer-navbar>
  
  <!-- Main Content -->
  <schmancy-nav-drawer-content>
    <!-- App Bar -->
    <schmancy-nav-drawer-appbar>
      <schmancy-icon-button @click="${toggleDrawer}">
        menu
      </schmancy-icon-button>
      <h1 class="text-xl">Dashboard</h1>
    </schmancy-nav-drawer-appbar>
    
    <!-- Page Content -->
    <main class="p-4">
      <router-outlet></router-outlet>
    </main>
  </schmancy-nav-drawer-content>
</schmancy-nav-drawer>
```

### With User Profile
```html
<schmancy-nav-drawer>
  <schmancy-nav-drawer-navbar>
    <!-- User Profile Section -->
    <div class="p-4 border-b">
      <schmancy-avatar 
        src="/user-avatar.jpg" 
        name="John Doe"
      ></schmancy-avatar>
      <div class="mt-2">
        <div class="font-medium">John Doe</div>
        <div class="text-sm opacity-70">john@example.com</div>
      </div>
    </div>
    
    <!-- Navigation -->
    <schmancy-list class="py-2">
      <!-- Menu items -->
    </schmancy-list>
  </schmancy-nav-drawer-navbar>
  
  <schmancy-nav-drawer-content>
    <!-- Content -->
  </schmancy-nav-drawer-content>
</schmancy-nav-drawer>
```

## Features

### Responsive Modes
- **Push Mode**: Drawer pushes content (desktop)
- **Overlay Mode**: Drawer overlays content (mobile)
- Automatic switching based on breakpoint

### Breakpoint Values
- `sm`: 640px
- `md`: 768px (default)
- `lg`: 1024px
- `xl`: 1280px

### Events
Toggle drawer programmatically:
```javascript
window.dispatchEvent(
  new CustomEvent('schmancy-nav-drawer-toggle', {
    detail: { state: 'open' } // or 'close'
  })
);
```

### Animation
Smooth transitions with customizable easing:
- Overlay fade: 200ms open, 150ms close
- Drawer slide: 200ms
- Cubic bezier easing for natural motion

## Styling

```css
/* Custom drawer styling */
schmancy-nav-drawer-navbar {
  --drawer-width: 320px;
  --animation-duration: 200ms;
}

/* Overlay customization */
schmancy-nav-drawer {
  --overlay-opacity: 0.4;
  --overlay-color: var(--schmancy-sys-color-scrim);
}
```

## Context System

The component uses Lit Context API for state management:
- `SchmancyDrawerNavbarMode`: Current mode (push/overlay)
- `SchmancyDrawerNavbarState`: Open/close state

## Best Practices

1. **Navigation Structure**: Keep navigation hierarchy shallow
2. **Mobile First**: Design for overlay mode first
3. **Breakpoints**: Choose breakpoints based on content
4. **Performance**: Use `fullscreen` prop for immersive experiences
5. **Accessibility**: Include proper ARIA labels

## Related Components

- [List](./list.md) - Navigation menu items
- [Icon](./icons.md) - Menu icons
- [Avatar](./avatar.md) - User profiles
- [Surface](./surface.md) - Content containers
- [Button](./button.md) - Navigation triggers

## Use Cases

1. **Admin Dashboards**: Multi-section navigation
2. **Mobile Apps**: Responsive app shells
3. **Documentation Sites**: Side navigation
4. **E-commerce**: Category navigation
5. **Social Apps**: User navigation with profiles