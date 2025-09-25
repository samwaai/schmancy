import { html, css } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { $LitElement } from '@mixins/index'

@customElement('demo-navigation-bar')
export class NavigationBar extends $LitElement(css`
  :host {
    display: block;
  }
`) {
  @state() private currentView = 'dashboard'
  @state() private orderCount = 12
  @state() private productCount = 48

  private handleNavigation = (e: CustomEvent) => {
    const routes = ['dashboard', 'orders', 'products', 'customers', 'settings']
    const route = routes[e.detail.newIndex]
    this.currentView = route
  }

  private getActiveIndex(): number {
    const routes = ['dashboard', 'orders', 'products', 'customers', 'settings']
    return routes.indexOf(this.currentView)
  }

  render() {
    return html`
      <schmancy-surface class="p-8">
        <!-- Header -->
        <schmancy-typography type="display" token="lg" class="mb-4 block">
          Navigation Bar with Routing
        </schmancy-typography>
        <schmancy-typography type="body" token="lg" class="mb-8 text-surface-onVariant block">
          Real-world example: Navigation bar integrated with schmancy-area for routing
        </schmancy-typography>

        <!-- Practical Example -->
        <div class="mb-12">
          <schmancy-typography type="title" token="lg" class="mb-6 block">Working Example</schmancy-typography>
          <schmancy-surface type="surfaceDim" rounded="all" class="overflow-hidden">
            <div class="h-[600px] flex flex-col">
              <!-- Main Content Area -->
              <div class="flex-1 overflow-auto">
                ${this.currentView === 'dashboard' ? html`
                    <div class="p-6">
                      <schmancy-typography type="headline" token="md" class="mb-6 block">Dashboard</schmancy-typography>
                      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <schmancy-card>
                          <div class="p-6">
                            <div class="flex items-center justify-between mb-2">
                              <schmancy-icon class="text-primary text-2xl">shopping_cart</schmancy-icon>
                              <schmancy-chip type="assist" class="text-xs">+24%</schmancy-chip>
                            </div>
                            <schmancy-typography type="display" token="sm" class="mb-1">${this.orderCount}</schmancy-typography>
                            <schmancy-typography type="body" token="sm" class="text-surface-onVariant">New Orders</schmancy-typography>
                          </div>
                        </schmancy-card>
                        <schmancy-card>
                          <div class="p-6">
                            <div class="flex items-center justify-between mb-2">
                              <schmancy-icon class="text-primary text-2xl">inventory</schmancy-icon>
                              <schmancy-chip type="assist" class="text-xs">In Stock</schmancy-chip>
                            </div>
                            <schmancy-typography type="display" token="sm" class="mb-1">${this.productCount}</schmancy-typography>
                            <schmancy-typography type="body" token="sm" class="text-surface-onVariant">Active Products</schmancy-typography>
                          </div>
                        </schmancy-card>
                        <schmancy-card>
                          <div class="p-6">
                            <div class="flex items-center justify-between mb-2">
                              <schmancy-icon class="text-primary text-2xl">trending_up</schmancy-icon>
                              <schmancy-chip type="assist" class="text-xs">+12%</schmancy-chip>
                            </div>
                            <schmancy-typography type="display" token="sm" class="mb-1">$24.5k</schmancy-typography>
                            <schmancy-typography type="body" token="sm" class="text-surface-onVariant">Revenue Today</schmancy-typography>
                          </div>
                        </schmancy-card>
                      </div>

                      <schmancy-typography type="title" token="md" class="mt-8 mb-4 block">Recent Activity</schmancy-typography>
                      <schmancy-list>
                        <schmancy-list-item>
                          <schmancy-icon slot="start" class="text-primary">check_circle</schmancy-icon>
                          <div>
                            <schmancy-typography type="body" token="md">Order #1234 completed</schmancy-typography>
                            <schmancy-typography type="body" token="sm" class="text-surface-onVariant">2 minutes ago</schmancy-typography>
                          </div>
                        </schmancy-list-item>
                        <schmancy-list-item>
                          <schmancy-icon slot="start" class="text-primary">person_add</schmancy-icon>
                          <div>
                            <schmancy-typography type="body" token="md">New customer registered</schmancy-typography>
                            <schmancy-typography type="body" token="sm" class="text-surface-onVariant">5 minutes ago</schmancy-typography>
                          </div>
                        </schmancy-list-item>
                      </schmancy-list>
                    </div>
                ` : this.currentView === 'orders' ? html`
                    <div class="p-6">
                      <div class="flex items-center justify-between mb-6">
                        <schmancy-typography type="headline" token="md">Orders</schmancy-typography>
                        <schmancy-button variant="filled" leadingIcon="add">New Order</schmancy-button>
                      </div>

                      <schmancy-card>
                        <div class="p-0">
                          <schmancy-list>
                            <schmancy-list-item>
                              <div class="flex items-center justify-between w-full">
                                <div>
                                  <schmancy-typography type="body" token="lg">Order #1234</schmancy-typography>
                                  <schmancy-typography type="body" token="sm" class="text-surface-onVariant">John Doe • $125.00</schmancy-typography>
                                </div>
                                <schmancy-chip type="assist">Processing</schmancy-chip>
                              </div>
                            </schmancy-list-item>
                            <schmancy-list-item>
                              <div class="flex items-center justify-between w-full">
                                <div>
                                  <schmancy-typography type="body" token="lg">Order #1233</schmancy-typography>
                                  <schmancy-typography type="body" token="sm" class="text-surface-onVariant">Jane Smith • $89.99</schmancy-typography>
                                </div>
                                <schmancy-chip type="assist">Shipped</schmancy-chip>
                              </div>
                            </schmancy-list-item>
                            <schmancy-list-item>
                              <div class="flex items-center justify-between w-full">
                                <div>
                                  <schmancy-typography type="body" token="lg">Order #1232</schmancy-typography>
                                  <schmancy-typography type="body" token="sm" class="text-surface-onVariant">Bob Wilson • $450.00</schmancy-typography>
                                </div>
                                <schmancy-chip type="assist">Delivered</schmancy-chip>
                              </div>
                            </schmancy-list-item>
                          </schmancy-list>
                        </div>
                      </schmancy-card>
                    </div>
                ` : this.currentView === 'products' ? html`
                    <div class="p-6">
                      <div class="flex items-center justify-between mb-6">
                        <schmancy-typography type="headline" token="md">Products</schmancy-typography>
                        <schmancy-button variant="filled" leadingIcon="add">Add Product</schmancy-button>
                      </div>

                      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <schmancy-card>
                          <div class="p-4">
                            <div class="h-32 bg-surface-container rounded mb-3 flex items-center justify-center">
                              <schmancy-icon class="text-4xl text-surface-onVariant">image</schmancy-icon>
                            </div>
                            <schmancy-typography type="title" token="sm">Product Name</schmancy-typography>
                            <schmancy-typography type="body" token="sm" class="text-surface-onVariant mt-1">$29.99</schmancy-typography>
                            <div class="flex gap-2 mt-3">
                              <schmancy-chip type="assist">In Stock</schmancy-chip>
                              <schmancy-chip type="assist">12 units</schmancy-chip>
                            </div>
                          </div>
                        </schmancy-card>
                        <schmancy-card>
                          <div class="p-4">
                            <div class="h-32 bg-surface-container rounded mb-3 flex items-center justify-center">
                              <schmancy-icon class="text-4xl text-surface-onVariant">image</schmancy-icon>
                            </div>
                            <schmancy-typography type="title" token="sm">Another Product</schmancy-typography>
                            <schmancy-typography type="body" token="sm" class="text-surface-onVariant mt-1">$45.00</schmancy-typography>
                            <div class="flex gap-2 mt-3">
                              <schmancy-chip type="assist">Low Stock</schmancy-chip>
                              <schmancy-chip type="assist">3 units</schmancy-chip>
                            </div>
                          </div>
                        </schmancy-card>
                      </div>
                    </div>
                ` : this.currentView === 'customers' ? html`
                    <div class="p-6">
                      <div class="flex items-center justify-between mb-6">
                        <schmancy-typography type="headline" token="md">Customers</schmancy-typography>
                        <schmancy-text-field
                          type="outlined"
                          label="Search customers"
                          leadingIcon="search"
                          class="w-64">
                        </schmancy-text-field>
                      </div>

                      <schmancy-card>
                        <div class="p-0">
                          <schmancy-list>
                            <schmancy-list-item>
                              <schmancy-icon slot="start" class="text-2xl">account_circle</schmancy-icon>
                              <div>
                                <schmancy-typography type="body" token="lg">John Doe</schmancy-typography>
                                <schmancy-typography type="body" token="sm" class="text-surface-onVariant">john.doe@example.com • Customer since 2023</schmancy-typography>
                              </div>
                            </schmancy-list-item>
                            <schmancy-list-item>
                              <schmancy-icon slot="start" class="text-2xl">account_circle</schmancy-icon>
                              <div>
                                <schmancy-typography type="body" token="lg">Jane Smith</schmancy-typography>
                                <schmancy-typography type="body" token="sm" class="text-surface-onVariant">jane.smith@example.com • Customer since 2022</schmancy-typography>
                              </div>
                            </schmancy-list-item>
                            <schmancy-list-item>
                              <schmancy-icon slot="start" class="text-2xl">account_circle</schmancy-icon>
                              <div>
                                <schmancy-typography type="body" token="lg">Bob Wilson</schmancy-typography>
                                <schmancy-typography type="body" token="sm" class="text-surface-onVariant">bob.wilson@example.com • Customer since 2024</schmancy-typography>
                              </div>
                            </schmancy-list-item>
                          </schmancy-list>
                        </div>
                      </schmancy-card>
                    </div>
                ` : this.currentView === 'settings' ? html`
                    <div class="p-6">
                      <schmancy-typography type="headline" token="md" class="mb-6 block">Settings</schmancy-typography>

                      <div class="space-y-4 max-w-2xl">
                        <schmancy-card>
                          <div class="p-6">
                            <schmancy-typography type="title" token="sm" class="mb-4 block">General Settings</schmancy-typography>
                            <div class="space-y-4">
                              <schmancy-text-field
                                type="outlined"
                                label="Store Name"
                                value="My Store"
                                class="w-full">
                              </schmancy-text-field>
                              <schmancy-text-field
                                type="outlined"
                                label="Contact Email"
                                value="contact@mystore.com"
                                class="w-full">
                              </schmancy-text-field>
                            </div>
                          </div>
                        </schmancy-card>

                        <schmancy-card>
                          <div class="p-6">
                            <schmancy-typography type="title" token="sm" class="mb-4 block">Notifications</schmancy-typography>
                            <div class="space-y-3">
                              <div class="flex items-center justify-between">
                                <div>
                                  <schmancy-typography type="body" token="md">Email Notifications</schmancy-typography>
                                  <schmancy-typography type="body" token="sm" class="text-surface-onVariant">Receive order updates via email</schmancy-typography>
                                </div>
                                <schmancy-switch checked></schmancy-switch>
                              </div>
                              <div class="flex items-center justify-between">
                                <div>
                                  <schmancy-typography type="body" token="md">Push Notifications</schmancy-typography>
                                  <schmancy-typography type="body" token="sm" class="text-surface-onVariant">Get instant alerts</schmancy-typography>
                                </div>
                                <schmancy-switch></schmancy-switch>
                              </div>
                            </div>
                          </div>
                        </schmancy-card>

                        <div class="flex gap-3 pt-4">
                          <schmancy-button variant="filled">Save Changes</schmancy-button>
                          <schmancy-button variant="outlined">Cancel</schmancy-button>
                        </div>
                      </div>
                    </div>
                ` : html``}
              </div>

              <!-- Navigation Bar -->
              <schmancy-navigation-bar
                .activeIndex=${this.getActiveIndex()}
                @navigation-change=${this.handleNavigation}>
                <schmancy-navigation-bar-item icon="dashboard" label="Dashboard"></schmancy-navigation-bar-item>
                <schmancy-navigation-bar-item icon="shopping_cart" label="Orders" badge=${this.orderCount.toString()}></schmancy-navigation-bar-item>
                <schmancy-navigation-bar-item icon="inventory" label="Products"></schmancy-navigation-bar-item>
                <schmancy-navigation-bar-item icon="people" label="Customers"></schmancy-navigation-bar-item>
                <schmancy-navigation-bar-item icon="settings" label="Settings"></schmancy-navigation-bar-item>
              </schmancy-navigation-bar>
            </div>
          </schmancy-surface>
        </div>

        <!-- Code Example -->
        <div class="mb-12">
          <schmancy-typography type="title" token="lg" class="mb-6 block">Implementation Code</schmancy-typography>

          <schmancy-code-preview language="typescript">
            ${`import { html, css } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { $LitElement } from '@mixins/index'
import { area } from '@schmancy/area'

// Define your component tag names
@customElement('dashboard-component')
export class DashboardComponent extends $LitElement(css\`
  :host { display: block; }
\`) {
  render() {
    return html\`<div>Dashboard content...</div>\`
  }
}

@customElement('orders-component')
export class OrdersComponent extends $LitElement(css\`
  :host { display: block; }
\`) {
  render() {
    return html\`<div>Orders content...</div>\`
  }
}

// Main app component
@customElement('app-main')
export class AppMain extends $LitElement(css\`
  :host {
    display: block;
    height: 100vh;
  }
\`) {
  @state() private currentView = 'dashboard-component'
  @state() private notificationCount = 3

  private handleNavigation = (e: CustomEvent) => {
    const routes = [
      'dashboard-component',
      'orders-component',
      'products-component',
      'customers-component',
      'settings-component'
    ]
    const route = routes[e.detail.newIndex]
    this.currentView = route

    // Navigate using component tag name (string)
    area.push({
      area: 'app-main',
      component: route  // Pass tag name as string
    })
  }

  private getActiveIndex(): number {
    const routes = [
      'dashboard-component',
      'orders-component',
      'products-component',
      'customers-component',
      'settings-component'
    ]
    return routes.indexOf(this.currentView)
  }

  render() {
    return html\`
      <div class="h-screen flex flex-col">
        <!-- Main Content Area with routes -->
        <div class="flex-1 overflow-auto">
          <schmancy-area name="app-main" default="dashboard-component">
            <schmancy-route when="dashboard-component" component="dashboard-component"></schmancy-route>
            <schmancy-route when="orders-component" component="orders-component"></schmancy-route>
            <schmancy-route when="products-component" component="products-component"></schmancy-route>
            <schmancy-route when="customers-component" component="customers-component"></schmancy-route>
            <schmancy-route when="settings-component" component="settings-component"></schmancy-route>
          </schmancy-area>
        </div>

        <!-- Navigation Bar -->
        <schmancy-navigation-bar
          .activeIndex=\${this.getActiveIndex()}
          @navigation-change=\${this.handleNavigation}>
          <schmancy-navigation-bar-item icon="dashboard" label="Dashboard"></schmancy-navigation-bar-item>
          <schmancy-navigation-bar-item icon="shopping_cart" label="Orders" badge="\${this.notificationCount}"></schmancy-navigation-bar-item>
          <schmancy-navigation-bar-item icon="inventory" label="Products"></schmancy-navigation-bar-item>
          <schmancy-navigation-bar-item icon="people" label="Customers"></schmancy-navigation-bar-item>
          <schmancy-navigation-bar-item icon="settings" label="Settings"></schmancy-navigation-bar-item>
        </schmancy-navigation-bar>
      </div>
    \`
  }
}

// Alternative: Using component instances
@customElement('app-main-with-instances')
export class AppMainWithInstances extends $LitElement(css\`
  :host {
    display: block;
    height: 100vh;
  }
\`) {
  @state() private currentView = 'dashboard'

  private handleNavigation = async (e: CustomEvent) => {
    const routes = ['dashboard', 'orders', 'products', 'customers', 'settings']
    const route = routes[e.detail.newIndex]
    this.currentView = route

    // Import and instantiate components
    let component
    switch (route) {
      case 'dashboard':
        const { DashboardComponent } = await import('./dashboard')
        component = new DashboardComponent()
        break
      case 'orders':
        const { OrdersComponent } = await import('./orders')
        component = new OrdersComponent()
        break
      // ... etc for other routes
    }

    if (component) {
      area.push({
        area: 'app-main',
        component  // Pass component instance
      })
    }
  }

  render() {
    return html\`
      <div class="h-screen flex flex-col">
        <div class="flex-1 overflow-auto">
          <!-- Area without routes - components pushed programmatically -->
          <schmancy-area name="app-main"></schmancy-area>
        </div>
        <schmancy-navigation-bar
          .activeIndex=\${this.getActiveIndex()}
          @navigation-change=\${this.handleNavigation}>
          <schmancy-navigation-bar-item icon="dashboard" label="Dashboard"></schmancy-navigation-bar-item>
          <schmancy-navigation-bar-item icon="shopping_cart" label="Orders"></schmancy-navigation-bar-item>
          <schmancy-navigation-bar-item icon="inventory" label="Products"></schmancy-navigation-bar-item>
          <schmancy-navigation-bar-item icon="people" label="Customers"></schmancy-navigation-bar-item>
          <schmancy-navigation-bar-item icon="settings" label="Settings"></schmancy-navigation-bar-item>
        </schmancy-navigation-bar>
      </div>
    \`
  }
}`}
          </schmancy-code-preview>
        </div>

        <!-- Key Points -->
        <schmancy-card>
          <div class="p-6">
            <schmancy-typography type="title" token="md" class="mb-4 block">Key Implementation Points</schmancy-typography>
            <ul class="space-y-3">
              <li class="flex items-start gap-3">
                <schmancy-icon class="text-primary mt-1">code</schmancy-icon>
                <div>
                  <schmancy-typography type="body" token="md" class="font-medium">Area Component for Routing</schmancy-typography>
                  <schmancy-typography type="body" token="sm" class="text-surface-onVariant mt-1">
                    Use schmancy-area with schmancy-route elements. Each route specifies a 'when' condition and 'component' tag name.
                  </schmancy-typography>
                </div>
              </li>
              <li class="flex items-start gap-3">
                <schmancy-icon class="text-primary mt-1">sync</schmancy-icon>
                <div>
                  <schmancy-typography type="body" token="md" class="font-medium">Synchronized Navigation</schmancy-typography>
                  <schmancy-typography type="body" token="sm" class="text-surface-onVariant mt-1">
                    Keep navigation bar activeIndex in sync with current route using getActiveIndex() method.
                  </schmancy-typography>
                </div>
              </li>
              <li class="flex items-start gap-3">
                <schmancy-icon class="text-primary mt-1">notifications</schmancy-icon>
                <div>
                  <schmancy-typography type="body" token="md" class="font-medium">Dynamic Badges</schmancy-typography>
                  <schmancy-typography type="body" token="sm" class="text-surface-onVariant mt-1">
                    Update badge counts dynamically by binding to component state variables.
                  </schmancy-typography>
                </div>
              </li>
              <li class="flex items-start gap-3">
                <schmancy-icon class="text-primary mt-1">height</schmancy-icon>
                <div>
                  <schmancy-typography type="body" token="md" class="font-medium">Layout Structure</schmancy-typography>
                  <schmancy-typography type="body" token="sm" class="text-surface-onVariant mt-1">
                    Use flexbox with flex-1 for content area and fixed navigation bar at bottom.
                  </schmancy-typography>
                </div>
              </li>
            </ul>
          </div>
        </schmancy-card>
      </schmancy-surface>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'demo-navigation-bar': NavigationBar;
  }
}