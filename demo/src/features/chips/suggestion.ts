import { $LitElement } from '@mixins/index'
import { html } from 'lit'
import { customElement, state } from 'lit/decorators.js'

@customElement('demo-chips-suggestion')
export class DemoChipsSuggestion extends $LitElement() {
  @state() private selectedSuggestion = '';
  @state() private searchQuery = '';
  @state() private messageReply = '';

  private handleSuggestion(value: string) {
    this.selectedSuggestion = value;
  }

  private handleSearchSuggestion(query: string) {
    this.searchQuery = query;
  }

  private handleReply(reply: string) {
    this.messageReply = reply;
  }

  render() {
    return html`
      <schmancy-surface class="p-8">
        <!-- Header -->
        <schmancy-typography type="display" token="lg" class="mb-4 block">
          Suggestion Chips
        </schmancy-typography>
        <schmancy-typography type="body" token="lg" class="mb-8 text-surface-onVariant block">
          Suggestion chips provide quick options for users to select from. They help users by offering
          contextual suggestions, quick replies, or common search terms.
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
            </tbody>
          </table>
        </schmancy-surface>

        <!-- Examples -->
        <schmancy-typography type="title" token="lg" class="mb-6 block">Examples</schmancy-typography>

        <schmancy-grid gap="lg" class="w-full">
          <!-- Basic Suggestion Chips -->
          <schmancy-code-preview language="html">
            <div class="flex flex-col gap-3">
              <schmancy-typography type="label" token="sm" class="block text-surface-onVariant">
                Basic Suggestions
              </schmancy-typography>
              <schmancy-chips>
                <schmancy-suggestion-chip @click=${() => this.handleSuggestion('yes')}>
                  Yes
                </schmancy-suggestion-chip>
                <schmancy-suggestion-chip @click=${() => this.handleSuggestion('no')}>
                  No
                </schmancy-suggestion-chip>
                <schmancy-suggestion-chip @click=${() => this.handleSuggestion('maybe')}>
                  Maybe
                </schmancy-suggestion-chip>
                <schmancy-suggestion-chip elevated @click=${() => this.handleSuggestion('more')}>
                  Tell me more
                </schmancy-suggestion-chip>
              </schmancy-chips>
              ${this.selectedSuggestion ? html`
                <schmancy-typography type="body" token="xs" class="text-surface-onVariant">
                  Selected: ${this.selectedSuggestion}
                </schmancy-typography>
              ` : ''}
            </div>
          </schmancy-code-preview>

          <!-- Quick Replies with Icons -->
          <schmancy-code-preview language="html">
            <div class="flex flex-col gap-3">
              <schmancy-typography type="label" token="sm" class="block text-surface-onVariant">
                Quick Replies
              </schmancy-typography>
              <schmancy-chips>
                <schmancy-suggestion-chip @click=${() => this.handleReply('yes')}>
                  <schmancy-icon slot="icon">thumb_up</schmancy-icon>
                  Yes, please
                </schmancy-suggestion-chip>
                <schmancy-suggestion-chip @click=${() => this.handleReply('no')}>
                  <schmancy-icon slot="icon">thumb_down</schmancy-icon>
                  No, thanks
                </schmancy-suggestion-chip>
                <schmancy-suggestion-chip @click=${() => this.handleReply('help')}>
                  <schmancy-icon slot="icon">help</schmancy-icon>
                  I need help
                </schmancy-suggestion-chip>
                <schmancy-suggestion-chip elevated @click=${() => this.handleReply('call')}>
                  <schmancy-icon slot="icon">phone</schmancy-icon>
                  Call me
                </schmancy-suggestion-chip>
              </schmancy-chips>
            </div>
          </schmancy-code-preview>

          <!-- Search Suggestions -->
          <schmancy-code-preview language="html">
            <div class="flex flex-col gap-3">
              <schmancy-typography type="label" token="sm" class="block text-surface-onVariant">
                Popular Searches
              </schmancy-typography>
              <schmancy-chips>
                <schmancy-suggestion-chip @click=${() => this.handleSearchSuggestion('best restaurants')}>
                  <schmancy-icon slot="icon">restaurant</schmancy-icon>
                  Best restaurants
                </schmancy-suggestion-chip>
                <schmancy-suggestion-chip @click=${() => this.handleSearchSuggestion('near me')}>
                  <schmancy-icon slot="icon">near_me</schmancy-icon>
                  Near me
                </schmancy-suggestion-chip>
                <schmancy-suggestion-chip @click=${() => this.handleSearchSuggestion('open now')}>
                  <schmancy-icon slot="icon">schedule</schmancy-icon>
                  Open now
                </schmancy-suggestion-chip>
                <schmancy-suggestion-chip @click=${() => this.handleSearchSuggestion('top rated')}>
                  <schmancy-icon slot="icon">star</schmancy-icon>
                  Top rated
                </schmancy-suggestion-chip>
              </div>
              ${this.searchQuery ? html`
                <schmancy-typography type="body" token="xs" class="text-surface-onVariant">
                  Searching for: "${this.searchQuery}"
                </schmancy-typography>
              ` : ''}
            </div>
          </schmancy-code-preview>

          <!-- Time Suggestions -->
          <schmancy-code-preview language="html">
            <div class="flex flex-col gap-3">
              <schmancy-typography type="label" token="sm" class="block text-surface-onVariant">
                When would you like to meet?
              </schmancy-typography>
              <schmancy-chips>
                <schmancy-suggestion-chip>
                  <schmancy-icon slot="icon">schedule</schmancy-icon>
                  Morning
                </schmancy-suggestion-chip>
                <schmancy-suggestion-chip>
                  <schmancy-icon slot="icon">wb_sunny</schmancy-icon>
                  Afternoon
                </schmancy-suggestion-chip>
                <schmancy-suggestion-chip>
                  <schmancy-icon slot="icon">nights_stay</schmancy-icon>
                  Evening
                </schmancy-suggestion-chip>
                <schmancy-suggestion-chip elevated>
                  <schmancy-icon slot="icon">calendar_today</schmancy-icon>
                  Pick a date
                </schmancy-suggestion-chip>
              </schmancy-chips>
            </div>
          </schmancy-code-preview>

          <!-- Duration Suggestions -->
          <schmancy-code-preview language="html">
            <div class="flex flex-col gap-3">
              <schmancy-typography type="label" token="sm" class="block text-surface-onVariant">
                How long?
              </schmancy-typography>
              <schmancy-chips>
                <schmancy-suggestion-chip>15 min</schmancy-suggestion-chip>
                <schmancy-suggestion-chip>30 min</schmancy-suggestion-chip>
                <schmancy-suggestion-chip>1 hour</schmancy-suggestion-chip>
                <schmancy-suggestion-chip>2 hours</schmancy-suggestion-chip>
                <schmancy-suggestion-chip elevated>
                  <schmancy-icon slot="icon">edit</schmancy-icon>
                  Custom
                </schmancy-suggestion-chip>
              </schmancy-chips>
            </div>
          </schmancy-code-preview>

          <!-- Smart Reply Suggestions -->
          <schmancy-code-preview language="html">
            <div class="flex flex-col gap-3">
              <schmancy-typography type="label" token="sm" class="block text-surface-onVariant">
                Smart Replies
              </schmancy-typography>
              <schmancy-chips>
                <schmancy-suggestion-chip>
                  Sounds good!
                </schmancy-suggestion-chip>
                <schmancy-suggestion-chip>
                  Let me check and get back to you
                </schmancy-suggestion-chip>
                <schmancy-suggestion-chip>
                  Can we reschedule?
                </schmancy-suggestion-chip>
                <schmancy-suggestion-chip>
                  I'll send the details
                </schmancy-suggestion-chip>
              </schmancy-chips>
            </div>
          </schmancy-code-preview>

          <!-- Product Recommendations -->
          <schmancy-code-preview language="html">
            <div class="flex flex-col gap-3">
              <schmancy-typography type="label" token="sm" class="block text-surface-onVariant">
                You might also like
              </schmancy-typography>
              <schmancy-chips>
                <schmancy-suggestion-chip>
                  <schmancy-icon slot="icon">laptop</schmancy-icon>
                  Laptop accessories
                </schmancy-suggestion-chip>
                <schmancy-suggestion-chip>
                  <schmancy-icon slot="icon">mouse</schmancy-icon>
                  Wireless mouse
                </schmancy-suggestion-chip>
                <schmancy-suggestion-chip>
                  <schmancy-icon slot="icon">keyboard</schmancy-icon>
                  Keyboards
                </schmancy-suggestion-chip>
                <schmancy-suggestion-chip elevated>
                  <schmancy-icon slot="icon">more_horiz</schmancy-icon>
                  See more
                </schmancy-suggestion-chip>
              </schmancy-chips>
            </div>
          </schmancy-code-preview>

          <!-- Real-World Example: Chatbot Interface -->
          <schmancy-code-preview language="html">
            <schmancy-card>
              <div class="p-6 space-y-4">
                <div class="flex items-start gap-3">
                  <schmancy-icon class="mt-1">smart_toy</schmancy-icon>
                  <div class="flex-1">
                    <schmancy-typography type="body" token="md" class="block mb-3">
                      Hi! I can help you with your order. What would you like to know?
                    </schmancy-typography>
                    <schmancy-chips>
                      <schmancy-suggestion-chip>
                        <schmancy-icon slot="icon">local_shipping</schmancy-icon>
                        Track my order
                      </schmancy-suggestion-chip>
                      <schmancy-suggestion-chip>
                        <schmancy-icon slot="icon">assignment_return</schmancy-icon>
                        Return policy
                      </schmancy-suggestion-chip>
                      <schmancy-suggestion-chip>
                        <schmancy-icon slot="icon">receipt</schmancy-icon>
                        View invoice
                      </schmancy-suggestion-chip>
                      <schmancy-suggestion-chip>
                        <schmancy-icon slot="icon">support_agent</schmancy-icon>
                        Talk to agent
                      </schmancy-suggestion-chip>
                    </schmancy-chips>
                  </div>
                </div>
              </div>
            </schmancy-card>
          </schmancy-code-preview>

          <!-- Real-World Example: Search Filters -->
          <schmancy-code-preview language="html">
            <schmancy-card>
              <div class="p-6 space-y-4">
                <div class="flex items-center gap-3">
                  <schmancy-text-field
                    label="Search"
                    value="coffee shops"
                    class="flex-1"
                  >
                    <schmancy-icon slot="leading-icon">search</schmancy-icon>
                  </schmancy-text-field>
                </div>

                <div>
                  <schmancy-typography type="label" token="sm" class="block mb-2 text-surface-onVariant">
                    Suggestions based on your search:
                  </schmancy-typography>
                  <schmancy-chips>
                    <schmancy-suggestion-chip>
                      <schmancy-icon slot="icon">coffee</schmancy-icon>
                      coffee shops near me
                    </schmancy-suggestion-chip>
                    <schmancy-suggestion-chip>
                      <schmancy-icon slot="icon">wifi</schmancy-icon>
                      coffee shops with wifi
                    </schmancy-suggestion-chip>
                    <schmancy-suggestion-chip>
                      <schmancy-icon slot="icon">schedule</schmancy-icon>
                      coffee shops open now
                    </schmancy-suggestion-chip>
                    <schmancy-suggestion-chip>
                      <schmancy-icon slot="icon">star</schmancy-icon>
                      best coffee shops
                    </schmancy-suggestion-chip>
                  </schmancy-chips>
                </div>

                <div>
                  <schmancy-typography type="label" token="sm" class="block mb-2 text-surface-onVariant">
                    Refine by:
                  </schmancy-typography>
                  <schmancy-chips>
                    <schmancy-suggestion-chip elevated>
                      <schmancy-icon slot="icon">attach_money</schmancy-icon>
                      Price
                    </schmancy-suggestion-chip>
                    <schmancy-suggestion-chip elevated>
                      <schmancy-icon slot="icon">location_on</schmancy-icon>
                      Distance
                    </schmancy-suggestion-chip>
                    <schmancy-suggestion-chip elevated>
                      <schmancy-icon slot="icon">grade</schmancy-icon>
                      Rating
                    </schmancy-suggestion-chip>
                  </schmancy-chips>
                </div>
              </div>
            </schmancy-card>
          </schmancy-code-preview>

          <!-- Real-World Example: Form Helper -->
          <schmancy-code-preview language="html">
            <schmancy-card>
              <div class="p-6 space-y-4">
                <schmancy-typography type="title" token="md" class="block">
                  Create Event
                </schmancy-typography>

                <schmancy-text-field
                  label="Event Title"
                  value="Team Meeting"
                ></schmancy-text-field>

                <div>
                  <schmancy-typography type="label" token="sm" class="block mb-2 text-surface-onVariant">
                    Quick title suggestions:
                  </schmancy-typography>
                  <schmancy-chips>
                    <schmancy-suggestion-chip>Team Meeting</schmancy-suggestion-chip>
                    <schmancy-suggestion-chip>Project Review</schmancy-suggestion-chip>
                    <schmancy-suggestion-chip>1:1 Sync</schmancy-suggestion-chip>
                    <schmancy-suggestion-chip>Brainstorm Session</schmancy-suggestion-chip>
                  </schmancy-chips>
                </div>

                <div>
                  <schmancy-typography type="label" token="sm" class="block mb-2 text-surface-onVariant">
                    Duration:
                  </schmancy-typography>
                  <schmancy-chips>
                    <schmancy-suggestion-chip>30 min</schmancy-suggestion-chip>
                    <schmancy-suggestion-chip elevated>1 hour</schmancy-suggestion-chip>
                    <schmancy-suggestion-chip>2 hours</schmancy-suggestion-chip>
                    <schmancy-suggestion-chip>All day</schmancy-suggestion-chip>
                  </schmancy-chips>
                </div>

                <div>
                  <schmancy-typography type="label" token="sm" class="block mb-2 text-surface-onVariant">
                    Meeting type:
                  </schmancy-typography>
                  <schmancy-chips>
                    <schmancy-suggestion-chip>
                      <schmancy-icon slot="icon">videocam</schmancy-icon>
                      Video call
                    </schmancy-suggestion-chip>
                    <schmancy-suggestion-chip>
                      <schmancy-icon slot="icon">meeting_room</schmancy-icon>
                      In person
                    </schmancy-suggestion-chip>
                    <schmancy-suggestion-chip>
                      <schmancy-icon slot="icon">phone</schmancy-icon>
                      Phone call
                    </schmancy-suggestion-chip>
                  </schmancy-chips>
                </div>
              </div>
            </schmancy-card>
          </schmancy-code-preview>

          <!-- Programmatic Usage -->
          <schmancy-code-preview language="javascript">
            // Dynamic suggestion generation
            class SuggestionEngine {
              constructor(container) {
                this.container = container;
                this.history = [];
              }

              generateSuggestions(context) {
                const suggestions = this.getSuggestionsForContext(context);
                this.renderSuggestions(suggestions);
              }

              getSuggestionsForContext(context) {
                // AI or rule-based suggestion logic
                switch(context.type) {
                  case 'search':
                    return this.getSearchSuggestions(context.query);
                  case 'reply':
                    return this.getSmartReplies(context.message);
                  case 'action':
                    return this.getActionSuggestions(context.state);
                  default:
                    return [];
                }
              }

              renderSuggestions(suggestions) {
                this.container.innerHTML = '';

                suggestions.forEach(suggestion => {
                  const chip = document.createElement('schmancy-suggestion-chip');
                  if (suggestion.elevated) chip.setAttribute('elevated', '');

                  chip.innerHTML = suggestion.icon ?
                    \`<schmancy-icon slot="icon">\${suggestion.icon}</schmancy-icon>\${suggestion.text}\` :
                    suggestion.text;

                  chip.addEventListener('click', () => {
                    this.onSuggestionClick?.(suggestion);
                    this.history.push(suggestion);
                  });

                  this.container.appendChild(chip);
                });
              }

              getSearchSuggestions(query) {
                // Return contextual search suggestions
                return [
                  { text: \`\${query} near me\`, icon: 'near_me' },
                  { text: \`best \${query}\`, icon: 'star' },
                  { text: \`\${query} reviews\`, icon: 'rate_review' },
                  { text: \`cheap \${query}\`, icon: 'attach_money' }
                ];
              }
            }
          </schmancy-code-preview>
        </schmancy-grid>
      </schmancy-surface>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'demo-chips-suggestion': DemoChipsSuggestion;
  }
}