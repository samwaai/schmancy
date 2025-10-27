# Schmancy Area Router - Developer Guide

## Quick Start Examples

### Example 1: Basic Navigation

```typescript
import { area, HISTORY_STRATEGY } from '@schmancy/area'
import { LitElement, html } from 'lit'
import { customElement } from 'lit/decorators.js'

// Define your page components
@customElement('page-home')
class PageHome extends LitElement {
  render() {
    return html`<h1>Welcome Home!</h1>`
  }
}

@customElement('page-about')
class PageAbout extends LitElement {
  render() {
    return html`<h1>About Us</h1>`
  }
}

// Main app with navigation
@customElement('my-app')
class MyApp extends LitElement {
  navigate(page: string) {
    area.push({
      area: 'main',
      component: `page-${page}`,
      historyStrategy: HISTORY_STRATEGY.push
    })
  }
  
  render() {
    return html`
      <nav>
        <button @click=${() => this.navigate('home')}>Home</button>
        <button @click=${() => this.navigate('about')}>About</button>
      </nav>
      
      <schmancy-area name="main" default="page-home"></schmancy-area>
    `
  }
}
```

### Example 2: Route Parameters

```typescript
@customElement('user-profile')
class UserProfile extends LitElement {
  @state() userId = ''
  @state() userData: any = {}
  
  connectedCallback() {
    super.connectedCallback()
    
    // Subscribe to userId parameter
    area.param<string>('main', 'userId').subscribe(id => {
      if (id) {
        this.userId = id
        this.loadUserData(id)
      }
    })
  }
  
  async loadUserData(id: string) {
    // Fetch user data
    this.userData = await fetch(`/api/users/${id}`).then(r => r.json())
  }
  
  render() {
    return html`
      <div>
        <h1>User: ${this.userData.name}</h1>
        <p>ID: ${this.userId}</p>
      </div>
    `
  }
}

// Navigate with parameters
area.push({
  area: 'main',
  component: 'user-profile',
  params: { userId: '12345' },
  historyStrategy: HISTORY_STRATEGY.push
})
```

### Example 3: Persistent Form State

```typescript
@customElement('contact-form')
class ContactForm extends LitElement {
  @state() formData = {
    name: '',
    email: '',
    message: ''
  }
  
  connectedCallback() {
    super.connectedCallback()
    
    // Restore form state from route
    area.getState<typeof this.formData>('main').subscribe(state => {
      if (state) {
        this.formData = { ...this.formData, ...state }
      }
    })
  }
  
  updateField(field: string, value: string) {
    this.formData = { ...this.formData, [field]: value }
    
    // Save form state to route (replace to avoid history spam)
    area.push({
      area: 'main',
      component: 'contact-form',
      state: this.formData,
      historyStrategy: HISTORY_STRATEGY.replace
    })
  }
  
  render() {
    return html`
      <form>
        <input 
          .value=${this.formData.name}
          @input=${(e: Event) => this.updateField('name', (e.target as HTMLInputElement).value)}
          placeholder="Name"
        />
        <input 
          .value=${this.formData.email}
          @input=${(e: Event) => this.updateField('email', (e.target as HTMLInputElement).value)}
          placeholder="Email"
        />
        <textarea 
          .value=${this.formData.message}
          @input=${(e: Event) => this.updateField('message', (e.target as HTMLTextAreaElement).value)}
          placeholder="Message"
        ></textarea>
      </form>
    `
  }
}
```

### Example 4: Modal Router

