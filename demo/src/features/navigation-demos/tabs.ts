import { html, css } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { $LitElement } from '@mixins/index'
import '@schmancy/surface'
import '@schmancy/tabs'
import '@schmancy/typography'
import '@schmancy/button'
import { animate, fadeIn, fadeOut } from '@lit-labs/motion'

@customElement('demo-navigation-tabs')
export class NavigationTabs extends $LitElement(css`
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

  .demo-header {
    margin-bottom: 24px;
  }

  .tabs-demo {
    margin-bottom: 24px;
  }

  .tab-content {
    padding: 24px;
    min-height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .code-block {
    background: var(--md-sys-color-surface-container);
    border-radius: 8px;
    padding: 16px;
    overflow-x: auto;
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

  .feature-card {
    padding: 16px;
  }

  .icon-tabs {
    display: flex;
    gap: 12px;
    margin-bottom: 24px;
  }

  .icon-tab {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 12px;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s;
    border: 2px solid transparent;
  }

  .icon-tab:hover {
    background: var(--md-sys-color-surface-container);
  }

  .icon-tab.active {
    background: var(--md-sys-color-secondary-container);
    border-color: var(--md-sys-color-secondary);
  }

  .scrollable-tabs {
    overflow-x: auto;
    scrollbar-width: thin;
  }

  .scrollable-tabs::-webkit-scrollbar {
    height: 4px;
  }

  .scrollable-tabs::-webkit-scrollbar-track {
    background: var(--md-sys-color-surface-container);
  }

  .scrollable-tabs::-webkit-scrollbar-thumb {
    background: var(--md-sys-color-outline);
    border-radius: 2px;
  }

  .content-card {
    padding: 24px;
    min-height: 300px;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 16px;
    margin-top: 24px;
  }

  .stat-card {
    text-align: center;
    padding: 16px;
    border-radius: 12px;
    background: var(--md-sys-color-surface-container);
  }

  .stat-value {
    font-size: 32px;
    font-weight: 500;
    margin-bottom: 8px;
  }

  .badge {
    display: inline-block;
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 12px;
    background: var(--md-sys-color-error);
    color: var(--md-sys-color-on-error);
    margin-left: 8px;
  }
`) {
  @state() private basicTab = 'tab1'
  @state() private iconTab = 'overview'
  @state() private scrollableTab = 'item1'
  @state() private secondaryTab = 'recent'
  @state() private verticalTab = 'profile'

  private basicTabs = [
    { id: 'tab1', label: 'First Tab' },
    { id: 'tab2', label: 'Second Tab' },
    { id: 'tab3', label: 'Third Tab' }
  ]

  private iconTabs = [
    { id: 'overview', label: 'Overview', icon: 'dashboard' },
    { id: 'analytics', label: 'Analytics', icon: 'analytics' },
    { id: 'reports', label: 'Reports', icon: 'assessment' },
    { id: 'settings', label: 'Settings', icon: 'settings' }
  ]

  private scrollableTabs = Array.from({ length: 10 }, (_, i) => ({
    id: `item${i + 1}`,
    label: `Tab Item ${i + 1}`
  }))

  private secondaryTabs = [
    { id: 'recent', label: 'Recent', badge: '3' },
    { id: 'popular', label: 'Popular' },
    { id: 'trending', label: 'Trending', badge: 'New' }
  ]

  render() {
    return html`
      <div class="container" ${animate()}>
        <!-- Header -->
        <div class="demo-header" ${animate({ in: fadeIn, out: fadeOut })}>
          <schmancy-typography type="display" token="sm">
            Tab Components
          </schmancy-typography>
          <schmancy-typography type="body" token="lg" style="margin-top: 8px; opacity: 0.8;">
            Organize content and navigation with Material Design 3 tabs.
          </schmancy-typography>
        </div>

        <!-- Basic Tabs -->
        <div class="demo-section">
          <schmancy-typography type="headline" token="md" style="margin-bottom: 16px;">
            Basic Tabs
          </schmancy-typography>

          <schmancy-surface type="filled" rounded="large">
            <schmancy-tabs>
              ${this.basicTabs.map(tab => html`
                <schmancy-tab
                  ?active=${this.basicTab === tab.id}
                  @click=${() => this.basicTab = tab.id}>
                  ${tab.label}
                </schmancy-tab>
              `)}
            </schmancy-tabs>

            <div class="tab-content">
              ${this.basicTab === 'tab1' ? html`
                <schmancy-typography type="body" token="lg">
                  Content for the first tab
                </schmancy-typography>
              ` : this.basicTab === 'tab2' ? html`
                <schmancy-typography type="body" token="lg">
                  Content for the second tab
                </schmancy-typography>
              ` : html`
                <schmancy-typography type="body" token="lg">
                  Content for the third tab
                </schmancy-typography>
              `}
            </div>
          </schmancy-surface>

          <div class="code-block" style="margin-top: 16px;">
            <pre>
&lt;schmancy-tabs&gt;
  &lt;schmancy-tab ?active=\${this.activeTab === 'tab1'}
               @click=\${() => this.activeTab = 'tab1'}&gt;
    First Tab
  &lt;/schmancy-tab&gt;
  &lt;schmancy-tab ?active=\${this.activeTab === 'tab2'}
               @click=\${() => this.activeTab = 'tab2'}&gt;
    Second Tab
  &lt;/schmancy-tab&gt;
&lt;/schmancy-tabs&gt;</pre>
          </div>
        </div>

        <!-- Icon Tabs -->
        <div class="demo-section">
          <schmancy-typography type="headline" token="md" style="margin-bottom: 16px;">
            Tabs with Icons
          </schmancy-typography>

          <schmancy-surface type="filled" rounded="large">
            <schmancy-tabs>
              ${this.iconTabs.map(tab => html`
                <schmancy-tab
                  ?active=${this.iconTab === tab.id}
                  @click=${() => this.iconTab = tab.id}>
                  <schmancy-icon name=${tab.icon} style="margin-right: 8px;"></schmancy-icon>
                  ${tab.label}
                </schmancy-tab>
              `)}
            </schmancy-tabs>

            <div class="content-card">
              ${this.iconTab === 'overview' ? html`
                <schmancy-typography type="headline" token="sm">Dashboard Overview</schmancy-typography>
                <div class="stats-grid">
                  <div class="stat-card">
                    <div class="stat-value">1,234</div>
                    <schmancy-typography type="body" token="sm">Total Users</schmancy-typography>
                  </div>
                  <div class="stat-card">
                    <div class="stat-value">567</div>
                    <schmancy-typography type="body" token="sm">Active Now</schmancy-typography>
                  </div>
                  <div class="stat-card">
                    <div class="stat-value">89%</div>
                    <schmancy-typography type="body" token="sm">Engagement</schmancy-typography>
                  </div>
                </div>
              ` : this.iconTab === 'analytics' ? html`
                <schmancy-typography type="headline" token="sm">Analytics Dashboard</schmancy-typography>
                <schmancy-typography type="body" token="md" style="margin-top: 16px;">
                  View detailed analytics and performance metrics for your application.
                </schmancy-typography>
              ` : this.iconTab === 'reports' ? html`
                <schmancy-typography type="headline" token="sm">Reports Section</schmancy-typography>
                <schmancy-typography type="body" token="md" style="margin-top: 16px;">
                  Generate and download comprehensive reports.
                </schmancy-typography>
              ` : html`
                <schmancy-typography type="headline" token="sm">Settings</schmancy-typography>
                <schmancy-typography type="body" token="md" style="margin-top: 16px;">
                  Configure your application preferences.
                </schmancy-typography>
              `}
            </div>
          </schmancy-surface>
        </div>

        <!-- Scrollable Tabs -->
        <div class="demo-section">
          <schmancy-typography type="headline" token="md" style="margin-bottom: 16px;">
            Scrollable Tabs
          </schmancy-typography>
          <schmancy-typography type="body" token="md" style="margin-bottom: 16px; opacity: 0.8;">
            For many navigation items, tabs automatically become scrollable.
          </schmancy-typography>

          <schmancy-surface type="filled" rounded="large">
            <div class="scrollable-tabs">
              <schmancy-tabs style="min-width: max-content;">
                ${this.scrollableTabs.map(tab => html`
                  <schmancy-tab
                    ?active=${this.scrollableTab === tab.id}
                    @click=${() => this.scrollableTab = tab.id}>
                    ${tab.label}
                  </schmancy-tab>
                `)}
              </schmancy-tabs>
            </div>

            <div class="tab-content">
              <schmancy-typography type="body" token="lg">
                Selected: ${this.scrollableTab}
              </schmancy-typography>
            </div>
          </schmancy-surface>
        </div>

        <!-- Secondary Tabs -->
        <div class="demo-section">
          <schmancy-typography type="headline" token="md" style="margin-bottom: 16px;">
            Secondary Tabs with Badges
          </schmancy-typography>

          <schmancy-surface type="filled" rounded="large">
            <schmancy-tabs variant="secondary">
              ${this.secondaryTabs.map(tab => html`
                <schmancy-tab
                  ?active=${this.secondaryTab === tab.id}
                  @click=${() => this.secondaryTab = tab.id}>
                  ${tab.label}
                  ${tab.badge ? html`<span class="badge">${tab.badge}</span>` : ''}
                </schmancy-tab>
              `)}
            </schmancy-tabs>

            <div class="tab-content">
              ${this.secondaryTab === 'recent' ? html`
                <div>
                  <schmancy-typography type="headline" token="sm">Recent Items</schmancy-typography>
                  <schmancy-typography type="body" token="md" style="margin-top: 8px;">
                    You have 3 new items to review
                  </schmancy-typography>
                </div>
              ` : this.secondaryTab === 'popular' ? html`
                <schmancy-typography type="headline" token="sm">Popular Content</schmancy-typography>
              ` : html`
                <div>
                  <schmancy-typography type="headline" token="sm">Trending Now</schmancy-typography>
                  <schmancy-chip type="assist" style="margin-top: 12px;">
                    <schmancy-icon slot="icon" name="trending_up"></schmancy-icon>
                    New Feature
                  </schmancy-chip>
                </div>
              `}
            </div>
          </schmancy-surface>
        </div>

        <!-- Tab Features -->
        <schmancy-typography type="headline" token="md" style="margin-bottom: 16px;">
          Tab Features
        </schmancy-typography>

        <div class="feature-grid">
          <schmancy-surface type="outlined" rounded="medium" class="feature-card">
            <schmancy-icon name="swipe" style="font-size: 32px; margin-bottom: 12px;"></schmancy-icon>
            <schmancy-typography type="title" token="md">Swipeable</schmancy-typography>
            <schmancy-typography type="body" token="sm" style="margin-top: 8px; opacity: 0.8;">
              Support for touch gestures on mobile devices
            </schmancy-typography>
          </schmancy-surface>

          <schmancy-surface type="outlined" rounded="medium" class="feature-card">
            <schmancy-icon name="animation" style="font-size: 32px; margin-bottom: 12px;"></schmancy-icon>
            <schmancy-typography type="title" token="md">Animated</schmancy-typography>
            <schmancy-typography type="body" token="sm" style="margin-top: 8px; opacity: 0.8;">
              Smooth transitions between tab selections
            </schmancy-typography>
          </schmancy-surface>

          <schmancy-surface type="outlined" rounded="medium" class="feature-card">
            <schmancy-icon name="keyboard" style="font-size: 32px; margin-bottom: 12px;"></schmancy-icon>
            <schmancy-typography type="title" token="md">Keyboard Nav</schmancy-typography>
            <schmancy-typography type="body" token="sm" style="margin-top: 8px; opacity: 0.8;">
              Full keyboard navigation with arrow keys
            </schmancy-typography>
          </schmancy-surface>

          <schmancy-surface type="outlined" rounded="medium" class="feature-card">
            <schmancy-icon name="responsive" style="font-size: 32px; margin-bottom: 12px;"></schmancy-icon>
            <schmancy-typography type="title" token="md">Responsive</schmancy-typography>
            <schmancy-typography type="body" token="sm" style="margin-top: 8px; opacity: 0.8;">
              Adapts to different screen sizes automatically
            </schmancy-typography>
          </schmancy-surface>
        </div>

        <!-- Best Practices -->
        <schmancy-surface type="filled" rounded="large" style="padding: 24px;">
          <schmancy-typography type="headline" token="sm" style="margin-bottom: 16px;">
            Best Practices
          </schmancy-typography>

          <schmancy-list>
            <schmancy-list-item>
              <schmancy-icon slot="start" name="check_circle"></schmancy-icon>
              <span slot="headline">Use 2-5 tabs for optimal usability</span>
            </schmancy-list-item>
            <schmancy-list-item>
              <schmancy-icon slot="start" name="check_circle"></schmancy-icon>
              <span slot="headline">Keep tab labels short and descriptive</span>
            </schmancy-list-item>
            <schmancy-list-item>
              <schmancy-icon slot="start" name="check_circle"></schmancy-icon>
              <span slot="headline">Use icons to enhance recognition</span>
            </schmancy-list-item>
            <schmancy-list-item>
              <schmancy-icon slot="start" name="check_circle"></schmancy-icon>
              <span slot="headline">Provide visual feedback for active state</span>
            </schmancy-list-item>
            <schmancy-list-item>
              <schmancy-icon slot="start" name="check_circle"></schmancy-icon>
              <span slot="headline">Consider scrollable tabs for many items</span>
            </schmancy-list-item>
          </schmancy-list>
        </schmancy-surface>
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'demo-navigation-tabs': NavigationTabs
  }
}