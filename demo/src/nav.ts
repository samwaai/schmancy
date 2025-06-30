import { TailwindElement } from '@mixins/index'
import { area } from '@schmancy/area'
import { schmancyNavDrawer } from '@schmancy/nav-drawer'
import { html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { repeat } from 'lit/directives/repeat.js'
import { filter, map } from 'rxjs'

// Key Features
import { DemoArea } from './features/area'
import { DemoAreaBasic } from './features/area-basic'
import { DemoAreaDefault } from './features/area-default'
import { DemoAreaHistory } from './features/area-history'
import { DemoAreaMulti } from './features/area-multi'
import { DemoAreaParams } from './features/area-params'
import { DemoAreaState } from './features/area-state'
import { DemoContext } from './features/context'

// Core Components
import { DemoButton } from './features/button'
import { DemoCard } from './features/card'
import { DemoIcons } from './features/icons'
import { DemoInput } from './features/input'
import { DemoSurface } from './features/surface'
import DemoTypography from './features/typography'

// Layout & Navigation
import { DemoBoat } from './features/boat'
import { DemoLayout } from './features/layout'

// Form Controls
import { DemoAutocomplete } from './features/autocomplete'
import { DemoDateRange } from './features/date-range'
import { DemoRadio } from './features/radio'
import { DemoSheet } from './features/sheet-demo'
import { DemoSlider } from './features/slider'

interface DemoSection {
  title: string
  demos: Array<{
    name: string
    component: CustomElementConstructor
  }>
}

@customElement('demo-nav')
export class DemoNav extends TailwindElement() {
  @state() activeComponent: string = ''
  @state() searchQuery: string = ''

  private sections: DemoSection[] = [
    {
      title: 'Key Features',
      demos: [
        { name: 'Context', component: DemoContext },
      ]
    },
    {
      title: 'Area',
      demos: [
        { name: 'Overview', component: DemoArea },
        { name: 'Basic Navigation', component: DemoAreaBasic },
        { name: 'With Parameters', component: DemoAreaParams },
        { name: 'State Management', component: DemoAreaState },
        { name: 'Default Component', component: DemoAreaDefault },
        { name: 'History Strategies', component: DemoAreaHistory },
        { name: 'Multiple Areas', component: DemoAreaMulti },
      ]
    },
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
        { name: 'Date Range', component: DemoDateRange },
        { name: 'Radio', component: DemoRadio },
        { name: 'Slider', component: DemoSlider },
      ]
    },
    {
      title: 'Layout',
      demos: [
        { name: 'Layout', component: DemoLayout },
        { name: 'Boat', component: DemoBoat },
        { 
          name : 'Sheet' , component:DemoSheet
        }
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
      component
      // Remove explicit historyStrategy - let it use default behavior
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
      <div class="flex flex-col h-screen overflow-hidden">
        <div class="p-6 flex-shrink-0">
          <schmancy-typography type="headline" token="sm" class="mb-1">
            Schmancy
          </schmancy-typography>
          <schmancy-typography type="body" token="sm" class="text-surface-onVariant">
            Web Component Library
          </schmancy-typography>
        </div>
<!--         
        <div class="px-6 pb-4 flex-shrink-0">
          <schmancy-input
            type="search"
            placeholder="Search components..."
            .value=${this.searchQuery}
            @input=${this.handleSearch}
            .variant=${'outlined'}
            class="w-full"
          ></schmancy-input>
        </div> -->
        
        <div class="px-4 overflow-y-auto flex-1 min-h-0">
          ${filtered.length === 0 
            ? html`<div class="text-center p-8 text-surface-onVariant text-sm">No components found</div>`
            : repeat(
            filtered,
            section => section.title,
            section => {
              return html`
                <div>
                  <div class="text-xs font-semibold text-primary-default mb-3 mt-6 first:mt-0">${section.title}</div>
                  <schmancy-list>
                    ${repeat(
                      section.demos,
                      demo => demo.name,
                      demo => html`
                        <schmancy-list-item
                          rounded
                          class="my-1 cursor-pointer text-sm rounded-lg transition-colors hover:bg-surface-container"
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
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'demo-nav': DemoNav
  }
}