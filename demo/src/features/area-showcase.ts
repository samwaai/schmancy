import { $LitElement } from '@mixins/index'
import { area } from '@schmancy/area'
import { html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'

// Example components for routing demonstration
@customElement('area-page-home')
class AreaPageHome extends $LitElement() {
  render() {
    return html`
      <schmancy-surface type="container" rounded="all" elevation="1" class="p-6">
        <schmancy-typography type="headline" token="lg">Home Page</schmancy-typography>
        <schmancy-typography class="mt-2">
          Welcome to the Area routing system demo. Use the navigation on the left to explore different pages.
        </schmancy-typography>
      </schmancy-surface>
    `
  }
}

@customElement('area-page-profile')
class AreaPageProfile extends $LitElement() {
  @state() userId: string = '123'

  connectedCallback(): void {
    super.connectedCallback()
    // Subscribe to params
    area.param<string>('profile-area', 'userId').subscribe(id => {
      this.userId = id
    })
  }

  render() {
    return html`
      <schmancy-surface type="container" rounded="all" elevation="1" class="p-6">
        <schmancy-typography type="headline" token="lg">User Profile</schmancy-typography>
        <schmancy-typography class="mt-2">
          Viewing profile for user ID: ${this.userId}
        </schmancy-typography>
        
        <schmancy-grid gap="md" cols="2" class="mt-4">
          <schmancy-button 
            variant="filled" 
            @click=${() => this.changeUser('123')}
          >
            User 123
          </schmancy-button>
          <schmancy-button 
            variant="filled tonal" 
            @click=${() => this.changeUser('456')}
          >
            User 456
          </schmancy-button>
        </schmancy-grid>
      </schmancy-surface>
    `
  }

  changeUser(id: string) {
    // Push to main-area to force a component re-render
    // This triggers the Area distinctUntilChanged to recognize a change
    area.push({
      area: 'main-area',
      component: 'area-page-profile',
      params: { userId: id },
      historyStrategy: 'push'
    })
    
    // Update the profile-area state as well for subscriptions
    area.push({
      area: 'profile-area',
      component: 'area-page-profile',
      params: { userId: id },
      historyStrategy: 'silent'  // We don't want this to create a history entry
    })
  }
}

@customElement('area-page-settings')
class AreaPageSettings extends $LitElement() {
  @state() settings = {
    darkMode: false,
    notifications: true
  }

  connectedCallback(): void {
    super.connectedCallback()
    // Subscribe to state
    area.getState<{darkMode: boolean, notifications: boolean}>('settings-area').subscribe(state => {
      if (state) {
        this.settings = state
      }
    })
  }

  render() {
    return html`
      <schmancy-surface type="container" rounded="all" elevation="1" class="p-6">
        <schmancy-typography type="headline" token="lg">Settings</schmancy-typography>
        
        <div class="mt-4 flex flex-col gap-4">
          <schmancy-checkbox
            label="Dark Mode"
            .checked=${this.settings.darkMode}
            @change=${() => this.updateSetting('darkMode', !this.settings.darkMode)}
          ></schmancy-checkbox>
          
          <schmancy-checkbox
            label="Enable Notifications"
            .checked=${this.settings.notifications}
            @change=${() => this.updateSetting('notifications', !this.settings.notifications)}
          ></schmancy-checkbox>
        </div>
      </schmancy-surface>
    `
  }

  updateSetting(key: keyof typeof this.settings, value: boolean) {
    this.settings = {
      ...this.settings,
      [key]: value
    }
    
    // Push to main-area to force a component re-render
    area.push({
      area: 'main-area',
      component: 'area-page-settings',
      state: this.settings,
      historyStrategy: 'replace'
    })
    
    // Also update settings-area for subscriptions
    area.push({
      area: 'settings-area',
      component: 'area-page-settings',
      state: this.settings,
      historyStrategy: 'silent'
    })
  }
}

@customElement('area-page-dashboard')
class AreaPageDashboard extends $LitElement() {
  @state() activeTab = 'overview'

  render() {
    return html`
      <schmancy-surface type="container" rounded="all" elevation="1" class="p-6">
        <schmancy-typography type="headline" token="lg">Dashboard</schmancy-typography>
        
        <schmancy-tab-group 
          class="mt-4" 
          .activeTab=${this.activeTab} 
          @tab-changed=${(e: CustomEvent) => this.activeTab = e.detail}
        >
          <schmancy-tab value="overview" label="Overview">
            <div class="mt-4">
              <schmancy-typography>Dashboard overview content</schmancy-typography>
            </div>
          </schmancy-tab>
          <schmancy-tab value="stats" label="Statistics">
            <div class="mt-4">
              <schmancy-typography>Statistics content with charts and data</schmancy-typography>
            </div>
          </schmancy-tab>
          <schmancy-tab value="reports" label="Reports">
            <div class="mt-4">
              <schmancy-typography>Reports and analytics content</schmancy-typography>
            </div>
          </schmancy-tab>
        </schmancy-tab-group>
      </schmancy-surface>
    `
  }
}

@customElement('area-modal-example')
class AreaModalExample extends $LitElement() {
  @property() name = 'Modal'

  connectedCallback(): void {
    super.connectedCallback()
    area.param<string>('modal-area', 'name').subscribe(name => {
      if (name) this.name = name
    })
  }

  render() {
    return html`
      <schmancy-surface type="containerHigh" rounded="all" elevation="3" class="p-6 max-w-md mx-auto">
        <schmancy-typography type="headline" token="md">Modal Example: ${this.name}</schmancy-typography>
        <schmancy-typography class="my-4">This is a modal dialog controlled by the Area router</schmancy-typography>
        <div class="flex justify-end">
          <schmancy-button variant="filled" @click=${this.closeModal}>Close</schmancy-button>
        </div>
      </schmancy-surface>
    `
  }

  closeModal() {
    // Pop removes the area from state
    area.pop('modal-area')
  }
}

// Main demo component
@customElement('demo-area')
export class DemoArea extends $LitElement() {
  @state() currentPage = ''
  @state() showModal = false
  @state() areaStates = {}

  connectedCallback(): void {
    super.connectedCallback()
    
    // Subscribe to main area changes
    area.on('main-area').subscribe(route => {
      this.currentPage = route.component
    })

    // Subscribe to modal area to show/hide modal
    area.on('modal-area').subscribe(route => {
      this.showModal = !!route.component
    })

    // Subscribe to all areas to display current state
    area.all().subscribe(areas => {
      const states: Record<string, any> = {}
      areas.forEach((route, name) => {
        states[name] = {
          component: route.component,
          state: route.state || {},
          params: route.params || {}
        }
      })
      this.areaStates = states
    })

    // Initialize with home page if no route is set
    setTimeout(() => {
      if (!this.currentPage) {
        this.navigateTo('home')
      }
    }, 100)
  }

  navigateTo(page: string, params?: Record<string, unknown>, state?: Record<string, unknown>) {
    let component: string
    switch(page) {
      case 'profile':
        component = 'area-page-profile'
        break
      case 'settings':
        component = 'area-page-settings'
        break
      case 'dashboard':
        component = 'area-page-dashboard'
        break
      case 'home':
      default:
        component = 'area-page-home'
    }

    area.push({
      area: 'main-area',
      component,
      params,
      state,
      historyStrategy: 'push'
    })
  }

  openModal(name: string = 'Example Modal') {
    area.push({
      area: 'modal-area',
      component: 'area-modal-example',
      params: { name },
      historyStrategy: 'push'
    })
  }

  render() {
    return html`
      <schmancy-surface type="surface" fill="all" class="p-6">
        <schmancy-typography type="headline" token="xl" class="mb-6">
          Schmancy Area Router
        </schmancy-typography>

        <schmancy-grid cols="auto 1fr" gap="lg">
          <!-- Navigation Sidebar -->
          <div class="w-48 border-r border-gray-200 pr-4">
            <schmancy-typography type="label" token="md" class="mb-4">Navigation</schmancy-typography>
            
            <schmancy-list>
              <schmancy-list-item 
                rounded
                .selected=${this.currentPage.toUpperCase() === 'AREA-PAGE-HOME'}
                @click=${() => this.navigateTo('home')}
              >Home</schmancy-list-item>
              
              <schmancy-list-item 
                rounded
                .selected=${this.currentPage.toUpperCase() === 'AREA-PAGE-PROFILE'}
                @click=${() => this.navigateTo('profile', { userId: '123' })}
              >Profile</schmancy-list-item>
              
              <schmancy-list-item 
                rounded
                .selected=${this.currentPage.toUpperCase() === 'AREA-PAGE-SETTINGS'}
                @click=${() => this.navigateTo('settings', {}, { darkMode: false, notifications: true })}
              >Settings</schmancy-list-item>
              
              <schmancy-list-item 
                rounded
                .selected=${this.currentPage.toUpperCase() === 'AREA-PAGE-DASHBOARD'}
                @click=${() => this.navigateTo('dashboard')}
              >Dashboard</schmancy-list-item>
            </schmancy-list>

            <schmancy-typography type="label" token="md" class="mt-6 mb-4">Modal Demo</schmancy-typography>
            
            <div class="flex flex-col gap-2">
              <schmancy-button variant="filled" @click=${() => this.openModal('Simple Modal')}>
                Open Modal
              </schmancy-button>
              <schmancy-button variant="outlined" @click=${() => this.openModal('Custom Modal')}>
                Open Custom Modal
              </schmancy-button>
            </div>
          </div>

          <!-- Main Content Area -->
          <div class="flex-1">
            <!-- Main Router Area -->
            <schmancy-area name="main-area" default="area-page-home"></schmancy-area>
            
            <!-- Area States Display -->
            <schmancy-surface type="containerLow" rounded="all" elevation="1" class="mt-6 p-4">
              <schmancy-typography type="headline" token="sm" class="mb-4">Current Area States</schmancy-typography>
              <pre class="bg-gray-100 p-4 rounded overflow-auto text-sm">${JSON.stringify(this.areaStates, null, 2)}</pre>
            </schmancy-surface>
          </div>
        </schmancy-grid>

        <!-- Modal Area (conditionally rendered) -->
        ${this.showModal ? html`
          <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <schmancy-area name="modal-area"></schmancy-area>
          </div>
        ` : ''}
      </schmancy-surface>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'demo-area': DemoArea
    'area-page-home': AreaPageHome
    'area-page-profile': AreaPageProfile
    'area-page-settings': AreaPageSettings
    'area-page-dashboard': AreaPageDashboard
    'area-modal-example': AreaModalExample
  }
}