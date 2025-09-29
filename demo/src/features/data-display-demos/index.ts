import { html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { $LitElement } from '@mixins/index'
import { area } from '@schmancy/area'
import '@schmancy/nav-drawer'

// Import all individual data display demo components and their classes
import { DataDisplayOverview } from './overview'
import DataDisplayTables from './tables'
import DataDisplayLists from './lists'
import DataDisplayTrees from './trees'
import { DataDisplayIndicators } from './indicators'
import { DataDisplayCards } from './cards'
import { DataDisplayExamples } from './examples'

// Main Demo Data Display Component
@customElement('demo-data-display-demos')
export default class DataDisplayDemos extends $LitElement() {
  @state() private activeDemo = 'overview'

  connectedCallback() {
    super.connectedCallback()

    // Subscribe to area changes to update active demo
    area.on('data-display').subscribe(route => {
      if (!route?.component) return

      // Map component names to demo names
      const componentToDemoMap: Record<string, string> = {
        'demo-data-display-overview': 'overview',
        'demo-data-display-tables': 'tables',
        'demo-data-display-lists': 'lists',
        'demo-data-display-trees': 'trees',
        'demo-data-display-indicators': 'indicators',
        'demo-data-display-cards': 'cards',
        'demo-data-display-examples': 'examples'
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
        <schmancy-nav-drawer-navbar width="220px">
          <schmancy-list>
            <schmancy-list-item
              .selected=${this.activeDemo === 'overview'}
              @click=${() => {
                this.activeDemo = 'overview'
                area.push({ component: DataDisplayOverview, area: 'data-display' })
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
              .selected=${this.activeDemo === 'tables'}
              @click=${() => {
                this.activeDemo = 'tables'
                area.push({ component: DataDisplayTables, area: 'data-display' })
              }}
              rounded
              variant="container"
            >
              <sch-flex flow="row" gap="2" align="center">
                <schmancy-icon size="sm">table_chart</schmancy-icon>
                <span>Tables</span>
              </sch-flex>
            </schmancy-list-item>

            <schmancy-list-item
              .selected=${this.activeDemo === 'lists'}
              @click=${() => {
                this.activeDemo = 'lists'
                area.push({ component: DataDisplayLists, area: 'data-display' })
              }}
              rounded
              variant="container"
            >
              <sch-flex flow="row" gap="2" align="center">
                <schmancy-icon size="sm">list</schmancy-icon>
                <span>Lists</span>
              </sch-flex>
            </schmancy-list-item>

            <schmancy-list-item
              .selected=${this.activeDemo === 'trees'}
              @click=${() => {
                this.activeDemo = 'trees'
                area.push({ component: DataDisplayTrees, area: 'data-display' })
              }}
              rounded
              variant="container"
            >
              <sch-flex flow="row" gap="2" align="center">
                <schmancy-icon size="sm">account_tree</schmancy-icon>
                <span>Tree Views</span>
              </sch-flex>
            </schmancy-list-item>

            <schmancy-list-item
              .selected=${this.activeDemo === 'indicators'}
              @click=${() => {
                this.activeDemo = 'indicators'
                area.push({ component: DataDisplayIndicators, area: 'data-display' })
              }}
              rounded
              variant="container"
            >
              <sch-flex flow="row" gap="2" align="center">
                <schmancy-icon size="sm">label</schmancy-icon>
                <span>Data Indicators</span>
              </sch-flex>
            </schmancy-list-item>

            <schmancy-list-item
              .selected=${this.activeDemo === 'cards'}
              @click=${() => {
                this.activeDemo = 'cards'
                area.push({ component: DataDisplayCards, area: 'data-display' })
              }}
              rounded
              variant="container"
            >
              <sch-flex flow="row" gap="2" align="center">
                <schmancy-icon size="sm">grid_view</schmancy-icon>
                <span>Cards & Grids</span>
              </sch-flex>
            </schmancy-list-item>

            <schmancy-list-item
              .selected=${this.activeDemo === 'examples'}
              @click=${() => {
                this.activeDemo = 'examples'
                area.push({ component: DataDisplayExamples, area: 'data-display' })
              }}
              rounded
              variant="container"
            >
              <sch-flex flow="row" gap="2" align="center">
                <schmancy-icon size="sm">dashboard</schmancy-icon>
                <span>Examples</span>
              </sch-flex>
            </schmancy-list-item>
          </schmancy-list>
        </schmancy-nav-drawer-navbar>
        <schmancy-nav-drawer-content class="pl-2">
          <schmancy-scroll>
            <schmancy-area name="data-display" .default=${DataDisplayOverview}>
              <schmancy-route when="overview" .component=${DataDisplayOverview}></schmancy-route>
            </schmancy-area>
          </schmancy-scroll>
        </schmancy-nav-drawer-content>
      </schmancy-nav-drawer>
    `
  }
}

// Also export as named export for backward compatibility
export { DataDisplayDemos }

declare global {
  interface HTMLElementTagNameMap {
    'demo-data-display-demos': DataDisplayDemos
  }
}