# Schmancy Content Drawer

A sophisticated drawer/sheet component system that provides sliding panels for content organization, navigation, and modal interactions. Perfect for creating responsive layouts with collapsible sidebars, bottom sheets, and overlay panels.

## 🎯 Overview

The Content Drawer system consists of multiple components that work together to create flexible, animated drawer experiences:

- **Content Drawer** - The main container that orchestrates drawer behavior
- **Main Content** - The primary content area that adjusts when drawers open
- **Sheet/Drawer** - The sliding panel that contains secondary content
- **Context System** - Shared state management for drawer coordination

## 🚀 Key Features

- **Responsive Design** - Automatically adapts between mobile and desktop layouts
- **Smooth Animations** - Hardware-accelerated transitions for fluid interactions
- **Flexible Positioning** - Support for left, right, top, and bottom drawers
- **State Management** - Built-in context system for complex drawer hierarchies
- **Touch Gestures** - Swipe to open/close on mobile devices
- **Accessibility** - Full keyboard navigation and screen reader support
- **Theme Integration** - Follows Material Design 3 principles

## 📦 Basic Usage

```html
<schmancy-content-drawer>
  <schmancy-content-drawer-main>
    <!-- Main content goes here -->
    <h1>Main Application Content</h1>
    <p>This content will shift when the drawer opens.</p>
  </schmancy-content-drawer-main>

  <schmancy-content-drawer-sheet>
    <!-- Drawer content goes here -->
    <nav>
      <h2>Navigation</h2>
      <ul>
        <li>Home</li>
        <li>About</li>
        <li>Contact</li>
      </ul>
    </nav>
  </schmancy-content-drawer-sheet>
</schmancy-content-drawer>
```

## 🎨 Examples

### Navigation Drawer

```typescript
import { LitElement, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import '@schmancy/content-drawer'

@customElement('app-layout')
export class AppLayout extends LitElement {
  @state() drawerOpen = false

  render() {
    return html`
      <schmancy-content-drawer ?open=${this.drawerOpen}>
        <schmancy-content-drawer-main>
          <header>
            <schmancy-icon-button 
              icon="menu"
              @click=${() => this.drawerOpen = !this.drawerOpen}
            ></schmancy-icon-button>
            <h1>My Application</h1>
          </header>
          
          <main>
            <!-- Main app content -->
          </main>
        </schmancy-content-drawer-main>

        <schmancy-content-drawer-sheet width="280px">
          <div class="drawer-header">
            <img src="logo.png" alt="Logo" />
            <h2>App Name</h2>
          </div>
          
          <schmancy-list>
            <schmancy-list-item @click=${() => this.navigate('home')}>
              <schmancy-icon slot="start">home</schmancy-icon>
              Home
            </schmancy-list-item>
            <schmancy-list-item @click=${() => this.navigate('profile')}>
              <schmancy-icon slot="start">person</schmancy-icon>
              Profile
            </schmancy-list-item>
            <schmancy-list-item @click=${() => this.navigate('settings')}>
              <schmancy-icon slot="start">settings</schmancy-icon>
              Settings
            </schmancy-list-item>
          </schmancy-list>
        </schmancy-content-drawer-sheet>
      </schmancy-content-drawer>
    `
  }

  navigate(page: string) {
    // Handle navigation
    this.drawerOpen = false
  }
}
```

### Responsive Bottom Sheet

