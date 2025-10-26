import { html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { $LitElement } from '@mhmo91/schmancy/mixins'
import '@mhmo91/schmancy/surface'
import '@mhmo91/schmancy/nav-drawer'
import '@mhmo91/schmancy/tabs'
import '@mhmo91/schmancy/typography'
import '@mhmo91/schmancy/button'
import '@mhmo91/schmancy/list'
import '@mhmo91/schmancy/input'
import { animate } from '@lit-labs/motion'

@customElement('demo-navigation-examples')
export class NavigationExamples extends $LitElement() {
  @state() private currentExample = 'ecommerce'
  @state() private activeTab = 'products'
  @state() private mobileMenuOpen = false

  private examples = [
    { id: 'ecommerce', label: 'E-commerce App', icon: 'shopping_cart' },
    { id: 'dashboard', label: 'Admin Dashboard', icon: 'dashboard' },
    { id: 'social', label: 'Social Media', icon: 'people' },
    { id: 'productivity', label: 'Productivity App', icon: 'work' }
  ]

  render() {
    return html`
      <div class="max-w-6xl mx-auto p-6" ${animate()}>
        <!-- Header -->
        <div class="mb-12 text-center">
          <schmancy-typography type="display" token="lg" class="mb-4">
            Navigation Examples
          </schmancy-typography>
          <schmancy-typography type="body" token="lg" class="text-on-surface-variant max-w-3xl mx-auto">
            Real-world navigation patterns combining different components for common application types.
          </schmancy-typography>
        </div>

        <!-- Example Selector -->
        <div class="mb-8">
          <schmancy-tabs-group .activeTab=${this.currentExample} @tab-changed=${(e: CustomEvent) => this.currentExample = e.detail}>
            ${this.examples.map(example => html`
              <schmancy-tab .value=${example.id} .label=${example.label} ?active=${this.currentExample === example.id}>
                <schmancy-icon slot="icon">${example.icon}</schmancy-icon>
                ${example.label}
              </schmancy-tab>
            `)}
          </schmancy-tabs-group>
        </div>

        <!-- Example Content -->
        ${this.currentExample === 'ecommerce' ? this.renderEcommerceExample() : ''}
        ${this.currentExample === 'dashboard' ? this.renderDashboardExample() : ''}
        ${this.currentExample === 'social' ? this.renderSocialExample() : ''}
        ${this.currentExample === 'productivity' ? this.renderProductivityExample() : ''}
      </div>
    `
  }

  private renderEcommerceExample() {
    return html`
      <schmancy-surface type="container" class="p-6 rounded-xl">
        <schmancy-typography type="title" token="lg" class="mb-6">
          E-commerce App Navigation
        </schmancy-typography>

        <!-- Desktop Layout -->
        <div class="mb-8">
          <schmancy-typography type="title" token="md" class="mb-4">
            Desktop Layout
          </schmancy-typography>
          <div class="h-96 bg-surface rounded-lg overflow-hidden flex">
            <!-- Top Bar -->
            <div class="flex-1 flex flex-col">
              <div class="h-16 bg-surface-container px-6 flex items-center justify-between border-b border-outline">
                <div class="flex items-center gap-4">
                  <schmancy-typography type="title" token="md">StoreName</schmancy-typography>
                  <schmancy-input placeholder="Search products..." class="w-80"></schmancy-input>
                </div>
                <div class="flex items-center gap-4">
                  <schmancy-icon>account_circle</schmancy-icon>
                  <schmancy-icon>shopping_cart</schmancy-icon>
                </div>
              </div>

              <!-- Main Content with Tabs -->
              <div class="flex-1 p-6">
                <schmancy-tabs-group .activeTab=${this.activeTab} @tab-changed=${(e: CustomEvent) => this.activeTab = e.detail}>
                  <schmancy-tab value="products" label="Products" ?active=${this.activeTab === 'products'}>Products</schmancy-tab>
                  <schmancy-tab value="categories" label="Categories" ?active=${this.activeTab === 'categories'}>Categories</schmancy-tab>
                  <schmancy-tab value="brands" label="Brands" ?active=${this.activeTab === 'brands'}>Brands</schmancy-tab>
                  <schmancy-tab value="deals" label="Deals" ?active=${this.activeTab === 'deals'}>Deals</schmancy-tab>
                </schmancy-tabs-group>

                <div class="mt-6 flex items-center justify-center h-32 bg-surface-container rounded-lg">
                  <schmancy-typography type="body" token="md" class="text-on-surface-variant">
                    ${this.activeTab} content would be displayed here
                  </schmancy-typography>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Mobile Layout -->
        <div class="mb-6">
          <schmancy-typography type="title" token="md" class="mb-4">
            Mobile Layout
          </schmancy-typography>
          <div class="max-w-sm mx-auto h-96 bg-surface rounded-lg overflow-hidden flex flex-col relative">
            <!-- Top Bar -->
            <div class="h-14 bg-surface-container px-4 flex items-center justify-between">
              <schmancy-icon @click=${() => this.mobileMenuOpen = !this.mobileMenuOpen}>menu</schmancy-icon>
              <schmancy-typography type="title" token="sm">Store</schmancy-typography>
              <schmancy-icon>shopping_cart</schmancy-icon>
            </div>

            <!-- Content -->
            <div class="flex-1 p-4 flex items-center justify-center">
              <schmancy-typography type="body" token="md" class="text-on-surface-variant text-center">
                Product grid and content
              </schmancy-typography>
            </div>

            <!-- Bottom Navigation -->
            <div class="h-16 bg-surface-container flex items-center justify-around">
              ${['home', 'search', 'favorite', 'person'].map(icon => html`
                <div class="p-2">
                  <schmancy-icon>${icon}</schmancy-icon>
                </div>
              `)}
            </div>

            <!-- Mobile Menu Overlay -->
            ${this.mobileMenuOpen ? html`
              <div class="absolute inset-0 bg-black/20 z-10" @click=${() => this.mobileMenuOpen = false}></div>
              <div class="absolute top-14 left-0 w-64 h-full bg-surface-container z-20 transform transition-transform">
                <div class="p-4 space-y-2">
                  ${['Products', 'Categories', 'Brands', 'Account', 'Settings'].map(item => html`
                    <div class="p-3 hover:bg-surface-container-high rounded cursor-pointer">
                      <schmancy-typography type="body" token="md">${item}</schmancy-typography>
                    </div>
                  `)}
                </div>
              </div>
            ` : ''}
          </div>
        </div>
      </schmancy-surface>
    `
  }

  private renderDashboardExample() {
    return html`
      <schmancy-surface type="container" class="p-6 rounded-xl">
        <schmancy-typography type="title" token="lg" class="mb-6">
          Admin Dashboard Navigation
        </schmancy-typography>

        <div class="h-96 bg-surface rounded-lg overflow-hidden flex">
          <!-- Navigation Rail -->
          <div class="w-20 bg-surface-container flex flex-col items-center py-4 gap-3">
            ${['dashboard', 'analytics', 'users', 'settings'].map(icon => html`
              <div class="w-14 h-14 rounded-2xl flex items-center justify-center bg-secondary-container text-on-secondary-container">
                <schmancy-icon>${icon}</schmancy-icon>
              </div>
            `)}
          </div>

          <!-- Main Content -->
          <div class="flex-1 flex flex-col">
            <!-- Top Bar -->
            <div class="h-16 bg-surface-container px-6 flex items-center justify-between border-b border-outline">
              <schmancy-typography type="title" token="md">Dashboard</schmancy-typography>
              <div class="flex items-center gap-4">
                <schmancy-icon>notifications</schmancy-icon>
                <schmancy-icon>account_circle</schmancy-icon>
              </div>
            </div>

            <!-- Content -->
            <div class="flex-1 p-6 flex items-center justify-center">
              <schmancy-typography type="body" token="md" class="text-on-surface-variant">
                Dashboard content and widgets
              </schmancy-typography>
            </div>
          </div>
        </div>
      </schmancy-surface>
    `
  }

  private renderSocialExample() {
    return html`
      <schmancy-surface type="container" class="p-6 rounded-xl">
        <schmancy-typography type="title" token="lg" class="mb-6">
          Social Media App Navigation
        </schmancy-typography>

        <div class="max-w-sm mx-auto h-96 bg-surface rounded-lg overflow-hidden flex flex-col">
          <!-- Top Bar -->
          <div class="h-14 bg-surface-container px-4 flex items-center justify-between">
            <schmancy-typography type="title" token="md">Social</schmancy-typography>
            <div class="flex items-center gap-3">
              <schmancy-icon>search</schmancy-icon>
              <schmancy-icon>chat</schmancy-icon>
            </div>
          </div>

          <!-- Content -->
          <div class="flex-1 p-4 flex items-center justify-center">
            <schmancy-typography type="body" token="md" class="text-on-surface-variant text-center">
              Feed and posts
            </schmancy-typography>
          </div>

          <!-- Bottom Navigation -->
          <div class="h-16 bg-surface-container flex items-center justify-around">
            ${[
              { icon: 'home', label: 'Home' },
              { icon: 'search', label: 'Search' },
              { icon: 'add_circle', label: 'Create' },
              { icon: 'favorite', label: 'Activity' },
              { icon: 'person', label: 'Profile' }
            ].map(item => html`
              <div class="flex flex-col items-center gap-1">
                <schmancy-icon size="sm">${item.icon}</schmancy-icon>
                <span class="text-xs">${item.label}</span>
              </div>
            `)}
          </div>
        </div>
      </schmancy-surface>
    `
  }

  private renderProductivityExample() {
    return html`
      <schmancy-surface type="container" class="p-6 rounded-xl">
        <schmancy-typography type="title" token="lg" class="mb-6">
          Productivity App Navigation
        </schmancy-typography>

        <div class="h-96 bg-surface rounded-lg overflow-hidden flex">
          <!-- Sidebar -->
          <div class="w-64 bg-surface-container">
            <div class="p-4">
              <schmancy-typography type="title" token="md" class="mb-4">Workspace</schmancy-typography>
              <div class="space-y-2">
                ${[
                  { icon: 'inbox', label: 'Inbox', count: '3' },
                  { icon: 'today', label: 'Today' },
                  { icon: 'upcoming', label: 'Upcoming' },
                  { icon: 'label', label: 'Projects' },
                  { icon: 'archive', label: 'Archive' }
                ].map(item => html`
                  <div class="flex items-center gap-3 p-2 hover:bg-surface-container-high rounded cursor-pointer">
                    <schmancy-icon>${item.icon}</schmancy-icon>
                    <schmancy-typography type="body" token="md" class="flex-1">${item.label}</schmancy-typography>
                    ${item.count ? html`<span class="bg-error text-on-error text-xs px-2 py-1 rounded-full">${item.count}</span>` : ''}
                  </div>
                `)}
              </div>
            </div>
          </div>

          <!-- Main Content -->
          <div class="flex-1 flex flex-col">
            <!-- Top Bar -->
            <div class="h-16 bg-surface-container px-6 flex items-center justify-between border-b border-outline">
              <schmancy-typography type="title" token="md">Today</schmancy-typography>
              <schmancy-button variant="filled" size="sm">Add Task</schmancy-button>
            </div>

            <!-- Content -->
            <div class="flex-1 p-6 flex items-center justify-center">
              <schmancy-typography type="body" token="md" class="text-on-surface-variant">
                Task list and project content
              </schmancy-typography>
            </div>
          </div>
        </div>
      </schmancy-surface>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'demo-navigation-examples': NavigationExamples
  }
}