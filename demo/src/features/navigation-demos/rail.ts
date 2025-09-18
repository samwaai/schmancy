import { html, css } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { $LitElement } from '@mixins/index'
import '@schmancy/surface'
import '@schmancy/nav-drawer'
import '@schmancy/typography'
import '@schmancy/button'
import { animate, fadeIn, fadeOut } from '@lit-labs/motion'

@customElement('demo-navigation-rail')
export class NavigationRail extends $LitElement(css`
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

  .rail-demo {
    height: 600px;
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid var(--md-sys-color-outline);
    display: flex;
  }

  .rail {
    width: 80px;
    background: var(--md-sys-color-surface);
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 8px 0;
    border-right: 1px solid var(--md-sys-color-outline-variant);
  }

  .rail-header {
    padding: 8px;
    margin-bottom: 12px;
  }

  .rail-items {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 0 12px;
  }

  .rail-item {
    width: 56px;
    height: 56px;
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    cursor: pointer;
    transition: all 0.2s;
    position: relative;
  }

  .rail-item:hover {
    background: var(--md-sys-color-surface-container-highest);
  }

  .rail-item.active {
    background: var(--md-sys-color-secondary-container);
  }

  .rail-item.active .rail-icon {
    color: var(--md-sys-color-on-secondary-container);
  }

  .rail-icon {
    font-size: 24px;
    color: var(--md-sys-color-on-surface-variant);
  }

  .rail-label {
    font-size: 12px;
    font-weight: 500;
    color: var(--md-sys-color-on-surface-variant);
  }

  .rail-item.active .rail-label {
    color: var(--md-sys-color-on-secondary-container);
  }

  .rail-badge {
    position: absolute;
    top: 8px;
    right: 8px;
    min-width: 16px;
    height: 16px;
    padding: 0 4px;
    background: var(--md-sys-color-error);
    color: var(--md-sys-color-on-error);
    border-radius: 8px;
    font-size: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 500;
  }

  .content-area {
    flex: 1;
    padding: 24px;
    overflow-y: auto;
    background: var(--md-sys-color-surface);
  }

  .extended-rail {
    width: 256px;
    transition: width 0.3s ease;
  }

  .extended-rail .rail-item {
    width: auto;
    flex-direction: row;
    justify-content: flex-start;
    padding: 0 16px;
    gap: 12px;
  }

  .extended-rail .rail-label {
    font-size: 14px;
  }

  .extended-rail .rail-badge {
    position: static;
    margin-left: auto;
  }

  .adaptive-demo {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 24px;
    margin-bottom: 24px;
  }

  .device-frame {
    border: 2px solid var(--md-sys-color-outline);
    border-radius: 12px;
    overflow: hidden;
    height: 400px;
    display: flex;
    position: relative;
  }

  .tablet-frame {
    max-width: 768px;
  }

  .desktop-frame {
    max-width: 100%;
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

  .rail-with-fab {
    position: relative;
  }

  .rail-fab {
    margin: 16px;
  }

  .section-divider {
    width: 32px;
    height: 1px;
    background: var(--md-sys-color-outline-variant);
    margin: 16px 0;
  }

  .menu-trigger {
    position: relative;
  }

  .rail-menu {
    position: absolute;
    left: 100%;
    top: 0;
    margin-left: 8px;
    background: var(--md-sys-color-surface-container);
    border-radius: 8px;
    padding: 8px;
    min-width: 200px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    display: none;
  }

  .menu-trigger:hover .rail-menu {
    display: block;
  }

  .menu-item {
    padding: 8px 12px;
    border-radius: 4px;
    cursor: pointer;
    transition: background 0.2s;
  }

  .menu-item:hover {
    background: var(--md-sys-color-surface-container-highest);
  }
`) {
  @state() private activeRailItem = 'home'
  @state() private extendedRail = false
  @state() private railWithBadges = 'inbox'
  @state() private railWithFab = 'dashboard'

  private basicRailItems = [
    { id: 'home', icon: 'home', label: 'Home' },
    { id: 'search', icon: 'search', label: 'Search' },
    { id: 'library', icon: 'video_library', label: 'Library' },
    { id: 'profile', icon: 'person', label: 'Profile' }
  ]

  private badgeRailItems = [
    { id: 'inbox', icon: 'inbox', label: 'Inbox', badge: '12' },
    { id: 'starred', icon: 'star', label: 'Starred' },
    { id: 'sent', icon: 'send', label: 'Sent' },
    { id: 'notifications', icon: 'notifications', label: 'Alerts', badge: '3' }
  ]

  private fabRailItems = [
    { id: 'dashboard', icon: 'dashboard', label: 'Dashboard' },
    { id: 'analytics', icon: 'analytics', label: 'Analytics' },
    { id: 'reports', icon: 'assessment', label: 'Reports' },
    { id: 'settings', icon: 'settings', label: 'Settings' }
  ]

  render() {
    return html`
      <div class="container" ${animate()}>
        <!-- Header -->
        <div style="margin-bottom: 32px;" ${animate({ in: fadeIn, out: fadeOut })}>
          <schmancy-typography type="display" token="sm">
            Navigation Rail
          </schmancy-typography>
          <schmancy-typography type="body" token="lg" style="margin-top: 8px; opacity: 0.8;">
            Compact navigation pattern for tablets and desktop layouts with limited horizontal space.
          </schmancy-typography>
        </div>

        <!-- Basic Navigation Rail -->
        <div class="demo-section">
          <schmancy-typography type="headline" token="md" style="margin-bottom: 16px;">
            Basic Navigation Rail
          </schmancy-typography>
          <schmancy-typography type="body" token="md" style="margin-bottom: 16px; opacity: 0.8;">
            Simple vertical navigation with icons and labels.
          </schmancy-typography>

          <schmancy-surface type="filled" rounded="large" style="overflow: hidden;">
            <div class="rail-demo">
              <div class="rail">
                <div class="rail-header">
                  <schmancy-icon-button>
                    <schmancy-icon name="menu"></schmancy-icon>
                  </schmancy-icon-button>
                </div>

                <div class="rail-items">
                  ${this.basicRailItems.map(item => html`
                    <div class="rail-item ${this.activeRailItem === item.id ? 'active' : ''}"
                         @click=${() => this.activeRailItem = item.id}>
                      <schmancy-icon class="rail-icon" name=${item.icon}></schmancy-icon>
                      <span class="rail-label">${item.label}</span>
                    </div>
                  `)}
                </div>
              </div>

              <div class="content-area">
                <schmancy-typography type="headline" token="lg">
                  ${this.basicRailItems.find(i => i.id === this.activeRailItem)?.label} Content
                </schmancy-typography>
                <schmancy-typography type="body" token="md" style="margin-top: 16px; opacity: 0.8;">
                  The navigation rail provides quick access to top-level destinations in your app.
                  It's perfect for tablets and desktop layouts where horizontal space is at a premium.
                </schmancy-typography>

                <schmancy-surface type="outlined" rounded="medium" style="margin-top: 24px; padding: 24px;">
                  <schmancy-typography type="title" token="md">
                    Key Features
                  </schmancy-typography>
                  <ul style="margin-top: 16px; padding-left: 20px;">
                    <li>Compact 80px width saves screen space</li>
                    <li>Icons with optional labels for clarity</li>
                    <li>Clear active state indication</li>
                    <li>Smooth transitions between states</li>
                  </ul>
                </schmancy-surface>
              </div>
            </div>
          </schmancy-surface>

          <div class="code-block">
            <pre>
&lt;schmancy-navigation-rail
  .items=\${this.railItems}
  .activeItem=\${this.activeItem}
  @item-selected=\${this.handleNavigation}
&gt;
  &lt;schmancy-icon-button slot="menu"&gt;
    &lt;schmancy-icon name="menu"&gt;&lt;/schmancy-icon&gt;
  &lt;/schmancy-icon-button&gt;
&lt;/schmancy-navigation-rail&gt;</pre>
          </div>
        </div>

        <!-- Navigation Rail with Badges -->
        <div class="demo-section">
          <schmancy-typography type="headline" token="md" style="margin-bottom: 16px;">
            Navigation Rail with Badges
          </schmancy-typography>
          <schmancy-typography type="body" token="md" style="margin-bottom: 16px; opacity: 0.8;">
            Show notification counts and status indicators.
          </schmancy-typography>

          <schmancy-surface type="filled" rounded="large" style="overflow: hidden;">
            <div class="rail-demo">
              <div class="rail">
                <div class="rail-header">
                  <schmancy-icon-button>
                    <schmancy-icon name="menu"></schmancy-icon>
                  </schmancy-icon-button>
                </div>

                <div class="rail-items">
                  ${this.badgeRailItems.map(item => html`
                    <div class="rail-item ${this.railWithBadges === item.id ? 'active' : ''}"
                         @click=${() => this.railWithBadges = item.id}>
                      <schmancy-icon class="rail-icon" name=${item.icon}></schmancy-icon>
                      <span class="rail-label">${item.label}</span>
                      ${item.badge ? html`
                        <span class="rail-badge">${item.badge}</span>
                      ` : ''}
                    </div>
                  `)}
                </div>
              </div>

              <div class="content-area">
                <schmancy-typography type="headline" token="lg">
                  ${this.badgeRailItems.find(i => i.id === this.railWithBadges)?.label}
                  ${this.badgeRailItems.find(i => i.id === this.railWithBadges)?.badge ?
                    html`<schmancy-chip type="assist" style="margin-left: 12px;">
                      ${this.badgeRailItems.find(i => i.id === this.railWithBadges)?.badge} new
                    </schmancy-chip>` : ''}
                </schmancy-typography>

                <div style="margin-top: 24px;">
                  ${this.railWithBadges === 'inbox' ? html`
                    <schmancy-list>
                      <schmancy-list-item>
                        <schmancy-icon slot="start" name="mail"></schmancy-icon>
                        <span slot="headline">New message from Alex</span>
                        <span slot="supporting">Hey, are you available for a quick call?</span>
                      </schmancy-list-item>
                      <schmancy-list-item>
                        <schmancy-icon slot="start" name="mail"></schmancy-icon>
                        <span slot="headline">Project update</span>
                        <span slot="supporting">The latest designs are ready for review</span>
                      </schmancy-list-item>
                    </schmancy-list>
                  ` : this.railWithBadges === 'notifications' ? html`
                    <schmancy-list>
                      <schmancy-list-item>
                        <schmancy-icon slot="start" name="info"></schmancy-icon>
                        <span slot="headline">System update available</span>
                        <span slot="supporting">Version 2.0.1 is ready to install</span>
                      </schmancy-list-item>
                    </schmancy-list>
                  ` : html`
                    <schmancy-typography type="body" token="md" style="opacity: 0.8;">
                      No new items in ${this.badgeRailItems.find(i => i.id === this.railWithBadges)?.label}
                    </schmancy-typography>
                  `}
                </div>
              </div>
            </div>
          </schmancy-surface>
        </div>

        <!-- Navigation Rail with FAB -->
        <div class="demo-section">
          <schmancy-typography type="headline" token="md" style="margin-bottom: 16px;">
            Navigation Rail with FAB
          </schmancy-typography>
          <schmancy-typography type="body" token="md" style="margin-bottom: 16px; opacity: 0.8;">
            Include a floating action button for primary actions.
          </schmancy-typography>

          <schmancy-surface type="filled" rounded="large" style="overflow: hidden;">
            <div class="rail-demo">
              <div class="rail rail-with-fab">
                <div class="rail-header">
                  <schmancy-icon-button>
                    <schmancy-icon name="menu"></schmancy-icon>
                  </schmancy-icon-button>
                </div>

                <schmancy-fab class="rail-fab" size="small">
                  <schmancy-icon name="add"></schmancy-icon>
                </schmancy-fab>

                <div class="section-divider"></div>

                <div class="rail-items">
                  ${this.fabRailItems.map(item => html`
                    <div class="rail-item ${this.railWithFab === item.id ? 'active' : ''}"
                         @click=${() => this.railWithFab = item.id}>
                      <schmancy-icon class="rail-icon" name=${item.icon}></schmancy-icon>
                      <span class="rail-label">${item.label}</span>
                    </div>
                  `)}
                </div>
              </div>

              <div class="content-area">
                <schmancy-typography type="headline" token="lg">
                  ${this.fabRailItems.find(i => i.id === this.railWithFab)?.label}
                </schmancy-typography>

                <schmancy-surface type="outlined" rounded="medium" style="margin-top: 24px; padding: 24px;">
                  <schmancy-typography type="title" token="sm">
                    FAB Integration
                  </schmancy-typography>
                  <schmancy-typography type="body" token="md" style="margin-top: 12px; opacity: 0.8;">
                    The floating action button provides quick access to the most common action
                    in the current context. Position it prominently within the rail for easy reach.
                  </schmancy-typography>
                </schmancy-surface>
              </div>
            </div>
          </schmancy-surface>
        </div>

        <!-- Extended Navigation Rail -->
        <div class="demo-section">
          <schmancy-typography type="headline" token="md" style="margin-bottom: 16px;">
            Extended Navigation Rail
          </schmancy-typography>
          <schmancy-typography type="body" token="md" style="margin-bottom: 16px; opacity: 0.8;">
            Expandable rail that shows full labels on hover or toggle.
          </schmancy-typography>

          <schmancy-surface type="filled" rounded="large" style="overflow: hidden;">
            <div class="rail-demo">
              <div class="rail ${this.extendedRail ? 'extended-rail' : ''}">
                <div class="rail-header">
                  <schmancy-icon-button @click=${() => this.extendedRail = !this.extendedRail}>
                    <schmancy-icon name="menu"></schmancy-icon>
                  </schmancy-icon-button>
                </div>

                <div class="rail-items">
                  ${this.badgeRailItems.map(item => html`
                    <div class="rail-item ${this.railWithBadges === item.id ? 'active' : ''}"
                         @click=${() => this.railWithBadges = item.id}>
                      <schmancy-icon class="rail-icon" name=${item.icon}></schmancy-icon>
                      <span class="rail-label">${item.label}</span>
                      ${item.badge ? html`
                        <span class="rail-badge">${item.badge}</span>
                      ` : ''}
                    </div>
                  `)}
                </div>
              </div>

              <div class="content-area">
                <schmancy-typography type="headline" token="lg">
                  Adaptive Width
                </schmancy-typography>
                <schmancy-typography type="body" token="md" style="margin-top: 16px; opacity: 0.8;">
                  Click the menu button to toggle between compact and extended views.
                  The extended view shows full labels and provides better context for navigation items.
                </schmancy-typography>
              </div>
            </div>
          </schmancy-surface>
        </div>

        <!-- Features -->
        <schmancy-typography type="headline" token="md" style="margin-bottom: 16px;">
          Rail Features
        </schmancy-typography>

        <div class="feature-grid">
          <schmancy-surface type="outlined" rounded="medium" style="padding: 16px;">
            <schmancy-icon name="space_dashboard" style="font-size: 32px; margin-bottom: 12px;"></schmancy-icon>
            <schmancy-typography type="title" token="md">Space Efficient</schmancy-typography>
            <schmancy-typography type="body" token="sm" style="margin-top: 8px; opacity: 0.8;">
              Only 80px wide in compact mode
            </schmancy-typography>
          </schmancy-surface>

          <schmancy-surface type="outlined" rounded="medium" style="padding: 16px;">
            <schmancy-icon name="touch_app" style="font-size: 32px; margin-bottom: 12px;"></schmancy-icon>
            <schmancy-typography type="title" token="md">Touch Friendly</schmancy-typography>
            <schmancy-typography type="body" token="sm" style="margin-top: 8px; opacity: 0.8;">
              56px touch targets for easy interaction
            </schmancy-typography>
          </schmancy-surface>

          <schmancy-surface type="outlined" rounded="medium" style="padding: 16px;">
            <schmancy-icon name="notifications" style="font-size: 32px; margin-bottom: 12px;"></schmancy-icon>
            <schmancy-typography type="title" token="md">Badge Support</schmancy-typography>
            <schmancy-typography type="body" token="sm" style="margin-top: 8px; opacity: 0.8;">
              Show counts and status indicators
            </schmancy-typography>
          </schmancy-surface>

          <schmancy-surface type="outlined" rounded="medium" style="padding: 16px;">
            <schmancy-icon name="expand" style="font-size: 32px; margin-bottom: 12px;"></schmancy-icon>
            <schmancy-typography type="title" token="md">Expandable</schmancy-typography>
            <schmancy-typography type="body" token="sm" style="margin-top: 8px; opacity: 0.8;">
              Can expand to show full labels
            </schmancy-typography>
          </schmancy-surface>
        </div>

        <!-- Best Practices -->
        <schmancy-surface type="filled" rounded="large" style="padding: 24px; margin-top: 32px;">
          <schmancy-typography type="headline" token="sm" style="margin-bottom: 16px;">
            When to Use Navigation Rails
          </schmancy-typography>

          <schmancy-list>
            <schmancy-list-item>
              <schmancy-icon slot="start" name="tablet"></schmancy-icon>
              <span slot="headline">Tablet layouts (600-1239dp width)</span>
            </schmancy-list-item>
            <schmancy-list-item>
              <schmancy-icon slot="start" name="dashboard"></schmancy-icon>
              <span slot="headline">Apps with 3-7 primary destinations</span>
            </schmancy-list-item>
            <schmancy-list-item>
              <schmancy-icon slot="start" name="aspect_ratio"></schmancy-icon>
              <span slot="headline">When horizontal space is limited</span>
            </schmancy-list-item>
            <schmancy-list-item>
              <schmancy-icon slot="start" name="visibility"></schmancy-icon>
              <span slot="headline">When navigation should always be visible</span>
            </schmancy-list-item>
            <schmancy-list-item>
              <schmancy-icon slot="start" name="swap_horiz"></schmancy-icon>
              <span slot="headline">As an alternative to bottom navigation on tablets</span>
            </schmancy-list-item>
          </schmancy-list>
        </schmancy-surface>
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'demo-navigation-rail': NavigationRail
  }
}