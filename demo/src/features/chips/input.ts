import { $LitElement } from '@mixins/index'
import { html } from 'lit'
import { customElement, state } from 'lit/decorators.js'

@customElement('demo-chips-input')
export class DemoChipsInput extends $LitElement() {
  @state() private tags = ['design', 'development', 'testing', 'documentation'];
  @state() private recipients = ['john@example.com', 'alice@example.com'];
  @state() private skills = ['JavaScript', 'TypeScript', 'React', 'Node.js'];
  @state() private ingredients = ['tomatoes', 'onions', 'garlic', 'basil'];
  @state() private filters = ['in-stock', 'free-shipping', 'on-sale'];

  private removeTag(tag: string) {
    this.tags = this.tags.filter(t => t !== tag);
  }

  private removeRecipient(email: string) {
    this.recipients = this.recipients.filter(r => r !== email);
  }

  private removeSkill(skill: string) {
    this.skills = this.skills.filter(s => s !== skill);
  }

  private removeIngredient(ing: string) {
    this.ingredients = this.ingredients.filter(i => i !== ing);
  }

  private removeFilter(filter: string) {
    this.filters = this.filters.filter(f => f !== filter);
  }

  render() {
    return html`
      <schmancy-surface class="p-8">
        <!-- Header -->
        <schmancy-typography type="display" token="lg" class="mb-4 block">
          Input Chips
        </schmancy-typography>
        <schmancy-typography type="body" token="lg" class="mb-8 text-surface-onVariant block">
          Input chips represent user-provided information that can be removed or edited.
          They're commonly used for tags, email recipients, selected items, and other removable inputs.
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
                  <code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">removable</code>
                </td>
                <td class="p-4">
                  <schmancy-typography type="body" token="sm">boolean</schmancy-typography>
                </td>
                <td class="p-4">
                  <code class="text-sm">false</code>
                </td>
                <td class="p-4">
                  <schmancy-typography type="body" token="sm">Shows remove button</schmancy-typography>
                </td>
              </tr>
              <tr class="border-t border-outline">
                <td class="p-4">
                  <code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">avatar</code>
                </td>
                <td class="p-4">
                  <schmancy-typography type="body" token="sm">boolean</schmancy-typography>
                </td>
                <td class="p-4">
                  <code class="text-sm">false</code>
                </td>
                <td class="p-4">
                  <schmancy-typography type="body" token="sm">Enable avatar mode for circular icons</schmancy-typography>
                </td>
              </tr>
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
                  <schmancy-typography type="body" token="sm">Add elevation shadow</schmancy-typography>
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
            </tbody>
          </table>
        </schmancy-surface>

        <!-- Events -->
        <schmancy-typography type="title" token="lg" class="mb-4 block">Events</schmancy-typography>

        <schmancy-surface type="surfaceDim" class="rounded-lg overflow-hidden mb-12">
          <table class="w-full">
            <thead class="bg-surface-container">
              <tr>
                <th class="text-left p-4">
                  <schmancy-typography type="label" token="md">Event</schmancy-typography>
                </th>
                <th class="text-left p-4">
                  <schmancy-typography type="label" token="md">Detail</schmancy-typography>
                </th>
                <th class="text-left p-4">
                  <schmancy-typography type="label" token="md">Description</schmancy-typography>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-t border-outline">
                <td class="p-4">
                  <code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">@remove</code>
                </td>
                <td class="p-4">
                  <code class="text-sm">void</code>
                </td>
                <td class="p-4">
                  <schmancy-typography type="body" token="sm">Fires when remove button is clicked</schmancy-typography>
                </td>
              </tr>
            </tbody>
          </table>
        </schmancy-surface>

        <!-- Examples -->
        <schmancy-typography type="title" token="lg" class="mb-6 block">Examples</schmancy-typography>

        <schmancy-grid gap="lg" class="w-full">
          <!-- Basic Input Chips -->
          <schmancy-code-preview language="html">
            <div class="flex flex-col gap-3">
              <schmancy-typography type="label" token="sm" class="block text-surface-onVariant">
                Basic Input Chips
              </schmancy-typography>
              <!-- Note: Chips MUST be wrapped in schmancy-chips for proper styling -->
              <schmancy-chips>
                <schmancy-input-chip removable>
                  Simple tag
                </schmancy-input-chip>
                <schmancy-input-chip removable>
                  <schmancy-icon slot="icon">tag</schmancy-icon>
                  With icon
                </schmancy-input-chip>
                <schmancy-input-chip removable elevated>
                  <schmancy-icon slot="icon">star</schmancy-icon>
                  Elevated
                </schmancy-input-chip>
                <schmancy-input-chip removable disabled>
                  Disabled
                </schmancy-input-chip>
              </schmancy-chips>
            </div>
          </schmancy-code-preview>

          <!-- Tags Management -->
          <schmancy-code-preview language="html">
            <div class="flex flex-col gap-3">
              <schmancy-typography type="label" token="sm" class="block text-surface-onVariant">
                Project Tags
              </schmancy-typography>
              <schmancy-chips>
                ${this.tags.map(tag => html`
                  <schmancy-input-chip
                    removable
                    @remove=${() => this.removeTag(tag)}
                  >
                    ${tag}
                  </schmancy-input-chip>
                `)}
                ${this.tags.length === 0 ? html`
                  <schmancy-typography type="body" token="sm" class="text-surface-onVariant">
                    No tags added
                  </schmancy-typography>
                ` : ''}
              </schmancy-chips>
              <schmancy-typography type="body" token="xs" class="text-surface-onVariant">
                ${this.tags.length} tag(s)
              </schmancy-typography>
            </div>
          </schmancy-code-preview>

          <!-- Email Recipients with Avatars -->
          <schmancy-code-preview language="html">
            <div class="flex flex-col gap-3">
              <schmancy-typography type="label" token="sm" class="block text-surface-onVariant">
                Email Recipients
              </schmancy-typography>
              <schmancy-chips>
                ${this.recipients.map(email => html`
                  <schmancy-input-chip
                    avatar
                    removable
                    @remove=${() => this.removeRecipient(email)}
                  >
                    <schmancy-icon slot="icon">person</schmancy-icon>
                    ${email}
                  </schmancy-input-chip>
                `)}
                <schmancy-assist-chip elevated>
                  <schmancy-icon slot="icon">add</schmancy-icon>
                  Add recipient
                </schmancy-assist-chip>
              </schmancy-chips>
            </div>
          </schmancy-code-preview>

          <!-- Skills with Icons -->
          <schmancy-code-preview language="html">
            <div class="flex flex-col gap-3">
              <schmancy-typography type="label" token="sm" class="block text-surface-onVariant">
                Technical Skills
              </schmancy-typography>
              <schmancy-chips>
                ${this.skills.map(skill => html`
                  <schmancy-input-chip
                    removable
                    @remove=${() => this.removeSkill(skill)}
                  >
                    <schmancy-icon slot="icon">code</schmancy-icon>
                    ${skill}
                  </schmancy-input-chip>
                `)}
              </schmancy-chips>
            </div>
          </schmancy-code-preview>

          <!-- Recipe Ingredients -->
          <schmancy-code-preview language="html">
            <div class="flex flex-col gap-3">
              <schmancy-typography type="label" token="sm" class="block text-surface-onVariant">
                Recipe Ingredients
              </schmancy-typography>
              <schmancy-chips>
                ${this.ingredients.map(ing => html`
                  <schmancy-input-chip
                    removable
                    @remove=${() => this.removeIngredient(ing)}
                  >
                    <schmancy-icon slot="icon">restaurant</schmancy-icon>
                    ${ing}
                  </schmancy-input-chip>
                `)}
                <schmancy-assist-chip>
                  <schmancy-icon slot="icon">add</schmancy-icon>
                  Add ingredient
                </schmancy-assist-chip>
              </schmancy-chips>
            </div>
          </schmancy-code-preview>

          <!-- Applied Filters -->
          <schmancy-code-preview language="html">
            <div class="flex flex-col gap-3">
              <schmancy-typography type="label" token="sm" class="block text-surface-onVariant">
                Applied Filters
              </schmancy-typography>
              <schmancy-chips>
                ${this.filters.map(filter => html`
                  <schmancy-input-chip
                    removable
                    elevated
                    @remove=${() => this.removeFilter(filter)}
                  >
                    <schmancy-icon slot="icon">
                      ${filter === 'in-stock' ? 'check_circle' :
                        filter === 'free-shipping' ? 'local_shipping' : 'sell'}
                    </schmancy-icon>
                    ${filter.replace('-', ' ')}
                  </schmancy-input-chip>
                `)}
                ${this.filters.length > 0 ? html`
                  <schmancy-button variant="text" size="sm">
                    Clear all
                  </schmancy-button>
                ` : ''}
              </schmancy-chips>
            </div>
          </schmancy-code-preview>

          <!-- Contact List with Avatars -->
          <schmancy-code-preview language="html">
            <div class="flex flex-col gap-3">
              <schmancy-typography type="label" token="sm" class="block text-surface-onVariant">
                Team Members
              </schmancy-typography>
              <schmancy-chips>
                <schmancy-input-chip avatar removable>
                  <span slot="icon" class="w-6 h-6 rounded-full bg-primary text-primary-on flex items-center justify-center text-xs">JD</span>
                  John Doe
                </schmancy-input-chip>
                <schmancy-input-chip avatar removable>
                  <span slot="icon" class="w-6 h-6 rounded-full bg-secondary text-secondary-on flex items-center justify-center text-xs">AS</span>
                  Alice Smith
                </schmancy-input-chip>
                <schmancy-input-chip avatar removable>
                  <span slot="icon" class="w-6 h-6 rounded-full bg-tertiary text-tertiary-on flex items-center justify-center text-xs">BJ</span>
                  Bob Johnson
                </schmancy-input-chip>
                <schmancy-input-chip avatar removable elevated>
                  <schmancy-icon slot="icon">group</schmancy-icon>
                  Engineering Team
                </schmancy-input-chip>
              </schmancy-chips>
            </div>
          </schmancy-code-preview>

          <!-- Real-World Example: Email Composer -->
          <schmancy-code-preview language="html">
            <schmancy-card>
              <div class="p-6 space-y-4">
                <schmancy-typography type="title" token="md" class="block">
                  Compose Email
                </schmancy-typography>

                <schmancy-divider></schmancy-divider>

                <!-- To Field -->
                <div>
                  <schmancy-typography type="label" token="sm" class="block mb-2 text-surface-onVariant">
                    To:
                  </schmancy-typography>
                  <div class="p-3 border border-outline rounded-lg min-h-[48px]">
                    <schmancy-chips>
                      <schmancy-input-chip avatar removable>
                        <schmancy-icon slot="icon">person</schmancy-icon>
                        john@example.com
                      </schmancy-input-chip>
                      <schmancy-input-chip avatar removable>
                        <schmancy-icon slot="icon">person</schmancy-icon>
                        alice@example.com
                      </schmancy-input-chip>
                      <input
                        type="email"
                        placeholder="Add recipient..."
                        class="flex-1 min-w-[150px] outline-none bg-transparent"
                      />
                    </schmancy-chips>
                  </div>
                </div>

                <!-- CC Field -->
                <div>
                  <schmancy-typography type="label" token="sm" class="block mb-2 text-surface-onVariant">
                    CC:
                  </schmancy-typography>
                  <div class="p-3 border border-outline rounded-lg min-h-[48px]">
                    <schmancy-chips>
                      <schmancy-input-chip avatar removable>
                        <schmancy-icon slot="icon">person</schmancy-icon>
                        manager@example.com
                      </schmancy-input-chip>
                      <input
                        type="email"
                        placeholder="Add CC..."
                        class="flex-1 min-w-[150px] outline-none bg-transparent"
                      />
                    </schmancy-chips>
                  </div>
                </div>

                <!-- Tags -->
                <div>
                  <schmancy-typography type="label" token="sm" class="block mb-2 text-surface-onVariant">
                    Tags:
                  </schmancy-typography>
                  <schmancy-chips>
                    <schmancy-input-chip removable>
                      <schmancy-icon slot="icon">label</schmancy-icon>
                      important
                    </schmancy-input-chip>
                    <schmancy-input-chip removable>
                      <schmancy-icon slot="icon">label</schmancy-icon>
                      follow-up
                    </schmancy-input-chip>
                    <schmancy-input-chip removable>
                      <schmancy-icon slot="icon">label</schmancy-icon>
                      project-x
                    </schmancy-input-chip>
                    <schmancy-assist-chip>
                      <schmancy-icon slot="icon">add</schmancy-icon>
                      Add tag
                    </schmancy-assist-chip>
                  </schmancy-chips>
                </div>
              </div>
            </schmancy-card>
          </schmancy-code-preview>

          <!-- Real-World Example: Search Filters -->
          <schmancy-code-preview language="html">
            <schmancy-card>
              <div class="p-6 space-y-4">
                <div class="flex items-center justify-between">
                  <schmancy-typography type="title" token="md">
                    Search Results
                  </schmancy-typography>
                  <schmancy-typography type="body" token="sm" class="text-surface-onVariant">
                    247 results
                  </schmancy-typography>
                </div>

                <div class="p-3 bg-surface-container rounded-lg">
                  <schmancy-chips>
                    <schmancy-input-chip removable elevated>
                      <schmancy-icon slot="icon">category</schmancy-icon>
                      Electronics
                    </schmancy-input-chip>
                    <schmancy-input-chip removable elevated>
                      <schmancy-icon slot="icon">attach_money</schmancy-icon>
                      Under $100
                    </schmancy-input-chip>
                    <schmancy-input-chip removable elevated>
                      <schmancy-icon slot="icon">star</schmancy-icon>
                      4+ stars
                    </schmancy-input-chip>
                    <schmancy-input-chip removable elevated>
                      <schmancy-icon slot="icon">local_shipping</schmancy-icon>
                      Free shipping
                    </schmancy-input-chip>
                    <schmancy-button variant="text" size="sm">
                      Clear all filters
                    </schmancy-button>
                  </schmancy-chips>
                </div>
              </div>
            </schmancy-card>
          </schmancy-code-preview>

          <!-- Programmatic Usage -->
          <schmancy-code-preview language="javascript">
            // Managing input chips dynamically
            class TagManager {
              constructor(container) {
                this.container = container;
                this.tags = new Set();
              }

              addTag(text, icon = 'tag') {
                if (this.tags.has(text)) return;

                const chip = document.createElement('schmancy-input-chip');
                chip.setAttribute('removable', '');
                chip.innerHTML = \`
                  <schmancy-icon slot="icon">\${icon}</schmancy-icon>
                  \${text}
                \`;

                chip.addEventListener('remove', () => {
                  this.removeTag(text);
                  chip.remove();
                });

                this.container.appendChild(chip);
                this.tags.add(text);
              }

              removeTag(text) {
                this.tags.delete(text);
                this.onTagsChange?.(Array.from(this.tags));
              }

              getTags() {
                return Array.from(this.tags);
              }
            }

            // Usage
            const tagManager = new TagManager(document.querySelector('.tag-container'));
            tagManager.onTagsChange = (tags) => console.log('Tags:', tags);
            tagManager.addTag('JavaScript', 'code');
            tagManager.addTag('React', 'code');
          </schmancy-code-preview>
        </schmancy-grid>
      </schmancy-surface>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'demo-chips-input': DemoChipsInput;
  }
}