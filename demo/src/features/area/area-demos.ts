import { html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { $LitElement } from '@mixins/index';
import { area } from '@schmancy/area';
import '@schmancy/nav-drawer';

// Import all individual area demo components and their classes
import { DemoArea } from './overview';
import { DemoAreaBasic } from './basic';
import { DemoAreaParams } from './params';
import { DemoAreaState } from './state';
import { DemoAreaDefault } from './default';
import { DemoAreaHistory } from './history';
import { DemoAreaMulti } from './multi';
import { DemoAreaRouting } from './routing';

// Main Demo Area Component
@customElement('demo-area-demos')
export class DemoAreaDemos extends $LitElement(css`
  :host {
    display: block;
  }
`) {
  @state() private activeDemo = 'overview';

  connectedCallback() {
    super.connectedCallback();

    // Subscribe to area changes to update active demo
    area.on('area').subscribe(route => {
      if (!route?.component) return;

      // Map component names to demo names
      const componentToDemoMap: Record<string, string> = {
        'demo-area': 'overview',
        'demo-area-basic': 'basic',
        'demo-area-params': 'params',
        'demo-area-state': 'state',
        'demo-area-default': 'default',
        'demo-area-history': 'history',
        'demo-area-multi': 'multi',
        'demo-area-routing': 'routing'
      };

      const demoName = componentToDemoMap[route.component];
      if (demoName) {
        this.activeDemo = demoName;
      }
    });

    // Push default component only if area is empty on initial load
    if (!area.current.get('area')?.component) {
      area.push({
        area: 'area',
        component: DemoArea
      });
    }
  }

  render() {
    return html`
      <schmancy-nav-drawer>
        <schmancy-nav-drawer-navbar width="220px">
          <schmancy-list>
            <schmancy-list-item
              .selected=${this.activeDemo === 'overview'}
              @click=${() => {
                this.activeDemo = 'overview';
                area.push({ component: DemoArea, area: 'area' });
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
              .selected=${this.activeDemo === 'basic'}
              @click=${() => {
                this.activeDemo = 'basic';
                area.push({ component: DemoAreaBasic, area: 'area' });
              }}
              rounded
              variant="container"
            >
              <sch-flex flow="row" gap="2" align="center">
                <schmancy-icon size="sm">navigation</schmancy-icon>
                <span>Basic</span>
              </sch-flex>
            </schmancy-list-item>

            <schmancy-list-item
              .selected=${this.activeDemo === 'params'}
              @click=${() => {
                this.activeDemo = 'params';
                area.push({ component: DemoAreaParams, area: 'area' });
              }}
              rounded
              variant="container"
            >
              <sch-flex flow="row" gap="2" align="center">
                <schmancy-icon size="sm">tag</schmancy-icon>
                <span>Params</span>
              </sch-flex>
            </schmancy-list-item>

            <schmancy-list-item
              .selected=${this.activeDemo === 'state'}
              @click=${() => {
                this.activeDemo = 'state';
                area.push({ component: DemoAreaState, area: 'area' });
              }}
              rounded
              variant="container"
            >
              <sch-flex flow="row" gap="2" align="center">
                <schmancy-icon size="sm">storage</schmancy-icon>
                <span>State</span>
              </sch-flex>
            </schmancy-list-item>

            <schmancy-list-item
              .selected=${this.activeDemo === 'default'}
              @click=${() => {
                this.activeDemo = 'default';
                area.push({ component: DemoAreaDefault, area: 'area' });
              }}
              rounded
              variant="container"
            >
              <sch-flex flow="row" gap="2" align="center">
                <schmancy-icon size="sm">home</schmancy-icon>
                <span>Default</span>
              </sch-flex>
            </schmancy-list-item>

            <schmancy-list-item
              .selected=${this.activeDemo === 'history'}
              @click=${() => {
                this.activeDemo = 'history';
                area.push({ component: DemoAreaHistory, area: 'area' });
              }}
              rounded
              variant="container"
            >
              <sch-flex flow="row" gap="2" align="center">
                <schmancy-icon size="sm">history</schmancy-icon>
                <span>History</span>
              </sch-flex>
            </schmancy-list-item>

            <schmancy-list-item
              .selected=${this.activeDemo === 'multi'}
              @click=${() => {
                this.activeDemo = 'multi';
                area.push({ component: DemoAreaMulti, area: 'area' });
              }}
              rounded
              variant="container"
            >
              <sch-flex flow="row" gap="2" align="center">
                <schmancy-icon size="sm">view_module</schmancy-icon>
                <span>Multi</span>
              </sch-flex>
            </schmancy-list-item>

            <schmancy-list-item
              .selected=${this.activeDemo === 'routing'}
              @click=${() => {
                this.activeDemo = 'routing';
                area.push({ component: DemoAreaRouting, area: 'area' });
              }}
              rounded
              variant="container"
            >
              <sch-flex flow="row" gap="2" align="center">
                <schmancy-icon size="sm">route</schmancy-icon>
                <span>Routing</span>
              </sch-flex>
            </schmancy-list-item>
          </schmancy-list>
        </schmancy-nav-drawer-navbar>
        <schmancy-nav-drawer-content class="pl-2">
          <schmancy-scroll>
            <schmancy-area name="area">
              <schmancy-route when="basic" .component=${DemoAreaBasic}></schmancy-route>
            </schmancy-area>
          </schmancy-scroll>
        </schmancy-nav-drawer-content>
      </schmancy-nav-drawer>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'demo-area-demos': DemoAreaDemos;
  }
}