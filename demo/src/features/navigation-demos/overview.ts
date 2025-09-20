import { animate } from '@lit-labs/motion'
import { $LitElement } from '@mixins/index'
import '@schmancy/button'
import '@schmancy/surface'
import '@schmancy/typography'
import { html } from 'lit'
import { customElement, state } from 'lit/decorators.js'

@customElement('demo-navigation-overview')
export class NavigationOverview extends $LitElement() {
  @state() private activeRailItem = 0
  @state() private activeDrawerItem = 0
  @state() private activeBottomItem = 0

  render() {
    return html`
      <div class="max-w-6xl mx-auto p-6" ${animate()}>
        <!-- Intro Section -->
        <div class="mb-12 text-center">
          <schmancy-typography type="display" token="lg" class="mb-4">
            Navigation Patterns
          </schmancy-typography>
          <schmancy-typography type="body" token="lg" class="text-on-surface-variant max-w-3xl mx-auto">
            Navigation is the foundation of user experience. Schmancy provides powerful, accessible navigation components
            that adapt seamlessly to different screen sizes and interaction patterns.
          </schmancy-typography>
        </div>

        <!-- Features Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <schmancy-surface type="container" class="p-6 text-center">
            <div class="w-full h-48 bg-gradient-to-br from-primary-container to-secondary-container rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
              <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12"></div>
              <schmancy-typography type="title" token="lg" class="text-on-primary-container">
                Rail Navigation
              </schmancy-typography>
            </div>
            <schmancy-typography type="title" token="md" class="mb-2">
              Navigation Rail
            </schmancy-typography>
            <schmancy-typography type="body" token="sm" class="text-on-surface-variant">
              Side navigation for desktop applications with icon-based destinations
            </schmancy-typography>
          </schmancy-surface>

          <schmancy-surface type="container" class="p-6 text-center">
            <div class="w-full h-48 bg-gradient-to-br from-secondary-container to-tertiary-container rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
              <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12"></div>
              <schmancy-typography type="title" token="lg" class="text-on-secondary-container">
                Navigation Drawer
              </schmancy-typography>
            </div>
            <schmancy-typography type="title" token="md" class="mb-2">
              Navigation Drawer
            </schmancy-typography>
            <schmancy-typography type="body" token="sm" class="text-on-surface-variant">
              Side panel navigation that can slide in and out for mobile and desktop
            </schmancy-typography>
          </schmancy-surface>

          <schmancy-surface type="container" class="p-6 text-center">
            <div class="w-full h-48 bg-gradient-to-br from-tertiary-container to-primary-container rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
              <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12"></div>
              <schmancy-typography type="title" token="lg" class="text-on-tertiary-container">
                Bottom Navigation
              </schmancy-typography>
            </div>
            <schmancy-typography type="title" token="md" class="mb-2">
              Bottom Navigation
            </schmancy-typography>
            <schmancy-typography type="body" token="sm" class="text-on-surface-variant">
              Tab-based navigation for mobile devices with 3-5 primary destinations
            </schmancy-typography>
          </schmancy-surface>
        </div>

        <!-- Interactive Demos -->
        <div class="space-y-8">
          <!-- Rail Demo -->
          <div class="mb-8">
            <schmancy-typography type="title" token="lg" class="mb-4">
              Navigation Rail Demo
            </schmancy-typography>
            <schmancy-surface type="container" class="p-6 rounded-xl">
              <div class="flex h-48 overflow-hidden rounded-lg bg-surface">
                <div class="w-20 bg-surface-container flex flex-col items-center py-3 gap-2">
                  ${[0, 1, 2, 3].map(index => html`
                    <div
                      class="w-14 h-14 rounded-2xl flex items-center justify-center cursor-pointer transition-all relative
                             ${this.activeRailItem === index ? 'bg-secondary-container text-on-secondary-container' : 'text-on-surface-variant hover:bg-surface-container-high'}"
                      @click=${() => this.activeRailItem = index}
                    >
                      <schmancy-icon>${['home', 'search', 'favorite', 'settings'][index]}</schmancy-icon>
                      ${index === 1 ? html`<div class="absolute -top-1 -right-1 w-4 h-4 bg-error text-on-error rounded-md flex items-center justify-center text-xs font-medium">3</div>` : ''}
                    </div>
                  `)}
                </div>
                <div class="flex-1 p-5 flex items-center justify-center text-on-surface">
                  <schmancy-typography type="title" token="md">
                    ${['Home Content', 'Search Results', 'Favorites List', 'Settings Panel'][this.activeRailItem]}
                  </schmancy-typography>
                </div>
              </div>
            </schmancy-surface>
          </div>

          <!-- Drawer Demo -->
          <div class="mb-8">
            <schmancy-typography type="title" token="lg" class="mb-4">
              Navigation Drawer Demo
            </schmancy-typography>
            <schmancy-surface type="container" class="p-6 rounded-xl">
              <div class="flex h-48 overflow-hidden rounded-lg bg-surface">
                <div class="w-48 bg-surface-container flex flex-col py-4">
                  ${[0, 1, 2, 3].map(index => html`
                    <div
                      class="py-3 px-6 flex items-center gap-3 cursor-pointer transition-all text-on-surface-variant
                             ${this.activeDrawerItem === index ? 'bg-secondary-container text-on-secondary-container rounded-r-full mr-3' : 'hover:bg-surface-container-high hover:rounded-r-full hover:mr-3'}"
                      @click=${() => this.activeDrawerItem = index}
                    >
                      <schmancy-icon>${['dashboard', 'analytics', 'inventory', 'account_circle'][index]}</schmancy-icon>
                      <schmancy-typography type="body" token="md">
                        ${['Dashboard', 'Analytics', 'Inventory', 'Profile'][index]}
                      </schmancy-typography>
                    </div>
                  `)}
                </div>
                <div class="flex-1 p-5 flex items-center justify-center text-on-surface">
                  <schmancy-typography type="title" token="md">
                    ${['Dashboard View', 'Analytics Reports', 'Inventory Management', 'Profile Settings'][this.activeDrawerItem]}
                  </schmancy-typography>
                </div>
              </div>
            </schmancy-surface>
          </div>

          <!-- Bottom Navigation Demo -->
          <div class="mb-8">
            <schmancy-typography type="title" token="lg" class="mb-4">
              Bottom Navigation Demo
            </schmancy-typography>
            <schmancy-surface type="container" class="p-6 rounded-xl">
              <div class="h-48 overflow-hidden rounded-lg bg-surface flex flex-col">
                <div class="flex-1 p-5 flex items-center justify-center text-on-surface">
                  <schmancy-typography type="title" token="md">
                    ${['Home Screen', 'Browse Catalog', 'Shopping Cart', 'User Profile'][this.activeBottomItem]}
                  </schmancy-typography>
                </div>
                <div class="h-20 bg-surface-container flex items-center justify-around px-6">
                  ${[0, 1, 2, 3].map(index => html`
                    <div
                      class="flex flex-col items-center gap-1 cursor-pointer py-2 px-4 rounded-2xl transition-all min-w-16
                             ${this.activeBottomItem === index ? 'bg-secondary-container text-on-secondary-container' : 'text-on-surface-variant hover:bg-surface-container-high'}"
                      @click=${() => this.activeBottomItem = index}
                    >
                      <div class="relative">
                        <schmancy-icon size="sm">${['home', 'explore', 'shopping_cart', 'person'][index]}</schmancy-icon>
                        ${index === 2 ? html`<div class="absolute -top-1 -right-1 w-4 h-4 bg-tertiary-container text-on-tertiary-container rounded-md flex items-center justify-center text-xs font-medium">2</div>` : ''}
                      </div>
                      <span class="text-xs font-medium">
                        ${['Home', 'Browse', 'Cart', 'Profile'][index]}
                      </span>
                    </div>
                  `)}
                </div>
              </div>
            </schmancy-surface>
          </div>
        </div>

        <!-- Best Practices -->
        <div class="mt-12">
          <schmancy-typography type="title" token="lg" class="mb-6">
            Navigation Best Practices
          </schmancy-typography>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <schmancy-surface type="container-low" class="p-6 rounded-lg">
              <schmancy-typography type="title" token="md" class="mb-3 text-success">
                ✓ Do
              </schmancy-typography>
              <ul class="space-y-2 text-on-surface-variant">
                <li>• Use consistent navigation patterns throughout your app</li>
                <li>• Provide clear visual feedback for active states</li>
                <li>• Include proper labels and icons for accessibility</li>
                <li>• Consider mobile-first navigation design</li>
                <li>• Use badges sparingly for important notifications</li>
              </ul>
            </schmancy-surface>

            <schmancy-surface type="container-low" class="p-6 rounded-lg">
              <schmancy-typography type="title" token="md" class="mb-3 text-error">
                ✗ Don't
              </schmancy-typography>
              <ul class="space-y-2 text-on-surface-variant">
                <li>• Overcrowd navigation with too many options</li>
                <li>• Use inconsistent icon styles or meanings</li>
                <li>• Hide primary navigation on smaller screens</li>
                <li>• Ignore keyboard navigation accessibility</li>
                <li>• Use unclear or ambiguous labels</li>
              </ul>
            </schmancy-surface>
          </div>
        </div>
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'demo-navigation-overview': NavigationOverview
  }
}