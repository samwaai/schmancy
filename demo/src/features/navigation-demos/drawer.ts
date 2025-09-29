import { html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { $LitElement } from '@mixins/index'
import '@schmancy/surface'
import '@schmancy/nav-drawer'
import '@schmancy/typography'
import '@schmancy/button'
import '@schmancy/list'
import { animate, fadeIn, fadeOut } from '@lit-labs/motion'

@customElement('demo-navigation-drawer')
export default class NavigationDrawer extends $LitElement() {
  @state() private drawerOpen = false
  @state() private activeDrawerItem = 'dashboard'
  @state() private persistentDrawer = true

  private drawerItems = [
    { id: 'dashboard', icon: 'dashboard', label: 'Dashboard' },
    { id: 'analytics', icon: 'analytics', label: 'Analytics' },
    { id: 'inventory', icon: 'inventory', label: 'Inventory' },
    { id: 'customers', icon: 'people', label: 'Customers' },
    { id: 'orders', icon: 'shopping_cart', label: 'Orders' },
    { id: 'settings', icon: 'settings', label: 'Settings' }
  ]

  render() {
    return html`
      <div class="max-w-6xl mx-auto p-6" ${animate()}>
        <!-- Header -->
        <div class="mb-12 text-center">
          <schmancy-typography type="display" token="lg" class="mb-4">
            Navigation Drawer
          </schmancy-typography>
          <schmancy-typography type="body" token="lg" class="text-on-surface-variant max-w-3xl mx-auto">
            Side navigation that can slide in and out. Perfect for organizing many navigation destinations while maintaining clean layouts.
          </schmancy-typography>
        </div>

        <!-- Modal Drawer Demo -->
        <div class="mb-12">
          <schmancy-typography type="title" token="lg" class="mb-6">
            Modal Navigation Drawer
          </schmancy-typography>
          <schmancy-surface type="container" class="p-6 rounded-xl">
            <div class="mb-4">
              <schmancy-button
                variant="filled"
                @click=${() => this.drawerOpen = !this.drawerOpen}
              >
                ${this.drawerOpen ? 'Close' : 'Open'} Drawer
              </schmancy-button>
            </div>
            <div class="relative h-96 rounded-lg overflow-hidden bg-surface">
              <!-- Main Content -->
              <div class="h-full p-8 flex items-center justify-center text-on-surface transition-all">
                <div class="text-center">
                  <schmancy-typography type="title" token="lg">
                    Main Content Area
                  </schmancy-typography>
                  <schmancy-typography type="body" token="md" class="mt-2 text-on-surface-variant">
                    The drawer slides over this content when opened.
                  </schmancy-typography>
                </div>
              </div>

              <!-- Drawer Overlay -->
              ${this.drawerOpen ? html`
                <div class="absolute inset-0 bg-black/20 z-10" @click=${() => this.drawerOpen = false}></div>
              ` : ''}

              <!-- Drawer -->
              <div class="absolute top-0 left-0 h-full w-72 bg-surface-container transform transition-transform duration-300 z-20
                          ${this.drawerOpen ? 'translate-x-0' : '-translate-x-full'}">
                <div class="p-6">
                  <schmancy-typography type="title" token="md" class="mb-6">
                    Navigation
                  </schmancy-typography>
                  <div class="space-y-2">
                    ${this.drawerItems.map(item => html`
                      <div
                        class="flex items-center gap-3 px-4 py-3 rounded-r-full cursor-pointer transition-all
                               ${this.activeDrawerItem === item.id ? 'bg-secondary-container text-on-secondary-container mr-3' : 'text-on-surface-variant hover:bg-surface-container-high hover:mr-3'}"
                        @click=${() => {
                          this.activeDrawerItem = item.id
                          this.drawerOpen = false
                        }}
                      >
                        <schmancy-icon>${item.icon}</schmancy-icon>
                        <schmancy-typography type="body" token="md">
                          ${item.label}
                        </schmancy-typography>
                      </div>
                    `)}
                  </div>
                </div>
              </div>
            </div>
          </schmancy-surface>
        </div>

        <!-- Persistent Drawer Demo -->
        <div class="mb-12">
          <schmancy-typography type="title" token="lg" class="mb-6">
            Persistent Navigation Drawer
          </schmancy-typography>
          <schmancy-surface type="container" class="p-6 rounded-xl">
            <div class="mb-4">
              <schmancy-button
                variant="outlined"
                @click=${() => this.persistentDrawer = !this.persistentDrawer}
              >
                ${this.persistentDrawer ? 'Hide' : 'Show'} Drawer
              </schmancy-button>
            </div>
            <div class="flex h-96 rounded-lg overflow-hidden bg-surface">
              <!-- Drawer -->
              ${this.persistentDrawer ? html`
                <div class="w-72 bg-surface-container flex-shrink-0">
                  <div class="p-6">
                    <schmancy-typography type="title" token="md" class="mb-6">
                      Menu
                    </schmancy-typography>
                    <div class="space-y-2">
                      ${this.drawerItems.map(item => html`
                        <div
                          class="flex items-center gap-3 px-4 py-3 rounded-r-full cursor-pointer transition-all
                                 ${this.activeDrawerItem === item.id ? 'bg-secondary-container text-on-secondary-container mr-3' : 'text-on-surface-variant hover:bg-surface-container-high hover:mr-3'}"
                          @click=${() => this.activeDrawerItem = item.id}
                        >
                          <schmancy-icon>${item.icon}</schmancy-icon>
                          <schmancy-typography type="body" token="md">
                            ${item.label}
                          </schmancy-typography>
                        </div>
                      `)}
                    </div>
                  </div>
                </div>
              ` : ''}

              <!-- Main Content -->
              <div class="flex-1 p-8 flex items-center justify-center text-on-surface">
                <div class="text-center">
                  <schmancy-icon size="xl" class="mb-4">${this.drawerItems.find(i => i.id === this.activeDrawerItem)?.icon}</schmancy-icon>
                  <schmancy-typography type="title" token="lg">
                    ${this.drawerItems.find(i => i.id === this.activeDrawerItem)?.label} Page
                  </schmancy-typography>
                  <schmancy-typography type="body" token="md" class="mt-2 text-on-surface-variant">
                    Content for the ${this.drawerItems.find(i => i.id === this.activeDrawerItem)?.label.toLowerCase()} section.
                  </schmancy-typography>
                </div>
              </div>
            </div>
          </schmancy-surface>
        </div>

        <!-- Best Practices -->
        <div class="mt-12">
          <schmancy-typography type="title" token="lg" class="mb-6">
            Navigation Drawer Best Practices
          </schmancy-typography>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <schmancy-surface type="container-low" class="p-6 rounded-lg border-l-4 border-tertiary">
              <schmancy-typography type="title" token="md" class="mb-3 text-tertiary">
                ✓ Do
              </schmancy-typography>
              <ul class="space-y-2 text-on-surface-variant list-none">
                <li class="border-b border-outline-variant pb-2">✓ Use for 5+ navigation destinations</li>
                <li class="border-b border-outline-variant pb-2">✓ Include clear section headers</li>
                <li class="border-b border-outline-variant pb-2">✓ Support both modal and persistent modes</li>
                <li class="border-b border-outline-variant pb-2">✓ Provide keyboard navigation</li>
                <li>✓ Use consistent iconography</li>
              </ul>
            </schmancy-surface>

            <schmancy-surface type="container-low" class="p-6 rounded-lg border-l-4 border-error">
              <schmancy-typography type="title" token="md" class="mb-3 text-error">
                ✗ Don't
              </schmancy-typography>
              <ul class="space-y-2 text-on-surface-variant list-none">
                <li class="border-b border-outline-variant pb-2">✗ Use for fewer than 5 destinations</li>
                <li class="border-b border-outline-variant pb-2">✗ Make the drawer too wide (>320px)</li>
                <li class="border-b border-outline-variant pb-2">✗ Forget to handle touch gestures</li>
                <li class="border-b border-outline-variant pb-2">✗ Hide important actions in the drawer</li>
                <li>✗ Use inconsistent interaction patterns</li>
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
    'demo-navigation-drawer': NavigationDrawer
  }
}