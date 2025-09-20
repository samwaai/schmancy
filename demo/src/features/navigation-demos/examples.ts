import { html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { $LitElement } from '@mixins/index'
import '@schmancy/surface'
import '@schmancy/nav-drawer'
import '@schmancy/typography'
import '@schmancy/button'
import '@schmancy/tabs'
import '@schmancy/list'
import '@schmancy/input'
import { animate, fadeIn, fadeOut } from '@lit-labs/motion'

@customElement('demo-navigation-examples')
export class NavigationExamples extends $LitElement() {
  :host {
    display: block;
    padding: 24px;
  }

  .container {
    max-width: 1400px;
    margin: 0 auto;
  }

  .demo-section {
    margin-bottom: 48px;
  }

  .example-frame {
    border: 1px solid var(--md-sys-color-outline);
    border-radius: 12px;
    overflow: hidden;
    margin-bottom: 24px;
  }

  /* Dashboard Example Styles */
  .dashboard-layout {
    display: flex;
    height: 600px;
  }

  .dashboard-rail {
    width: 80px;
    background: var(--md-sys-color-surface-container);
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 12px 0;
    gap: 8px;
  }

  .dashboard-content {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .dashboard-header {
    height: 64px;
    background: var(--md-sys-color-surface);
    border-bottom: 1px solid var(--md-sys-color-outline-variant);
    display: flex;
    align-items: center;
    padding: 0 24px;
    gap: 16px;
  }

  .dashboard-tabs {
    height: 48px;
    border-bottom: 1px solid var(--md-sys-color-outline-variant);
  }

  .dashboard-main {
    flex: 1;
    padding: 24px;
    overflow-y: auto;
    background: var(--md-sys-color-surface);
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
  }

  .rail-item:hover {
    background: var(--md-sys-color-surface-container-highest);
  }

  .rail-item.active {
    background: var(--md-sys-color-secondary-container);
    color: var(--md-sys-color-on-secondary-container);
  }

  /* Mobile App Example */
  .mobile-app {
    width: 375px;
    height: 667px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    position: relative;
  }

  .mobile-header {
    height: 56px;
    background: var(--md-sys-color-primary);
    color: var(--md-sys-color-on-primary);
    display: flex;
    align-items: center;
    padding: 0 16px;
  }

  .mobile-body {
    flex: 1;
    overflow-y: auto;
    background: var(--md-sys-color-surface);
    padding-bottom: 80px;
  }

  .bottom-nav {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 80px;
    background: var(--md-sys-color-surface-container);
    display: flex;
    justify-content: space-around;
    align-items: center;
    border-top: 1px solid var(--md-sys-color-outline-variant);
  }

  .bottom-nav-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 8px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .bottom-nav-item.active {
    color: var(--md-sys-color-primary);
  }

  /* E-commerce Example */
  .ecommerce-layout {
    display: flex;
    height: 600px;
  }

  .sidebar {
    width: 240px;
    background: var(--md-sys-color-surface-container);
    overflow-y: auto;
    border-right: 1px solid var(--md-sys-color-outline-variant);
  }

  .sidebar-section {
    padding: 16px;
    border-bottom: 1px solid var(--md-sys-color-outline-variant);
  }

  .sidebar-title {
    font-size: 12px;
    font-weight: 500;
    text-transform: uppercase;
    opacity: 0.7;
    margin-bottom: 12px;
  }

  .filter-item {
    padding: 8px 0;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .main-area {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .breadcrumb {
    padding: 16px 24px;
    display: flex;
    align-items: center;
    gap: 8px;
    border-bottom: 1px solid var(--md-sys-color-outline-variant);
  }

  .product-grid {
    flex: 1;
    padding: 24px;
    overflow-y: auto;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 16px;
  }

  .product-card {
    aspect-ratio: 1;
    background: var(--md-sys-color-surface-container);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* Admin Panel Example */
  .admin-layout {
    display: grid;
    grid-template-columns: 256px 1fr;
    height: 600px;
  }

  .admin-nav {
    background: var(--md-sys-color-surface-container);
    overflow-y: auto;
  }

  .nav-header {
    padding: 24px;
    background: var(--md-sys-color-primary-container);
  }

  .nav-section {
    padding: 8px;
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .nav-item:hover {
    background: var(--md-sys-color-surface-container-highest);
  }

  .nav-item.active {
    background: var(--md-sys-color-secondary-container);
  }

  .admin-content {
    display: flex;
    flex-direction: column;
  }

  .admin-toolbar {
    height: 64px;
    background: var(--md-sys-color-surface);
    display: flex;
    align-items: center;
    padding: 0 24px;
    gap: 16px;
    border-bottom: 1px solid var(--md-sys-color-outline-variant);
  }

  .admin-main {
    flex: 1;
    padding: 24px;
    overflow-y: auto;
  }

  .stat-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
    margin-bottom: 24px;
  }

  .stat-card {
    background: var(--md-sys-color-surface-container);
    padding: 24px;
    border-radius: 12px;
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
`) {
  @state() private dashboardRail = 'dashboard'
  @state() private dashboardTab = 'overview'
  @state() private mobileNav = 'home'
  @state() private adminNav = 'dashboard'
  @state() private ecommerceCategory = 'all'

  render() {
    return html`
      <div class="container" ${animate()}>
        <!-- Header -->
        <div style="margin-bottom: 32px;" ${animate({ in: fadeIn, out: fadeOut })}>
          <schmancy-typography type="display" token="sm">
            Complete Navigation Examples
          </schmancy-typography>
          <schmancy-typography type="body" token="lg" style="margin-top: 8px; opacity: 0.8;">
            Real-world navigation patterns combining multiple components for different application types.
          </schmancy-typography>
        </div>

        <!-- Dashboard Example -->
        <div class="demo-section">
          <schmancy-typography type="headline" token="md" style="margin-bottom: 16px;">
            Analytics Dashboard
          </schmancy-typography>
          <schmancy-typography type="body" token="md" style="margin-bottom: 16px; opacity: 0.8;">
            Combination of navigation rail and tabs for complex data visualization apps.
          </schmancy-typography>

          <schmancy-surface type="filled" rounded="large" style="overflow: hidden;">
            <div class="example-frame">
              <div class="dashboard-layout">
                <!-- Navigation Rail -->
                <div class="dashboard-rail">
                  <schmancy-button type="icon" style="margin-bottom: 16px;">
                    <schmancy-icon>menu</schmancy-icon>
                  </schmancy-button>

                  <schmancy-button type="elevated" style="margin-bottom: 16px; border-radius: 16px; width: 56px; height: 56px;">
                    <schmancy-icon>add</schmancy-icon>
                  </schmancy-button>

                  ${['dashboard', 'analytics', 'reports', 'settings'].map(item => html`
                    <div class="rail-item ${this.dashboardRail === item ? 'active' : ''}"
                         @click=${() => this.dashboardRail = item}>
                      <schmancy-icon>${item === 'dashboard' ? 'dashboard' :
                                            item === 'analytics' ? 'analytics' :
                                            item === 'reports' ? 'assessment' : 'settings'}</schmancy-icon>
                    </div>
                  `)}
                </div>

                <!-- Main Content Area -->
                <div class="dashboard-content">
                  <!-- Header -->
                  <div class="dashboard-header">
                    <schmancy-typography type="title" token="lg">
                      ${this.dashboardRail.charAt(0).toUpperCase() + this.dashboardRail.slice(1)}
                    </schmancy-typography>
                    <schmancy-input
                      variant="outlined"
                      label="Search"
                      placeholder="Search..."
                      style="width: 300px; margin-left: auto;">
                      <schmancy-icon slot="leading">search</schmancy-icon>
                    </schmancy-input>
                    <schmancy-button type="icon">
                      <schmancy-icon>notifications</schmancy-icon>
                    </schmancy-button>
                    <schmancy-button type="icon">
                      <schmancy-icon>account_circle</schmancy-icon>
                    </schmancy-button>
                  </div>

                  <!-- Tabs -->
                  <div class="dashboard-tabs">
                    <schmancy-tabs>
                      ${['overview', 'performance', 'trends', 'insights'].map(tab => html`
                        <schmancy-tab
                          ?active=${this.dashboardTab === tab}
                          @click=${() => this.dashboardTab = tab}>
                          ${tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </schmancy-tab>
                      `)}
                    </schmancy-tabs>
                  </div>

                  <!-- Main Content -->
                  <div class="dashboard-main">
                    <div class="stat-cards">
                      <div class="stat-card">
                        <schmancy-typography type="headline" token="lg">1,234</schmancy-typography>
                        <schmancy-typography type="body" token="sm" style="opacity: 0.7;">Total Users</schmancy-typography>
                      </div>
                      <div class="stat-card">
                        <schmancy-typography type="headline" token="lg">89%</schmancy-typography>
                        <schmancy-typography type="body" token="sm" style="opacity: 0.7;">Engagement</schmancy-typography>
                      </div>
                      <div class="stat-card">
                        <schmancy-typography type="headline" token="lg">$12.5k</schmancy-typography>
                        <schmancy-typography type="body" token="sm" style="opacity: 0.7;">Revenue</schmancy-typography>
                      </div>
                      <div class="stat-card">
                        <schmancy-typography type="headline" token="lg">+24%</schmancy-typography>
                        <schmancy-typography type="body" token="sm" style="opacity: 0.7;">Growth</schmancy-typography>
                      </div>
                    </div>

                    <schmancy-surface type="outlined" rounded="medium" style="padding: 24px; height: 200px; display: flex; align-items: center; justify-content: center;">
                      <schmancy-typography type="body" token="lg" style="opacity: 0.5;">
                        Chart visualization would go here
                      </schmancy-typography>
                    </schmancy-surface>
                  </div>
                </div>
              </div>
            </div>
          </schmancy-surface>
        </div>

        <!-- Mobile App Example -->
        <div class="demo-section">
          <schmancy-typography type="headline" token="md" style="margin-bottom: 16px;">
            Mobile Social App
          </schmancy-typography>
          <schmancy-typography type="body" token="md" style="margin-bottom: 16px; opacity: 0.8;">
            Bottom navigation with contextual FAB for mobile-first applications.
          </schmancy-typography>

          <schmancy-surface type="filled" rounded="large" style="padding: 24px;">
            <div class="mobile-app">
              <!-- Header -->
              <div class="mobile-header">
                <schmancy-typography type="title" token="lg">
                  ${this.mobileNav === 'home' ? 'Feed' :
                    this.mobileNav === 'explore' ? 'Explore' :
                    this.mobileNav === 'messages' ? 'Messages' : 'Profile'}
                </schmancy-typography>
              </div>

              <!-- Content -->
              <div class="mobile-body">
                ${this.mobileNav === 'home' ? html`
                  <schmancy-list>
                    ${Array(5).fill(0).map(() => html`
                      <schmancy-list-item>
                        <schmancy-icon slot="start">account_circle</schmancy-icon>
                        <span slot="headline">User posted an update</span>
                        <span slot="supporting">2 hours ago</span>
                      </schmancy-list-item>
                    `)}
                  </schmancy-list>
                ` : this.mobileNav === 'explore' ? html`
                  <div style="padding: 16px;">
                    <schmancy-input
                      variant="filled"
                      label="Search"
                      style="width: 100%; margin-bottom: 16px;">
                      <schmancy-icon slot="leading">search</schmancy-icon>
                    </schmancy-input>
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px;">
                      ${Array(6).fill(0).map(() => html`
                        <div style="aspect-ratio: 1; background: var(--md-sys-color-surface-container); border-radius: 8px;"></div>
                      `)}
                    </div>
                  </div>
                ` : this.mobileNav === 'messages' ? html`
                  <schmancy-list>
                    ${Array(3).fill(0).map(() => html`
                      <schmancy-list-item>
                        <schmancy-icon slot="start">account_circle</schmancy-icon>
                        <span slot="headline">John Doe</span>
                        <span slot="supporting">Hey, how are you?</span>
                        <span slot="trailing">2m</span>
                      </schmancy-list-item>
                    `)}
                  </schmancy-list>
                ` : html`
                  <div style="text-align: center; padding: 32px;">
                    <schmancy-icon style="font-size: 80px; opacity: 0.3;">account_circle</schmancy-icon>
                    <schmancy-typography type="headline" token="sm" style="margin-top: 16px;">
                      Your Profile
                    </schmancy-typography>
                  </div>
                `}
              </div>

              <!-- FAB -->
              ${this.mobileNav === 'home' || this.mobileNav === 'messages' ? html`
                <schmancy-button type="elevated" style="position: absolute; bottom: 100px; right: 16px; border-radius: 16px; width: 56px; height: 56px;">
                  <schmancy-icon>${this.mobileNav === 'home' ? 'edit' : 'add'}</schmancy-icon>
                </schmancy-button>
              ` : ''}

              <!-- Bottom Navigation -->
              <div class="bottom-nav">
                ${[
                  { id: 'home', icon: 'home', label: 'Home' },
                  { id: 'explore', icon: 'explore', label: 'Explore' },
                  { id: 'messages', icon: 'message', label: 'Messages' },
                  { id: 'profile', icon: 'person', label: 'Profile' }
                ].map(item => html`
                  <div class="bottom-nav-item ${this.mobileNav === item.id ? 'active' : ''}"
                       @click=${() => this.mobileNav = item.id}>
                    <schmancy-icon>${item.icon}</schmancy-icon>
                    <span style="font-size: 12px;">${item.label}</span>
                  </div>
                `)}
              </div>
            </div>
          </schmancy-surface>
        </div>

        <!-- E-commerce Example -->
        <div class="demo-section">
          <schmancy-typography type="headline" token="md" style="margin-bottom: 16px;">
            E-commerce Catalog
          </schmancy-typography>
          <schmancy-typography type="body" token="md" style="margin-bottom: 16px; opacity: 0.8;">
            Sidebar filters with breadcrumb navigation for product browsing.
          </schmancy-typography>

          <schmancy-surface type="filled" rounded="large" style="overflow: hidden;">
            <div class="example-frame">
              <div class="ecommerce-layout">
                <!-- Sidebar Filters -->
                <div class="sidebar">
                  <div class="sidebar-section">
                    <div class="sidebar-title">Categories</div>
                    ${['All Products', 'Electronics', 'Clothing', 'Home & Garden', 'Sports'].map(cat => html`
                      <div class="filter-item">
                        <input type="radio" name="category"
                               ?checked=${cat === 'All Products'}
                               @change=${() => this.ecommerceCategory = cat}>
                        <span>${cat}</span>
                      </div>
                    `)}
                  </div>

                  <div class="sidebar-section">
                    <div class="sidebar-title">Price Range</div>
                    ${['Under $25', '$25 - $50', '$50 - $100', 'Over $100'].map(price => html`
                      <div class="filter-item">
                        <input type="checkbox">
                        <span>${price}</span>
                      </div>
                    `)}
                  </div>

                  <div class="sidebar-section">
                    <div class="sidebar-title">Brand</div>
                    ${['Brand A', 'Brand B', 'Brand C'].map(brand => html`
                      <div class="filter-item">
                        <input type="checkbox">
                        <span>${brand}</span>
                      </div>
                    `)}
                  </div>
                </div>

                <!-- Main Area -->
                <div class="main-area">
                  <!-- Breadcrumb -->
                  <div class="breadcrumb">
                    <span style="cursor: pointer; opacity: 0.7;">Home</span>
                    <schmancy-icon style="opacity: 0.5;">chevron_right</schmancy-icon>
                    <span style="cursor: pointer; opacity: 0.7;">Shop</span>
                    <schmancy-icon style="opacity: 0.5;">chevron_right</schmancy-icon>
                    <span style="font-weight: 500;">Electronics</span>
                  </div>

                  <!-- Product Grid -->
                  <div class="product-grid">
                    ${Array(12).fill(0).map(() => html`
                      <div class="product-card">
                        <schmancy-typography type="body" token="sm" style="opacity: 0.5;">
                          Product
                        </schmancy-typography>
                      </div>
                    `)}
                  </div>
                </div>
              </div>
            </div>
          </schmancy-surface>
        </div>

        <!-- Admin Panel Example -->
        <div class="demo-section">
          <schmancy-typography type="headline" token="md" style="margin-bottom: 16px;">
            Admin Dashboard
          </schmancy-typography>
          <schmancy-typography type="body" token="md" style="margin-bottom: 16px; opacity: 0.8;">
            Traditional sidebar navigation with nested menu items for admin interfaces.
          </schmancy-typography>

          <schmancy-surface type="filled" rounded="large" style="overflow: hidden;">
            <div class="example-frame">
              <div class="admin-layout">
                <!-- Sidebar Navigation -->
                <div class="admin-nav">
                  <div class="nav-header">
                    <schmancy-typography type="headline" token="sm">
                      Admin Panel
                    </schmancy-typography>
                    <schmancy-typography type="body" token="sm" style="margin-top: 4px; opacity: 0.7;">
                      v2.0.1
                    </schmancy-typography>
                  </div>

                  <div class="nav-section">
                    ${[
                      { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
                      { id: 'users', label: 'Users', icon: 'group' },
                      { id: 'products', label: 'Products', icon: 'inventory' },
                      { id: 'orders', label: 'Orders', icon: 'shopping_cart' },
                      { id: 'analytics', label: 'Analytics', icon: 'analytics' },
                      { id: 'settings', label: 'Settings', icon: 'settings' }
                    ].map(item => html`
                      <div class="nav-item ${this.adminNav === item.id ? 'active' : ''}"
                           @click=${() => this.adminNav = item.id}>
                        <schmancy-icon>${item.icon}</schmancy-icon>
                        <span>${item.label}</span>
                      </div>
                    `)}
                  </div>
                </div>

                <!-- Content Area -->
                <div class="admin-content">
                  <!-- Toolbar -->
                  <div class="admin-toolbar">
                    <schmancy-typography type="title" token="lg">
                      ${this.adminNav.charAt(0).toUpperCase() + this.adminNav.slice(1)}
                    </schmancy-typography>

                    <schmancy-button type="filled" style="margin-left: auto;">
                      <schmancy-icon slot="start">add</schmancy-icon>
                      New Item
                    </schmancy-button>
                  </div>

                  <!-- Main Content -->
                  <div class="admin-main">
                    <div class="stat-cards">
                      <div class="stat-card">
                        <schmancy-typography type="headline" token="lg">152</schmancy-typography>
                        <schmancy-typography type="body" token="sm" style="opacity: 0.7;">Total Items</schmancy-typography>
                      </div>
                      <div class="stat-card">
                        <schmancy-typography type="headline" token="lg">48</schmancy-typography>
                        <schmancy-typography type="body" token="sm" style="opacity: 0.7;">Active Today</schmancy-typography>
                      </div>
                      <div class="stat-card">
                        <schmancy-typography type="headline" token="lg">12</schmancy-typography>
                        <schmancy-typography type="body" token="sm" style="opacity: 0.7;">Pending</schmancy-typography>
                      </div>
                    </div>

                    <schmancy-surface type="outlined" rounded="medium" style="padding: 24px;">
                      <schmancy-typography type="title" token="md" style="margin-bottom: 16px;">
                        Recent Activity
                      </schmancy-typography>
                      <schmancy-list>
                        ${Array(3).fill(0).map(() => html`
                          <schmancy-list-item>
                            <schmancy-icon slot="start">info</schmancy-icon>
                            <span slot="headline">New item created</span>
                            <span slot="supporting">2 minutes ago</span>
                          </schmancy-list-item>
                        `)}
                      </schmancy-list>
                    </schmancy-surface>
                  </div>
                </div>
              </div>
            </div>
          </schmancy-surface>
        </div>

        <!-- Implementation Guide -->
        <schmancy-surface type="filled" rounded="large" style="padding: 24px;">
          <schmancy-typography type="headline" token="sm" style="margin-bottom: 16px;">
            Implementation Tips
          </schmancy-typography>

          <schmancy-list>
            <schmancy-list-item>
              <schmancy-icon slot="start">layers</schmancy-icon>
              <span slot="headline">Layer navigation components appropriately</span>
              <span slot="supporting">Use rails for primary nav, tabs for secondary</span>
            </schmancy-list-item>
            <schmancy-list-item>
              <schmancy-icon slot="start">responsive</schmancy-icon>
              <span slot="headline">Adapt navigation to screen size</span>
              <span slot="supporting">Switch between drawer, rail, and bottom nav</span>
            </schmancy-list-item>
            <schmancy-list-item>
              <schmancy-icon slot="start">visibility</schmancy-icon>
              <span slot="headline">Keep important navigation always visible</span>
              <span slot="supporting">Don't hide primary navigation behind menus</span>
            </schmancy-list-item>
            <schmancy-list-item>
              <schmancy-icon slot="start">touch_app</schmancy-icon>
              <span slot="headline">Ensure touch targets meet minimum size</span>
              <span slot="supporting">48dp minimum for mobile, 40dp for desktop</span>
            </schmancy-list-item>
          </schmancy-list>
        </schmancy-surface>
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'demo-navigation-examples': NavigationExamples
  }
}