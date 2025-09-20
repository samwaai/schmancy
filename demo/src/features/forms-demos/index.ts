import { html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { $LitElement } from '@mixins/index';
import { area } from '@schmancy/area';
import '@schmancy/nav-drawer';

// Import all individual form demo components and their classes
import { DemoFormsOverview } from './overview';
import { DemoFormsTextInputs } from './text-inputs';
import { DemoFormsSelection } from './selection';
import { DemoFormsValidation } from './validation';
import { DemoFormsExamples } from './examples';

// Main Demo Forms Component
@customElement('demo-forms-demos')
export default class DemoFormsDemos extends $LitElement(css`
  :host {
    display: block;
  }
`) {
  @state() private activeDemo = 'overview';

  connectedCallback() {
    super.connectedCallback();

    // Subscribe to area changes to update active demo
    area.on('forms').subscribe(route => {
      if (!route?.component) return;

      // Map component names to demo names
      const componentToDemoMap: Record<string, string> = {
        'demo-forms-overview': 'overview',
        'demo-forms-text-inputs': 'text-inputs',
        'demo-forms-selection': 'selection',
        'demo-forms-validation': 'validation',
        'demo-forms-examples': 'examples'
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
        <schmancy-nav-drawer-navbar width="260px">
          <schmancy-list>
            <schmancy-list-item
              .selected=${this.activeDemo === 'overview'}
              @click=${() => {
                this.activeDemo = 'overview';
                area.push({ component: DemoFormsOverview, area: 'forms' });
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
              .selected=${this.activeDemo === 'text-inputs'}
              @click=${() => {
                this.activeDemo = 'text-inputs';
                area.push({ component: DemoFormsTextInputs, area: 'forms' });
              }}
              rounded
              variant="container"
            >
              <sch-flex flow="row" gap="2" align="center">
                <schmancy-icon size="sm">text_fields</schmancy-icon>
                <span>Text Inputs</span>
              </sch-flex>
            </schmancy-list-item>

            <schmancy-list-item
              .selected=${this.activeDemo === 'selection'}
              @click=${() => {
                this.activeDemo = 'selection';
                area.push({ component: DemoFormsSelection, area: 'forms' });
              }}
              rounded
              variant="container"
            >
              <sch-flex flow="row" gap="2" align="center">
                <schmancy-icon size="sm">checklist</schmancy-icon>
                <span>Selection Controls</span>
              </sch-flex>
            </schmancy-list-item>

            <schmancy-list-item
              .selected=${this.activeDemo === 'validation'}
              @click=${() => {
                this.activeDemo = 'validation';
                area.push({ component: DemoFormsValidation, area: 'forms' });
              }}
              rounded
              variant="container"
            >
              <sch-flex flow="row" gap="2" align="center">
                <schmancy-icon size="sm">verified</schmancy-icon>
                <span>Validation</span>
              </sch-flex>
            </schmancy-list-item>

            <schmancy-list-item
              .selected=${this.activeDemo === 'examples'}
              @click=${() => {
                this.activeDemo = 'examples';
                area.push({ component: DemoFormsExamples, area: 'forms' });
              }}
              rounded
              variant="container"
            >
              <sch-flex flow="row" gap="2" align="center">
                <schmancy-icon size="sm">assignment</schmancy-icon>
                <span>Complete Examples</span>
              </sch-flex>
            </schmancy-list-item>
          </schmancy-list>
        </schmancy-nav-drawer-navbar>
        <schmancy-nav-drawer-content class="pl-2">
          <schmancy-scroll>
            <schmancy-area name="forms" .default=${DemoFormsOverview}>
              <schmancy-route when="overview" .component=${DemoFormsOverview}></schmancy-route>
            </schmancy-area>
          </schmancy-scroll>
        </schmancy-nav-drawer-content>
      </schmancy-nav-drawer>
    `;
  }
}

// Also export as named export for backward compatibility
export { DemoFormsDemos }

declare global {
  interface HTMLElementTagNameMap {
    'demo-forms-demos': DemoFormsDemos;
  }
}