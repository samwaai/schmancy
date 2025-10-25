import { $LitElement } from '@mhmo91/schmancy/mixins';
import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import '../shared/installation-section';

@customElement('details-showcase')
export default class DetailsShowcase extends $LitElement() {
  render() {
    return html`
      <schmancy-surface class="p-8">
        <!-- Title -->
        <schmancy-typography type="display" token="lg" class="mb-4 block">
          Details / Accordion
        </schmancy-typography>
        <schmancy-typography type="body" token="lg" class="mb-8 text-surface-onVariant block">
          Expandable/collapsible content sections with smooth animations and multiple variants.
        </schmancy-typography>

        <!-- Installation -->
        <installation-section></installation-section>

        <!-- Import -->
        <div class="mb-8">
          <schmancy-typography type="title" token="lg" class="mb-4 block">Import</schmancy-typography>
          <schmancy-code-preview language="javascript">
            import '@mhmo91/schmancy/details'
          </schmancy-code-preview>
        </div>

        <!-- API Reference -->
        <div class="mb-12">
          <schmancy-typography type="title" token="lg" class="mb-4 block">API Reference</schmancy-typography>
          <schmancy-surface type="surfaceDim" class="p-4 rounded-lg">
            <table class="w-full">
              <thead>
                <tr class="border-b border-outline">
                  <th class="text-left py-3 px-4">
                    <schmancy-typography type="label" token="lg">Property</schmancy-typography>
                  </th>
                  <th class="text-left py-3 px-4">
                    <schmancy-typography type="label" token="lg">Type</schmancy-typography>
                  </th>
                  <th class="text-left py-3 px-4">
                    <schmancy-typography type="label" token="lg">Default</schmancy-typography>
                  </th>
                  <th class="text-left py-3 px-4">
                    <schmancy-typography type="label" token="lg">Description</schmancy-typography>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr class="border-b border-outlineVariant">
                  <td class="py-3 px-4">
                    <schmancy-typography type="body" token="md" class="font-mono">summary</schmancy-typography>
                  </td>
                  <td class="py-3 px-4">
                    <schmancy-typography type="body" token="md" class="font-mono">string</schmancy-typography>
                  </td>
                  <td class="py-3 px-4">
                    <schmancy-typography type="body" token="md" class="font-mono">''</schmancy-typography>
                  </td>
                  <td class="py-3 px-4">
                    <schmancy-typography type="body" token="md">The header text shown in the summary</schmancy-typography>
                  </td>
                </tr>
                <tr class="border-b border-outlineVariant">
                  <td class="py-3 px-4">
                    <schmancy-typography type="body" token="md" class="font-mono">open</schmancy-typography>
                  </td>
                  <td class="py-3 px-4">
                    <schmancy-typography type="body" token="md" class="font-mono">boolean</schmancy-typography>
                  </td>
                  <td class="py-3 px-4">
                    <schmancy-typography type="body" token="md" class="font-mono">false</schmancy-typography>
                  </td>
                  <td class="py-3 px-4">
                    <schmancy-typography type="body" token="md">Initial expanded state</schmancy-typography>
                  </td>
                </tr>
                <tr>
                  <td class="py-3 px-4">
                    <schmancy-typography type="body" token="md" class="font-mono">variant</schmancy-typography>
                  </td>
                  <td class="py-3 px-4">
                    <schmancy-typography type="body" token="md" class="font-mono">'default' | 'outlined' | 'filled' | 'elevated'</schmancy-typography>
                  </td>
                  <td class="py-3 px-4">
                    <schmancy-typography type="body" token="md" class="font-mono">'default'</schmancy-typography>
                  </td>
                  <td class="py-3 px-4">
                    <schmancy-typography type="body" token="md">Visual style variant</schmancy-typography>
                  </td>
                </tr>
              </tbody>
            </table>
          </schmancy-surface>
        </div>

        <!-- Events -->
        <div class="mb-12">
          <schmancy-typography type="title" token="lg" class="mb-4 block">Events</schmancy-typography>
          <schmancy-surface type="surfaceDim" class="p-4 rounded-lg">
            <table class="w-full">
              <thead>
                <tr class="border-b border-outline">
                  <th class="text-left py-3 px-4">
                    <schmancy-typography type="label" token="lg">Event</schmancy-typography>
                  </th>
                  <th class="text-left py-3 px-4">
                    <schmancy-typography type="label" token="lg">Detail</schmancy-typography>
                  </th>
                  <th class="text-left py-3 px-4">
                    <schmancy-typography type="label" token="lg">Description</schmancy-typography>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="py-3 px-4">
                    <schmancy-typography type="body" token="md" class="font-mono">toggle</schmancy-typography>
                  </td>
                  <td class="py-3 px-4">
                    <schmancy-typography type="body" token="md" class="font-mono">{ open: boolean }</schmancy-typography>
                  </td>
                  <td class="py-3 px-4">
                    <schmancy-typography type="body" token="md">Fired when details open/close state changes</schmancy-typography>
                  </td>
                </tr>
              </tbody>
            </table>
          </schmancy-surface>
        </div>

        <!-- Examples -->
        <div>
          <schmancy-typography type="title" token="lg" class="mb-6 block">Examples</schmancy-typography>
          <schmancy-grid gap="lg" class="w-full">
            
            <!-- Basic Usage -->
            <schmancy-code-preview title="Basic Usage">
              <schmancy-details summary="Click to expand">
                <schmancy-typography type="body" token="md">
                  This is the expanded content. You can put any HTML or components here.
                </schmancy-typography>
              </schmancy-details>
            </schmancy-code-preview>

            <!-- Variants -->
            <schmancy-code-preview title="Variants">
              <schmancy-layout gap="md" direction="column">
                <schmancy-details summary="Default variant">
                  <schmancy-typography type="body" token="md">
                    Default styling with minimal visual emphasis.
                  </schmancy-typography>
                </schmancy-details>
                
                <schmancy-details summary="Outlined variant" variant="outlined">
                  <schmancy-typography type="body" token="md">
                    Outlined with a border for clear boundaries.
                  </schmancy-typography>
                </schmancy-details>
                
                <schmancy-details summary="Filled variant" variant="filled">
                  <schmancy-typography type="body" token="md">
                    Filled background for subtle emphasis.
                  </schmancy-typography>
                </schmancy-details>
                
                <schmancy-details summary="Elevated variant" variant="elevated">
                  <schmancy-typography type="body" token="md">
                    Elevated with shadow for depth and prominence.
                  </schmancy-typography>
                </schmancy-details>
              </schmancy-layout>
            </schmancy-code-preview>

            <!-- Initially Open -->
            <schmancy-code-preview title="Initially Open">
              <schmancy-details summary="This starts expanded" open variant="filled">
                <schmancy-typography type="body" token="md">
                  Set the open attribute to start with expanded content.
                </schmancy-typography>
              </schmancy-details>
            </schmancy-code-preview>

            <!-- Custom Summary Slot -->
            <schmancy-code-preview title="Custom Summary Content">
              <schmancy-details variant="elevated">
                <div slot="summary" class="flex items-center justify-between w-full">
                  <schmancy-typography type="title" token="md">Settings</schmancy-typography>
                  <schmancy-badge type="primary">New</schmancy-badge>
                </div>
                <schmancy-layout gap="sm" direction="column">
                  <schmancy-typography type="body" token="md">
                    Configure your preferences here.
                  </schmancy-typography>
                  <schmancy-button type="text">Open Settings</schmancy-button>
                </schmancy-layout>
              </schmancy-details>
            </schmancy-code-preview>

            <!-- Nested Details -->
            <schmancy-code-preview title="Nested Accordion">
              <schmancy-details summary="Parent Section" variant="outlined">
                <schmancy-typography type="body" token="md" class="mb-4">
                  This is the parent content with nested sections.
                </schmancy-typography>
                
                <schmancy-layout gap="sm" direction="column">
                  <schmancy-details summary="Child Section 1">
                    <schmancy-typography type="body" token="sm">
                      First nested content area.
                    </schmancy-typography>
                  </schmancy-details>
                  
                  <schmancy-details summary="Child Section 2">
                    <schmancy-typography type="body" token="sm">
                      Second nested content area.
                    </schmancy-typography>
                  </schmancy-details>
                </schmancy-layout>
              </schmancy-details>
            </schmancy-code-preview>

            <!-- FAQ Example -->
            <schmancy-code-preview title="FAQ List">
              <schmancy-layout gap="md" direction="column">
                <schmancy-typography type="headline" token="md" class="mb-2">
                  Frequently Asked Questions
                </schmancy-typography>
                
                <schmancy-details summary="What is Schmancy?" variant="filled">
                  <schmancy-typography type="body" token="md">
                    Schmancy is a modern web component library built with Lit and Material Design 3 principles.
                  </schmancy-typography>
                </schmancy-details>
                
                <schmancy-details summary="How do I install it?" variant="filled">
                  <schmancy-typography type="body" token="md">
                    You can install Schmancy via npm or yarn:
                  </schmancy-typography>
                  <pre class="mt-2 p-2 bg-surface-container rounded">npm install @mhmo91/schmancy</pre>
                </schmancy-details>
                
                <schmancy-details summary="Is it customizable?" variant="filled">
                  <schmancy-typography type="body" token="md">
                    Yes! Schmancy uses CSS custom properties and a flexible theming system based on Material Design 3 tokens.
                  </schmancy-typography>
                </schmancy-details>
              </schmancy-layout>
            </schmancy-code-preview>

            <!-- Event Handling -->
            <schmancy-code-preview title="Event Handling">
              <schmancy-details 
                summary="Track open/close events" 
                variant="elevated"
              >
                <schmancy-typography type="body" token="md">
                  Check the console to see toggle events when you expand/collapse this section.
                </schmancy-typography>
              </schmancy-details>
            </schmancy-code-preview>

            <!-- Complex Content -->
            <schmancy-code-preview title="Complex Content">
              <schmancy-details summary="Product Details" variant="elevated">
                <schmancy-layout gap="md" direction="column">
                  <schmancy-surface type="surfaceContainer" class="p-4 rounded">
                    <schmancy-typography type="title" token="sm" class="mb-2">Specifications</schmancy-typography>
                    <schmancy-divider class="my-2"></schmancy-divider>
                    <div class="grid grid-cols-2 gap-2">
                      <schmancy-typography type="body" token="sm">Weight:</schmancy-typography>
                      <schmancy-typography type="body" token="sm">2.5 kg</schmancy-typography>
                      <schmancy-typography type="body" token="sm">Dimensions:</schmancy-typography>
                      <schmancy-typography type="body" token="sm">30 x 20 x 10 cm</schmancy-typography>
                      <schmancy-typography type="body" token="sm">Material:</schmancy-typography>
                      <schmancy-typography type="body" token="sm">Aluminum</schmancy-typography>
                    </div>
                  </schmancy-surface>
                  
                  <schmancy-layout gap="sm">
                    <schmancy-button type="filled">Add to Cart</schmancy-button>
                    <schmancy-button type="tonal">Save for Later</schmancy-button>
                  </schmancy-layout>
                </schmancy-layout>
              </schmancy-details>
            </schmancy-code-preview>

          </schmancy-grid>
        </div>
      </schmancy-surface>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'details-showcase': DetailsShowcase;
  }
}