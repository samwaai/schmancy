import { html, css } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { $LitElement } from '@mixins/index'
import '@schmancy/surface'
import '@schmancy/menu'
import '@schmancy/typography'
import '@schmancy/button'
import '@schmancy/list'
import { animate, fadeIn, fadeOut } from '@lit-labs/motion'

@customElement('demo-navigation-menu')
export class NavigationMenu extends $LitElement(css`
  :host {
    display: block;
    padding: 24px;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
  }

  .demo-section {
    margin-bottom: 48px;
  }

  .menu-demo {
    padding: 24px;
    min-height: 300px;
    position: relative;
  }

  .demo-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 24px;
    margin-bottom: 24px;
  }

  .dropdown-menu {
    position: relative;
    display: inline-block;
  }

  .menu-content {
    position: absolute;
    top: 100%;
    left: 0;
    margin-top: 4px;
    background: var(--md-sys-color-surface-container);
    border-radius: 8px;
    padding: 8px 0;
    min-width: 200px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    opacity: 0;
    transform: translateY(-10px);
    pointer-events: none;
    transition: all 0.2s;
    z-index: 10;
  }

  .menu-content.open {
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
  }

  .menu-item {
    padding: 12px 16px;
    cursor: pointer;
    transition: background 0.2s;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .menu-item:hover {
    background: var(--md-sys-color-surface-container-highest);
  }

  .menu-item.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .menu-divider {
    height: 1px;
    background: var(--md-sys-color-outline-variant);
    margin: 8px 0;
  }

  .context-menu {
    position: fixed;
    background: var(--md-sys-color-surface-container);
    border-radius: 8px;
    padding: 8px 0;
    min-width: 180px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    z-index: 100;
    display: none;
  }

  .context-menu.visible {
    display: block;
  }

  .context-area {
    height: 200px;
    background: var(--md-sys-color-surface-container);
    border: 2px dashed var(--md-sys-color-outline);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: context-menu;
  }

  .overflow-menu {
    position: relative;
  }

  .cascading-menu {
    position: relative;
  }

  .submenu {
    position: absolute;
    left: 100%;
    top: 0;
    margin-left: 4px;
    background: var(--md-sys-color-surface-container);
    border-radius: 8px;
    padding: 8px 0;
    min-width: 180px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    opacity: 0;
    pointer-events: none;
    transition: all 0.2s;
  }

  .menu-item.has-submenu:hover .submenu {
    opacity: 1;
    pointer-events: auto;
  }

  .menu-item.has-submenu::after {
    content: 'chevron_right';
    font-family: 'Material Symbols Rounded';
    margin-left: auto;
  }

  .feature-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 16px;
    margin-bottom: 24px;
  }

  .code-block {
    background: var(--md-sys-color-surface-container);
    border-radius: 8px;
    padding: 16px;
    overflow-x: auto;
    margin-top: 16px;
  }

  pre {
    margin: 0;
    font-family: 'Roboto Mono', monospace;
    font-size: 14px;
    line-height: 1.5;
  }

  .action-bar {
    display: flex;
    gap: 8px;
    padding: 16px;
    background: var(--md-sys-color-surface-container);
    border-radius: 8px;
    align-items: center;
  }

  .breadcrumb {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 0;
  }

  .breadcrumb-item {
    cursor: pointer;
    transition: color 0.2s;
  }

  .breadcrumb-item:hover {
    color: var(--md-sys-color-primary);
  }

  .breadcrumb-separator {
    opacity: 0.5;
  }
`) {
  @state() private dropdownOpen = false
  @state() private overflowMenuOpen = false
  @state() private contextMenuVisible = false
  @state() private contextMenuPosition = { x: 0, y: 0 }
  @state() private selectedAction = ''

  private dropdownItems = [
    { id: 'profile', label: 'Profile', icon: 'person' },
    { id: 'settings', label: 'Settings', icon: 'settings' },
    { id: 'help', label: 'Help', icon: 'help' },
    { divider: true },
    { id: 'logout', label: 'Sign Out', icon: 'logout' }
  ]

  private contextItems = [
    { id: 'cut', label: 'Cut', icon: 'content_cut', shortcut: 'Ctrl+X' },
    { id: 'copy', label: 'Copy', icon: 'content_copy', shortcut: 'Ctrl+C' },
    { id: 'paste', label: 'Paste', icon: 'content_paste', shortcut: 'Ctrl+V' },
    { divider: true },
    { id: 'delete', label: 'Delete', icon: 'delete', shortcut: 'Del' }
  ]

  private handleContextMenu(e: MouseEvent) {
    e.preventDefault()
    this.contextMenuPosition = { x: e.clientX, y: e.clientY }
    this.contextMenuVisible = true

    // Hide on next click
    const hideMenu = () => {
      this.contextMenuVisible = false
      document.removeEventListener('click', hideMenu)
    }
    setTimeout(() => document.addEventListener('click', hideMenu), 0)
  }

  private handleMenuAction(action: string) {
    this.selectedAction = action
    this.dropdownOpen = false
    this.overflowMenuOpen = false
    this.contextMenuVisible = false
  }

  render() {
    return html`
      <div class="container" ${animate()}>
        <!-- Header -->
        <div style="margin-bottom: 32px;" ${animate({ in: fadeIn, out: fadeOut })}>
          <schmancy-typography type="display" token="sm">
            Menu Components
          </schmancy-typography>
          <schmancy-typography type="body" token="lg" style="margin-top: 8px; opacity: 0.8;">
            Dropdown, context, and overflow menus for additional navigation and actions.
          </schmancy-typography>
        </div>

        <!-- Dropdown Menu -->
        <div class="demo-section">
          <schmancy-typography type="headline" token="md" style="margin-bottom: 16px;">
            Dropdown Menu
          </schmancy-typography>
          <schmancy-typography type="body" token="md" style="margin-bottom: 16px; opacity: 0.8;">
            Click-triggered menus for user actions and navigation.
          </schmancy-typography>

          <schmancy-surface type="filled" rounded="large">
            <div class="menu-demo">
              <div class="dropdown-menu">
                <schmancy-button @click=${() => this.dropdownOpen = !this.dropdownOpen}>
                  <schmancy-icon slot="end" name="arrow_drop_down"></schmancy-icon>
                  User Menu
                </schmancy-button>

                <div class="menu-content ${this.dropdownOpen ? 'open' : ''}">
                  ${this.dropdownItems.map(item =>
                    item.divider ? html`
                      <div class="menu-divider"></div>
                    ` : html`
                      <div class="menu-item" @click=${() => this.handleMenuAction(item.id)}>
                        <schmancy-icon name=${item.icon}></schmancy-icon>
                        <span>${item.label}</span>
                      </div>
                    `
                  )}
                </div>
              </div>

              ${this.selectedAction ? html`
                <schmancy-chip type="assist" style="margin-top: 24px;">
                  Last action: ${this.selectedAction}
                </schmancy-chip>
              ` : ''}
            </div>
          </schmancy-surface>

          <div class="code-block">
            <pre>
&lt;schmancy-menu&gt;
  &lt;schmancy-button slot="trigger"&gt;
    Open Menu
    &lt;schmancy-icon slot="end" name="arrow_drop_down"&gt;&lt;/schmancy-icon&gt;
  &lt;/schmancy-button&gt;

  &lt;schmancy-menu-item icon="person"&gt;Profile&lt;/schmancy-menu-item&gt;
  &lt;schmancy-menu-item icon="settings"&gt;Settings&lt;/schmancy-menu-item&gt;
  &lt;schmancy-divider&gt;&lt;/schmancy-divider&gt;
  &lt;schmancy-menu-item icon="logout"&gt;Sign Out&lt;/schmancy-menu-item&gt;
&lt;/schmancy-menu&gt;</pre>
          </div>
        </div>

        <!-- Context Menu -->
        <div class="demo-section">
          <schmancy-typography type="headline" token="md" style="margin-bottom: 16px;">
            Context Menu
          </schmancy-typography>
          <schmancy-typography type="body" token="md" style="margin-bottom: 16px; opacity: 0.8;">
            Right-click menus for contextual actions.
          </schmancy-typography>

          <schmancy-surface type="filled" rounded="large">
            <div class="menu-demo">
              <div class="context-area" @contextmenu=${this.handleContextMenu}>
                <schmancy-typography type="body" token="lg">
                  Right-click anywhere in this area
                </schmancy-typography>
              </div>

              <div class="context-menu ${this.contextMenuVisible ? 'visible' : ''}"
                   style="left: ${this.contextMenuPosition.x}px; top: ${this.contextMenuPosition.y}px;">
                ${this.contextItems.map(item =>
                  item.divider ? html`
                    <div class="menu-divider"></div>
                  ` : html`
                    <div class="menu-item" @click=${() => this.handleMenuAction(item.id)}>
                      <schmancy-icon name=${item.icon}></schmancy-icon>
                      <span>${item.label}</span>
                      <span style="margin-left: auto; opacity: 0.5; font-size: 12px;">
                        ${item.shortcut || ''}
                      </span>
                    </div>
                  `
                )}
              </div>
            </div>
          </schmancy-surface>
        </div>

        <!-- Overflow Menu -->
        <div class="demo-section">
          <schmancy-typography type="headline" token="md" style="margin-bottom: 16px;">
            Overflow Menu
          </schmancy-typography>
          <schmancy-typography type="body" token="md" style="margin-bottom: 16px; opacity: 0.8;">
            Three-dot menu for additional actions.
          </schmancy-typography>

          <schmancy-surface type="filled" rounded="large">
            <div class="action-bar">
              <schmancy-button type="tonal">
                <schmancy-icon slot="start" name="edit"></schmancy-icon>
                Edit
              </schmancy-button>
              <schmancy-button type="tonal">
                <schmancy-icon slot="start" name="share"></schmancy-icon>
                Share
              </schmancy-button>
              <schmancy-button type="tonal">
                <schmancy-icon slot="start" name="favorite"></schmancy-icon>
                Favorite
              </schmancy-button>

              <div style="margin-left: auto;" class="overflow-menu">
                <schmancy-icon-button @click=${() => this.overflowMenuOpen = !this.overflowMenuOpen}>
                  <schmancy-icon name="more_vert"></schmancy-icon>
                </schmancy-icon-button>

                <div class="menu-content ${this.overflowMenuOpen ? 'open' : ''}"
                     style="right: 0; left: auto;">
                  <div class="menu-item">
                    <schmancy-icon name="download"></schmancy-icon>
                    <span>Download</span>
                  </div>
                  <div class="menu-item">
                    <schmancy-icon name="print"></schmancy-icon>
                    <span>Print</span>
                  </div>
                  <div class="menu-item">
                    <schmancy-icon name="archive"></schmancy-icon>
                    <span>Archive</span>
                  </div>
                  <div class="menu-divider"></div>
                  <div class="menu-item">
                    <schmancy-icon name="delete"></schmancy-icon>
                    <span>Delete</span>
                  </div>
                </div>
              </div>
            </div>
          </schmancy-surface>
        </div>

        <!-- Cascading Menu -->
        <div class="demo-section">
          <schmancy-typography type="headline" token="md" style="margin-bottom: 16px;">
            Cascading Menu
          </schmancy-typography>
          <schmancy-typography type="body" token="md" style="margin-bottom: 16px; opacity: 0.8;">
            Multi-level menus for complex navigation hierarchies.
          </schmancy-typography>

          <schmancy-surface type="filled" rounded="large">
            <div class="menu-demo">
              <schmancy-button>
                File Menu
              </schmancy-button>

              <div style="margin-top: 16px; position: relative; display: inline-block;">
                <div class="menu-content open" style="position: static;">
                  <div class="menu-item">
                    <schmancy-icon name="create_new_folder"></schmancy-icon>
                    <span>New</span>
                  </div>
                  <div class="menu-item">
                    <schmancy-icon name="folder_open"></schmancy-icon>
                    <span>Open</span>
                  </div>
                  <div class="menu-item has-submenu">
                    <schmancy-icon name="history"></schmancy-icon>
                    <span>Recent</span>
                    <div class="submenu">
                      <div class="menu-item">Project A</div>
                      <div class="menu-item">Project B</div>
                      <div class="menu-item">Project C</div>
                    </div>
                  </div>
                  <div class="menu-divider"></div>
                  <div class="menu-item has-submenu">
                    <schmancy-icon name="save"></schmancy-icon>
                    <span>Export As</span>
                    <div class="submenu">
                      <div class="menu-item">PDF</div>
                      <div class="menu-item">PNG</div>
                      <div class="menu-item">SVG</div>
                      <div class="menu-item">CSV</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </schmancy-surface>
        </div>

        <!-- Breadcrumb Navigation -->
        <div class="demo-section">
          <schmancy-typography type="headline" token="md" style="margin-bottom: 16px;">
            Breadcrumb Navigation
          </schmancy-typography>
          <schmancy-typography type="body" token="md" style="margin-bottom: 16px; opacity: 0.8;">
            Show the current location within a navigation hierarchy.
          </schmancy-typography>

          <schmancy-surface type="filled" rounded="large" style="padding: 24px;">
            <div class="breadcrumb">
              <span class="breadcrumb-item">Home</span>
              <schmancy-icon name="chevron_right" class="breadcrumb-separator"></schmancy-icon>
              <span class="breadcrumb-item">Products</span>
              <schmancy-icon name="chevron_right" class="breadcrumb-separator"></schmancy-icon>
              <span class="breadcrumb-item">Electronics</span>
              <schmancy-icon name="chevron_right" class="breadcrumb-separator"></schmancy-icon>
              <span style="font-weight: 500;">Smartphones</span>
            </div>

            <schmancy-typography type="headline" token="sm" style="margin-top: 24px;">
              Smartphones
            </schmancy-typography>
            <schmancy-typography type="body" token="md" style="margin-top: 8px; opacity: 0.8;">
              Browse our collection of latest smartphones...
            </schmancy-typography>
          </schmancy-surface>
        </div>

        <!-- Features -->
        <schmancy-typography type="headline" token="md" style="margin-bottom: 16px;">
          Menu Features
        </schmancy-typography>

        <div class="feature-grid">
          <schmancy-surface type="outlined" rounded="medium" style="padding: 16px;">
            <schmancy-icon name="mouse" style="font-size: 32px; margin-bottom: 12px;"></schmancy-icon>
            <schmancy-typography type="title" token="md">Multiple Triggers</schmancy-typography>
            <schmancy-typography type="body" token="sm" style="margin-top: 8px; opacity: 0.8;">
              Click, right-click, or hover activation
            </schmancy-typography>
          </schmancy-surface>

          <schmancy-surface type="outlined" rounded="medium" style="padding: 16px;">
            <schmancy-icon name="keyboard" style="font-size: 32px; margin-bottom: 12px;"></schmancy-icon>
            <schmancy-typography type="title" token="md">Keyboard Nav</schmancy-typography>
            <schmancy-typography type="body" token="sm" style="margin-top: 8px; opacity: 0.8;">
              Arrow keys and shortcuts support
            </schmancy-typography>
          </schmancy-surface>

          <schmancy-surface type="outlined" rounded="medium" style="padding: 16px;">
            <schmancy-icon name="account_tree" style="font-size: 32px; margin-bottom: 12px;"></schmancy-icon>
            <schmancy-typography type="title" token="md">Nested Menus</schmancy-typography>
            <schmancy-typography type="body" token="sm" style="margin-top: 8px; opacity: 0.8;">
              Support for cascading submenus
            </schmancy-typography>
          </schmancy-surface>

          <schmancy-surface type="outlined" rounded="medium" style="padding: 16px;">
            <schmancy-icon name="tune" style="font-size: 32px; margin-bottom: 12px;"></schmancy-icon>
            <schmancy-typography type="title" token="md">Customizable</schmancy-typography>
            <schmancy-typography type="body" token="sm" style="margin-top: 8px; opacity: 0.8;">
              Icons, shortcuts, and dividers
            </schmancy-typography>
          </schmancy-surface>
        </div>

        <!-- Best Practices -->
        <schmancy-surface type="filled" rounded="large" style="padding: 24px; margin-top: 32px;">
          <schmancy-typography type="headline" token="sm" style="margin-bottom: 16px;">
            Menu Best Practices
          </schmancy-typography>

          <schmancy-list>
            <schmancy-list-item>
              <schmancy-icon slot="start" name="format_list_numbered"></schmancy-icon>
              <span slot="headline">Keep menus short (7±2 items)</span>
            </schmancy-list-item>
            <schmancy-list-item>
              <schmancy-icon slot="start" name="sort"></schmancy-icon>
              <span slot="headline">Group related items with dividers</span>
            </schmancy-list-item>
            <schmancy-list-item>
              <schmancy-icon slot="start" name="warning"></schmancy-icon>
              <span slot="headline">Place destructive actions at the bottom</span>
            </schmancy-list-item>
            <schmancy-list-item>
              <schmancy-icon slot="start" name="keyboard_alt"></schmancy-icon>
              <span slot="headline">Show keyboard shortcuts when available</span>
            </schmancy-list-item>
            <schmancy-list-item>
              <schmancy-icon slot="start" name="visibility"></schmancy-icon>
              <span slot="headline">Use icons to improve scanability</span>
            </schmancy-list-item>
          </schmancy-list>
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