import { html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { $LitElement } from '@mixins/index'
import { area } from '@schmancy/area'
import '@schmancy/nav-drawer'

// Import all individual navigation demo components and their classes
import { NavigationOverview } from './overview'
import NavigationTabs from './tabs'
import NavigationDrawer from './drawer'
import NavigationRail from './rail'
import { NavigationMobile } from './mobile'
import NavigationBar from './navigation-bar'
import NavigationMenu from './menu'
import { NavigationExamples } from './examples'

// Main Demo Navigation Component
@customElement('demo-navigation-demos')
export default class NavigationDemos extends $LitElement() {
  @state() private activeDemo = 'overview'

  connectedCallback() {
    super.connectedCallback()

    // Subscribe to area changes to update active demo
    area.on('navigation').subscribe(route => {
      if (!route?.component) return

      // Map component names to demo names
      const componentToDemoMap: Record<string, string> = {
        'demo-navigation-overview': 'overview',
        'demo-navigation-tabs': 'tabs',
        'demo-navigation-drawer': 'drawer',
        'demo-navigation-rail': 'rail',
        'demo-navigation-mobile': 'mobile',
        'demo-navigation-bar': 'navigation-bar',
        'demo-navigation-menu': 'menu',
        'demo-navigation-examples': 'examples'
      }

      const demoName = componentToDemoMap[route.component]
      if (demoName) {
        this.activeDemo = demoName
      }
    })
  }

  render() {
    return html`
      <schmancy-nav-drawer>
        <schmancy-nav-drawer-navbar width="260px">
          <schmancy-list>
            <schmancy-list-item
              .selected=${this.activeDemo === 'overview'}
              @click=${() => {
                this.activeDemo = 'overview'
                area.push({ component: NavigationOverview, area: 'navigation' })
              }}
              rounded
              variant="container"
            >
              <sch-flex flow="row" gap="2" align="center">
                <schmancy-icon size="sm">dashboard</schmancy-icon>
                <span>Overview</span>
              </sch-flex>
            </schmancy-list-item>

            <schmancy-list-item
              .selected=${this.activeDemo === 'tabs'}
              @click=${() => {
                this.activeDemo = 'tabs'
                area.push({ component: NavigationTabs, area: 'navigation' })
              }}
              rounded
              variant="container"
            >
              <sch-flex flow="row" gap="2" align="center">
                <schmancy-icon size="sm">tab</schmancy-icon>
                <span>Tabs</span>
              </sch-flex>
            </schmancy-list-item>

            <schmancy-list-item
              .selected=${this.activeDemo === 'drawer'}
              @click=${() => {
                this.activeDemo = 'drawer'
                area.push({ component: NavigationDrawer, area: 'navigation' })
              }}
              rounded
              variant="container"
            >
              <sch-flex flow="row" gap="2" align="center">
                <schmancy-icon size="sm">menu</schmancy-icon>
                <span>Navigation Drawer</span>
              </sch-flex>
            </schmancy-list-item>

            <schmancy-list-item
              .selected=${this.activeDemo === 'rail'}
              @click=${() => {
                this.activeDemo = 'rail'
                area.push({ component: NavigationRail, area: 'navigation' })
              }}
              rounded
              variant="container"
            >
              <sch-flex flow="row" gap="2" align="center">
                <schmancy-icon size="sm">view_sidebar</schmancy-icon>
                <span>Navigation Rail</span>
              </sch-flex>
            </schmancy-list-item>

            <schmancy-list-item
              .selected=${this.activeDemo === 'mobile'}
              @click=${() => {
                this.activeDemo = 'mobile'
                area.push({ component: NavigationMobile, area: 'navigation' })
              }}
              rounded
              variant="container"
            >
              <sch-flex flow="row" gap="2" align="center">
                <schmancy-icon size="sm">phone_android</schmancy-icon>
                <span>Mobile Navigation</span>
              </sch-flex>
            </schmancy-list-item>

            <schmancy-list-item
              .selected=${this.activeDemo === 'navigation-bar'}
              @click=${() => {
                this.activeDemo = 'navigation-bar'
                area.push({ component: NavigationBar, area: 'navigation' })
              }}
              rounded
              variant="container"
            >
              <sch-flex flow="row" gap="2" align="center">
                <schmancy-icon size="sm">dock_to_bottom</schmancy-icon>
                <span>Navigation Bar</span>
              </sch-flex>
            </schmancy-list-item>

            <schmancy-list-item
              .selected=${this.activeDemo === 'menu'}
              @click=${() => {
                this.activeDemo = 'menu'
                area.push({ component: NavigationMenu, area: 'navigation' })
              }}
              rounded
              variant="container"
            >
              <sch-flex flow="row" gap="2" align="center">
                <schmancy-icon size="sm">more_vert</schmancy-icon>
                <span>Menus</span>
              </sch-flex>
            </schmancy-list-item>

            <schmancy-list-item
              .selected=${this.activeDemo === 'examples'}
              @click=${() => {
                this.activeDemo = 'examples'
                area.push({ component: NavigationExamples, area: 'navigation' })
              }}
              rounded
              variant="container"
            >
              <sch-flex flow="row" gap="2" align="center">
                <schmancy-icon size="sm">dashboard</schmancy-icon>
                <span>Complete Examples</span>
              </sch-flex>
            </schmancy-list-item>
          </schmancy-list>
        </schmancy-nav-drawer-navbar>
        <schmancy-nav-drawer-content class="pl-2">
          <schmancy-scroll>
            <schmancy-area name="navigation" .default=${NavigationOverview}>
              <schmancy-route when="overview" .component=${NavigationOverview}></schmancy-route>
              <schmancy-route when="tabs" .component=${NavigationTabs}></schmancy-route>
              <schmancy-route when="drawer" .component=${NavigationDrawer}></schmancy-route>
              <schmancy-route when="rail" .component=${NavigationRail}></schmancy-route>
              <schmancy-route when="mobile" .component=${NavigationMobile}></schmancy-route>
              <schmancy-route when="navigation-bar" .component=${NavigationBar}></schmancy-route>
              <schmancy-route when="menu" .component=${NavigationMenu}></schmancy-route>
              <schmancy-route when="examples" .component=${NavigationExamples}></schmancy-route>
            </schmancy-area>
          </schmancy-scroll>
        </schmancy-nav-drawer-content>
      </schmancy-nav-drawer>
    `
  }
}

// Also export as named export for backward compatibility
export { NavigationDemos }

declare global {
  interface HTMLElementTagNameMap {
    'demo-navigation-demos': NavigationDemos
  }
}