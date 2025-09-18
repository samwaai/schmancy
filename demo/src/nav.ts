import { TailwindElement } from '@mixins/index'
import { area, lazy } from '@schmancy/area'
import { schmancyNavDrawer } from '@schmancy/nav-drawer'
import { html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { repeat } from 'lit/directives/repeat.js'
import { filter, map } from 'rxjs'

// Key Features
import { DemoAreaDemos } from './features/area/area-demos'
import { DemoContext } from './features/context'
import { ThemeServiceDemo } from './features/theme-service-demo'


// Other Components (still using original files temporarily)
import { DemoChips } from './features/chips'

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
        { name: 'Area', component: DemoAreaDemos as any },
        { name: 'Theme Service', component: ThemeServiceDemo },
      ]
    },
    {
      title: 'Components',
      demos: [
        { name: 'Core', component: lazy(() => import('./features/core-demos')) as any },
        { name: 'Feedback', component: lazy(() => import('./features/feedback-demos')) as any },
        { name: 'Forms', component: lazy(() => import('./features/forms-demos')) as any },
        { name: 'Navigation', component: lazy(() => import('./features/navigation-demos')) as any },
        { name: 'Data Display', component: lazy(() => import('./features/data-display-demos')) as any },
        { name: 'Overlays', component: lazy(() => import('./features/overlays-demos')) as any },
        { name: 'Layout', component: lazy(() => import('./features/layout-demos')) as any },
      ]
    },
    {
      title: 'Others',
      demos: [
        { name: 'Chips', component: DemoChips },
        { name: 'Miscellaneous', component: lazy(() => import('./features/misc-demos')) as any },
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

  private navigate(demo: { name: string; component: CustomElementConstructor }) {
    schmancyNavDrawer.close(this)

    // Simple navigation - just use area.push with the component
    area.push({
      area: 'main',
      component: demo.component
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
                          @click=${() => this.navigate(demo)}
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