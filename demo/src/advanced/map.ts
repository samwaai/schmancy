import { $LitElement } from '@mhmo91/schmancy/mixins'
import { html } from 'lit'
import { customElement } from 'lit/decorators.js'
import '../shared/installation-section'

@customElement('demo-map')
export default class DemoMap extends $LitElement() {
  // Replace with your Google Maps API key
  // Get one at: https://console.cloud.google.com/google/maps-apis/credentials
  // Note: For testing, you may need to temporarily remove API key restrictions in Google Cloud Console
  private apiKey = 'AIzaSyBMBfvIOM0YWoCiQPH6apVa_OpHWWlmI1I'
  
  render() {
    return html`
      <schmancy-surface class="p-8">
        <!-- Title & Description -->
        <schmancy-typography type="display" token="lg" class="mb-4 block">
          Map
        </schmancy-typography>
        <schmancy-typography type="body" token="lg" class="mb-8 text-surface-onVariant block">
          Google Maps integration with intuitive address geocoding, multiple map types, and interactive controls. 
          Simply provide an address string or coordinates to display any location.
        </schmancy-typography>

        <!-- Installation Section -->
        <installation-section></installation-section>

        <!-- Import Instructions -->
        <div class="mb-8">
          <schmancy-typography type="title" token="lg" class="mb-4 block">Import</schmancy-typography>
          <schmancy-code-preview language="javascript">
            import '@mhmo91/schmancy/map'
          </schmancy-code-preview>
        </div>

        <!-- API Reference -->
        <div class="mb-12">
          <schmancy-typography type="title" token="lg" class="mb-4 block">API Reference</schmancy-typography>
          <schmancy-surface type="surfaceDim" class="rounded-lg overflow-hidden">
            <table class="w-full">
              <thead class="bg-surface-container">
                <tr>
                  <th class="text-left p-4">
                    <schmancy-typography type="label" token="md">Property</schmancy-typography>
                  </th>
                  <th class="text-left p-4">
                    <schmancy-typography type="label" token="md">Type</schmancy-typography>
                  </th>
                  <th class="text-left p-4">
                    <schmancy-typography type="label" token="md">Default</schmancy-typography>
                  </th>
                  <th class="text-left p-4">
                    <schmancy-typography type="label" token="md">Description</schmancy-typography>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr class="border-t border-outline">
                  <td class="p-4">
                    <code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">address</code>
                  </td>
                  <td class="p-4">
                    <schmancy-typography type="body" token="sm">string</schmancy-typography>
                  </td>
                  <td class="p-4">
                    <schmancy-typography type="body" token="sm">-</schmancy-typography>
                  </td>
                  <td class="p-4">
                    <schmancy-typography type="body" token="sm">
                      Address string to geocode and display (e.g., "Times Square, New York")
                    </schmancy-typography>
                  </td>
                </tr>
                <tr class="border-t border-outline">
                  <td class="p-4">
                    <code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">latitude</code>
                  </td>
                  <td class="p-4">
                    <schmancy-typography type="body" token="sm">number</schmancy-typography>
                  </td>
                  <td class="p-4">
                    <schmancy-typography type="body" token="sm">-</schmancy-typography>
                  </td>
                  <td class="p-4">
                    <schmancy-typography type="body" token="sm">
                      Latitude coordinate (alternative to address)
                    </schmancy-typography>
                  </td>
                </tr>
                <tr class="border-t border-outline">
                  <td class="p-4">
                    <code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">longitude</code>
                  </td>
                  <td class="p-4">
                    <schmancy-typography type="body" token="sm">number</schmancy-typography>
                  </td>
                  <td class="p-4">
                    <schmancy-typography type="body" token="sm">-</schmancy-typography>
                  </td>
                  <td class="p-4">
                    <schmancy-typography type="body" token="sm">
                      Longitude coordinate (alternative to address)
                    </schmancy-typography>
                  </td>
                </tr>
                <tr class="border-t border-outline">
                  <td class="p-4">
                    <code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">zoom</code>
                  </td>
                  <td class="p-4">
                    <schmancy-typography type="body" token="sm">number</schmancy-typography>
                  </td>
                  <td class="p-4">
                    <schmancy-typography type="body" token="sm">15</schmancy-typography>
                  </td>
                  <td class="p-4">
                    <schmancy-typography type="body" token="sm">
                      Map zoom level (1-20, higher = more detail)
                    </schmancy-typography>
                  </td>
                </tr>
                <tr class="border-t border-outline">
                  <td class="p-4">
                    <code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">height</code>
                  </td>
                  <td class="p-4">
                    <schmancy-typography type="body" token="sm">string</schmancy-typography>
                  </td>
                  <td class="p-4">
                    <schmancy-typography type="body" token="sm">"400px"</schmancy-typography>
                  </td>
                  <td class="p-4">
                    <schmancy-typography type="body" token="sm">
                      Map height with CSS unit (e.g., "400px", "50vh")
                    </schmancy-typography>
                  </td>
                </tr>
                <tr class="border-t border-outline">
                  <td class="p-4">
                    <code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">marker</code>
                  </td>
                  <td class="p-4">
                    <schmancy-typography type="body" token="sm">boolean</schmancy-typography>
                  </td>
                  <td class="p-4">
                    <schmancy-typography type="body" token="sm">true</schmancy-typography>
                  </td>
                  <td class="p-4">
                    <schmancy-typography type="body" token="sm">
                      Show location marker on map
                    </schmancy-typography>
                  </td>
                </tr>
                <tr class="border-t border-outline">
                  <td class="p-4">
                    <code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">markerTitle</code>
                  </td>
                  <td class="p-4">
                    <schmancy-typography type="body" token="sm">string</schmancy-typography>
                  </td>
                  <td class="p-4">
                    <schmancy-typography type="body" token="sm">""</schmancy-typography>
                  </td>
                  <td class="p-4">
                    <schmancy-typography type="body" token="sm">
                      Tooltip text for marker
                    </schmancy-typography>
                  </td>
                </tr>
                <tr class="border-t border-outline">
                  <td class="p-4">
                    <code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">type</code>
                  </td>
                  <td class="p-4">
                    <schmancy-typography type="body" token="sm">'roadmap' | 'satellite' | 'hybrid' | 'terrain'</schmancy-typography>
                  </td>
                  <td class="p-4">
                    <schmancy-typography type="body" token="sm">'roadmap'</schmancy-typography>
                  </td>
                  <td class="p-4">
                    <schmancy-typography type="body" token="sm">
                      Map display type
                    </schmancy-typography>
                  </td>
                </tr>
                <tr class="border-t border-outline">
                  <td class="p-4">
                    <code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">interactive</code>
                  </td>
                  <td class="p-4">
                    <schmancy-typography type="body" token="sm">boolean</schmancy-typography>
                  </td>
                  <td class="p-4">
                    <schmancy-typography type="body" token="sm">true</schmancy-typography>
                  </td>
                  <td class="p-4">
                    <schmancy-typography type="body" token="sm">
                      Allow user interaction (zoom, pan, etc.)
                    </schmancy-typography>
                  </td>
                </tr>
                <tr class="border-t border-outline">
                  <td class="p-4">
                    <code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">controls</code>
                  </td>
                  <td class="p-4">
                    <schmancy-typography type="body" token="sm">boolean</schmancy-typography>
                  </td>
                  <td class="p-4">
                    <schmancy-typography type="body" token="sm">true</schmancy-typography>
                  </td>
                  <td class="p-4">
                    <schmancy-typography type="body" token="sm">
                      Show map controls (zoom, fullscreen)
                    </schmancy-typography>
                  </td>
                </tr>
                <tr class="border-t border-outline">
                  <td class="p-4">
                    <code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">apiKey</code>
                  </td>
                  <td class="p-4">
                    <schmancy-typography type="body" token="sm">string</schmancy-typography>
                  </td>
                  <td class="p-4">
                    <schmancy-typography type="body" token="sm">Required</schmancy-typography>
                  </td>
                  <td class="p-4">
                    <schmancy-typography type="body" token="sm">
                      Google Maps API key (required for map to load)
                    </schmancy-typography>
                  </td>
                </tr>
              </tbody>
            </table>
          </schmancy-surface>
        </div>

        <!-- Setup Instructions -->
        <div class="mb-12">
          <schmancy-typography type="title" token="lg" class="mb-4 block">Setup</schmancy-typography>
          <schmancy-surface type="surfaceDim" class="rounded-lg p-4">
            <schmancy-typography type="body" token="sm" class="mb-2 block">
              To use the Map component, you need a Google Maps API key:
            </schmancy-typography>
            <ol class="list-decimal list-inside space-y-2">
              <li>
                <schmancy-typography type="body" token="sm">
                  Get an API key from the 
                  <a href="https://console.cloud.google.com/google/maps-apis/credentials" target="_blank" class="text-primary-default underline">
                    Google Cloud Console
                  </a>
                </schmancy-typography>
              </li>
              <li>
                <schmancy-typography type="body" token="sm">
                  Enable these APIs in your Google Cloud project:
                </schmancy-typography>
                <ul class="list-disc list-inside ml-4 mt-2 space-y-1">
                  <li class="text-sm">Maps JavaScript API</li>
                  <li class="text-sm">Geocoding API (for address lookup)</li>
                </ul>
              </li>
              <li>
                <schmancy-typography type="body" token="sm">
                  Configure API key restrictions in the Google Cloud Console:
                </schmancy-typography>
                <ul class="list-disc list-inside ml-4 mt-2 space-y-1">
                  <li class="text-sm">For development: Add these entries:
                    <div class="mt-1 space-y-1">
                      <code class="bg-primary-container text-primary-onContainer px-1 rounded block">http://localhost:5176/*</code>
                      <code class="bg-primary-container text-primary-onContainer px-1 rounded block">http://localhost:*</code>
                      <code class="bg-primary-container text-primary-onContainer px-1 rounded block">http://127.0.0.1:*</code>
                    </div>
                  </li>
                  <li class="text-sm">For production: Add <code class="bg-primary-container text-primary-onContainer px-1 rounded">https://yourdomain.com/*</code></li>
                </ul>
              </li>
              <li>
                <schmancy-typography type="body" token="sm">
                  Pass it via the <code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">apiKey</code> property:
                </schmancy-typography>
                <schmancy-code 
                  language="html" 
                  class="mt-2"
                  .code=${`<schmancy-map 
  address="Times Square, New York"
  apiKey="YOUR_GOOGLE_MAPS_API_KEY">
</schmancy-map>`}>
                </schmancy-code>
              </li>
            </ol>
          </schmancy-surface>
        </div>

        <!-- Troubleshooting -->
        <div class="mb-8">
          <schmancy-typography type="title" token="lg" class="mb-4 block">Troubleshooting</schmancy-typography>
          <schmancy-surface type="surfaceDim" class="rounded-lg p-4">
            <schmancy-typography type="body" token="sm" class="mb-2 block font-semibold">
              Common Issues:
            </schmancy-typography>
            <ul class="list-disc list-inside space-y-2">
              <li class="text-sm">
                <strong>REQUEST_DENIED error:</strong> 
                <ul class="list-disc list-inside ml-4 mt-1">
                  <li>Ensure Geocoding API is enabled in Google Cloud Console</li>
                  <li>Check API key restrictions - try removing all restrictions temporarily to test</li>
                  <li>Wait 5-10 minutes after changes for them to propagate</li>
                </ul>
              </li>
              <li class="text-sm">
                <strong>RefererNotAllowedMapError:</strong>
                <ul class="list-disc list-inside ml-4 mt-1">
                  <li>Add your exact domain to API key restrictions</li>
                  <li>Include wildcards: <code class="bg-primary-container text-primary-onContainer px-1 rounded">http://localhost/*</code></li>
                </ul>
              </li>
              <li class="text-sm">
                <strong>For immediate testing:</strong> Remove all API key restrictions in Google Cloud Console (remember to add them back for production)
              </li>
            </ul>
          </schmancy-surface>
        </div>

        <!-- Examples Section -->
        <div>
          <schmancy-typography type="title" token="lg" class="mb-6 block">Examples</schmancy-typography>
          <schmancy-grid gap="lg" class="w-full">
            
            <!-- Basic Usage -->
            <schmancy-code-preview language="html">
              <!-- Basic map with address -->
              <schmancy-map 
                address="Times Square, New York"
                apiKey="${this.apiKey}">
              </schmancy-map>
            </schmancy-code-preview>

            <!-- Using Coordinates -->
            <schmancy-code-preview language="html">
              <!-- Map with precise coordinates -->
              <schmancy-map 
                latitude="40.758" 
                longitude="-73.985"
                markerTitle="Times Square"
                zoom="17"
                apiKey="${this.apiKey}">
              </schmancy-map>
            </schmancy-code-preview>

            <!-- Map Types -->
            <schmancy-code-preview language="html">
              <!-- Different map types -->
              <div class="grid grid-cols-2 gap-4">
                <!-- Roadmap (default) -->
                <schmancy-map 
                  address="Grand Canyon" 
                  type="roadmap"
                  height="250px"
                  apiKey="${this.apiKey}">
                </schmancy-map>
                
                <!-- Satellite -->
                <schmancy-map 
                  address="Grand Canyon" 
                  type="satellite"
                  height="250px"
                  apiKey="${this.apiKey}">
                </schmancy-map>
                
                <!-- Hybrid -->
                <schmancy-map 
                  address="Grand Canyon" 
                  type="hybrid"
                  height="250px"
                  apiKey="${this.apiKey}">
                </schmancy-map>
                
                <!-- Terrain -->
                <schmancy-map 
                  address="Grand Canyon" 
                  type="terrain"
                  height="250px"
                  apiKey="${this.apiKey}">
                </schmancy-map>
              </div>
            </schmancy-code-preview>

            <!-- Custom Height -->
            <schmancy-code-preview language="html">
              <!-- Different height values -->
              <schmancy-map 
                address="Statue of Liberty, New York" 
                height="500px"
                type="satellite"
                zoom="18"
                apiKey="${this.apiKey}">
              </schmancy-map>
            </schmancy-code-preview>

            <!-- Static Map -->
            <schmancy-code-preview language="html">
              <!-- Non-interactive map (no zoom/pan) -->
              <schmancy-map 
                address="Eiffel Tower, Paris" 
                ?interactive=${false}
                ?controls=${false}
                height="300px"
                markerTitle="Eiffel Tower"
                apiKey="${this.apiKey}">
              </schmancy-map>
            </schmancy-code-preview>

            <!-- Famous Landmarks -->
            <schmancy-code-preview language="html">
              <!-- Multiple famous locations -->
              <div class="grid grid-cols-2 gap-4">
                <schmancy-map 
                  address="Colosseum, Rome" 
                  height="250px"
                  markerTitle="Colosseum"
                  type="satellite"
                  apiKey="${this.apiKey}">
                </schmancy-map>
                
                <schmancy-map 
                  address="Sydney Opera House" 
                  height="250px"
                  markerTitle="Sydney Opera House"
                  type="hybrid"
                  apiKey="${this.apiKey}">
                </schmancy-map>
                
                <schmancy-map 
                  address="Taj Mahal, India" 
                  height="250px"
                  markerTitle="Taj Mahal"
                  type="satellite"
                  apiKey="${this.apiKey}">
                </schmancy-map>
                
                <schmancy-map 
                  address="Christ the Redeemer, Rio" 
                  height="250px"
                  markerTitle="Christ the Redeemer"
                  type="terrain"
                  apiKey="${this.apiKey}">
                </schmancy-map>
              </div>
            </schmancy-code-preview>

            <!-- Without Marker -->
            <schmancy-code-preview language="html">
              <!-- Map without location marker -->
              <schmancy-map 
                address="Central Park, New York" 
                ?marker=${false}
                zoom="14"
                height="350px"
                apiKey="${this.apiKey}">
              </schmancy-map>
            </schmancy-code-preview>

            <!-- Custom Zoom Levels -->
            <schmancy-code-preview language="html">
              <!-- Different zoom levels -->
              <div class="grid grid-cols-3 gap-4">
                <!-- City view -->
                <schmancy-map 
                  address="Manhattan, NY" 
                  zoom="11"
                  height="200px"
                  markerTitle="Zoom: 11"
                  apiKey="${this.apiKey}">
                </schmancy-map>
                
                <!-- Neighborhood view -->
                <schmancy-map 
                  address="Manhattan, NY" 
                  zoom="15"
                  height="200px"
                  markerTitle="Zoom: 15"
                  apiKey="${this.apiKey}">
                </schmancy-map>
                
                <!-- Street view -->
                <schmancy-map 
                  address="Manhattan, NY" 
                  zoom="19"
                  height="200px"
                  markerTitle="Zoom: 19"
                  apiKey="${this.apiKey}">
                </schmancy-map>
              </div>
            </schmancy-code-preview>

            <!-- Real-world Example -->
            <schmancy-code-preview language="html">
              <!-- Store locator example -->
              <schmancy-card>
                <div class="p-4">
                  <schmancy-typography type="title" token="md" class="mb-4 block">
                    Our Location
                  </schmancy-typography>
                  <schmancy-map 
                    address="1600 Amphitheatre Parkway, Mountain View, CA" 
                    height="300px"
                    markerTitle="Google Headquarters"
                    type="hybrid"
                    zoom="16"
                    apiKey="${this.apiKey}">
                  </schmancy-map>
                  <div class="mt-4 flex gap-2">
                    <schmancy-button variant="filled">
                      Get Directions
                    </schmancy-button>
                    <schmancy-button variant="outlined">
                      Call Now
                    </schmancy-button>
                  </div>
                </div>
              </schmancy-card>
            </schmancy-code-preview>

          </schmancy-grid>
        </div>
      </schmancy-surface>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'demo-map': DemoMap
  }
}