```typescript
@customElement('mobile-actions')
export class MobileActions extends LitElement {
  @state() sheetOpen = false
  @state() selectedImage: File | null = null

  render() {
    return html`
      <schmancy-content-drawer
        ?open=${this.sheetOpen}
        position="bottom"
        @drawer-closed=${() => this.sheetOpen = false}
      >
        <schmancy-content-drawer-main>
          <div class="image-picker">
            <schmancy-button @click=${() => this.sheetOpen = true}>
              ${this.selectedImage ? 'Change Image' : 'Select Image'}
            </schmancy-button>
            
            ${this.selectedImage ? html`
              <img src=${URL.createObjectURL(this.selectedImage)} />
            ` : ''}
          </div>
        </schmancy-content-drawer-main>

        <schmancy-content-drawer-sheet height="auto" max-height="50vh">
          <div class="sheet-handle"></div>
          <h3>Select Image Source</h3>
          
          <schmancy-list>
            <schmancy-list-item @click=${() => this.selectSource('camera')}>
              <schmancy-icon slot="start">photo_camera</schmancy-icon>
              Take Photo
            </schmancy-list-item>
            <schmancy-list-item @click=${() => this.selectSource('gallery')}>
              <schmancy-icon slot="start">photo_library</schmancy-icon>
              Choose from Gallery
            </schmancy-list-item>
            <schmancy-list-item @click=${() => this.selectSource('files')}>
              <schmancy-icon slot="start">folder</schmancy-icon>
              Browse Files
            </schmancy-list-item>
          </schmancy-list>
        </schmancy-content-drawer-sheet>
      </schmancy-content-drawer>
    `
  }

  selectSource(source: string) {
    // Handle source selection
    this.sheetOpen = false
  }
}
```

### Persistent Sidebar with Context

```typescript
import { contentDrawerContext } from '@schmancy/content-drawer'

@customElement('dashboard-layout')
export class DashboardLayout extends LitElement {
  private drawerContext = contentDrawerContext.create('main-drawer')

  connectedCallback() {
    super.connectedCallback()
    
    // Subscribe to drawer state changes
    this.drawerContext.state$.subscribe(state => {
      console.log('Drawer state:', state)
    })
    
    // Check screen size for responsive behavior
    const mediaQuery = window.matchMedia('(min-width: 1024px)')
    this.drawerContext.setPersistent(mediaQuery.matches)
    
    mediaQuery.addEventListener('change', (e) => {
      this.drawerContext.setPersistent(e.matches)
    })
  }

  render() {
    return html`
      <schmancy-content-drawer
        .context=${this.drawerContext}
        variant="persistent"
        breakpoint="1024px"
      >
        <schmancy-content-drawer-main>
          <schmancy-app-bar>
            <schmancy-icon-button
              icon="menu"
              @click=${() => this.drawerContext.toggle()}
            ></schmancy-icon-button>
            <span>Dashboard</span>
          </schmancy-app-bar>
          
          <div class="dashboard-content">
            <!-- Dashboard widgets -->
          </div>
        </schmancy-content-drawer-main>

        <schmancy-content-drawer-sheet width="240px">
          <div class="sidebar">
            <div class="user-info">
              <schmancy-avatar>JD</schmancy-avatar>
              <div>
                <div class="name">John Doe</div>
                <div class="email">john@example.com</div>
              </div>
            </div>
            
            <schmancy-divider></schmancy-divider>
            
            <nav>
              <a href="/dashboard" class="nav-item active">
                <schmancy-icon>dashboard</schmancy-icon>
                Dashboard
              </a>
              <a href="/analytics" class="nav-item">
                <schmancy-icon>analytics</schmancy-icon>
                Analytics
              </a>
              <a href="/reports" class="nav-item">
                <schmancy-icon>description</schmancy-icon>
                Reports
              </a>
            </nav>
          </div>
        </schmancy-content-drawer-sheet>
      </schmancy-content-drawer>
    `
  }
}
```

### Multi-level Drawer System

