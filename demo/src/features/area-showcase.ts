import { $LitElement } from '@mixins/index'
import { area, HISTORY_STRATEGY } from '@schmancy/area'
import { html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'

// ============================================
// MINIMAL DEMO COMPONENTS
// ============================================

@customElement('demo-home')
class DemoHome extends $LitElement(css`
  :host { display: block; }
`) {
  render() {
    return html`
      <div class="p-4">
        <h2 class="text-2xl font-bold mb-2">Home</h2>
        <p class="text-gray-600">A simple home component</p>
      </div>
    `
  }
}

@customElement('demo-user')
class DemoUser extends $LitElement(css`
  :host { display: block; }
`) {
  @property({ type: String }) userId = ''
  
  render() {
    return html`
      <div class="p-4">
        <h2 class="text-2xl font-bold mb-2">User ${this.userId}</h2>
        <p class="text-gray-600">Showing profile for user: ${this.userId || 'Guest'}</p>
      </div>
    `
  }
}

@customElement('demo-settings')
class DemoSettings extends $LitElement(css`
  :host { display: block; }
`) {
  @property({ type: String }) tab = 'general'
  
  render() {
    return html`
      <div class="p-4">
        <h2 class="text-2xl font-bold mb-2">Settings</h2>
        <p class="text-gray-600">Active tab: ${this.tab}</p>
      </div>
    `
  }
}

// ============================================
// MAIN SHOWCASE COMPONENT
// ============================================

@customElement('area-showcase')
export class AreaShowcase extends $LitElement(css`
  :host {
    display: block;
    height: 100vh;
    overflow-y: auto;
  }
  
  .code-block {
    background: #1e1e1e;
    color: #d4d4d4;
    padding: 1rem;
    border-radius: 0.5rem;
    overflow-x: auto;
    font-family: 'Consolas', 'Monaco', monospace;
    font-size: 0.875rem;
    line-height: 1.5;
  }
  
  .example-section {
    border-bottom: 1px solid #e5e7eb;
    padding: 2rem 0;
  }
  
  .example-section:last-child {
    border-bottom: none;
  }
  
  schmancy-area {
    min-height: 120px;
    background: #f9fafb;
    border: 2px dashed #e5e7eb;
    border-radius: 0.5rem;
  }
`) {
  render() {
    return html`
      <div class="max-w-4xl mx-auto p-6">
        <h1 class="text-4xl font-bold mb-2">Area Router</h1>
        <p class="text-xl text-gray-600 mb-8">A powerful client-side routing system for web components</p>
        
        <!-- Example 1: Basic Navigation -->
        <div class="example-section">
          <h2 class="text-2xl font-semibold mb-4">1. Basic Navigation</h2>
          <p class="text-gray-600 mb-4">Simple component switching with area.push()</p>
          
          <div class="mb-4 space-x-2">
            <schmancy-button variant="outlined" @click=${() => this.navigate('demo-home')}>
              Home
            </schmancy-button>
            <schmancy-button variant="outlined" @click=${() => this.navigate('demo-settings')}>
              Settings
            </schmancy-button>
          </div>
          
          <schmancy-area name="demo-basic"></schmancy-area>
          
          <pre class="code-block mt-4">// Navigate to a component
area.push({
  area: 'demo-basic',
  component: 'demo-home',
  historyStrategy: HISTORY_STRATEGY.push
})</pre>
        </div>
        
        <!-- Example 2: Route Parameters -->
        <div class="example-section">
          <h2 class="text-2xl font-semibold mb-4">2. Route Parameters</h2>
          <p class="text-gray-600 mb-4">Pass data to components via params</p>
          
          <div class="mb-4 space-x-2">
            <schmancy-button variant="outlined" @click=${() => this.navigateUser('123')}>
              User 123
            </schmancy-button>
            <schmancy-button variant="outlined" @click=${() => this.navigateUser('456')}>
              User 456
            </schmancy-button>
            <schmancy-button variant="outlined" @click=${() => this.navigateUser('789')}>
              User 789
            </schmancy-button>
          </div>
          
          <schmancy-area name="users"></schmancy-area>
          
          <pre class="code-block mt-4">// Navigate with parameters
area.push({
  area: 'users',
  component: 'demo-user',
  params: { userId: '123' },
  historyStrategy: HISTORY_STRATEGY.push
})

// In your component, params are passed as properties
@customElement('demo-user')
class DemoUser extends LitElement {
  @property({ type: String }) userId = ''
  
  render() {
    return html\`User: \${this.userId}\`
  }
}</pre>
        </div>
        
        <!-- Example 3: Multiple Areas -->
        <div class="example-section">
          <h2 class="text-2xl font-semibold mb-4">3. Multiple Areas</h2>
          <p class="text-gray-600 mb-4">Use multiple areas for complex layouts</p>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-sm font-semibold mb-2">Left Panel</p>
              <div class="mb-2 space-x-2">
                <schmancy-button size="sm" variant="text" @click=${() => this.navigatePanel('left', 'demo-home')}>
                  Home
                </schmancy-button>
                <schmancy-button size="sm" variant="text" @click=${() => this.navigatePanel('left', 'demo-settings')}>
                  Settings
                </schmancy-button>
              </div>
              <schmancy-area name="left-panel"></schmancy-area>
            </div>
            
            <div>
              <p class="text-sm font-semibold mb-2">Right Panel</p>
              <div class="mb-2 space-x-2">
                <schmancy-button size="sm" variant="text" @click=${() => this.navigatePanel('right', 'demo-user', { userId: '999' })}>
                  User
                </schmancy-button>
                <schmancy-button size="sm" variant="text" @click=${() => this.navigatePanel('right', 'demo-settings', { tab: 'advanced' })}>
                  Settings
                </schmancy-button>
              </div>
              <schmancy-area name="right-panel"></schmancy-area>
            </div>
          </div>
          
          <pre class="code-block mt-4">// Multiple areas on the same page
<schmancy-area name="left-panel"></schmancy-area>
<schmancy-area name="right-panel"></schmancy-area>

// Navigate different areas independently
area.push({ area: 'left-panel', component: 'demo-home' })
area.push({ area: 'right-panel', component: 'demo-user' })</pre>
        </div>
        
        <!-- Example 4: History Strategies -->
        <div class="example-section">
          <h2 class="text-2xl font-semibold mb-4">4. History Strategies</h2>
          <p class="text-gray-600 mb-4">Control browser history behavior</p>
          
          <div class="mb-4 space-x-2">
            <schmancy-button variant="outlined" @click=${() => this.navigateWithStrategy('push')}>
              Push (adds to history)
            </schmancy-button>
            <schmancy-button variant="outlined" @click=${() => this.navigateWithStrategy('replace')}>
              Replace (replaces current)
            </schmancy-button>
            <schmancy-button variant="outlined" @click=${() => this.navigateWithStrategy('silent')}>
              Silent (no history change)
            </schmancy-button>
          </div>
          
          <schmancy-area name="history-demo"></schmancy-area>
          
          <pre class="code-block mt-4">// Different history strategies
area.push({
  area: 'history-demo',
  component: 'demo-home',
  historyStrategy: HISTORY_STRATEGY.push    // adds to history
})

area.push({
  area: 'history-demo',
  component: 'demo-home',
  historyStrategy: HISTORY_STRATEGY.replace // replaces current
})

area.push({
  area: 'history-demo',
  component: 'demo-home',
  historyStrategy: HISTORY_STRATEGY.silent  // no history change
})</pre>
        </div>
        
        <!-- Example 5: Subscribing to Route Changes -->
        <div class="example-section">
          <h2 class="text-2xl font-semibold mb-4">5. Subscribing to Changes</h2>
          <p class="text-gray-600 mb-4">React to route changes in your components</p>
          
          <pre class="code-block">// Subscribe to area changes
area.on('my-area').subscribe(route => {
  console.log('Route changed:', route)
})

// Get current route
const currentRoute = area.getRoute('my-area')

// Subscribe to specific param
area.param&lt;string&gt;('my-area', 'userId').subscribe(userId => {
  console.log('User ID changed:', userId)
})

// Subscribe to route state
area.getState&lt;MyState&gt;('my-area').subscribe(state => {
  console.log('State changed:', state)
})</pre>
        </div>
        
        <!-- Example 6: Default Components -->
        <div class="example-section">
          <h2 class="text-2xl font-semibold mb-4">6. Default Components</h2>
          <p class="text-gray-600 mb-4">Set fallback components for areas</p>
          
          <pre class="code-block"><!-- Set a default component -->
<schmancy-area name="app" default="demo-home"></schmancy-area>

<!-- The default will be shown when:
     - The area is first rendered
     - No valid route is found
     - Navigation fails -->
</pre>
        </div>
        
        <!-- API Reference -->
        <div class="example-section">
          <h2 class="text-2xl font-semibold mb-4">API Quick Reference</h2>
          
          <pre class="code-block">import { area, HISTORY_STRATEGY } from '@schmancy/area'

// Navigation
area.push({ area, component, params?, state?, historyStrategy? })

// Subscriptions
area.on(areaName)                    // Subscribe to area changes
area.params(areaName)                // Get all params
area.param(areaName, paramName)      // Get specific param
area.getState(areaName)              // Get route state

// Utilities
area.getRoute(areaName)              // Get current route (sync)
area.hasArea(areaName)               // Check if area exists
area.getActiveAreas()                // Get all active area names
area.pop(areaName)                   // Remove area
area.clear()                         // Clear all areas</pre>
        </div>
      </div>
    `
  }
  
  private navigate(component: string) {
    area.push({
      area: 'demo-basic',
      component,
      historyStrategy: HISTORY_STRATEGY.push
    })
  }
  
  private navigateUser(userId: string) {
    area.push({
      area: 'users',
      component: 'demo-user',
      params: { userId },
      historyStrategy: HISTORY_STRATEGY.push
    })
  }
  
  private navigatePanel(panel: string, component: string, params?: Record<string, unknown>) {
    area.push({
      area: `${panel}-panel`,
      component,
      params,
      historyStrategy: HISTORY_STRATEGY.push
    })
  }
  
  private navigateWithStrategy(strategy: string) {
    const component = strategy === 'push' ? 'demo-home' : 
                     strategy === 'replace' ? 'demo-user' : 'demo-settings'
    
    area.push({
      area: 'history-demo',
      component,
      params: { strategy },
      historyStrategy: HISTORY_STRATEGY[strategy as keyof typeof HISTORY_STRATEGY]
    })
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'area-showcase': AreaShowcase
    'demo-home': DemoHome
    'demo-user': DemoUser
    'demo-settings': DemoSettings
  }
}