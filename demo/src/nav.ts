import { $LitElement } from '@mixins/index'
import { area } from '@schmancy/area'
import { schmancyNavDrawer } from '@schmancy/nav-drawer'
import { css, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { repeat } from 'lit/directives/repeat.js'
import { filter, map } from 'rxjs'

// Core Components
import DemoTypography from './features/typography'
import { DemoButton } from './features/button'
import { DemoCard } from './features/card'
import { DemoInput } from './features/input'
import { DemoSurface } from './features/surface'
import { DemoIcons } from './features/icons'

// Layout & Navigation
import { DemoLayout } from './features/layout'

// Form Controls
import { DemoAutocomplete } from './features/autocomplete'
import { DemoRadio } from './features/radio'
import { DemoSlider } from './features/slider'

// TODO: Components that need demo rewrite:
// - Tabs (demo/src/features/tabs.ts)
// - Drawer (demo/src/features/drawer-content.ts)
// - Sheet (demo/src/features/sheet/sheet.ts)
// - Table (demo/src/features/table.ts)
// - List (demo/src/features/list.ts)
// - Tree (demo/src/features/tree.ts)
// - Avatar (demo/src/features/avatar.ts)
// - Badges (demo/src/features/badges.ts)
// - Dialog (demo/src/features/dialog-showcase.ts)
// - Notifications (demo/src/features/notifications.ts)
// - Loading/Busy (demo/src/features/busy.ts)
// - Area Router (demo/src/features/area-showcase.ts)
// - Router (demo/src/features/router.ts)
// - Boat (demo/src/features/boat.ts)
// - Animated Text (demo/src/features/animated-text.ts)
// - Typewriter (demo/src/features/typewriter.ts)
// - Checkbox (missing demo)
// - Switch (missing demo)
// - Select (missing demo)
// - Divider (missing demo)
// - Chip (missing demo)
// - Progress (missing demo)
// - Menu (missing demo)
// - Tooltip (missing demo)
// - Fab (missing demo)
// - Navigation Drawer (missing demo)
// - Navigation Rail (missing demo)
// - Snackbar (missing demo)

interface DemoSection {
  title: string
  demos: Array<{
    name: string
    component: CustomElementConstructor
  }>
}

@customElement('demo-nav')
export class DemoNav extends $LitElement(css`
  :host {
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: hidden;
  }
  
  .nav-header {
    padding: 1rem;
    border-bottom: 1px solid var(--schmancy-sys-color-outline);
    flex-shrink: 0;
  }
  
  .nav-content {
    padding: 1rem;
    overflow-y: auto;
    flex: 1;
    min-height: 0;
  }
  
  .search-container {
    padding: 0.5rem 1rem;
    border-bottom: 1px solid var(--schmancy-sys-color-outline);
    flex-shrink: 0;
  }
  
  .search-input {
    width: 100%;
    padding: 0.5rem 1rem;
    border: 1px solid var(--schmancy-sys-color-outline);
    border-radius: 0.25rem;
    background: transparent;
    font-size: 0.875rem;
    transition: border-color 0.2s ease;
  }
  
  .search-input:focus {
    outline: none;
    border-color: var(--schmancy-sys-color-primary-default);
  }
  
  .search-input::placeholder {
    color: var(--schmancy-sys-color-surface-onVariant);
  }
  
  .section-title {
    font-size: 0.6875rem;
    font-weight: 500;
    color: var(--schmancy-sys-color-surface-onVariant);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    opacity: 0.7;
    margin-bottom: 0.5rem;
    margin-top: 1rem;
  }
  
  .section-title:first-child {
    margin-top: 0;
  }
  
  schmancy-list {
    margin-bottom: 1rem;
  }
  
  schmancy-list-item {
    margin: 0.125rem 0;
    cursor: pointer;
    font-size: 0.875rem;
  }
  
  .no-results {
    text-align: center;
    padding: 2rem;
    color: var(--schmancy-sys-color-surface-onVariant);
    font-size: 0.875rem;
  }
`) {
  @state() activeComponent: string = ''
  @state() searchQuery: string = ''

  private sections: DemoSection[] = [
    {
      title: 'Core',
      demos: [
        { name: 'Typography', component: DemoTypography },
        { name: 'Button', component: DemoButton },
        { name: 'Card', component: DemoCard },
        { name: 'Surface', component: DemoSurface },
        { name: 'Icons', component: DemoIcons },
      ]
    },
    {
      title: 'Forms',
      demos: [
        { name: 'Input', component: DemoInput },
        { name: 'Autocomplete', component: DemoAutocomplete },
        { name: 'Radio', component: DemoRadio },
        { name: 'Slider', component: DemoSlider },
      ]
    },
    {
      title: 'Layout',
      demos: [
        { name: 'Layout', component: DemoLayout },
      ]
    },
  ]

  connectedCallback(): void {
    super.connectedCallback()
    
    // Subscribe to route changes
    area.$current
      .pipe(
        filter(r => r.has('main')),
        map(r => r.get('main')),
      )
      .subscribe(r => {
        if (r?.component) {
          // Convert tag name to class name format
          this.activeComponent = r.component.toLowerCase().replace(/-/g, '')
        }
      })
  }

  private navigate(component: CustomElementConstructor) {
    schmancyNavDrawer.close(this)
    area.push({
      area: 'main',
      component,
      historyStrategy: 'push'
    })
  }

  private get filteredSections() {
    if (!this.searchQuery) return this.sections
    
    const query = this.searchQuery.toLowerCase()
    return this.sections
      .map(section => ({
        ...section,
        demos: section.demos.filter(demo => 
          demo.name.toLowerCase().includes(query)
        )
      }))
      .filter(section => section.demos.length > 0)
  }

  private handleSearch(e: Event) {
    this.searchQuery = (e.target as HTMLInputElement).value
  }

  render() {
    const filtered = this.filteredSections
    
    return html`
      <div class="nav-header">
        <schmancy-typography type="headline" token="md">
          Schmancy Components
        </schmancy-typography>
        <schmancy-typography type="body" token="sm" class="text-surface-onVariant">
          Material Design 3 Web Components
        </schmancy-typography>
        <schmancy-typography type="label" token="sm" class="text-error-default mt-2 block">
          TODO: 30+ components need demos
        </schmancy-typography>
      </div>
      
      <div class="search-container">
        <input
          type="search"
          class="search-input"
          placeholder="Search components..."
          .value=${this.searchQuery}
          @input=${this.handleSearch}
        />
      </div>
      
      <div class="nav-content">
        ${filtered.length === 0 
          ? html`<div class="no-results">No components found</div>`
          : repeat(
          filtered,
          section => section.title,
          section => {
            return html`
              <div>
                <div class="section-title">${section.title}</div>
                <schmancy-list>
                  ${repeat(
                  section.demos,
                  demo => demo.name,
                  demo => html`
                    <schmancy-list-item
                      rounded
                      .selected=${this.activeComponent === demo.component.name?.toLowerCase().replace(/-/g, '')}
                      @click=${() => this.navigate(demo.component)}
                    >
                      ${demo.name}
                    </schmancy-list-item>
                  `
                  )}
                </schmancy-list>
              </div>
            `
          }
        )}
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'demo-nav': DemoNav
  }
}