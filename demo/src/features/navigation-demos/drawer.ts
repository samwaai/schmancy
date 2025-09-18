import { html, css } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { $LitElement } from '@mixins/index'
import '@schmancy/surface'
import '@schmancy/nav-drawer'
import '@schmancy/typography'
import '@schmancy/button'
import '@schmancy/list'
import { animate, fadeIn, fadeOut } from '@lit-labs/motion'

@customElement('demo-navigation-drawer')
export class NavigationDrawer extends $LitElement(css`
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

  .drawer-demo {
    height: 500px;
    position: relative;
    overflow: hidden;
    border-radius: 12px;
    border: 1px solid var(--md-sys-color-outline);
  }

  .drawer-container {
    display: flex;
    height: 100%;
  }

  .drawer {
    width: 280px;
    background: var(--md-sys-color-surface-container);
    display: flex;
    flex-direction: column;
    transition: transform 0.3s ease;
  }

  .drawer.modal {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: 10;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  }

  .drawer.modal.closed {
    transform: translateX(-100%);
  }

  .drawer-header {
    padding: 24px;
    background: var(--md-sys-color-primary-container);
  }

  .drawer-content {
    flex: 1;
    overflow-y: auto;
    padding: 8px;
  }

  .drawer-footer {
    padding: 16px;
    border-top: 1px solid var(--md-sys-color-outline-variant);
  }

  .main-content {
    flex: 1;
    padding: 24px;
    overflow-y: auto;
  }

  .nav-section {
    margin-bottom: 24px;
  }

  .nav-section-title {
    padding: 12px 16px;
    font-size: 14px;
    font-weight: 500;
    opacity: 0.7;
  }

  .nav-item {
    display: flex;
    align-items: center;
    padding: 12px 16px;
    border-radius: 28px;
    margin: 4px 8px;
    cursor: pointer;
    transition: background 0.2s;
  }

  .nav-item:hover {
    background: var(--md-sys-color-surface-container-highest);
  }

  .nav-item.active {
    background: var(--md-sys-color-secondary-container);
  }

  .nav-item-icon {
    margin-right: 12px;
    opacity: 0.8;
  }

  .nav-item-badge {
    margin-left: auto;
    padding: 2px 8px;
    border-radius: 12px;
    background: var(--md-sys-color-tertiary-container);
    font-size: 12px;
  }

  .drawer-backdrop {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    z-index: 9;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s;
  }

  .drawer-backdrop.visible {
    opacity: 1;
    pointer-events: auto;
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

  .feature-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 16px;
    margin-bottom: 24px;
  }

  .rail-drawer-combo {
    display: flex;
    height: 500px;
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid var(--md-sys-color-outline);
  }

  .rail {
    width: 80px;
    background: var(--md-sys-color-surface-container);
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 12px 0;
    gap: 8px;
  }

  .rail-item {
    width: 56px;
    height: 56px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.2s;
  }

  .rail-item:hover {
    background: var(--md-sys-color-surface-container-highest);
  }

  .rail-item.active {
    background: var(--md-sys-color-secondary-container);
  }

  .mini-drawer {
    width: 56px;
    transition: width 0.3s ease;
  }

  .mini-drawer.expanded {
    width: 280px;
  }

  .mini-drawer .nav-item {
    overflow: hidden;
    white-space: nowrap;
  }

  .mini-drawer:not(.expanded) .nav-item {
    padding: 12px;
    justify-content: center;
  }

  .mini-drawer:not(.expanded) .nav-item-icon {
    margin-right: 0;
  }

  .mini-drawer:not(.expanded) .nav-item-text,
  .mini-drawer:not(.expanded) .nav-item-badge {
    display: none;
  }
`) {
  @state() private activeItem = 'inbox'
  @state() private modalDrawerOpen = false
  @state() private miniDrawerExpanded = false
  @state() private activeRailItem = 'home'
  @state() private drawerVariant: 'standard' | 'modal' | 'rail' = 'standard'

  private navigationItems = [
    { id: 'inbox', label: 'Inbox', icon: 'inbox', badge: '12' },
    { id: 'starred', label: 'Starred', icon: 'star' },
    { id: 'sent', label: 'Sent', icon: 'send' },
    { id: 'drafts', label: 'Drafts', icon: 'drafts', badge: '3' },
    { id: 'trash', label: 'Trash', icon: 'delete' }
  ]

  private settingsItems = [
    { id: 'settings', label: 'Settings', icon: 'settings' },
    { id: 'help', label: 'Help & Feedback', icon: 'help' }
  ]

  private railItems = [
    { id: 'home', icon: 'home' },
    { id: 'search', icon: 'search' },
    { id: 'notifications', icon: 'notifications' },
    { id: 'profile', icon: 'person' }
  ]

  render() {
    return html`
      <div class="container" ${animate()}>
        <!-- Header -->
        <div style="margin-bottom: 32px;" ${animate({ in: fadeIn, out: fadeOut })}>
          <schmancy-typography type="display" token="sm">
            Navigation Drawer
          </schmancy-typography>
          <schmancy-typography type="body" token="lg" style="margin-top: 8px; opacity: 0.8;">
            Side navigation patterns for organizing app content and features.
          </schmancy-typography>
        </div>

        <!-- Standard Navigation Drawer -->
        <div class="demo-section">
          <schmancy-typography type="headline" token="md" style="margin-bottom: 16px;">
            Standard Navigation Drawer
          </schmancy-typography>
          <schmancy-typography type="body" token="md" style="margin-bottom: 16px; opacity: 0.8;">
            Always visible sidebar navigation for desktop applications.
          </schmancy-typography>

          <schmancy-surface type="filled" rounded="large" style="overflow: hidden;">
            <div class="drawer-demo">
              <div class="drawer-container">
                <div class="drawer">
                  <div class="drawer-header">
                    <schmancy-typography type="headline" token="sm">
                      Mail App
                    </schmancy-typography>
                    <schmancy-typography type="body" token="sm" style="margin-top: 4px; opacity: 0.8;">
                      user@example.com
                    </schmancy-typography>
                  </div>

                  <div class="drawer-content">
                    <div class="nav-section">
                      ${this.navigationItems.map(item => html`
                        <div class="nav-item ${this.activeItem === item.id ? 'active' : ''}"
                             @click=${() => this.activeItem = item.id}>
                          <schmancy-icon class="nav-item-icon" name=${item.icon}></schmancy-icon>
                          <span class="nav-item-text">${item.label}</span>
                          ${item.badge ? html`
                            <span class="nav-item-badge">${item.badge}</span>
                          ` : ''}
                        </div>
                      `)}
                    </div>

                    <div style="border-top: 1px solid var(--md-sys-color-outline-variant); margin: 16px;"></div>

                    <div class="nav-section">
                      <div class="nav-section-title">Settings</div>
                      ${this.settingsItems.map(item => html`
                        <div class="nav-item ${this.activeItem === item.id ? 'active' : ''}"
                             @click=${() => this.activeItem = item.id}>
                          <schmancy-icon class="nav-item-icon" name=${item.icon}></schmancy-icon>
                          <span class="nav-item-text">${item.label}</span>
                        </div>
                      `)}
                    </div>
                  </div>

                  <div class="drawer-footer">
                    <schmancy-button type="tonal" fullWidth>
                      <schmancy-icon slot="start" name="logout"></schmancy-icon>
                      Sign Out
                    </schmancy-button>
                  </div>
                </div>

                <div class="main-content">
                  <schmancy-typography type="headline" token="md">
                    ${this.navigationItems.find(i => i.id === this.activeItem)?.label ||
                      this.settingsItems.find(i => i.id === this.activeItem)?.label}
                  </schmancy-typography>
                  <schmancy-typography type="body" token="md" style="margin-top: 16px; opacity: 0.8;">
                    Content for the selected navigation item would appear here.
                    The drawer remains visible on desktop for quick navigation.
                  </schmancy-typography>
                </div>
              </div>
            </div>
          </schmancy-surface>

          <div class="code-block">
            <pre>
&lt;schmancy-navigation-drawer&gt;
  &lt;div slot="header"&gt;
    &lt;schmancy-typography&gt;App Name&lt;/schmancy-typography&gt;
  &lt;/div&gt;

  &lt;schmancy-nav-item icon="inbox" ?active=\${active}&gt;
    Inbox
    &lt;schmancy-badge slot="end"&gt;12&lt;/schmancy-badge&gt;
  &lt;/schmancy-nav-item&gt;

  &lt;schmancy-nav-item icon="star"&gt;Starred&lt;/schmancy-nav-item&gt;
&lt;/schmancy-navigation-drawer&gt;</pre>
          </div>
        </div>

        <!-- Modal Navigation Drawer -->
        <div class="demo-section">
          <schmancy-typography type="headline" token="md" style="margin-bottom: 16px;">
            Modal Navigation Drawer
          </schmancy-typography>
          <schmancy-typography type="body" token="md" style="margin-bottom: 16px; opacity: 0.8;">
            Overlay drawer that appears on demand, perfect for mobile and responsive layouts.
          </schmancy-typography>

          <schmancy-surface type="filled" rounded="large" style="overflow: hidden;">
            <div class="drawer-demo">
              <div class="drawer-backdrop ${this.modalDrawerOpen ? 'visible' : ''}"
                   @click=${() => this.modalDrawerOpen = false}></div>

              <div class="drawer modal ${!this.modalDrawerOpen ? 'closed' : ''}">
                <div class="drawer-header">
                  <div style="display: flex; align-items: center; justify-content: space-between;">
                    <schmancy-typography type="headline" token="sm">
                      Navigation
                    </schmancy-typography>
                    <schmancy-icon-button @click=${() => this.modalDrawerOpen = false}>
                      <schmancy-icon name="close"></schmancy-icon>
                    </schmancy-icon-button>
                  </div>
                </div>

                <div class="drawer-content">
                  ${this.navigationItems.map(item => html`
                    <div class="nav-item ${this.activeItem === item.id ? 'active' : ''}"
                         @click=${() => {
                           this.activeItem = item.id
                           this.modalDrawerOpen = false
                         }}>
                      <schmancy-icon class="nav-item-icon" name=${item.icon}></schmancy-icon>
                      <span>${item.label}</span>
                      ${item.badge ? html`
                        <span class="nav-item-badge">${item.badge}</span>
                      ` : ''}
                    </div>
                  `)}
                </div>
              </div>

              <div class="main-content">
                <schmancy-button @click=${() => this.modalDrawerOpen = true}>
                  <schmancy-icon slot="start" name="menu"></schmancy-icon>
                  Open Drawer
                </schmancy-button>

                <schmancy-typography type="body" token="md" style="margin-top: 24px;">
                  Click the button to open the modal drawer. This pattern is ideal for mobile
                  applications where screen space is limited.
                </schmancy-typography>
              </div>
            </div>
          </schmancy-surface>
        </div>

        <!-- Rail + Drawer Combination -->
        <div class="demo-section">
          <schmancy-typography type="headline" token="md" style="margin-bottom: 16px;">
            Navigation Rail with Expandable Drawer
          </schmancy-typography>
          <schmancy-typography type="body" token="md" style="margin-bottom: 16px; opacity: 0.8;">
            Compact rail that expands to full drawer on hover or click.
          </schmancy-typography>

          <schmancy-surface type="filled" rounded="large" style="overflow: hidden;">
            <div class="rail-drawer-combo">
              <div class="drawer mini-drawer ${this.miniDrawerExpanded ? 'expanded' : ''}"
                   @mouseenter=${() => this.miniDrawerExpanded = true}
                   @mouseleave=${() => this.miniDrawerExpanded = false}>
                <div style="padding: 16px;">
                  <schmancy-icon-button>
                    <schmancy-icon name="menu"></schmancy-icon>
                  </schmancy-icon-button>
                </div>

                ${this.navigationItems.map(item => html`
                  <div class="nav-item ${this.activeItem === item.id ? 'active' : ''}">
                    <schmancy-icon class="nav-item-icon" name=${item.icon}></schmancy-icon>
                    <span class="nav-item-text">${item.label}</span>
                    ${item.badge ? html`
                      <span class="nav-item-badge">${item.badge}</span>
                    ` : ''}
                  </div>
                `)}
              </div>

              <div class="main-content">
                <schmancy-typography type="headline" token="md">
                  Adaptive Navigation
                </schmancy-typography>
                <schmancy-typography type="body" token="md" style="margin-top: 16px;">
                  Hover over the rail to expand it into a full drawer. This pattern saves
                  space while maintaining quick access to navigation.
                </schmancy-typography>
              </div>
            </div>
          </schmancy-surface>
        </div>

        <!-- Features -->
        <schmancy-typography type="headline" token="md" style="margin-bottom: 16px;">
          Drawer Features
        </schmancy-typography>

        <div class="feature-grid">
          <schmancy-surface type="outlined" rounded="medium" style="padding: 16px;">
            <schmancy-icon name="swap_horiz" style="font-size: 32px; margin-bottom: 12px;"></schmancy-icon>
            <schmancy-typography type="title" token="md">Multiple Variants</schmancy-typography>
            <schmancy-typography type="body" token="sm" style="margin-top: 8px; opacity: 0.8;">
              Standard, modal, and mini drawer options
            </schmancy-typography>
          </schmancy-surface>

          <schmancy-surface type="outlined" rounded="medium" style="padding: 16px;">
            <schmancy-icon name="tune" style="font-size: 32px; margin-bottom: 12px;"></schmancy-icon>
            <schmancy-typography type="title" token="md">Customizable</schmancy-typography>
            <schmancy-typography type="body" token="sm" style="margin-top: 8px; opacity: 0.8;">
              Flexible header, content, and footer slots
            </schmancy-typography>
          </schmancy-surface>

          <schmancy-surface type="outlined" rounded="medium" style="padding: 16px;">
            <schmancy-icon name="devices" style="font-size: 32px; margin-bottom: 12px;"></schmancy-icon>
            <schmancy-typography type="title" token="md">Responsive</schmancy-typography>
            <schmancy-typography type="body" token="sm" style="margin-top: 8px; opacity: 0.8;">
              Adapts to different screen sizes
            </schmancy-typography>
          </schmancy-surface>

          <schmancy-surface type="outlined" rounded="medium" style="padding: 16px;">
            <schmancy-icon name="palette" style="font-size: 32px; margin-bottom: 12px;"></schmancy-icon>
            <schmancy-typography type="title" token="md">Themed</schmancy-typography>
            <schmancy-typography type="body" token="sm" style="margin-top: 8px; opacity: 0.8;">
              Follows Material Design 3 theming
            </schmancy-typography>
          </schmancy-surface>
        </div>

        <!-- Best Practices -->
        <schmancy-surface type="filled" rounded="large" style="padding: 24px; margin-top: 32px;">
          <schmancy-typography type="headline" token="sm" style="margin-bottom: 16px;">
            Best Practices
          </schmancy-typography>

          <schmancy-list>
            <schmancy-list-item>
              <schmancy-icon slot="start" name="check_circle"></schmancy-icon>
              <span slot="headline">Use standard drawer for desktop applications</span>
            </schmancy-list-item>
            <schmancy-list-item>
              <schmancy-icon slot="start" name="check_circle"></schmancy-icon>
              <span slot="headline">Use modal drawer for mobile and tablets</span>
            </schmancy-list-item>
            <schmancy-list-item>
              <schmancy-icon slot="start" name="check_circle"></schmancy-icon>
              <span slot="headline">Group related navigation items together</span>
            </schmancy-list-item>
            <schmancy-list-item>
              <schmancy-icon slot="start" name="check_circle"></schmancy-icon>
              <span slot="headline">Provide visual feedback for active items</span>
            </schmancy-list-item>
            <schmancy-list-item>
              <schmancy-icon slot="start" name="check_circle"></schmancy-icon>
              <span slot="headline">Include user actions in drawer footer</span>
            </schmancy-list-item>
          </schmancy-list>
        </schmancy-surface>
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'demo-navigation-drawer': NavigationDrawer
  }
}