import { html, css } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { $LitElement } from '@mixins/index'
import '@schmancy/surface'
import '@schmancy/button'
import '@schmancy/typography'
import { animate, fadeIn, fadeOut } from '@lit-labs/motion'

@customElement('demo-navigation-overview')
export class NavigationOverview extends $LitElement(css`
  :host {
    display: block;
    padding: 24px;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
  }

  .intro-section {
    margin-bottom: 48px;
    text-align: center;
  }

  .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 24px;
    margin-bottom: 48px;
  }

  .demo-section {
    margin-bottom: 32px;
  }

  .demo-card {
    height: 300px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
  }

  .pattern-preview {
    width: 100%;
    height: 200px;
    border-radius: 8px;
    overflow: hidden;
    position: relative;
  }

  .mobile-frame {
    width: 280px;
    height: 200px;
    margin: 0 auto;
    border: 2px solid var(--md-sys-color-outline);
    border-radius: 12px;
    overflow: hidden;
    position: relative;
  }

  .desktop-frame {
    width: 100%;
    height: 200px;
    border: 1px solid var(--md-sys-color-outline);
    border-radius: 8px;
    overflow: hidden;
    display: flex;
  }

  .rail-demo {
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
    transition: background-color 0.2s;
  }

  .rail-item.active {
    background: var(--md-sys-color-secondary-container);
  }

  .drawer-demo {
    width: 240px;
    background: var(--md-sys-color-surface-container);
    padding: 16px;
  }

  .drawer-item {
    height: 48px;
    display: flex;
    align-items: center;
    padding: 0 16px;
    border-radius: 24px;
    margin-bottom: 4px;
  }

  .drawer-item.active {
    background: var(--md-sys-color-secondary-container);
  }

  .bottom-nav-demo {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 80px;
    background: var(--md-sys-color-surface-container);
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 8px;
  }

  .nav-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 8px;
    border-radius: 16px;
    transition: background-color 0.2s;
  }

  .nav-item.active {
    background: var(--md-sys-color-secondary-container);
  }

  .icon-placeholder {
    width: 24px;
    height: 24px;
    background: var(--md-sys-color-on-surface);
    opacity: 0.6;
    border-radius: 4px;
  }

  .text-placeholder {
    height: 4px;
    background: var(--md-sys-color-on-surface);
    opacity: 0.4;
    border-radius: 2px;
  }

  code {
    background: var(--md-sys-color-surface-container);
    padding: 2px 6px;
    border-radius: 4px;
    font-family: 'Roboto Mono', monospace;
    font-size: 14px;
  }

  .comparison-table {
    overflow-x: auto;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  th, td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid var(--md-sys-color-outline-variant);
  }

  th {
    background: var(--md-sys-color-surface-container);
    font-weight: 500;
  }

  .badge {
    display: inline-block;
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
  }

  .badge.desktop {
    background: var(--md-sys-color-primary-container);
    color: var(--md-sys-color-on-primary-container);
  }

  .badge.mobile {
    background: var(--md-sys-color-secondary-container);
    color: var(--md-sys-color-on-secondary-container);
  }

  .badge.both {
    background: var(--md-sys-color-tertiary-container);
    color: var(--md-sys-color-on-tertiary-container);
  }
`) {
  @state() private activeRailItem = 0
  @state() private activeDrawerItem = 0
  @state() private activeBottomItem = 0

  render() {
    return html`
      <div class="container" ${animate()}>
        <!-- Intro Section -->
        <div class="intro-section" ${animate({ in: fadeIn, out: fadeOut })}>
          <schmancy-typography type="display" token="md">
            Navigation Components
          </schmancy-typography>
          <schmancy-typography type="body" token="lg"
            style="margin-top: 16px; opacity: 0.8; max-width: 600px; margin-left: auto; margin-right: auto;">
            Comprehensive navigation patterns for building intuitive and responsive user interfaces.
            From tabs to drawers, menus to navigation rails - all following Material Design 3 guidelines.
          </schmancy-typography>
        </div>

        <!-- Key Features -->
        <div class="features-grid">
          <schmancy-surface type="filled" rounded="medium">
            <div style="padding: 24px;">
              <schmancy-icon name="responsive" style="font-size: 32px; margin-bottom: 16px;"></schmancy-icon>
              <schmancy-typography type="headline" token="sm">Responsive</schmancy-typography>
              <schmancy-typography type="body" token="md" style="margin-top: 8px; opacity: 0.8;">
                Adapts seamlessly from mobile to desktop with appropriate navigation patterns.
              </schmancy-typography>
            </div>
          </schmancy-surface>

          <schmancy-surface type="filled" rounded="medium">
            <div style="padding: 24px;">
              <schmancy-icon name="touch_app" style="font-size: 32px; margin-bottom: 16px;"></schmancy-icon>
              <schmancy-typography type="headline" token="sm">Touch Optimized</schmancy-typography>
              <schmancy-typography type="body" token="md" style="margin-top: 8px; opacity: 0.8;">
                Large touch targets and gesture support for mobile and tablet devices.
              </schmancy-typography>
            </div>
          </schmancy-surface>

          <schmancy-surface type="filled" rounded="medium">
            <div style="padding: 24px;">
              <schmancy-icon name="accessibility" style="font-size: 32px; margin-bottom: 16px;"></schmancy-icon>
              <schmancy-typography type="headline" token="sm">Accessible</schmancy-typography>
              <schmancy-typography type="body" token="md" style="margin-top: 8px; opacity: 0.8;">
                Full keyboard navigation and screen reader support built-in.
              </schmancy-typography>
            </div>
          </schmancy-surface>
        </div>

        <!-- Navigation Patterns Preview -->
        <div class="demo-section">
          <schmancy-typography type="headline" token="md" style="margin-bottom: 24px;">
            Navigation Patterns
          </schmancy-typography>

          <div class="features-grid">
            <!-- Navigation Rail Preview -->
            <schmancy-surface type="filled" rounded="large">
              <div class="demo-card">
                <schmancy-typography type="title" token="md" style="margin-bottom: 16px;">
                  Navigation Rail
                </schmancy-typography>
                <div class="desktop-frame">
                  <div class="rail-demo">
                    ${[0, 1, 2, 3].map((i) => html`
                      <div class="rail-item ${i === this.activeRailItem ? 'active' : ''}"
                           @click=${() => this.activeRailItem = i}>
                        <div class="icon-placeholder"></div>
                      </div>
                    `)}
                  </div>
                  <div style="flex: 1; padding: 24px;">
                    <div class="text-placeholder" style="width: 60%; margin-bottom: 12px;"></div>
                    <div class="text-placeholder" style="width: 80%; margin-bottom: 12px;"></div>
                    <div class="text-placeholder" style="width: 70%;"></div>
                  </div>
                </div>
                <schmancy-typography type="body" token="sm" style="margin-top: 12px; opacity: 0.7;">
                  Compact navigation for desktop
                </schmancy-typography>
              </div>
            </schmancy-surface>

            <!-- Navigation Drawer Preview -->
            <schmancy-surface type="filled" rounded="large">
              <div class="demo-card">
                <schmancy-typography type="title" token="md" style="margin-bottom: 16px;">
                  Navigation Drawer
                </schmancy-typography>
                <div class="desktop-frame">
                  <div class="drawer-demo">
                    ${[0, 1, 2, 3].map((i) => html`
                      <div class="drawer-item ${i === this.activeDrawerItem ? 'active' : ''}"
                           @click=${() => this.activeDrawerItem = i}>
                        <div class="icon-placeholder" style="margin-right: 12px;"></div>
                        <div class="text-placeholder" style="width: 80px;"></div>
                      </div>
                    `)}
                  </div>
                  <div style="flex: 1; padding: 24px;">
                    <div class="text-placeholder" style="width: 60%; margin-bottom: 12px;"></div>
                    <div class="text-placeholder" style="width: 80%; margin-bottom: 12px;"></div>
                    <div class="text-placeholder" style="width: 70%;"></div>
                  </div>
                </div>
                <schmancy-typography type="body" token="sm" style="margin-top: 12px; opacity: 0.7;">
                  Traditional sidebar navigation
                </schmancy-typography>
              </div>
            </schmancy-surface>

            <!-- Bottom Navigation Preview -->
            <schmancy-surface type="filled" rounded="large">
              <div class="demo-card">
                <schmancy-typography type="title" token="md" style="margin-bottom: 16px;">
                  Bottom Navigation
                </schmancy-typography>
                <div class="mobile-frame">
                  <div style="padding: 16px;">
                    <div class="text-placeholder" style="width: 60%; margin-bottom: 12px;"></div>
                    <div class="text-placeholder" style="width: 80%; margin-bottom: 12px;"></div>
                    <div class="text-placeholder" style="width: 70%;"></div>
                  </div>
                  <div class="bottom-nav-demo">
                    ${[0, 1, 2, 3].map((i) => html`
                      <div class="nav-item ${i === this.activeBottomItem ? 'active' : ''}"
                           @click=${() => this.activeBottomItem = i}>
                        <div class="icon-placeholder"></div>
                        <div class="text-placeholder" style="width: 40px; margin-top: 4px;"></div>
                      </div>
                    `)}
                  </div>
                </div>
                <schmancy-typography type="body" token="sm" style="margin-top: 12px; opacity: 0.7;">
                  Mobile-first navigation
                </schmancy-typography>
              </div>
            </schmancy-surface>
          </div>
        </div>

        <!-- Component Comparison -->
        <schmancy-surface type="filled" rounded="large" style="padding: 24px; margin-bottom: 32px;">
          <schmancy-typography type="headline" token="sm" style="margin-bottom: 16px;">
            When to Use Each Pattern
          </schmancy-typography>

          <div class="comparison-table">
            <table>
              <thead>
                <tr>
                  <th>Component</th>
                  <th>Best For</th>
                  <th>Platform</th>
                  <th>Items</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>schmancy-tabs</code></td>
                  <td>Content organization within a page</td>
                  <td><span class="badge both">Desktop & Mobile</span></td>
                  <td>2-5 items</td>
                </tr>
                <tr>
                  <td><code>schmancy-navigation-rail</code></td>
                  <td>Primary app navigation on tablets/desktop</td>
                  <td><span class="badge desktop">Desktop</span></td>
                  <td>3-7 items</td>
                </tr>
                <tr>
                  <td><code>schmancy-navigation-drawer</code></td>
                  <td>Complex navigation hierarchies</td>
                  <td><span class="badge both">Desktop & Mobile</span></td>
                  <td>5+ items</td>
                </tr>
                <tr>
                  <td><code>schmancy-bottom-navigation</code></td>
                  <td>Primary mobile app navigation</td>
                  <td><span class="badge mobile">Mobile</span></td>
                  <td>3-5 items</td>
                </tr>
                <tr>
                  <td><code>schmancy-menu</code></td>
                  <td>Contextual actions and overflow</td>
                  <td><span class="badge both">Desktop & Mobile</span></td>
                  <td>Any</td>
                </tr>
              </tbody>
            </table>
          </div>
        </schmancy-surface>

        <!-- Quick Start -->
        <schmancy-surface type="filled" rounded="large" style="padding: 24px;">
          <schmancy-typography type="headline" token="sm" style="margin-bottom: 16px;">
            Quick Start
          </schmancy-typography>

          <schmancy-typography type="body" token="md" style="margin-bottom: 16px;">
            Import and use navigation components in your application:
          </schmancy-typography>

          <schmancy-surface type="outlined" rounded="medium" style="padding: 16px; margin-bottom: 16px;">
            <pre style="margin: 0; font-family: 'Roboto Mono', monospace; font-size: 14px;">
import '@mhmo91/schmancy/navigation'
import '@mhmo91/schmancy/tabs'

// Create navigation items
const navItems = [
  { id: 'home', label: 'Home', icon: 'home' },
  { id: 'search', label: 'Search', icon: 'search' },
  { id: 'profile', label: 'Profile', icon: 'person' }
]

// Use in template
html\`
  &lt;schmancy-navigation-rail
    .items=\${navItems}
    @item-selected=\${this.handleNavigation}
  &gt;&lt;/schmancy-navigation-rail&gt;
\`</pre>
          </schmancy-surface>

          <schmancy-typography type="body" token="sm" style="opacity: 0.7;">
            Explore each section to see detailed examples and implementation patterns.
          </schmancy-typography>
        </schmancy-surface>
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'demo-navigation-overview': NavigationOverview
  }
}