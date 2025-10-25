import { $LitElement } from '@mhmo91/schmancy/mixins'
import { html } from 'lit'
import { customElement, state } from 'lit/decorators.js'

@customElement('demo-chips-assist')
export class DemoChipsAssist extends $LitElement() {
  @state() private lastAction = '';
  @state() private actionCount = 0;

  private handleAction(action: string) {
    this.lastAction = action;
    this.actionCount++;
  }

  render() {
    return html`
      <schmancy-surface class="p-8">
        <!-- Header -->
        <schmancy-typography type="display" token="lg" class="mb-4 block">
          Assist Chips
        </schmancy-typography>
        <schmancy-typography type="body" token="lg" class="mb-8 text-surface-onVariant block">
          Assist chips trigger actions, open new views, or provide contextual assistance.
          They're typically used to offer shortcuts to common actions or smart suggestions based on context.
        </schmancy-typography>

        <!-- API Reference -->
        <schmancy-typography type="title" token="lg" class="mb-4 block">API Reference</schmancy-typography>

        <schmancy-surface type="surfaceDim" class="rounded-lg overflow-hidden mb-12">
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
                  <code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">elevated</code>
                </td>
                <td class="p-4">
                  <schmancy-typography type="body" token="sm">boolean</schmancy-typography>
                </td>
                <td class="p-4">
                  <code class="text-sm">false</code>
                </td>
                <td class="p-4">
                  <schmancy-typography type="body" token="sm">Add elevation shadow for emphasis</schmancy-typography>
                </td>
              </tr>
              <tr class="border-t border-outline">
                <td class="p-4">
                  <code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">disabled</code>
                </td>
                <td class="p-4">
                  <schmancy-typography type="body" token="sm">boolean</schmancy-typography>
                </td>
                <td class="p-4">
                  <code class="text-sm">false</code>
                </td>
                <td class="p-4">
                  <schmancy-typography type="body" token="sm">Disable the chip</schmancy-typography>
                </td>
              </tr>
              <tr class="border-t border-outline">
                <td class="p-4">
                  <code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">label</code>
                </td>
                <td class="p-4">
                  <schmancy-typography type="body" token="sm">string</schmancy-typography>
                </td>
                <td class="p-4">
                  <code class="text-sm">''</code>
                </td>
                <td class="p-4">
                  <schmancy-typography type="body" token="sm">Text label</schmancy-typography>
                </td>
              </tr>
              <tr class="border-t border-outline">
                <td class="p-4">
                  <code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">href</code>
                </td>
                <td class="p-4">
                  <schmancy-typography type="body" token="sm">string</schmancy-typography>
                </td>
                <td class="p-4">
                  <code class="text-sm">''</code>
                </td>
                <td class="p-4">
                  <schmancy-typography type="body" token="sm">Makes chip behave as a link</schmancy-typography>
                </td>
              </tr>
              <tr class="border-t border-outline">
                <td class="p-4">
                  <code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">target</code>
                </td>
                <td class="p-4">
                  <schmancy-typography type="body" token="sm">string</schmancy-typography>
                </td>
                <td class="p-4">
                  <code class="text-sm">''</code>
                </td>
                <td class="p-4">
                  <schmancy-typography type="body" token="sm">Link target (e.g., '_blank')</schmancy-typography>
                </td>
              </tr>
            </tbody>
          </table>
        </schmancy-surface>

        <!-- Examples -->
        <schmancy-typography type="title" token="lg" class="mb-6 block">Examples</schmancy-typography>

        <schmancy-grid gap="lg" class="w-full">
          <!-- Basic Assist Chips -->
          <schmancy-code-preview language="html">
            <div class="flex flex-col gap-3">
              <schmancy-typography type="label" token="sm" class="block text-surface-onVariant">
                Basic Actions
              </schmancy-typography>
              <!-- Note: Chips MUST be wrapped in schmancy-chips for proper styling -->
              <schmancy-chips>
                <schmancy-assist-chip @click=${() => this.handleAction('help')}>
                  <schmancy-icon slot="icon">help</schmancy-icon>
                  Help
                </schmancy-assist-chip>
                <schmancy-assist-chip @click=${() => this.handleAction('settings')}>
                  <schmancy-icon slot="icon">settings</schmancy-icon>
                  Settings
                </schmancy-assist-chip>
                <schmancy-assist-chip elevated @click=${() => this.handleAction('add')}>
                  <schmancy-icon slot="icon">add</schmancy-icon>
                  Add Item
                </schmancy-assist-chip>
                <schmancy-assist-chip disabled>
                  <schmancy-icon slot="icon">lock</schmancy-icon>
                  Locked
                </schmancy-assist-chip>
              </schmancy-chips>
              ${this.lastAction ? html`
                <schmancy-typography type="body" token="xs" class="text-surface-onVariant">
                  Last action: ${this.lastAction} (${this.actionCount} total)
                </schmancy-typography>
              ` : ''}
            </div>
          </schmancy-code-preview>

          <!-- Calendar & Time Actions -->
          <schmancy-code-preview language="html">
            <div class="flex flex-col gap-3">
              <schmancy-typography type="label" token="sm" class="block text-surface-onVariant">
                Date & Time Actions
              </schmancy-typography>
              <schmancy-chips>
                <schmancy-assist-chip>
                  <schmancy-icon slot="icon">calendar_today</schmancy-icon>
                  Set date
                </schmancy-assist-chip>
                <schmancy-assist-chip>
                  <schmancy-icon slot="icon">schedule</schmancy-icon>
                  Set time
                </schmancy-assist-chip>
                <schmancy-assist-chip>
                  <schmancy-icon slot="icon">alarm</schmancy-icon>
                  Set alarm
                </schmancy-assist-chip>
                <schmancy-assist-chip>
                  <schmancy-icon slot="icon">timer</schmancy-icon>
                  Start timer
                </schmancy-assist-chip>
                <schmancy-assist-chip elevated>
                  <schmancy-icon slot="icon">event</schmancy-icon>
                  Create event
                </schmancy-assist-chip>
              </schmancy-chips>
            </div>
          </schmancy-code-preview>

          <!-- Navigation Actions -->
          <schmancy-code-preview language="html">
            <div class="flex flex-col gap-3">
              <schmancy-typography type="label" token="sm" class="block text-surface-onVariant">
                Navigation & Directions
              </schmancy-typography>
              <schmancy-chips>
                <schmancy-assist-chip>
                  <schmancy-icon slot="icon">directions</schmancy-icon>
                  Get directions
                </schmancy-assist-chip>
                <schmancy-assist-chip>
                  <schmancy-icon slot="icon">map</schmancy-icon>
                  View map
                </schmancy-assist-chip>
                <schmancy-assist-chip>
                  <schmancy-icon slot="icon">near_me</schmancy-icon>
                  Nearby places
                </schmancy-assist-chip>
                <schmancy-assist-chip>
                  <schmancy-icon slot="icon">navigation</schmancy-icon>
                  Start navigation
                </schmancy-assist-chip>
                <schmancy-assist-chip elevated>
                  <schmancy-icon slot="icon">my_location</schmancy-icon>
                  Share location
                </schmancy-assist-chip>
              </schmancy-chips>
            </div>
          </schmancy-code-preview>

          <!-- Communication Actions -->
          <schmancy-code-preview language="html">
            <div class="flex flex-col gap-3">
              <schmancy-typography type="label" token="sm" class="block text-surface-onVariant">
                Communication
              </schmancy-typography>
              <schmancy-chips>
                <schmancy-assist-chip>
                  <schmancy-icon slot="icon">call</schmancy-icon>
                  Call
                </schmancy-assist-chip>
                <schmancy-assist-chip>
                  <schmancy-icon slot="icon">message</schmancy-icon>
                  Message
                </schmancy-assist-chip>
                <schmancy-assist-chip>
                  <schmancy-icon slot="icon">email</schmancy-icon>
                  Email
                </schmancy-assist-chip>
                <schmancy-assist-chip>
                  <schmancy-icon slot="icon">videocam</schmancy-icon>
                  Video call
                </schmancy-assist-chip>
                <schmancy-assist-chip>
                  <schmancy-icon slot="icon">share</schmancy-icon>
                  Share
                </schmancy-assist-chip>
              </schmancy-chips>
            </div>
          </schmancy-code-preview>

          <!-- Smart Suggestions -->
          <schmancy-code-preview language="html">
            <div class="flex flex-col gap-3">
              <schmancy-typography type="label" token="sm" class="block text-surface-onVariant">
                Smart Suggestions (Context-Aware)
              </schmancy-typography>
              <schmancy-chips>
                <schmancy-assist-chip elevated>
                  <schmancy-icon slot="icon">auto_awesome</schmancy-icon>
                  AI Enhance
                </schmancy-assist-chip>
                <schmancy-assist-chip>
                  <schmancy-icon slot="icon">translate</schmancy-icon>
                  Translate
                </schmancy-assist-chip>
                <schmancy-assist-chip>
                  <schmancy-icon slot="icon">summarize</schmancy-icon>
                  Summarize
                </schmancy-assist-chip>
                <schmancy-assist-chip>
                  <schmancy-icon slot="icon">spellcheck</schmancy-icon>
                  Check spelling
                </schmancy-assist-chip>
                <schmancy-assist-chip>
                  <schmancy-icon slot="icon">smart_toy</schmancy-icon>
                  AI Assistant
                </schmancy-assist-chip>
              </schmancy-chips>
            </div>
          </schmancy-code-preview>

          <!-- Media Actions -->
          <schmancy-code-preview language="html">
            <div class="flex flex-col gap-3">
              <schmancy-typography type="label" token="sm" class="block text-surface-onVariant">
                Media Actions
              </schmancy-typography>
              <schmancy-chips>
                <schmancy-assist-chip>
                  <schmancy-icon slot="icon">photo_camera</schmancy-icon>
                  Take photo
                </schmancy-assist-chip>
                <schmancy-assist-chip>
                  <schmancy-icon slot="icon">videocam</schmancy-icon>
                  Record video
                </schmancy-assist-chip>
                <schmancy-assist-chip>
                  <schmancy-icon slot="icon">mic</schmancy-icon>
                  Record audio
                </schmancy-assist-chip>
                <schmancy-assist-chip>
                  <schmancy-icon slot="icon">qr_code_scanner</schmancy-icon>
                  Scan QR code
                </schmancy-assist-chip>
                <schmancy-assist-chip>
                  <schmancy-icon slot="icon">upload_file</schmancy-icon>
                  Upload file
                </schmancy-assist-chip>
              </schmancy-chips>
            </div>
          </schmancy-code-preview>

          <!-- Assist Chips as Links -->
          <schmancy-code-preview language="html">
            <div class="flex flex-col gap-3">
              <schmancy-typography type="label" token="sm" class="block text-surface-onVariant">
                Links & External Actions
              </schmancy-typography>
              <schmancy-chips>
                <schmancy-assist-chip href="https://github.com" target="_blank">
                  <schmancy-icon slot="icon">code</schmancy-icon>
                  View source
                </schmancy-assist-chip>
                <schmancy-assist-chip href="/docs" target="_blank">
                  <schmancy-icon slot="icon">description</schmancy-icon>
                  Documentation
                </schmancy-assist-chip>
                <schmancy-assist-chip href="mailto:support@example.com">
                  <schmancy-icon slot="icon">support_agent</schmancy-icon>
                  Contact support
                </schmancy-assist-chip>
                <schmancy-assist-chip href="tel:+1234567890">
                  <schmancy-icon slot="icon">phone</schmancy-icon>
                  Call us
                </schmancy-assist-chip>
              </schmancy-chips>
            </div>
          </schmancy-code-preview>

          <!-- Real-World Example: Document Editor Actions -->
          <schmancy-code-preview language="html">
            <schmancy-card>
              <div class="p-6 space-y-4">
                <schmancy-typography type="title" token="md" class="block">
                  Document Quick Actions
                </schmancy-typography>

                <schmancy-divider></schmancy-divider>

                <!-- Main Actions -->
                <div>
                  <schmancy-typography type="label" token="sm" class="block mb-2 text-surface-onVariant">
                    Edit Actions
                  </schmancy-typography>
                  <schmancy-chips>
                    <schmancy-assist-chip elevated>
                      <schmancy-icon slot="icon">edit</schmancy-icon>
                      Edit
                    </schmancy-assist-chip>
                    <schmancy-assist-chip>
                      <schmancy-icon slot="icon">format_paint</schmancy-icon>
                      Format
                    </schmancy-assist-chip>
                    <schmancy-assist-chip>
                      <schmancy-icon slot="icon">find_replace</schmancy-icon>
                      Find & Replace
                    </schmancy-assist-chip>
                  </schmancy-chips>
                </div>

                <!-- Insert Options -->
                <div>
                  <schmancy-typography type="label" token="sm" class="block mb-2 text-surface-onVariant">
                    Insert
                  </schmancy-typography>
                  <schmancy-chips>
                    <schmancy-assist-chip>
                      <schmancy-icon slot="icon">image</schmancy-icon>
                      Image
                    </schmancy-assist-chip>
                    <schmancy-assist-chip>
                      <schmancy-icon slot="icon">table_chart</schmancy-icon>
                      Table
                    </schmancy-assist-chip>
                    <schmancy-assist-chip>
                      <schmancy-icon slot="icon">link</schmancy-icon>
                      Link
                    </schmancy-assist-chip>
                    <schmancy-assist-chip>
                      <schmancy-icon slot="icon">code</schmancy-icon>
                      Code block
                    </schmancy-assist-chip>
                  </schmancy-chips>
                </div>

                <!-- AI Features -->
                <div>
                  <schmancy-typography type="label" token="sm" class="block mb-2 text-surface-onVariant">
                    AI Assistance
                  </schmancy-typography>
                  <schmancy-chips>
                    <schmancy-assist-chip elevated>
                      <schmancy-icon slot="icon">auto_fix_high</schmancy-icon>
                      Improve writing
                    </schmancy-assist-chip>
                    <schmancy-assist-chip>
                      <schmancy-icon slot="icon">summarize</schmancy-icon>
                      Summarize
                    </schmancy-assist-chip>
                    <schmancy-assist-chip>
                      <schmancy-icon slot="icon">translate</schmancy-icon>
                      Translate
                    </schmancy-assist-chip>
                  </schmancy-chips>
                </div>
              </div>
            </schmancy-card>
          </schmancy-code-preview>

          <!-- Real-World Example: Shopping Assistant -->
          <schmancy-code-preview language="html">
            <schmancy-card>
              <div class="p-6 space-y-4">
                <schmancy-typography type="title" token="md" class="block">
                  Shopping Assistant
                </schmancy-typography>

                <schmancy-chips>
                  <schmancy-assist-chip elevated>
                    <schmancy-icon slot="icon">shopping_cart</schmancy-icon>
                    View cart
                  </schmancy-assist-chip>
                  <schmancy-assist-chip>
                    <schmancy-icon slot="icon">favorite_border</schmancy-icon>
                    Save for later
                  </schmancy-assist-chip>
                  <schmancy-assist-chip>
                    <schmancy-icon slot="icon">compare</schmancy-icon>
                    Compare items
                  </schmancy-assist-chip>
                  <schmancy-assist-chip>
                    <schmancy-icon slot="icon">local_shipping</schmancy-icon>
                    Track order
                  </schmancy-assist-chip>
                  <schmancy-assist-chip>
                    <schmancy-icon slot="icon">support_agent</schmancy-icon>
                    Chat with agent
                  </schmancy-assist-chip>
                  <schmancy-assist-chip>
                    <schmancy-icon slot="icon">qr_code</schmancy-icon>
                    Scan barcode
                  </schmancy-assist-chip>
                </schmancy-chips>
              </div>
            </schmancy-card>
          </schmancy-code-preview>

          <!-- Programmatic Usage -->
          <schmancy-code-preview language="javascript">
            // Handling assist chip actions programmatically
            const assistChip = document.querySelector('schmancy-assist-chip');

            // Add click handler
            assistChip.addEventListener('click', (event) => {
              const action = event.target.getAttribute('data-action');

              switch(action) {
                case 'calendar':
                  openDatePicker();
                  break;
                case 'location':
                  getCurrentLocation();
                  break;
                case 'ai-assist':
                  launchAIAssistant();
                  break;
                default:
                  console.log('Action:', action);
              }
            });

            // Dynamically create assist chips
            function createAssistChips(actions) {
              const container = document.querySelector('.chip-container');

              actions.forEach(action => {
                const chip = document.createElement('schmancy-assist-chip');
                chip.innerHTML = \`
                  <schmancy-icon slot="icon">\${action.icon}</schmancy-icon>
                  \${action.label}
                \`;
                chip.addEventListener('click', () => action.handler());
                container.appendChild(chip);
              });
            }
          </schmancy-code-preview>
        </schmancy-grid>
      </schmancy-surface>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'demo-chips-assist': DemoChipsAssist;
  }
}