```typescript
@customElement('nested-navigation')
export class NestedNavigation extends LitElement {
  private mainDrawer = contentDrawerContext.create('main')
  private subDrawer = contentDrawerContext.create('sub')
  
  @state() selectedCategory: string = ''

  render() {
    return html`
      <schmancy-content-drawer .context=${this.mainDrawer}>
        <schmancy-content-drawer-main>
          <!-- Main drawer for categories -->
          <schmancy-content-drawer .context=${this.subDrawer}>
            <schmancy-content-drawer-main>
              <!-- Application content -->
              <button @click=${() => this.mainDrawer.open()}>
                Open Menu
              </button>
            </schmancy-content-drawer-main>
            
            <!-- Sub drawer for items -->
            <schmancy-content-drawer-sheet 
              width="280px"
              offset="240px"
            >
              <div class="sub-drawer-header">
                <schmancy-icon-button 
                  icon="arrow_back"
                  @click=${() => this.subDrawer.close()}
                ></schmancy-icon-button>
                <h3>${this.selectedCategory}</h3>
              </div>
              
              <schmancy-list>
                ${this.getItemsForCategory(this.selectedCategory).map(item => html`
                  <schmancy-list-item>${item}</schmancy-list-item>
                `)}
              </schmancy-list>
            </schmancy-content-drawer-sheet>
          </schmancy-content-drawer>
        </schmancy-content-drawer-main>
        
        <!-- Main drawer for categories -->
        <schmancy-content-drawer-sheet width="240px">
          <h2>Categories</h2>
          <schmancy-list>
            ${this.categories.map(category => html`
              <schmancy-list-item @click=${() => this.openSubDrawer(category)}>
                <schmancy-icon slot="start">${category.icon}</schmancy-icon>
                ${category.name}
                <schmancy-icon slot="end">chevron_right</schmancy-icon>
              </schmancy-list-item>
            `)}
          </schmancy-list>
        </schmancy-content-drawer-sheet>
      </schmancy-content-drawer>
    `
  }

  openSubDrawer(category: any) {
    this.selectedCategory = category.name
    this.subDrawer.open()
  }
}
```

## 🎯 AI Integration Examples

### Smart Command Palette

```typescript
@customElement('ai-command-drawer')
export class AICommandDrawer extends LitElement {
  @state() query = ''
  @state() results: any[] = []
  @state() isProcessing = false
  
  private drawer = contentDrawerContext.create('command')

  render() {
    return html`
      <schmancy-content-drawer
        .context=${this.drawer}
        position="top"
        variant="modal"
      >
        <schmancy-content-drawer-main>
          <!-- Main app content -->
        </schmancy-content-drawer-main>
        
        <schmancy-content-drawer-sheet height="400px">
          <div class="command-palette">
            <schmancy-input
              placeholder="Ask me anything..."
              .value=${this.query}
              @input=${this.handleInput}
              autofocus
            >
              <schmancy-icon slot="prefix">
                ${this.isProcessing ? 'hourglass_empty' : 'search'}
              </schmancy-icon>
            </schmancy-input>
            
            <div class="results">
              ${this.results.map(result => html`
                <div class="result-item" @click=${() => this.executeAction(result)}>
                  <schmancy-icon>${result.icon}</schmancy-icon>
                  <div class="result-content">
                    <div class="title">${result.title}</div>
                    <div class="description">${result.description}</div>
                  </div>
                  ${result.shortcut ? html`
                    <kbd>${result.shortcut}</kbd>
                  ` : ''}
                </div>
              `)}
            </div>
            
            ${this.isProcessing ? html`
              <div class="processing">
                <schmancy-circular-progress></schmancy-circular-progress>
                <span>Thinking...</span>
              </div>
            ` : ''}
          </div>
        </schmancy-content-drawer-sheet>
      </schmancy-content-drawer>
    `
  }

  async handleInput(e: Event) {
    this.query = (e.target as HTMLInputElement).value
    this.isProcessing = true
    
    // AI-powered search and suggestions
    try {
      const response = await fetch('/api/ai-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: this.query })
      })
      
      this.results = await response.json()
    } finally {
      this.isProcessing = false
    }
  }
}

// Open with keyboard shortcut
document.addEventListener('keydown', (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault()
    document.querySelector('ai-command-drawer')?.drawer.open()
  }
})
```

### Contextual Help Panel

