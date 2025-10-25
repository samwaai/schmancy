import { html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { $LitElement } from '@mhmo91/schmancy/mixins'
import '@mhmo91/schmancy/surface'
import '@mhmo91/schmancy/tabs'
import '@mhmo91/schmancy/typography'
import '@mhmo91/schmancy/button'
import { animate } from '@lit-labs/motion'

@customElement('demo-navigation-tabs')
export default class NavigationTabs extends $LitElement() {
  @state() private basicTab = 'tab1'
  @state() private iconTab = 'overview'
  @state() private scrollableTab = 'item1'
  @state() private secondaryTab = 'recent'
  @state() private verticalTab = 'profile'

  private basicTabs = [
    { value: 'tab1', label: 'Tab One' },
    { value: 'tab2', label: 'Tab Two' },
    { value: 'tab3', label: 'Tab Three' }
  ]

  private iconTabs = [
    { value: 'overview', label: 'Overview', icon: 'dashboard' },
    { value: 'analytics', label: 'Analytics', icon: 'analytics' },
    { value: 'reports', label: 'Reports', icon: 'assessment' },
    { value: 'settings', label: 'Settings', icon: 'settings' }
  ]

  private scrollableTabs = Array.from({ length: 8 }, (_, i) => ({
    value: `item${i + 1}`,
    label: `Item ${i + 1}`
  }))

  private secondaryTabs = [
    { value: 'recent', label: 'Recent' },
    { value: 'popular', label: 'Popular' },
    { value: 'trending', label: 'Trending' }
  ]

  private verticalTabs = [
    { value: 'profile', label: 'Profile', icon: 'person' },
    { value: 'security', label: 'Security', icon: 'security' },
    { value: 'notifications', label: 'Notifications', icon: 'notifications' },
    { value: 'privacy', label: 'Privacy', icon: 'privacy_tip' }
  ]

  render() {
    return html`
      <div class="max-w-6xl mx-auto p-6" ${animate()}>
        <!-- Header -->
        <div class="mb-12 text-center">
          <schmancy-typography type="display" token="lg" class="mb-4">
            Tab Navigation
          </schmancy-typography>
          <schmancy-typography type="body" token="lg" class="text-on-surface-variant max-w-3xl mx-auto">
            Organize content into distinct sections with tabs. Perfect for settings pages, data views, and multi-step processes.
          </schmancy-typography>
        </div>

        <!-- Basic Tabs Demo -->
        <div class="mb-12">
          <schmancy-typography type="title" token="lg" class="mb-6">
            Basic Tabs
          </schmancy-typography>
          <schmancy-surface type="container" class="p-6 rounded-xl">
            <schmancy-tabs-group .activeTab=${this.basicTab} @tab-changed=${(e: CustomEvent) => this.basicTab = e.detail}>
              ${this.basicTabs.map(tab => html`
                <schmancy-tab .value=${tab.value} .label=${tab.label} ?active=${this.basicTab === tab.value}>
                  ${tab.label}
                </schmancy-tab>
              `)}
            </schmancy-tabs-group>
            <div class="min-h-48 flex items-center justify-center bg-surface rounded-lg mt-4 text-on-surface">
              <div class="text-center p-10">
                <schmancy-typography type="title" token="md">
                  Content for ${this.basicTabs.find(t => t.value === this.basicTab)?.label}
                </schmancy-typography>
                <schmancy-typography type="body" token="md" class="mt-2 text-on-surface-variant">
                  This is the content area for the selected tab.
                </schmancy-typography>
              </div>
            </div>
          </schmancy-surface>
        </div>

        <!-- Icon Tabs Demo -->
        <div class="mb-12">
          <schmancy-typography type="title" token="lg" class="mb-6">
            Icon Tabs
          </schmancy-typography>
          <schmancy-surface type="container" class="p-6 rounded-xl">
            <schmancy-tabs-group .activeTab=${this.iconTab} @tab-changed=${(e: CustomEvent) => this.iconTab = e.detail}>
              ${this.iconTabs.map(tab => html`
                <schmancy-tab .value=${tab.value} .label=${tab.label} ?active=${this.iconTab === tab.value}>
                  <schmancy-icon slot="icon">${tab.icon}</schmancy-icon>
                  ${tab.label}
                </schmancy-tab>
              `)}
            </schmancy-tabs-group>
            <div class="min-h-48 flex items-center justify-center bg-surface rounded-lg mt-4 text-on-surface">
              <div class="text-center p-10">
                <schmancy-icon size="xl" class="mb-4">${this.iconTabs.find(t => t.value === this.iconTab)?.icon}</schmancy-icon>
                <schmancy-typography type="title" token="md">
                  ${this.iconTabs.find(t => t.value === this.iconTab)?.label} Section
                </schmancy-typography>
                <schmancy-typography type="body" token="md" class="mt-2 text-on-surface-variant">
                  Content and controls for ${this.iconTabs.find(t => t.value === this.iconTab)?.label.toLowerCase()}.
                </schmancy-typography>
              </div>
            </div>
          </schmancy-surface>
        </div>

        <!-- Scrollable Tabs Demo -->
        <div class="mb-12">
          <schmancy-typography type="title" token="lg" class="mb-6">
            Scrollable Tabs
          </schmancy-typography>
          <schmancy-surface type="container" class="p-6 rounded-xl">
            <div class="max-w-md overflow-hidden">
              <schmancy-tabs-group .activeTab=${this.scrollableTab} @tab-changed=${(e: CustomEvent) => this.scrollableTab = e.detail}>
                ${this.scrollableTabs.map(tab => html`
                  <schmancy-tab .value=${tab.value} .label=${tab.label} ?active=${this.scrollableTab === tab.value}>
                    ${tab.label}
                  </schmancy-tab>
                `)}
              </schmancy-tabs-group>
            </div>
            <div class="min-h-32 flex items-center justify-center bg-surface rounded-lg mt-4 text-on-surface">
              <schmancy-typography type="body" token="md">
                Selected: ${this.scrollableTabs.find(t => t.value === this.scrollableTab)?.label}
              </schmancy-typography>
            </div>
          </schmancy-surface>
        </div>

        <!-- Secondary Tabs Demo -->
        <div class="mb-12">
          <schmancy-typography type="title" token="lg" class="mb-6">
            Secondary Tabs
          </schmancy-typography>
          <schmancy-surface type="container" class="p-6 rounded-xl">
            <schmancy-tabs-group variant="secondary" .activeTab=${this.secondaryTab} @tab-changed=${(e: CustomEvent) => this.secondaryTab = e.detail}>
              ${this.secondaryTabs.map(tab => html`
                <schmancy-tab .value=${tab.value} .label=${tab.label} ?active=${this.secondaryTab === tab.value}>
                  ${tab.label}
                </schmancy-tab>
              `)}
            </schmancy-tabs-group>
            <div class="min-h-32 flex items-center justify-center bg-surface rounded-lg mt-4 text-on-surface">
              <schmancy-typography type="body" token="md">
                Showing ${this.secondaryTabs.find(t => t.value === this.secondaryTab)?.label.toLowerCase()} content
              </schmancy-typography>
            </div>
          </schmancy-surface>
        </div>

        <!-- Vertical Tabs Demo -->
        <div class="mb-12">
          <schmancy-typography type="title" token="lg" class="mb-6">
            Vertical Tabs
          </schmancy-typography>
          <schmancy-surface type="container" class="p-6 rounded-xl">
            <div class="flex h-72 gap-0 bg-surface-container rounded-xl overflow-hidden">
              <div class="min-w-48 bg-surface-container-high border-r border-outline">
                <schmancy-tabs-group variant="vertical" .activeTab=${this.verticalTab} @tab-changed=${(e: CustomEvent) => this.verticalTab = e.detail}>
                  ${this.verticalTabs.map(tab => html`
                    <schmancy-tab .value=${tab.value} .label=${tab.label} ?active=${this.verticalTab === tab.value}>
                      <schmancy-icon slot="icon">${tab.icon}</schmancy-icon>
                      ${tab.label}
                    </schmancy-tab>
                  `)}
                </schmancy-tabs-group>
              </div>
              <div class="flex-1 p-10 flex items-center justify-center bg-surface text-on-surface">
                <div class="text-center">
                  <schmancy-icon size="xl" class="mb-4">${this.verticalTabs.find(t => t.value === this.verticalTab)?.icon}</schmancy-icon>
                  <schmancy-typography type="title" token="md">
                    ${this.verticalTabs.find(t => t.value === this.verticalTab)?.label} Settings
                  </schmancy-typography>
                  <schmancy-typography type="body" token="md" class="mt-2 text-on-surface-variant">
                    Configure your ${this.verticalTabs.find(t => t.value === this.verticalTab)?.label.toLowerCase()} preferences here.
                  </schmancy-typography>
                </div>
              </div>
            </div>
          </schmancy-surface>
        </div>

        <!-- Best Practices -->
        <div class="mt-12">
          <schmancy-typography type="title" token="lg" class="mb-6">
            Tab Best Practices
          </schmancy-typography>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <schmancy-surface type="container-low" class="p-6 rounded-lg border-l-4 border-tertiary">
              <schmancy-typography type="title" token="md" class="mb-3 text-tertiary">
                ✓ Do
              </schmancy-typography>
              <ul class="space-y-2 text-on-surface-variant list-none">
                <li class="border-b border-outline-variant pb-2">✓ Use clear, concise tab labels</li>
                <li class="border-b border-outline-variant pb-2">✓ Keep tab count between 2-7 for best UX</li>
                <li class="border-b border-outline-variant pb-2">✓ Use icons to enhance recognition</li>
                <li class="border-b border-outline-variant pb-2">✓ Implement keyboard navigation</li>
                <li>✓ Consider vertical tabs for narrow layouts</li>
              </ul>
            </schmancy-surface>

            <schmancy-surface type="container-low" class="p-6 rounded-lg border-l-4 border-error">
              <schmancy-typography type="title" token="md" class="mb-3 text-error">
                ✗ Don't
              </schmancy-typography>
              <ul class="space-y-2 text-on-surface-variant list-none">
                <li class="border-b border-outline-variant pb-2">✗ Use more than 7 tabs in one group</li>
                <li class="border-b border-outline-variant pb-2">✗ Hide important content behind tabs</li>
                <li class="border-b border-outline-variant pb-2">✗ Use tabs for sequential steps</li>
                <li class="border-b border-outline-variant pb-2">✗ Mix different tab styles randomly</li>
                <li>✗ Forget to indicate the active tab clearly</li>
              </ul>
            </schmancy-surface>
          </div>
        </div>
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'demo-navigation-tabs': NavigationTabs
  }
}