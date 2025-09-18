import { html, css } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { $LitElement } from '@mixins/index'
import '@schmancy/surface'
import '@schmancy/nav-drawer'
import '@schmancy/typography'
import '@schmancy/button'
import '@schmancy/badge'
import { animate, fadeIn, fadeOut } from '@lit-labs/motion'

@customElement('demo-navigation-mobile')
export class NavigationMobile extends $LitElement(css`
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

  .mobile-frame {
    width: 375px;
    height: 667px;
    margin: 0 auto;
    border: 8px solid var(--md-sys-color-outline);
    border-radius: 32px;
    overflow: hidden;
    position: relative;
    background: var(--md-sys-color-surface);
  }

  .mobile-header {
    height: 56px;
    background: var(--md-sys-color-surface-container);
    display: flex;
    align-items: center;
    padding: 0 16px;
    border-bottom: 1px solid var(--md-sys-color-outline-variant);
  }

  .mobile-content {
    height: calc(100% - 56px - 80px);
    overflow-y: auto;
    padding: 16px;
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
    padding: 8px 0;
    border-top: 1px solid var(--md-sys-color-outline-variant);
  }

  .nav-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 8px;
    cursor: pointer;
    transition: all 0.2s;
    position: relative;
  }

  .nav-item.active {
    color: var(--md-sys-color-primary);
  }

  .nav-item.active .nav-icon {
    background: var(--md-sys-color-secondary-container);
    color: var(--md-sys-color-on-secondary-container);
  }

  .nav-icon {
    width: 64px;
    height: 32px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
  }

  .nav-label {
    font-size: 12px;
    font-weight: 500;
  }

  .nav-badge {
    position: absolute;
    top: 4px;
    right: calc(50% - 20px);
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

  .floating-nav {
    position: absolute;
    bottom: 16px;
    left: 16px;
    right: 16px;
    background: var(--md-sys-color-primary-container);
    border-radius: 28px;
    padding: 8px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .floating-nav-item {
    width: 56px;
    height: 56px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
  }

  .floating-nav-item:hover {
    background: var(--md-sys-color-surface-container-highest);
  }

  .floating-nav-item.active {
    background: var(--md-sys-color-secondary-container);
  }

  .segmented-nav {
    display: flex;
    background: var(--md-sys-color-surface-container);
    border-radius: 100px;
    padding: 4px;
    margin: 16px;
  }

  .segment {
    flex: 1;
    padding: 12px;
    text-align: center;
    border-radius: 100px;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 14px;
    font-weight: 500;
  }

  .segment.active {
    background: var(--md-sys-color-secondary-container);
    color: var(--md-sys-color-on-secondary-container);
  }

  .demo-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 24px;
    margin-bottom: 24px;
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

  .gesture-indicator {
    position: absolute;
    bottom: 100px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--md-sys-color-inverse-surface);
    color: var(--md-sys-color-inverse-on-surface);
    padding: 8px 16px;
    border-radius: 16px;
    font-size: 12px;
    opacity: 0;
    animation: fadeInOut 3s ease-in-out;
  }

  @keyframes fadeInOut {
    0%, 100% { opacity: 0; }
    50% { opacity: 1; }
  }

  .content-card {
    background: var(--md-sys-color-surface-container);
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 16px;
  }

  .app-bar {
    height: 64px;
    background: var(--md-sys-color-surface);
    display: flex;
    align-items: center;
    padding: 0 16px;
    position: sticky;
    top: 0;
    z-index: 1;
  }

  .tab-bar {
    height: 48px;
    display: flex;
    border-bottom: 1px solid var(--md-sys-color-outline-variant);
  }

  .tab {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    position: relative;
    transition: all 0.2s;
  }

  .tab.active::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: var(--md-sys-color-primary);
  }
`) {
  @state() private bottomNavActive = 'home'
  @state() private floatingNavActive = 'home'
  @state() private segmentActive = 'posts'
  @state() private tabActive = 'recent'

  private bottomNavItems = [
    { id: 'home', icon: 'home', label: 'Home' },
    { id: 'search', icon: 'search', label: 'Search' },
    { id: 'notifications', icon: 'notifications', label: 'Alerts', badge: '3' },
    { id: 'profile', icon: 'person', label: 'Profile' }
  ]

  private floatingNavItems = [
    { id: 'home', icon: 'home' },
    { id: 'explore', icon: 'explore' },
    { id: 'add', icon: 'add' },
    { id: 'favorite', icon: 'favorite' },
    { id: 'person', icon: 'person' }
  ]

  private segments = [
    { id: 'posts', label: 'Posts' },
    { id: 'stories', label: 'Stories' },
    { id: 'reels', label: 'Reels' }
  ]

  private tabs = [
    { id: 'recent', label: 'Recent' },
    { id: 'trending', label: 'Trending' },
    { id: 'following', label: 'Following' }
  ]

  render() {
    return html`
      <div class="container" ${animate()}>
        <!-- Header -->
        <div style="margin-bottom: 32px;" ${animate({ in: fadeIn, out: fadeOut })}>
          <schmancy-typography type="display" token="sm">
            Mobile Navigation
          </schmancy-typography>
          <schmancy-typography type="body" token="lg" style="margin-top: 8px; opacity: 0.8;">
            Touch-optimized navigation patterns for mobile devices and responsive layouts.
          </schmancy-typography>
        </div>

        <!-- Bottom Navigation -->
        <div class="demo-section">
          <schmancy-typography type="headline" token="md" style="margin-bottom: 16px;">
            Bottom Navigation
          </schmancy-typography>
          <schmancy-typography type="body" token="md" style="margin-bottom: 24px; opacity: 0.8;">
            Primary navigation pattern for mobile apps with 3-5 destinations.
          </schmancy-typography>

          <div class="demo-grid">
            <schmancy-surface type="filled" rounded="large" style="padding: 24px;">
              <div class="mobile-frame">
                <div class="mobile-header">
                  <schmancy-icon-button>
                    <schmancy-icon name="menu"></schmancy-icon>
                  </schmancy-icon-button>
                  <schmancy-typography type="title" token="lg" style="margin-left: 16px;">
                    Mobile App
                  </schmancy-typography>
                </div>

                <div class="mobile-content">
                  ${this.bottomNavActive === 'home' ? html`
                    <schmancy-typography type="headline" token="sm">Welcome Back!</schmancy-typography>
                    <div class="content-card" style="margin-top: 16px;">
                      <schmancy-typography type="body" token="md">
                        Your personalized home feed
                      </schmancy-typography>
                    </div>
                    <div class="content-card">
                      <schmancy-typography type="body" token="md">
                        Recent activity and updates
                      </schmancy-typography>
                    </div>
                  ` : this.bottomNavActive === 'search' ? html`
                    <schmancy-text-field
                      type="filled"
                      label="Search"
                      leadingIcon="search"
                      style="width: 100%;">
                    </schmancy-text-field>
                    <schmancy-typography type="body" token="md" style="margin-top: 24px; text-align: center; opacity: 0.6;">
                      Start typing to search...
                    </schmancy-typography>
                  ` : this.bottomNavActive === 'notifications' ? html`
                    <schmancy-typography type="headline" token="sm">Notifications</schmancy-typography>
                    <schmancy-list style="margin-top: 16px;">
                      <schmancy-list-item>
                        <schmancy-icon slot="start" name="info"></schmancy-icon>
                        <span slot="headline">New update available</span>
                        <span slot="supporting">2 hours ago</span>
                      </schmancy-list-item>
                      <schmancy-list-item>
                        <schmancy-icon slot="start" name="person_add"></schmancy-icon>
                        <span slot="headline">New follower</span>
                        <span slot="supporting">5 hours ago</span>
                      </schmancy-list-item>
                      <schmancy-list-item>
                        <schmancy-icon slot="start" name="favorite"></schmancy-icon>
                        <span slot="headline">Your post was liked</span>
                        <span slot="supporting">Yesterday</span>
                      </schmancy-list-item>
                    </schmancy-list>
                  ` : html`
                    <div style="text-align: center; padding: 32px;">
                      <schmancy-icon name="account_circle" style="font-size: 80px; opacity: 0.3;"></schmancy-icon>
                      <schmancy-typography type="headline" token="sm" style="margin-top: 16px;">
                        John Doe
                      </schmancy-typography>
                      <schmancy-typography type="body" token="md" style="margin-top: 8px; opacity: 0.7;">
                        @johndoe
                      </schmancy-typography>
                    </div>
                  `}
                </div>

                <div class="bottom-nav">
                  ${this.bottomNavItems.map(item => html`
                    <div class="nav-item ${this.bottomNavActive === item.id ? 'active' : ''}"
                         @click=${() => this.bottomNavActive = item.id}>
                      <div class="nav-icon">
                        <schmancy-icon name=${item.icon}></schmancy-icon>
                      </div>
                      <span class="nav-label">${item.label}</span>
                      ${item.badge ? html`
                        <span class="nav-badge">${item.badge}</span>
                      ` : ''}
                    </div>
                  `)}
                </div>
              </div>
            </schmancy-surface>

            <div>
              <schmancy-surface type="outlined" rounded="medium" style="padding: 24px; margin-bottom: 16px;">
                <schmancy-typography type="title" token="md">Key Features</schmancy-typography>
                <ul style="margin-top: 16px; padding-left: 20px;">
                  <li>Fixed at bottom of screen</li>
                  <li>3-5 navigation items maximum</li>
                  <li>Icons with text labels</li>
                  <li>Badge support for notifications</li>
                  <li>Clear active state indication</li>
                </ul>
              </schmancy-surface>

              <div class="code-block">
                <pre>
&lt;schmancy-bottom-navigation
  .items=\${this.navItems}
  .activeItem=\${this.activeItem}
  @item-selected=\${this.handleNavigation}
&gt;&lt;/schmancy-bottom-navigation&gt;</pre>
              </div>
            </div>
          </div>
        </div>

        <!-- Floating Action Bar -->
        <div class="demo-section">
          <schmancy-typography type="headline" token="md" style="margin-bottom: 16px;">
            Floating Navigation Bar
          </schmancy-typography>
          <schmancy-typography type="body" token="md" style="margin-bottom: 24px; opacity: 0.8;">
            Modern floating navigation with gesture support.
          </schmancy-typography>

          <schmancy-surface type="filled" rounded="large" style="padding: 24px;">
            <div class="mobile-frame" style="margin: 0 auto;">
              <div class="mobile-content" style="height: 100%; padding-bottom: 100px;">
                <schmancy-typography type="headline" token="sm">Discover</schmancy-typography>
                <div class="content-card" style="margin-top: 16px; height: 200px;">
                  <schmancy-typography type="body" token="md">
                    Swipe up to reveal navigation
                  </schmancy-typography>
                </div>
                <div class="content-card" style="height: 150px;">
                  <schmancy-typography type="body" token="md">
                    Content scrolls behind floating bar
                  </schmancy-typography>
                </div>
                <div class="content-card" style="height: 180px;">
                  <schmancy-typography type="body" token="md">
                    More content here...
                  </schmancy-typography>
                </div>
              </div>

              <div class="floating-nav">
                ${this.floatingNavItems.map(item => html`
                  <div class="floating-nav-item ${this.floatingNavActive === item.id ? 'active' : ''}"
                       @click=${() => this.floatingNavActive = item.id}>
                    <schmancy-icon name=${item.icon}></schmancy-icon>
                  </div>
                `)}
              </div>
            </div>
          </schmancy-surface>
        </div>

        <!-- Segmented Navigation -->
        <div class="demo-section">
          <schmancy-typography type="headline" token="md" style="margin-bottom: 16px;">
            Segmented Navigation
          </schmancy-typography>
          <schmancy-typography type="body" token="md" style="margin-bottom: 24px; opacity: 0.8;">
            Toggle between different views or content types.
          </schmancy-typography>

          <schmancy-surface type="filled" rounded="large" style="padding: 24px;">
            <div class="mobile-frame" style="margin: 0 auto;">
              <div class="app-bar">
                <schmancy-icon-button>
                  <schmancy-icon name="arrow_back"></schmancy-icon>
                </schmancy-icon-button>
                <schmancy-typography type="title" token="lg" style="margin-left: 16px;">
                  Profile
                </schmancy-typography>
              </div>

              <div class="segmented-nav">
                ${this.segments.map(segment => html`
                  <div class="segment ${this.segmentActive === segment.id ? 'active' : ''}"
                       @click=${() => this.segmentActive = segment.id}>
                    ${segment.label}
                  </div>
                `)}
              </div>

              <div class="mobile-content" style="height: calc(100% - 64px - 56px);">
                ${this.segmentActive === 'posts' ? html`
                  <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 2px;">
                    ${Array(9).fill(0).map(() => html`
                      <div style="aspect-ratio: 1; background: var(--md-sys-color-surface-container); border-radius: 4px;"></div>
                    `)}
                  </div>
                ` : this.segmentActive === 'stories' ? html`
                  <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px;">
                    ${Array(4).fill(0).map(() => html`
                      <div style="aspect-ratio: 9/16; background: var(--md-sys-color-surface-container); border-radius: 8px;"></div>
                    `)}
                  </div>
                ` : html`
                  <div style="display: flex; flex-direction: column; gap: 8px;">
                    ${Array(3).fill(0).map(() => html`
                      <div style="height: 200px; background: var(--md-sys-color-surface-container); border-radius: 8px;"></div>
                    `)}
                  </div>
                `}
              </div>
            </div>
          </schmancy-surface>
        </div>

        <!-- Tab Bar Navigation -->
        <div class="demo-section">
          <schmancy-typography type="headline" token="md" style="margin-bottom: 16px;">
            Tab Bar Navigation
          </schmancy-typography>
          <schmancy-typography type="body" token="md" style="margin-bottom: 24px; opacity: 0.8;">
            Secondary navigation within a screen.
          </schmancy-typography>

          <schmancy-surface type="filled" rounded="large" style="padding: 24px;">
            <div class="mobile-frame" style="margin: 0 auto;">
              <div class="mobile-header">
                <schmancy-typography type="title" token="lg">
                  Feed
                </schmancy-typography>
              </div>

              <div class="tab-bar">
                ${this.tabs.map(tab => html`
                  <div class="tab ${this.tabActive === tab.id ? 'active' : ''}"
                       @click=${() => this.tabActive = tab.id}>
                    ${tab.label}
                  </div>
                `)}
              </div>

              <div class="mobile-content" style="height: calc(100% - 56px - 48px);">
                ${this.tabActive === 'recent' ? html`
                  <schmancy-typography type="body" token="lg">Recent posts from your network</schmancy-typography>
                ` : this.tabActive === 'trending' ? html`
                  <schmancy-typography type="body" token="lg">Trending content right now</schmancy-typography>
                ` : html`
                  <schmancy-typography type="body" token="lg">Updates from people you follow</schmancy-typography>
                `}

                <div style="margin-top: 16px;">
                  ${Array(5).fill(0).map(() => html`
                    <div class="content-card">
                      <div style="height: 8px; width: 60%; background: var(--md-sys-color-outline); opacity: 0.2; border-radius: 4px; margin-bottom: 8px;"></div>
                      <div style="height: 8px; width: 80%; background: var(--md-sys-color-outline); opacity: 0.2; border-radius: 4px;"></div>
                    </div>
                  `)}
                </div>
              </div>
            </div>
          </schmancy-surface>
        </div>

        <!-- Features -->
        <schmancy-typography type="headline" token="md" style="margin-bottom: 16px;">
          Mobile Navigation Features
        </schmancy-typography>

        <div class="feature-grid">
          <schmancy-surface type="outlined" rounded="medium" style="padding: 16px;">
            <schmancy-icon name="touch_app" style="font-size: 32px; margin-bottom: 12px;"></schmancy-icon>
            <schmancy-typography type="title" token="md">Touch Optimized</schmancy-typography>
            <schmancy-typography type="body" token="sm" style="margin-top: 8px; opacity: 0.8;">
              Large touch targets for easy interaction
            </schmancy-typography>
          </schmancy-surface>

          <schmancy-surface type="outlined" rounded="medium" style="padding: 16px;">
            <schmancy-icon name="swipe" style="font-size: 32px; margin-bottom: 12px;"></schmancy-icon>
            <schmancy-typography type="title" token="md">Gesture Support</schmancy-typography>
            <schmancy-typography type="body" token="sm" style="margin-top: 8px; opacity: 0.8;">
              Swipe gestures for natural navigation
            </schmancy-typography>
          </schmancy-surface>

          <schmancy-surface type="outlined" rounded="medium" style="padding: 16px;">
            <schmancy-icon name="speed" style="font-size: 32px; margin-bottom: 12px;"></schmancy-icon>
            <schmancy-typography type="title" token="md">Fast Access</schmancy-typography>
            <schmancy-typography type="body" token="sm" style="margin-top: 8px; opacity: 0.8;">
              One-thumb reachable navigation
            </schmancy-typography>
          </schmancy-surface>

          <schmancy-surface type="outlined" rounded="medium" style="padding: 16px;">
            <schmancy-icon name="auto_awesome" style="font-size: 32px; margin-bottom: 12px;"></schmancy-icon>
            <schmancy-typography type="title" token="md">Modern Design</schmancy-typography>
            <schmancy-typography type="body" token="sm" style="margin-top: 8px; opacity: 0.8;">
              Follows latest mobile UX patterns
            </schmancy-typography>
          </schmancy-surface>
        </div>

        <!-- Best Practices -->
        <schmancy-surface type="filled" rounded="large" style="padding: 24px; margin-top: 32px;">
          <schmancy-typography type="headline" token="sm" style="margin-bottom: 16px;">
            Mobile Navigation Best Practices
          </schmancy-typography>

          <schmancy-list>
            <schmancy-list-item>
              <schmancy-icon slot="start" name="rule"></schmancy-icon>
              <span slot="headline">Use 3-5 items in bottom navigation</span>
            </schmancy-list-item>
            <schmancy-list-item>
              <schmancy-icon slot="start" name="visibility"></schmancy-icon>
              <span slot="headline">Always show labels with icons</span>
            </schmancy-list-item>
            <schmancy-list-item>
              <schmancy-icon slot="start" name="thumb_up"></schmancy-icon>
              <span slot="headline">Place most important items first and last</span>
            </schmancy-list-item>
            <schmancy-list-item>
              <schmancy-icon slot="start" name="notifications"></schmancy-icon>
              <span slot="headline">Use badges sparingly for important updates</span>
            </schmancy-list-item>
            <schmancy-list-item>
              <schmancy-icon slot="start" name="pan_tool"></schmancy-icon>
              <span slot="headline">Ensure thumb-reachable placement</span>
            </schmancy-list-item>
          </schmancy-list>
        </schmancy-surface>
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'demo-navigation-mobile': NavigationMobile
  }
}