```typescript
@customElement('contextual-help')
export class ContextualHelp extends LitElement {
  @state() helpContent: any = null
  @state() isLoading = false
  @state() currentContext = ''
  
  private drawer = contentDrawerContext.create('help')

  render() {
    return html`
      <schmancy-content-drawer
        .context=${this.drawer}
        position="right"
        variant="overlay"
      >
        <schmancy-content-drawer-main>
          <!-- Main content with help triggers -->
          <form>
            <schmancy-input
              label="Email"
              type="email"
              helper-text="Enter your email address"
              @focus=${() => this.showHelp('email-input')}
            ></schmancy-input>
            
            <schmancy-input
              label="Password"
              type="password"
              helper-text="Must be at least 8 characters"
              @focus=${() => this.showHelp('password-input')}
            ></schmancy-input>
          </form>
        </schmancy-content-drawer-main>
        
        <schmancy-content-drawer-sheet width="350px">
          <div class="help-panel">
            <div class="help-header">
              <schmancy-icon>help_outline</schmancy-icon>
              <h3>Help & Tips</h3>
              <schmancy-icon-button
                icon="close"
                @click=${() => this.drawer.close()}
              ></schmancy-icon-button>
            </div>
            
            ${this.isLoading ? html`
              <div class="loading">
                <schmancy-skeleton-text lines="3"></schmancy-skeleton-text>
              </div>
            ` : this.helpContent ? html`
              <div class="help-content">
                <h4>${this.helpContent.title}</h4>
                <div class="content">${this.helpContent.content}</div>
                
                ${this.helpContent.tips ? html`
                  <div class="tips">
                    <h5>Tips:</h5>
                    <ul>
                      ${this.helpContent.tips.map(tip => html`
                        <li>${tip}</li>
                      `)}
                    </ul>
                  </div>
                ` : ''}
                
                ${this.helpContent.related ? html`
                  <div class="related">
                    <h5>Related Topics:</h5>
                    <div class="chips">
                      ${this.helpContent.related.map(topic => html`
                        <schmancy-chip
                          @click=${() => this.showHelp(topic.id)}
                        >${topic.label}</schmancy-chip>
                      `)}
                    </div>
                  </div>
                ` : ''}
              </div>
            ` : html`
              <div class="empty-state">
                <schmancy-icon>info</schmancy-icon>
                <p>Click on any field to see contextual help</p>
              </div>
            `}
          </div>
        </schmancy-content-drawer-sheet>
      </schmancy-content-drawer>
    `
  }

  async showHelp(context: string) {
    if (this.currentContext === context && this.drawer.isOpen) return
    
    this.currentContext = context
    this.isLoading = true
    this.drawer.open()
    
    // Fetch AI-generated help content
    try {
      const response = await fetch(`/api/help/${context}`)
      this.helpContent = await response.json()
    } finally {
      this.isLoading = false
    }
  }
}
```

## 📊 API Reference

### SchmancyContentDrawer

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `open` | `boolean` | `false` | Controls drawer open state |
| `position` | `'left' \| 'right' \| 'top' \| 'bottom'` | `'left'` | Drawer position |
| `variant` | `'standard' \| 'modal' \| 'persistent'` | `'standard'` | Drawer behavior variant |
| `breakpoint` | `string` | `'1024px'` | Breakpoint for responsive behavior |
| `backdrop` | `boolean` | `true` | Show backdrop in modal variant |
| `closeOnEscape` | `boolean` | `true` | Close drawer on Escape key |
| `closeOnBackdrop` | `boolean` | `true` | Close drawer on backdrop click |
| `swipeToOpen` | `boolean` | `true` | Enable swipe gesture to open |
| `swipeToClose` | `boolean` | `true` | Enable swipe gesture to close |

### SchmancyContentDrawerSheet

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `width` | `string` | `'256px'` | Width for left/right drawers |
| `height` | `string` | `'auto'` | Height for top/bottom drawers |
| `maxWidth` | `string` | `'100vw'` | Maximum width constraint |
| `maxHeight` | `string` | `'100vh'` | Maximum height constraint |
| `offset` | `string` | `'0'` | Offset from edge (for nested drawers) |

### Events

| Event | Detail | Description |
|-------|--------|-------------|
| `drawer-opened` | `void` | Fired when drawer opens |
| `drawer-closed` | `void` | Fired when drawer closes |
| `drawer-toggled` | `{ open: boolean }` | Fired when drawer toggles |
| `before-open` | `void` | Fired before opening animation |
| `before-close` | `void` | Fired before closing animation |

