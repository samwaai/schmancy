import { html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { $LitElement } from '@mhmo91/schmancy/mixins'
import '@mhmo91/schmancy/surface'
import '@mhmo91/schmancy/typography'
import '@mhmo91/schmancy/button'
import '@mhmo91/schmancy/icons'
import '@mhmo91/schmancy/menu'
import '@mhmo91/schmancy/list'
import '../shared/installation-section'

@customElement('demo-menu')
export default class DemoMenu extends $LitElement() {
  @state() private lastAction = ''

  private handleMenuItemClick = (action: string) => {
    this.lastAction = action
    console.log('Menu item clicked:', action)
  }

  render() {
    return html`
      <schmancy-surface class="p-8">
        <!-- Component Title -->
        <schmancy-typography type="display" token="lg" class="mb-4 block">
          Menu
        </schmancy-typography>
        <schmancy-typography type="body" token="lg" class="mb-8 text-surface-onVariant block">
          Context menus and dropdown menus for secondary actions and options. Auto-positioned with Floating UI.
        </schmancy-typography>

        <!-- Installation -->
        <installation-section></installation-section>

        <!-- Import -->
        <div class="mb-8">
          <schmancy-typography type="title" token="lg" class="mb-4 block">Import</schmancy-typography>
          <schmancy-code-preview language="javascript">
            import '@mhmo91/schmancy/menu'
            import '@mhmo91/schmancy/menu-item'
          </schmancy-code-preview>
        </div>

        <!-- API Reference -->
        <div class="mb-6">
          <schmancy-typography type="title" token="lg" class="mb-4 block">API Reference</schmancy-typography>

          <!-- Menu Component -->
          <schmancy-typography type="title" token="md" class="mb-2 block">Menu Component</schmancy-typography>
          <schmancy-surface type="surfaceDim" class="rounded-lg overflow-hidden mb-6">
            <table class="w-full">
              <thead class="bg-surface-container">
                <tr>
                  <th class="text-left p-4">
                    <schmancy-typography type="label" token="md">Slot Name</schmancy-typography>
                  </th>
                  <th class="text-left p-4">
                    <schmancy-typography type="label" token="md">Description</schmancy-typography>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr class="border-t border-outline">
                  <td class="p-4">
                    <code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">button</code>
                  </td>
                  <td class="p-4">
                    <schmancy-typography type="body" token="sm">
                      Custom trigger button (defaults to icon button with more_vert icon if not provided)
                    </schmancy-typography>
                  </td>
                </tr>
                <tr class="border-t border-outline">
                  <td class="p-4">
                    <code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">default</code>
                  </td>
                  <td class="p-4">
                    <schmancy-typography type="body" token="sm">
                      Menu items (use schmancy-menu-item components)
                    </schmancy-typography>
                  </td>
                </tr>
              </tbody>
            </table>
          </schmancy-surface>

          <!-- Menu Item Component -->
          <schmancy-typography type="title" token="md" class="mb-2 block">Menu Item Component</schmancy-typography>
          <schmancy-surface type="surfaceDim" class="rounded-lg overflow-hidden mb-6">
            <table class="w-full">
              <thead class="bg-surface-container">
                <tr>
                  <th class="text-left p-4">
                    <schmancy-typography type="label" token="md">Event</schmancy-typography>
                  </th>
                  <th class="text-left p-4">
                    <schmancy-typography type="label" token="md">Description</schmancy-typography>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr class="border-t border-outline">
                  <td class="p-4">
                    <code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">schmancy-menu-item-click</code>
                  </td>
                  <td class="p-4">
                    <schmancy-typography type="body" token="sm">
                      Fired when menu item is clicked (bubbles up to menu, automatically closes menu)
                    </schmancy-typography>
                  </td>
                </tr>
              </tbody>
            </table>
          </schmancy-surface>
        </div>

        <!-- Examples -->
        <div class="mb-12">
          <schmancy-typography type="title" token="lg" class="mb-6 block">Examples</schmancy-typography>

          <div class="space-y-8">
            <!-- Basic Menu with Custom Button -->
            <div>
              <schmancy-typography type="title" token="md" class="mb-4 block">
                Basic Menu with Custom Button
              </schmancy-typography>
              <schmancy-code-preview language="html">
                <div class="flex gap-4 items-start">
                  <schmancy-menu>
                    <schmancy-button slot="trigger" variant="filled">
                      Actions
                    </schmancy-button>
                    <schmancy-menu-item @click=${() => this.handleMenuItemClick('Edit')}>
                      Edit
                    </schmancy-menu-item>
                    <schmancy-menu-item @click=${() => this.handleMenuItemClick('Duplicate')}>
                      Duplicate
                    </schmancy-menu-item>
                    <schmancy-menu-item @click=${() => this.handleMenuItemClick('Delete')}>
                      Delete
                    </schmancy-menu-item>
                  </schmancy-menu>

                  <schmancy-menu>
                    <schmancy-button slot="trigger" variant="outlined">
                      Options
                    </schmancy-button>
                    <schmancy-menu-item @click=${() => this.handleMenuItemClick('Settings')}>
                      Settings
                    </schmancy-menu-item>
                    <schmancy-menu-item @click=${() => this.handleMenuItemClick('Preferences')}>
                      Preferences
                    </schmancy-menu-item>
                    <schmancy-menu-item @click=${() => this.handleMenuItemClick('Help')}>
                      Help
                    </schmancy-menu-item>
                  </schmancy-menu>

                  ${this.lastAction ? html`
                    <schmancy-typography type="body" token="sm" class="text-surface-onVariant">
                      Last action: <strong>${this.lastAction}</strong>
                    </schmancy-typography>
                  ` : ''}
                </div>
              </schmancy-code-preview>
            </div>

            <!-- Default Icon Button Menu -->
            <div>
              <schmancy-typography type="title" token="md" class="mb-4 block">
                Default Menu (Icon Button)
              </schmancy-typography>
              <schmancy-typography type="body" token="sm" class="mb-4 text-surface-onVariant block">
                When no button slot is provided, menu defaults to an icon button with more_vert icon
              </schmancy-typography>
              <schmancy-code-preview language="html">
                <div class="flex gap-4">
                  <schmancy-menu>
                    <schmancy-menu-item @click=${() => this.handleMenuItemClick('Profile')}>
                      Profile
                    </schmancy-menu-item>
                    <schmancy-menu-item @click=${() => this.handleMenuItemClick('Account')}>
                      Account
                    </schmancy-menu-item>
                    <schmancy-menu-item @click=${() => this.handleMenuItemClick('Sign Out')}>
                      Sign Out
                    </schmancy-menu-item>
                  </schmancy-menu>

                  <schmancy-menu>
                    <schmancy-menu-item @click=${() => this.handleMenuItemClick('Share')}>
                      Share
                    </schmancy-menu-item>
                    <schmancy-menu-item @click=${() => this.handleMenuItemClick('Export')}>
                      Export
                    </schmancy-menu-item>
                    <schmancy-menu-item @click=${() => this.handleMenuItemClick('Print')}>
                      Print
                    </schmancy-menu-item>
                  </schmancy-menu>

                  <schmancy-menu>
                    <schmancy-menu-item @click=${() => this.handleMenuItemClick('Refresh')}>
                      Refresh
                    </schmancy-menu-item>
                    <schmancy-menu-item @click=${() => this.handleMenuItemClick('Clear Cache')}>
                      Clear Cache
                    </schmancy-menu-item>
                    <schmancy-menu-item @click=${() => this.handleMenuItemClick('Reset')}>
                      Reset
                    </schmancy-menu-item>
                  </schmancy-menu>
                </div>
              </schmancy-code-preview>
            </div>

            <!-- Menu with Icons -->
            <div>
              <schmancy-typography type="title" token="md" class="mb-4 block">
                Menu Items with Icons
              </schmancy-typography>
              <schmancy-typography type="body" token="sm" class="mb-4 text-surface-onVariant block">
                Add icons to menu items for better visual recognition
              </schmancy-typography>
              <schmancy-code-preview language="html">
                <schmancy-menu>
                  <schmancy-button slot="trigger" variant="filled tonal">
                    <schmancy-icon slot="prefix">edit</schmancy-icon>
                    Edit Menu
                  </schmancy-button>
                  <schmancy-menu-item @click=${() => this.handleMenuItemClick('Cut')}>
                    <schmancy-icon slot="leading">content_cut</schmancy-icon>
                    Cut
                  </schmancy-menu-item>
                  <schmancy-menu-item @click=${() => this.handleMenuItemClick('Copy')}>
                    <schmancy-icon slot="leading">content_copy</schmancy-icon>
                    Copy
                  </schmancy-menu-item>
                  <schmancy-menu-item @click=${() => this.handleMenuItemClick('Paste')}>
                    <schmancy-icon slot="leading">content_paste</schmancy-icon>
                    Paste
                  </schmancy-menu-item>
                </schmancy-menu>
              </schmancy-code-preview>
            </div>

            <!-- Multiple Menus Demonstration -->
            <div>
              <schmancy-typography type="title" token="md" class="mb-4 block">
                Multiple Menus Side-by-Side
              </schmancy-typography>
              <schmancy-code-preview language="html">
                <div class="flex gap-4 flex-wrap">
                  <!-- File Menu -->
                  <schmancy-menu>
                    <schmancy-button slot="trigger" variant="text">
                      File
                    </schmancy-button>
                    <schmancy-menu-item @click=${() => this.handleMenuItemClick('New')}>
                      <schmancy-icon slot="leading">add</schmancy-icon>
                      New
                    </schmancy-menu-item>
                    <schmancy-menu-item @click=${() => this.handleMenuItemClick('Open')}>
                      <schmancy-icon slot="leading">folder_open</schmancy-icon>
                      Open
                    </schmancy-menu-item>
                    <schmancy-menu-item @click=${() => this.handleMenuItemClick('Save')}>
                      <schmancy-icon slot="leading">save</schmancy-icon>
                      Save
                    </schmancy-menu-item>
                  </schmancy-menu>

                  <!-- Edit Menu -->
                  <schmancy-menu>
                    <schmancy-button slot="trigger" variant="text">
                      Edit
                    </schmancy-button>
                    <schmancy-menu-item @click=${() => this.handleMenuItemClick('Undo')}>
                      <schmancy-icon slot="leading">undo</schmancy-icon>
                      Undo
                    </schmancy-menu-item>
                    <schmancy-menu-item @click=${() => this.handleMenuItemClick('Redo')}>
                      <schmancy-icon slot="leading">redo</schmancy-icon>
                      Redo
                    </schmancy-menu-item>
                    <schmancy-menu-item @click=${() => this.handleMenuItemClick('Select All')}>
                      <schmancy-icon slot="leading">select_all</schmancy-icon>
                      Select All
                    </schmancy-menu-item>
                  </schmancy-menu>

                  <!-- View Menu -->
                  <schmancy-menu>
                    <schmancy-button slot="trigger" variant="text">
                      View
                    </schmancy-button>
                    <schmancy-menu-item @click=${() => this.handleMenuItemClick('Zoom In')}>
                      <schmancy-icon slot="leading">zoom_in</schmancy-icon>
                      Zoom In
                    </schmancy-menu-item>
                    <schmancy-menu-item @click=${() => this.handleMenuItemClick('Zoom Out')}>
                      <schmancy-icon slot="leading">zoom_out</schmancy-icon>
                      Zoom Out
                    </schmancy-menu-item>
                    <schmancy-menu-item @click=${() => this.handleMenuItemClick('Full Screen')}>
                      <schmancy-icon slot="leading">fullscreen</schmancy-icon>
                      Full Screen
                    </schmancy-menu-item>
                  </schmancy-menu>
                </div>
              </schmancy-code-preview>
            </div>

            <!-- Real-World Example: User Card -->
            <div>
              <schmancy-typography type="title" token="md" class="mb-4 block">
                Real-World Example: User Card with Menu
              </schmancy-typography>
              <schmancy-code-preview language="html">
                <schmancy-surface type="container" class="p-6 rounded-xl max-w-md">
                  <div class="flex items-start justify-between">
                    <div class="flex gap-4 items-center">
                      <div class="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center">
                        <schmancy-icon class="text-primary-onContainer">person</schmancy-icon>
                      </div>
                      <div>
                        <schmancy-typography type="title" token="md" class="block">
                          John Doe
                        </schmancy-typography>
                        <schmancy-typography type="body" token="sm" class="text-surface-onVariant block">
                          john.doe@example.com
                        </schmancy-typography>
                      </div>
                    </div>
                    <schmancy-menu>
                      <schmancy-menu-item @click=${() => this.handleMenuItemClick('View Profile')}>
                        <schmancy-icon slot="leading">person</schmancy-icon>
                        View Profile
                      </schmancy-menu-item>
                      <schmancy-menu-item @click=${() => this.handleMenuItemClick('Send Message')}>
                        <schmancy-icon slot="leading">mail</schmancy-icon>
                        Send Message
                      </schmancy-menu-item>
                      <schmancy-menu-item @click=${() => this.handleMenuItemClick('Block User')}>
                        <schmancy-icon slot="leading">block</schmancy-icon>
                        Block User
                      </schmancy-menu-item>
                    </schmancy-menu>
                  </div>
                </schmancy-surface>
              </schmancy-code-preview>
            </div>
          </div>
        </div>

        <!-- Features Section -->
        <div class="mb-12">
          <schmancy-typography type="title" token="lg" class="mb-6 block">
            Features
          </schmancy-typography>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <schmancy-surface type="surfaceDim" class="p-6 rounded-lg">
              <div class="flex gap-3 mb-3">
                <schmancy-icon class="text-primary-default">check_circle</schmancy-icon>
                <schmancy-typography type="title" token="sm">Portal Positioning</schmancy-typography>
              </div>
              <schmancy-typography type="body" token="sm" class="text-surface-onVariant">
                Uses $dialog service to portal menus to document.body, ensuring proper z-index and positioning in complex layouts (tables, virtualizers, overflow containers)
              </schmancy-typography>
            </schmancy-surface>

            <schmancy-surface type="surfaceDim" class="p-6 rounded-lg">
              <div class="flex gap-3 mb-3">
                <schmancy-icon class="text-primary-default">check_circle</schmancy-icon>
                <schmancy-typography type="title" token="sm">Fixed to Viewport</schmancy-typography>
              </div>
              <schmancy-typography type="body" token="sm" class="text-surface-onVariant">
                Menus stay fixed to viewport and don't scroll with content, automatically closing when clicking outside or selecting a menu item
              </schmancy-typography>
            </schmancy-surface>

            <schmancy-surface type="surfaceDim" class="p-6 rounded-lg">
              <div class="flex gap-3 mb-3">
                <schmancy-icon class="text-primary-default">check_circle</schmancy-icon>
                <schmancy-typography type="title" token="sm">Custom Triggers</schmancy-typography>
              </div>
              <schmancy-typography type="body" token="sm" class="text-surface-onVariant">
                Use any button or element as a trigger via the button slot, or use the default icon button
              </schmancy-typography>
            </schmancy-surface>

            <schmancy-surface type="surfaceDim" class="p-6 rounded-lg">
              <div class="flex gap-3 mb-3">
                <schmancy-icon class="text-primary-default">check_circle</schmancy-icon>
                <schmancy-typography type="title" token="sm">Works Everywhere</schmancy-typography>
              </div>
              <schmancy-typography type="body" token="sm" class="text-surface-onVariant">
                Works correctly in tables, grids, virtualizers, and any complex layout without z-index or stacking context issues
              </schmancy-typography>
            </schmancy-surface>
          </div>
        </div>

        <!-- Best Practices -->
        <div>
          <schmancy-typography type="title" token="lg" class="mb-6 block">
            Best Practices
          </schmancy-typography>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <schmancy-surface type="containerLow" class="p-6 rounded-lg border-l-4 border-tertiary">
              <schmancy-typography type="title" token="md" class="mb-3 text-tertiary">
                ✓ Do
              </schmancy-typography>
              <ul class="space-y-2 text-surface-onVariant list-none">
                <li class="border-b border-outline-variant pb-2">✓ Use icons for better menu item recognition</li>
                <li class="border-b border-outline-variant pb-2">✓ Keep menu items concise and action-oriented</li>
                <li class="border-b border-outline-variant pb-2">✓ Group related actions together</li>
                <li class="border-b border-outline-variant pb-2">✓ Use consistent trigger button styles</li>
                <li>✓ Handle menu item clicks to perform actions</li>
              </ul>
            </schmancy-surface>

            <schmancy-surface type="containerLow" class="p-6 rounded-lg border-l-4 border-error">
              <schmancy-typography type="title" token="md" class="mb-3 text-error">
                ✗ Don't
              </schmancy-typography>
              <ul class="space-y-2 text-surface-onVariant list-none">
                <li class="border-b border-outline-variant pb-2">✗ Overload menus with too many items (keep under 10)</li>
                <li class="border-b border-outline-variant pb-2">✗ Use menus for primary navigation</li>
                <li class="border-b border-outline-variant pb-2">✗ Hide critical actions in menus</li>
                <li class="border-b border-outline-variant pb-2">✗ Use vague labels like "More" without context</li>
                <li>✗ Nest menus too deeply (avoid submenus)</li>
              </ul>
            </schmancy-surface>
          </div>
        </div>
      </schmancy-surface>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'demo-menu': DemoMenu
  }
}
