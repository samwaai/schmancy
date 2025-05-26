import { $LitElement } from '@mixins/index'
import { area } from '@schmancy/area'
import { schmancyNavDrawer } from '@schmancy/nav-drawer'
import { css, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { repeat } from 'lit/directives/repeat.js'
import { filter, map } from 'rxjs'
import { AreaShowcase } from './features/area-showcase'
import { DemoAnimatedText } from './features/animated-text'
import { DemoAvatars } from './features/avatar'
import DemoBadges from './features/badges'
import { DemoBusy } from './features/busy'
import { DemoButton } from './features/button'
import { DemoCard } from './features/card'
import { DemoDialog } from './features/dialog'
import { DemoDialogConfirm } from './features/dialog-confirm-demo'
import { DemoDialogPlayground } from './features/dialog-playground'
import { DemoDialogShowcase } from './features/dialog-showcase'
import { DemoContentDrawer } from './features/drawer-content'
import { DemoIcons } from './features/icons'
import { DemoInput } from './features/input'
import { DemoList } from './features/list'
import NotificationDemo from './features/notifications'
import { DemoPlayground } from './features/playground-demo'
import { DemoRadio } from './features/radio'
import { DemoSheet } from './features/sheet/sheet'
import { DemoSlider } from './features/slider'
import { DemoSurface } from './features/surface'
import { TableDemo } from './features/table'
import { DemoTabs } from './features/tabs'
import { DemoTree } from './features/tree'
import { SchmancyTypewriterDemo } from './features/typewriter'
import DemoTypography from './features/typography'

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
    border-bottom: 1px solid var(--surface-variant);
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
    border-bottom: 1px solid var(--surface-variant);
    flex-shrink: 0;
  }
  
  
  
  .search-input {
    width: 100%;
    padding: 0.5rem 1rem;
    border: 1px solid var(--surface-variant);
    border-radius: 0.25rem;
    background: transparent;
    font-size: 0.875rem;
    transition: border-color 0.2s ease;
  }
  
  .search-input:focus {
    outline: none;
    border-color: var(--primary);
  }
  
  .search-input::placeholder {
    color: var(--on-surface-variant);
  }
  
  
  .section-title {
    font-size: 0.6875rem;
    font-weight: 500;
    color: var(--on-surface-variant);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    opacity: 0.7;
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
    color: var(--on-surface-variant);
    font-size: 0.875rem;
  }
  
`) {
  @state() activeComponent: string = ''
  @state() searchQuery: string = ''

  private sections: DemoSection[] = [
    {
      title: 'Core Components',
      demos: [
        { name: 'Typography', component: DemoTypography },
        { name: 'Button', component: DemoButton },
        { name: 'Input', component: DemoInput },
        { name: 'Icons', component: DemoIcons },
        { name: 'Surface', component: DemoSurface },
        { name: 'Card', component: DemoCard },
      ]
    },
    {
      title: 'Navigation',
      demos: [
        { name: 'Area Router', component: AreaShowcase },
        { name: 'Tabs', component: DemoTabs },
        { name: 'Content Drawer', component: DemoContentDrawer },
        { name: 'Sheet', component: DemoSheet },
      ]
    },
    {
      title: 'Data Display',
      demos: [
        { name: 'Table', component: TableDemo },
        { name: 'List', component: DemoList },
        { name: 'Tree', component: DemoTree },
        { name: 'Avatar', component: DemoAvatars },
        { name: 'Badges', component: DemoBadges },
      ]
    },
    {
      title: 'Feedback',
      demos: [
        { name: 'Dialog', component: DemoDialog },
        { name: 'Dialog Confirm', component: DemoDialogConfirm },
        { name: 'Dialog Showcase', component: DemoDialogShowcase },
        { name: 'Dialog Playground', component: DemoDialogPlayground },
        { name: 'Notifications', component: NotificationDemo },
        { name: 'Busy', component: DemoBusy },
      ]
    },
    {
      title: 'Form Controls',
      demos: [
        { name: 'Radio', component: DemoRadio },
        { name: 'Slider', component: DemoSlider },
      ]
    },
    {
      title: 'Advanced',
      demos: [
        { name: 'Interactive Playground', component: DemoPlayground },
        { name: 'Animated Text', component: DemoAnimatedText },
        { name: 'Typewriter', component: SchmancyTypewriterDemo },
      ]
    }
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
          // Convert tag name (e.g., 'area-showcase') to class name format (e.g., 'areashowcase')
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
          Schmancy
        </schmancy-typography>
      </div>
      
      <div class="search-container">
        <input
          type="search"
          class="search-input"
          placeholder="Search..."
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