### Context API

```typescript
import { contentDrawerContext } from '@schmancy/content-drawer'

// Create drawer context
const drawer = contentDrawerContext.create('my-drawer')

// Control drawer
drawer.open()
drawer.close()
drawer.toggle()

// Check state
if (drawer.isOpen) {
  // Drawer is open
}

// Subscribe to changes
drawer.state$.subscribe(state => {
  console.log('Drawer state:', state)
})

// Set persistent mode
drawer.setPersistent(true)

// Lock drawer (prevent closing)
drawer.lock()
drawer.unlock()
```

## 🎨 Styling

### CSS Custom Properties

```css
schmancy-content-drawer {
  /* Drawer styling */
  --drawer-background: var(--md-sys-color-surface);
  --drawer-text-color: var(--md-sys-color-on-surface);
  --drawer-width: 256px;
  --drawer-shadow: 0 8px 10px -5px rgba(0,0,0,0.2);
  
  /* Animation */
  --drawer-transition-duration: 250ms;
  --drawer-transition-timing: cubic-bezier(0.4, 0, 0.2, 1);
  
  /* Backdrop */
  --backdrop-color: rgba(0, 0, 0, 0.5);
  --backdrop-blur: 0px;
  
  /* Z-index layers */
  --drawer-z-index: 200;
  --backdrop-z-index: 199;
}

/* Responsive breakpoints */
@media (min-width: 1024px) {
  schmancy-content-drawer[variant="persistent"] {
    --drawer-shadow: none;
  }
}
```

### Custom Animations

```typescript
// Custom open animation
<schmancy-content-drawer
  .openAnimation=${[
    { transform: 'translateX(-100%)' },
    { transform: 'translateX(0)' }
  ]}
  .openAnimationOptions=${{
    duration: 300,
    easing: 'ease-out'
  }}
>

// Custom close animation
<schmancy-content-drawer
  .closeAnimation=${[
    { opacity: 1 },
    { opacity: 0 }
  ]}
>
```

## 🚀 Performance Optimization

### Lazy Loading Content

```typescript
@customElement('lazy-drawer')
export class LazyDrawer extends LitElement {
  @state() drawerContent: TemplateResult | null = null

  render() {
    return html`
      <schmancy-content-drawer
        @before-open=${this.loadContent}
      >
        <schmancy-content-drawer-main>
          <!-- Main content -->
        </schmancy-content-drawer-main>
        
        <schmancy-content-drawer-sheet>
          ${this.drawerContent || html`
            <schmancy-circular-progress></schmancy-circular-progress>
          `}
        </schmancy-content-drawer-sheet>
      </schmancy-content-drawer>
    `
  }

  async loadContent() {
    if (!this.drawerContent) {
      // Lazy load content
      const module = await import('./drawer-content.js')
      this.drawerContent = module.renderContent()
    }
  }
}
```

### Virtual Scrolling

```typescript
// For long lists in drawers
<schmancy-content-drawer-sheet>
  <schmancy-virtual-list
    .items=${this.longList}
    .renderItem=${(item) => html`
      <schmancy-list-item>${item.name}</schmancy-list-item>
    `}
  ></schmancy-virtual-list>
</schmancy-content-drawer-sheet>
```

## 🎯 Best Practices

1. **Mobile First**: Design drawer content for mobile screens first
2. **Accessibility**: Include proper ARIA labels and keyboard navigation
3. **Performance**: Lazy load heavy content and use virtual scrolling for lists
4. **Responsive**: Use persistent variant for desktop, modal for mobile
5. **Context**: Use drawer context for complex multi-drawer scenarios
6. **Testing**: Test swipe gestures on actual devices

## 🔗 Related Components

- [Sheet](../sheet) - Standalone bottom sheet component
- [Navigation Drawer](../nav-drawer) - Specialized navigation drawer
- [Dialog](../dialog) - Modal dialogs
- [Layout](../layout) - Layout utilities