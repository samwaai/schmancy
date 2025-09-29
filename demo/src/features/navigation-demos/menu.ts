import { html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { $LitElement } from '@mixins/index'
import '@schmancy/surface'
import '@schmancy/typography'
import '@schmancy/button'
import '@schmancy/menu'
import { animate, fadeIn, fadeOut } from '@lit-labs/motion'

@customElement('demo-navigation-menu')
export default class NavigationMenu extends $LitElement() {
  @state() private activeExample = 'basic'

  render() {
    return html`
      <div class="max-w-6xl mx-auto p-6" ${animate()}>
        <!-- Header -->
        <div class="mb-12 text-center">
          <schmancy-typography type="display" token="lg" class="mb-4">
            Menu Navigation
          </schmancy-typography>
          <schmancy-typography type="body" token="lg" class="text-on-surface-variant max-w-3xl mx-auto">
            Context menus and dropdown menus for secondary actions and options.
          </schmancy-typography>
        </div>

        <!-- Basic Menu Demo -->
        <schmancy-surface type="container" class="p-6 rounded-xl">
          <schmancy-typography type="title" token="lg" class="mb-6">
            Basic Menu Examples
          </schmancy-typography>

          <div class="space-y-8">
            <!-- Context Menu -->
            <div>
              <schmancy-typography type="title" token="md" class="mb-4">
                Context Menu
              </schmancy-typography>
              <div class="p-8 bg-surface-container rounded-lg text-center">
                <schmancy-typography type="body" token="md" class="text-on-surface-variant">
                  Right-click in this area to open context menu
                </schmancy-typography>
              </div>
            </div>

            <!-- Dropdown Menu -->
            <div>
              <schmancy-typography type="title" token="md" class="mb-4">
                Dropdown Menu
              </schmancy-typography>
              <div class="flex gap-4">
                <schmancy-button variant="outlined">
                  Options ▼
                </schmancy-button>
                <schmancy-button variant="outlined">
                  Actions ▼
                </schmancy-button>
                <schmancy-button variant="outlined">
                  More ▼
                </schmancy-button>
              </div>
            </div>

            <!-- Menu with Icons -->
            <div>
              <schmancy-typography type="title" token="md" class="mb-4">
                Menu with Icons
              </schmancy-typography>
              <div class="p-6 bg-surface-container rounded-lg">
                <schmancy-typography type="body" token="md" class="mb-4">
                  Menu items with icons for better recognition:
                </schmancy-typography>
                <div class="space-y-2">
                  <div class="flex items-center gap-3 p-2 hover:bg-surface-container-high rounded cursor-pointer">
                    <schmancy-icon>edit</schmancy-icon>
                    <span>Edit</span>
                  </div>
                  <div class="flex items-center gap-3 p-2 hover:bg-surface-container-high rounded cursor-pointer">
                    <schmancy-icon>content_copy</schmancy-icon>
                    <span>Copy</span>
                  </div>
                  <div class="flex items-center gap-3 p-2 hover:bg-surface-container-high rounded cursor-pointer">
                    <schmancy-icon>delete</schmancy-icon>
                    <span>Delete</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </schmancy-surface>
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'demo-navigation-menu': NavigationMenu
  }
}