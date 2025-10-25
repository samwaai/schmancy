import { html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { $LitElement } from '@mhmo91/schmancy/mixins';
import { area } from '@mhmo91/schmancy/area';

// Import dialog demo components
import './dialog-showcase';
import './dialog-confirm';
import './sheet';
import './menu';

@customElement('demo-overlays-demos')
export default class DemoOverlaysDemos extends $LitElement() {
  @state() private activeDemo = 'dialog-showcase';

  connectedCallback() {
    super.connectedCallback();

    // Subscribe to area changes to update active demo
    area.on('overlays').subscribe(route => {
      if (!route?.component) return;

      // Map component names to demo names
      const componentToDemoMap: Record<string, string> = {
        'overlays-dialog-showcase': 'dialog-showcase',
        'overlays-dialog-confirm': 'dialog-confirm',
        'overlays-sheet': 'sheet',
        'demo-menu': 'menu'
      };

      const demoName = componentToDemoMap[route.component];
      if (demoName) {
        this.activeDemo = demoName;
      }
    });
  }

  private navigate(demo: string, component: any) {
    this.activeDemo = demo;
    area.push({ component, area: 'overlays' });
  }

  render() {
    return html`
      <schmancy-nav-drawer>
        <schmancy-nav-drawer-navbar width="260px">
          <div class="p-4">
            <schmancy-typography type="title" token="lg" class="mb-4">
              Overlays & Dialogs
            </schmancy-typography>

            <schmancy-list>
              <schmancy-list-item
                .selected=${this.activeDemo === 'dialog-showcase'}
                @click=${() => this.navigate('dialog-showcase', 'overlays-dialog-showcase')}
                rounded
                variant="container"
                class="mb-2"
              >
                <sch-flex flow="row" gap="2" align="center">
                  <schmancy-icon size="sm">picture_in_picture</schmancy-icon>
                  <span>Dialog Showcase</span>
                </sch-flex>
              </schmancy-list-item>

              <schmancy-list-item
                .selected=${this.activeDemo === 'dialog-confirm'}
                @click=${() => this.navigate('dialog-confirm', 'overlays-dialog-confirm')}
                rounded
                variant="container"
                class="mb-2"
              >
                <sch-flex flow="row" gap="2" align="center">
                  <schmancy-icon size="sm">check_circle</schmancy-icon>
                  <span>Confirm Dialog</span>
                </sch-flex>
              </schmancy-list-item>

              <schmancy-list-item
                .selected=${this.activeDemo === 'sheet'}
                @click=${() => this.navigate('sheet', 'overlays-sheet')}
                rounded
                variant="container"
                class="mb-2"
              >
                <sch-flex flow="row" gap="2" align="center">
                  <schmancy-icon size="sm">vertical_split</schmancy-icon>
                  <span>Sheet</span>
                </sch-flex>
              </schmancy-list-item>

              <schmancy-list-item
                .selected=${this.activeDemo === 'menu'}
                @click=${() => this.navigate('menu', 'demo-menu')}
                rounded
                variant="container"
                class="mb-2"
              >
                <sch-flex flow="row" gap="2" align="center">
                  <schmancy-icon size="sm">more_vert</schmancy-icon>
                  <span>Menu</span>
                </sch-flex>
              </schmancy-list-item>
            </schmancy-list>
          </div>
        </schmancy-nav-drawer-navbar>

        <schmancy-nav-drawer-content>
          <schmancy-area name="overlays" .default=${'overlays-dialog-showcase'}>
            <schmancy-route when="dialog-showcase" component="overlays-dialog-showcase"></schmancy-route>
            <schmancy-route when="dialog-confirm" component="overlays-dialog-confirm"></schmancy-route>
            <schmancy-route when="sheet" component="overlays-sheet"></schmancy-route>
            <schmancy-route when="menu" component="demo-menu"></schmancy-route>
          </schmancy-area>
        </schmancy-nav-drawer-content>
      </schmancy-nav-drawer>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'demo-overlays-demos': DemoOverlaysDemos;
  }
}