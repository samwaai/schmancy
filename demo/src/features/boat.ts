import { $LitElement } from '@mixins/index'
import { html } from 'lit'
import { customElement, state } from 'lit/decorators.js'

@customElement('demo-boat')
export class DemoBoat extends $LitElement() {
    @state() boatState: 'hidden' | 'minimized' | 'expanded' = 'hidden'

    render() {
        return html`
            <schmancy-surface class="p-8">
                <!-- Component Title -->
                <schmancy-typography type="display" token="lg" class="mb-4">
                    Boat
                </schmancy-typography>
                <schmancy-typography type="body" token="lg" class="mb-8 text-surface-onVariant">
                    A bottom sheet component that slides up from the bottom of the screen. 
                    Perfect for chat interfaces, media players, and quick settings panels.
                </schmancy-typography>

                <!-- API Table -->
                <schmancy-surface class="mb-12 rounded-lg overflow-hidden">
                    <table class="w-full">
                        <thead class="bg-surface-dim">
                            <tr>
                                <th class="text-left p-4"><schmancy-typography type="label" token="md">Property</schmancy-typography></th>
                                <th class="text-left p-4"><schmancy-typography type="label" token="md">Type</schmancy-typography></th>
                                <th class="text-left p-4"><schmancy-typography type="label" token="md">Default</schmancy-typography></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="border-t border-outline">
                                <td class="p-4"><sch-badge class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">state</sch-badge></td>
                                <td class="p-4"><code class="text-sm">'hidden' | 'minimized' | 'expanded'</code></td>
                                <td class="p-4"><code class="text-sm">'hidden'</code></td>
                            </tr>
                        </tbody>
                    </table>
                </schmancy-surface>

                <!-- Events Table -->
                <schmancy-surface class="mb-12 rounded-lg overflow-hidden">
                    <table class="w-full">
                        <thead class="bg-surface-dim">
                            <tr>
                                <th class="text-left p-4"><schmancy-typography type="label" token="md">Event</schmancy-typography></th>
                                <th class="text-left p-4"><schmancy-typography type="label" token="md">Detail</schmancy-typography></th>
                                <th class="text-left p-4"><schmancy-typography type="label" token="md">Description</schmancy-typography></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="border-t border-outline">
                                <td class="p-4"><sch-badge type="filled">change</sch-badge></td>
                                <td class="p-4"><code class="text-sm">'hidden' | 'minimized' | 'expanded'</code></td>
                                <td class="p-4">Fired when the state changes</td>
                            </tr>
                        </tbody>
                    </table>
                </schmancy-surface>

                <!-- Interactive Controls -->
                <schmancy-surface class="mb-8 p-4 rounded-lg">
                    <schmancy-grid gap="md">
                        <schmancy-typography type="title" token="md">Try it out</schmancy-typography>
                        <schmancy-flex gap="md">
                            <schmancy-button 
                                variant="filled"
                                @click=${() => this.boatState = 'minimized'}
                            >
                                Show Minimized
                            </schmancy-button>
                            <schmancy-button 
                                variant="filled tonal"
                                @click=${() => this.boatState = 'expanded'}
                            >
                                Show Expanded
                            </schmancy-button>
                            <schmancy-button 
                                variant="outlined"
                                @click=${() => this.boatState = 'hidden'}
                            >
                                Hide
                            </schmancy-button>
                        </schmancy-flex>
                        <schmancy-typography type="body" token="sm" class="text-surface-onVariant">
                            Current state: <strong>${this.boatState}</strong>
                        </schmancy-typography>
                    </schmancy-grid>
                </schmancy-surface>

                <!-- Example -->
                <schmancy-code-preview language="html">
&lt;schmancy-boat 
  state="minimized"
  &lt;schmancy-flex slot="header" gap="sm" content="center"&gt;
    &lt;schmancy-icon&gt;chat&lt;/schmancy-icon&gt;
    &lt;schmancy-typography type="title" token="md"&gt;Chat Support&lt;/schmancy-typography&gt;
  &lt;/schmancy-flex&gt;
  
  &lt;schmancy-flex direction="column" gap="md" class="p-4"&gt;
    &lt;schmancy-typography type="body" token="md"&gt;
      How can we help you today?
    &lt;/schmancy-typography&gt;
    &lt;schmancy-button variant="filled"&gt;
      Start Conversation
    &lt;/schmancy-button&gt;
  &lt;/schmancy-flex&gt;
&lt;/schmancy-boat&gt;
                </schmancy-code-preview>
            </schmancy-surface>

            <!-- Live Demo Boat -->
            <schmancy-boat 
                .state=${this.boatState}
                @change=${(e: CustomEvent) => this.boatState = e.detail}
            >
                <schmancy-flex slot="header" gap="sm" content="center">
                    <schmancy-icon>sailing</schmancy-icon>
                    <schmancy-typography type="title" token="md">Interactive Demo</schmancy-typography>
                </schmancy-flex>
                
                <schmancy-flex direction="column" gap="lg" class="p-6">
                    <schmancy-typography type="headline" token="md">
                        Welcome to the Boat Component!
                    </schmancy-typography>
                    
                    <schmancy-typography type="body" token="md">
                        This component slides up from the bottom of the screen and can be minimized 
                        to show just the header, or expanded to show all content.
                    </schmancy-typography>

                    <schmancy-flex gap="md">
                        <schmancy-button variant="filled">
                            <schmancy-icon>thumb_up</schmancy-icon>
                            Like
                        </schmancy-button>
                        <schmancy-button variant="filled tonal">
                            <schmancy-icon>share</schmancy-icon>
                            Share
                        </schmancy-button>
                    </schmancy-flex>
                </schmancy-flex>
            </schmancy-boat>
        `
    }
}

export default DemoBoat