```typescript
@customElement('app-modal')
class AppModal extends LitElement {
  @property() title = ''
  @property() content = ''
  
  connectedCallback() {
    super.connectedCallback()
    
    area.params<{title: string, content: string}>('modal').subscribe(params => {
      this.title = params.title || ''
      this.content = params.content || ''
    })
  }
  
  close() {
    area.pop('modal')
  }
  
  render() {
    return html`
      <div class="modal-backdrop" @click=${this.close}>
        <div class="modal-content" @click=${(e: Event) => e.stopPropagation()}>
          <h2>${this.title}</h2>
          <p>${this.content}</p>
          <button @click=${this.close}>Close</button>
        </div>
      </div>
    `
  }
}

// Open modal
area.push({
  area: 'modal',
  component: 'app-modal',
  params: {
    title: 'Confirm Action',
    content: 'Are you sure you want to proceed?'
  },
  historyStrategy: HISTORY_STRATEGY.push
})

// In your main app template
render() {
  return html`
    <main>
      <schmancy-area name="main" default="page-home"></schmancy-area>
    </main>
    
    ${this.modalOpen ? html`
      <schmancy-area name="modal"></schmancy-area>
    ` : ''}
  `
}
```

### Example 5: Tab Navigation

```typescript
@customElement('settings-page')
class SettingsPage extends LitElement {
  @state() activeTab = 'general'
  
  connectedCallback() {
    super.connectedCallback()
    
    area.param<string>('main', 'tab').subscribe(tab => {
      this.activeTab = tab || 'general'
    })
  }
  
  switchTab(tab: string) {
    area.push({
      area: 'main',
      component: 'settings-page',
      params: { tab },
      historyStrategy: HISTORY_STRATEGY.push
    })
  }
  
  render() {
    return html`
      <div class="tabs">
        <button 
          class=${this.activeTab === 'general' ? 'active' : ''}
          @click=${() => this.switchTab('general')}
        >
          General
        </button>
        <button 
          class=${this.activeTab === 'privacy' ? 'active' : ''}
          @click=${() => this.switchTab('privacy')}
        >
          Privacy
        </button>
        <button 
          class=${this.activeTab === 'notifications' ? 'active' : ''}
          @click=${() => this.switchTab('notifications')}
        >
          Notifications
        </button>
      </div>
      
      <div class="tab-content">
        ${this.activeTab === 'general' ? html`
          <h3>General Settings</h3>
          <!-- General settings content -->
        ` : this.activeTab === 'privacy' ? html`
          <h3>Privacy Settings</h3>
          <!-- Privacy settings content -->
        ` : html`
          <h3>Notification Settings</h3>
          <!-- Notification settings content -->
        `}
      </div>
    `
  }
}
```

## Common Patterns

### Protected Routes

```typescript
// Check authentication before navigation
function navigateToProtected(component: string) {
  if (!isAuthenticated()) {
    area.push({
      area: 'main',
      component: 'login-page',
      state: { redirect: component }
    })
    return
  }
  
  area.push({
    area: 'main',
    component,
    historyStrategy: HISTORY_STRATEGY.push
  })
}
```

### Nested Routes

```typescript
// Parent component with sub-area
@customElement('dashboard-layout')
class DashboardLayout extends LitElement {
  render() {
    return html`
      <div class="dashboard">
        <aside class="sidebar">
          <nav><!-- Dashboard navigation --></nav>
        </aside>
        <main>
          <schmancy-area name="dashboard-content" default="dashboard-overview"></schmancy-area>
        </main>
      </div>
    `
  }
}
```

### Route Guards

```typescript
// Intercept navigation
const originalPush = area.push.bind(area)
area.push = (route) => {
  // Check permissions
  if (route.component === 'admin-panel' && !hasAdminRole()) {
    console.warn('Access denied')
    return
  }
  
  // Proceed with navigation
  originalPush(route)
}
```

### Query Parameters

```typescript
// Handle query params separately
const urlParams = new URLSearchParams(window.location.search)
const searchQuery = urlParams.get('q')

// Include in navigation
area.push({
  area: 'main',
  component: 'search-results',
  params: { query: searchQuery },
  clearQueryParams: ['q'] // Optional: clear from URL
})
```

## Tips & Tricks

1. **Preload Components**: Import components at app start for instant navigation
2. **Use Replace for Filters**: When updating filters/sorting, use `replace` strategy
3. **Handle Deep Links**: Always handle direct navigation to any route
4. **Clean Subscriptions**: Unsubscribe in `disconnectedCallback`
5. **Type Your Routes**: Create interfaces for your route params and state