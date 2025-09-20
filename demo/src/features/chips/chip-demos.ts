import { html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { $LitElement } from '@mixins/index';
import { area } from '@schmancy/area';
import '@schmancy/nav-drawer';

// Import all individual chip demo components and their classes
import { DemoChipsOverview } from './overview';
import { DemoChipsFilter } from './filter';
import { DemoChipsAssist } from './assist';
import { DemoChipsInput } from './input';
import { DemoChipsSuggestion } from './suggestion';
import { DemoChipsSelection } from './selection';
import { DemoChipsInteractive } from './interactive';
import { DemoChipsLegacy } from './legacy';

// Main Demo Chips Component
@customElement('demo-chip-demos')
export class DemoChipDemos extends $LitElement() {
  @state() private activeDemo = 'overview';

  connectedCallback() {
    super.connectedCallback();

    // Subscribe to area changes to update active demo
    area.on('chips').subscribe(route => {
      if (!route?.component) return;

      // Map component names to demo names
      const componentToDemoMap: Record<string, string> = {
        'demo-chips-overview': 'overview',
        'demo-chips-filter': 'filter',
        'demo-chips-assist': 'assist',
        'demo-chips-input': 'input',
        'demo-chips-suggestion': 'suggestion',
        'demo-chips-selection': 'selection',
        'demo-chips-interactive': 'interactive',
        'demo-chips-legacy': 'legacy'
      };

      const demoName = componentToDemoMap[route.component];
      if (demoName) {
        this.activeDemo = demoName;
      }
    });
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
                area.push({ component: DemoChipsOverview, area: 'chips' });
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
              .selected=${this.activeDemo === 'filter'}
              @click=${() => {
                this.activeDemo = 'filter';
                area.push({ component: DemoChipsFilter, area: 'chips' });
              }}
              rounded
              variant="container"
            >
              <sch-flex flow="row" gap="2" align="center">
                <schmancy-icon size="sm">filter_list</schmancy-icon>
                <span>Filter Chips</span>
              </sch-flex>
            </schmancy-list-item>

            <schmancy-list-item
              .selected=${this.activeDemo === 'assist'}
              @click=${() => {
                this.activeDemo = 'assist';
                area.push({ component: DemoChipsAssist, area: 'chips' });
              }}
              rounded
              variant="container"
            >
              <sch-flex flow="row" gap="2" align="center">
                <schmancy-icon size="sm">assistant</schmancy-icon>
                <span>Assist Chips</span>
              </sch-flex>
            </schmancy-list-item>

            <schmancy-list-item
              .selected=${this.activeDemo === 'input'}
              @click=${() => {
                this.activeDemo = 'input';
                area.push({ component: DemoChipsInput, area: 'chips' });
              }}
              rounded
              variant="container"
            >
              <sch-flex flow="row" gap="2" align="center">
                <schmancy-icon size="sm">input</schmancy-icon>
                <span>Input Chips</span>
              </sch-flex>
            </schmancy-list-item>

            <schmancy-list-item
              .selected=${this.activeDemo === 'suggestion'}
              @click=${() => {
                this.activeDemo = 'suggestion';
                area.push({ component: DemoChipsSuggestion, area: 'chips' });
              }}
              rounded
              variant="container"
            >
              <sch-flex flow="row" gap="2" align="center">
                <schmancy-icon size="sm">lightbulb</schmancy-icon>
                <span>Suggestion Chips</span>
              </sch-flex>
            </schmancy-list-item>

            <schmancy-list-item
              .selected=${this.activeDemo === 'selection'}
              @click=${() => {
                this.activeDemo = 'selection';
                area.push({ component: DemoChipsSelection, area: 'chips' });
              }}
              rounded
              variant="container"
            >
              <sch-flex flow="row" gap="2" align="center">
                <schmancy-icon size="sm">checklist</schmancy-icon>
                <span>Selection</span>
              </sch-flex>
            </schmancy-list-item>

            <schmancy-list-item
              .selected=${this.activeDemo === 'interactive'}
              @click=${() => {
                this.activeDemo = 'interactive';
                area.push({ component: DemoChipsInteractive, area: 'chips' });
              }}
              rounded
              variant="container"
            >
              <sch-flex flow="row" gap="2" align="center">
                <schmancy-icon size="sm">touch_app</schmancy-icon>
                <span>Interactive</span>
              </sch-flex>
            </schmancy-list-item>

            <schmancy-list-item
              .selected=${this.activeDemo === 'legacy'}
              @click=${() => {
                this.activeDemo = 'legacy';
                area.push({ component: DemoChipsLegacy, area: 'chips' });
              }}
              rounded
              variant="container"
            >
              <sch-flex flow="row" gap="2" align="center">
                <schmancy-icon size="sm">history</schmancy-icon>
                <span>Legacy</span>
              </sch-flex>
            </schmancy-list-item>
          </schmancy-list>
        </schmancy-nav-drawer-navbar>
        <schmancy-nav-drawer-content class="pl-2">
          <schmancy-scroll>
            <schmancy-area name="chips" .default=${DemoChipsOverview}>
              <schmancy-route when="overview" .component=${DemoChipsOverview}></schmancy-route>
            </schmancy-area>
          </schmancy-scroll>
        </schmancy-nav-drawer-content>
      </schmancy-nav-drawer>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'demo-chip-demos': DemoChipDemos;
  }
}