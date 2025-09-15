import { $LitElement } from '@mixins/index'
import { html } from 'lit'
import { customElement, state } from 'lit/decorators.js'

@customElement('demo-chips-interactive')
export class DemoChipsInteractive extends $LitElement() {
  @state() private tags: string[] = ['design', 'development'];
  @state() private newTag = '';
  @state() private filters: string[] = [];
  @state() private searchSuggestions = ['coffee', 'restaurants', 'hotels', 'shopping'];
  @state() private selectedSuggestion = '';
  @state() private taskStatus = 'todo';
  @state() private selectedEmails: string[] = [];
  @state() private availableEmails = [
    'john@example.com',
    'alice@example.com',
    'bob@example.com',
    'sarah@example.com'
  ];

  private addTag() {
    if (this.newTag && !this.tags.includes(this.newTag)) {
      this.tags = [...this.tags, this.newTag];
      this.newTag = '';
    }
  }

  private removeTag(tag: string) {
    this.tags = this.tags.filter(t => t !== tag);
  }

  private toggleFilter(filter: string) {
    const index = this.filters.indexOf(filter);
    if (index >= 0) {
      this.filters = this.filters.filter(f => f !== filter);
    } else {
      this.filters = [...this.filters, filter];
    }
  }

  private selectSuggestion(suggestion: string) {
    this.selectedSuggestion = suggestion;
    // Remove from suggestions after selection
    this.searchSuggestions = this.searchSuggestions.filter(s => s !== suggestion);
    // Add back after 3 seconds
    setTimeout(() => {
      if (!this.searchSuggestions.includes(suggestion)) {
        this.searchSuggestions = [...this.searchSuggestions, suggestion];
      }
    }, 3000);
  }

  private toggleEmail(email: string) {
    const index = this.selectedEmails.indexOf(email);
    if (index >= 0) {
      this.selectedEmails = this.selectedEmails.filter(e => e !== email);
    } else {
      this.selectedEmails = [...this.selectedEmails, email];
    }
  }

  render() {
    return html`
      <schmancy-surface class="p-8">
        <!-- Header -->
        <schmancy-typography type="display" token="lg" class="mb-4 block">
          Interactive Chip Examples
        </schmancy-typography>
        <schmancy-typography type="body" token="lg" class="mb-8 text-surface-onVariant block">
          Real-world interactive patterns combining chips with other components for dynamic user experiences.
        </schmancy-typography>

        <!-- Examples -->
        <schmancy-typography type="title" token="lg" class="mb-6 block">Interactive Patterns</schmancy-typography>

        <schmancy-grid gap="lg" class="w-full">
          <!-- Dynamic Tag Input -->
          <schmancy-code-preview language="html">
            <schmancy-card>
              <div class="p-6 space-y-4">
                <schmancy-typography type="title" token="md" class="block">
                  Dynamic Tag Management
                </schmancy-typography>

                <div class="flex gap-2">
                  <schmancy-text-field
                    label="Add tag"
                    .value="${this.newTag}"
                    @input="${(e: Event) => this.newTag = (e.target as HTMLInputElement).value}"
                    @keydown="${(e: KeyboardEvent) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        this.addTag();
                      }
                    }}"
                    class="flex-1"
                  >
                    <schmancy-icon slot="leading-icon">label</schmancy-icon>
                  </schmancy-text-field>
                  <schmancy-button
                    variant="filled"
                    @click="${this.addTag}"
                    ?disabled="${!this.newTag}"
                  >
                    <schmancy-icon>add</schmancy-icon>
                    Add
                  </schmancy-button>
                </div>

                <div class="min-h-[40px] p-3 bg-surface-container rounded-lg">
                  <schmancy-chips>
                    ${this.tags.map(tag => html`
                      <schmancy-input-chip
                        removable
                        @remove="${() => this.removeTag(tag)}"
                      >
                        ${tag}
                      </schmancy-input-chip>
                    `)}
                    ${this.tags.length === 0 ? html`
                      <schmancy-typography type="body" token="sm" class="text-surface-onVariant">
                        No tags added yet
                      </schmancy-typography>
                    ` : ''}
                  </schmancy-chips>
                </div>

                <schmancy-typography type="body" token="xs" class="text-surface-onVariant">
                  ${this.tags.length} tag(s) • Try adding: "urgent", "bug", "feature"
                </schmancy-typography>
              </div>
            </schmancy-card>
          </schmancy-code-preview>

          <!-- Live Filter Updates -->
          <schmancy-code-preview language="html">
            <schmancy-card>
              <div class="p-6 space-y-4">
                <schmancy-typography type="title" token="md" class="block">
                  Live Filter Results
                </schmancy-typography>

                <div>
                  <schmancy-typography type="label" token="sm" class="block mb-2 text-surface-onVariant">
                    Filter Options
                  </schmancy-typography>
                  <schmancy-chips>
                    <schmancy-filter-chip
                      .selected="${this.filters.includes('available')}"
                      @click="${() => this.toggleFilter('available')}"
                    >
                      <schmancy-icon slot="icon">check_circle</schmancy-icon>
                      Available
                    </schmancy-filter-chip>
                    <schmancy-filter-chip
                      .selected="${this.filters.includes('featured')}"
                      @click="${() => this.toggleFilter('featured')}"
                    >
                      <schmancy-icon slot="icon">star</schmancy-icon>
                      Featured
                    </schmancy-filter-chip>
                    <schmancy-filter-chip
                      .selected="${this.filters.includes('new')}"
                      @click="${() => this.toggleFilter('new')}"
                    >
                      <schmancy-icon slot="icon">new_releases</schmancy-icon>
                      New
                    </schmancy-filter-chip>
                    <schmancy-filter-chip
                      .selected="${this.filters.includes('sale')}"
                      @click="${() => this.toggleFilter('sale')}"
                    >
                      <schmancy-icon slot="icon">sell</schmancy-icon>
                      On Sale
                    </schmancy-filter-chip>
                  </div>
                </div>

                <schmancy-divider></schmancy-divider>

                <div class="space-y-2">
                  <schmancy-typography type="body" token="md" class="block">
                    Results ${this.filters.length > 0 ? `(Filtered)` : `(All)`}
                  </schmancy-typography>

                  ${this.filters.length === 0 ? html`
                    <div class="p-4 bg-surface-container rounded-lg">
                      <schmancy-typography type="body" token="sm" class="text-surface-onVariant">
                        Showing all items. Select filters above to narrow results.
                      </schmancy-typography>
                    </div>
                  ` : html`
                    <div class="space-y-2">
                      ${this.filters.map(filter => html`
                        <div class="p-3 bg-surface-container rounded-lg flex items-center gap-2">
                          <schmancy-icon class="text-primary">
                            ${filter === 'available' ? 'check_circle' :
                              filter === 'featured' ? 'star' :
                              filter === 'new' ? 'new_releases' : 'sell'}
                          </schmancy-icon>
                          <schmancy-typography type="body" token="sm">
                            Showing ${filter} items
                          </schmancy-typography>
                        </div>
                      `)}
                    </div>
                  `}
                </div>

                <div class="flex justify-between items-center">
                  <schmancy-typography type="body" token="xs" class="text-surface-onVariant">
                    ${this.filters.length} filter(s) active
                  </schmancy-typography>
                  <schmancy-button
                    variant="text"
                    @click="${() => this.filters = []}"
                    ?disabled="${this.filters.length === 0}"
                  >
                    Clear all
                  </schmancy-button>
                </div>
              </div>
            </schmancy-card>
          </schmancy-code-preview>

          <!-- Search with Disappearing Suggestions -->
          <schmancy-code-preview language="html">
            <schmancy-card>
              <div class="p-6 space-y-4">
                <schmancy-typography type="title" token="md" class="block">
                  Search with Smart Suggestions
                </schmancy-typography>

                <schmancy-text-field
                  label="Search"
                  .value="${this.selectedSuggestion}"
                  class="w-full"
                >
                  <schmancy-icon slot="leading-icon">search</schmancy-icon>
                </schmancy-text-field>

                <div>
                  <schmancy-typography type="label" token="sm" class="block mb-2 text-surface-onVariant">
                    Popular searches (click to use)
                  </schmancy-typography>
                  <div class="min-h-[40px]">
                    <schmancy-chips>
                      ${this.searchSuggestions.map(suggestion => html`
                        <schmancy-suggestion-chip
                          @click="${() => this.selectSuggestion(suggestion)}"
                        >
                          <schmancy-icon slot="icon">trending_up</schmancy-icon>
                          ${suggestion}
                        </schmancy-suggestion-chip>
                      `)}
                      ${this.searchSuggestions.length === 0 ? html`
                        <schmancy-typography type="body" token="sm" class="text-surface-onVariant">
                          All suggestions used. They'll reappear shortly...
                        </schmancy-typography>
                      ` : ''}
                    </schmancy-chips>
                  </div>
                </div>

                ${this.selectedSuggestion ? html`
                  <div class="p-3 bg-primary-container text-primary-onContainer rounded-lg">
                    <schmancy-typography type="body" token="sm">
                      Searching for: "${this.selectedSuggestion}"
                    </schmancy-typography>
                  </div>
                ` : ''}
              </div>
            </schmancy-card>
          </schmancy-code-preview>

          <!-- Task Status Workflow -->
          <schmancy-code-preview language="html">
            <schmancy-card>
              <div class="p-6 space-y-4">
                <schmancy-typography type="title" token="md" class="block">
                  Task Status Workflow
                </schmancy-typography>

                <div class="p-4 bg-surface-container rounded-lg">
                  <schmancy-typography type="body" token="md" class="block mb-3">
                    Implement new feature
                  </schmancy-typography>
                  <schmancy-typography type="body" token="sm" class="text-surface-onVariant">
                    Update the user dashboard with real-time analytics
                  </schmancy-typography>
                </div>

                <div>
                  <schmancy-typography type="label" token="sm" class="block mb-2 text-surface-onVariant">
                    Status
                  </schmancy-typography>
                  <schmancy-chips
                    .value="${this.taskStatus}"
                    @change="${(e: CustomEvent) => this.taskStatus = e.detail}"
                  >
                    <schmancy-chip value="todo">
                      <schmancy-icon slot="icon">radio_button_unchecked</schmancy-icon>
                      To Do
                    </schmancy-chip>
                    <schmancy-chip value="progress">
                      <schmancy-icon slot="icon">pending</schmancy-icon>
                      In Progress
                    </schmancy-chip>
                    <schmancy-chip value="review">
                      <schmancy-icon slot="icon">rate_review</schmancy-icon>
                      Review
                    </schmancy-chip>
                    <schmancy-chip value="done">
                      <schmancy-icon slot="icon">check_circle</schmancy-icon>
                      Done
                    </schmancy-chip>
                  </schmancy-chips>
                </div>

                <div class="p-3 bg-surface-container rounded-lg flex items-center gap-2">
                  <schmancy-icon class="${this.taskStatus === 'done' ? 'text-success' : 'text-surface-onVariant'}">
                    ${this.taskStatus === 'todo' ? 'schedule' :
                      this.taskStatus === 'progress' ? 'engineering' :
                      this.taskStatus === 'review' ? 'visibility' : 'done'}
                  </schmancy-icon>
                  <schmancy-typography type="body" token="sm">
                    ${this.taskStatus === 'todo' ? 'Task is waiting to be started' :
                      this.taskStatus === 'progress' ? 'Task is being worked on' :
                      this.taskStatus === 'review' ? 'Task is under review' :
                      'Task has been completed'}
                  </schmancy-typography>
                </div>
              </div>
            </schmancy-card>
          </schmancy-code-preview>

          <!-- Email Recipient Selector -->
          <schmancy-code-preview language="html">
            <schmancy-card>
              <div class="p-6 space-y-4">
                <schmancy-typography type="title" token="md" class="block">
                  Select Recipients
                </schmancy-typography>

                <div>
                  <schmancy-typography type="label" token="sm" class="block mb-2 text-surface-onVariant">
                    To:
                  </schmancy-typography>
                  <div class="p-3 border border-outline rounded-lg min-h-[48px]">
                    <schmancy-chips>
                    ${this.selectedEmails.map(email => html`
                      <schmancy-input-chip
                        removable
                        avatar
                        @remove="${() => this.toggleEmail(email)}"
                      >
                        <schmancy-icon slot="icon">person</schmancy-icon>
                        ${email}
                      </schmancy-input-chip>
                    `)}
                    ${this.selectedEmails.length === 0 ? html`
                      <schmancy-typography type="body" token="sm" class="text-surface-onVariant">
                        No recipients selected
                      </schmancy-typography>
                    ` : ''}
                  </div>
                </div>

                <div>
                  <schmancy-typography type="label" token="sm" class="block mb-2 text-surface-onVariant">
                    Suggested contacts:
                  </schmancy-typography>
                  <schmancy-chips>
                    ${this.availableEmails
                      .filter(email => !this.selectedEmails.includes(email))
                      .map(email => html`
                        <schmancy-suggestion-chip @click="${() => this.toggleEmail(email)}">
                          <schmancy-icon slot="icon">person_add</schmancy-icon>
                          ${email.split('@')[0]}
                        </schmancy-suggestion-chip>
                      `)}
                  </div>
                </div>

                <div class="flex justify-between items-center">
                  <schmancy-typography type="body" token="xs" class="text-surface-onVariant">
                    ${this.selectedEmails.length} recipient(s) selected
                  </schmancy-typography>
                  <div class="flex gap-2">
                    <schmancy-button
                      variant="text"
                      @click="${() => this.selectedEmails = this.availableEmails}"
                    >
                      Select all
                    </schmancy-button>
                    <schmancy-button
                      variant="text"
                      @click="${() => this.selectedEmails = []}"
                      ?disabled="${this.selectedEmails.length === 0}"
                    >
                      Clear
                    </schmancy-button>
                  </div>
                </div>
              </div>
            </schmancy-card>
          </schmancy-code-preview>

          <!-- Complex Filter Builder -->
          <schmancy-code-preview language="html">
            <schmancy-card>
              <div class="p-6 space-y-4">
                <schmancy-typography type="title" token="md" class="block">
                  Advanced Filter Builder
                </schmancy-typography>

                <!-- Price Range -->
                <div>
                  <schmancy-typography type="label" token="sm" class="block mb-2 text-surface-onVariant">
                    Price Range
                  </schmancy-typography>
                  <schmancy-chips .value="${'100-500'}">
                    <schmancy-chip value="0-100">Under $100</schmancy-chip>
                    <schmancy-chip value="100-500">$100-500</schmancy-chip>
                    <schmancy-chip value="500-1000">$500-1000</schmancy-chip>
                    <schmancy-chip value="1000+">Over $1000</schmancy-chip>
                  </schmancy-chips>
                </div>

                <!-- Categories -->
                <div>
                  <schmancy-typography type="label" token="sm" class="block mb-2 text-surface-onVariant">
                    Categories
                  </schmancy-typography>
                  <schmancy-chips multi .values="${['electronics', 'computers']}">
                    <schmancy-chip value="electronics">
                      <schmancy-icon slot="icon">devices</schmancy-icon>
                      Electronics
                    </schmancy-chip>
                    <schmancy-chip value="computers">
                      <schmancy-icon slot="icon">computer</schmancy-icon>
                      Computers
                    </schmancy-chip>
                    <schmancy-chip value="phones">
                      <schmancy-icon slot="icon">smartphone</schmancy-icon>
                      Phones
                    </schmancy-chip>
                    <schmancy-chip value="accessories">
                      <schmancy-icon slot="icon">headphones</schmancy-icon>
                      Accessories
                    </schmancy-chip>
                  </schmancy-chips>
                </div>

                <!-- Features -->
                <div>
                  <schmancy-typography type="label" token="sm" class="block mb-2 text-surface-onVariant">
                    Features
                  </schmancy-typography>
                  <schmancy-chips multi .values="${['free-shipping']}">
                    <schmancy-chip value="free-shipping">
                      <schmancy-icon slot="icon">local_shipping</schmancy-icon>
                      Free Shipping
                    </schmancy-chip>
                    <schmancy-chip value="warranty">
                      <schmancy-icon slot="icon">shield</schmancy-icon>
                      Warranty
                    </schmancy-chip>
                    <schmancy-chip value="returns">
                      <schmancy-icon slot="icon">assignment_return</schmancy-icon>
                      Easy Returns
                    </schmancy-chip>
                  </schmancy-chips>
                </div>

                <schmancy-divider></schmancy-divider>

                <!-- Applied Filters Summary -->
                <div class="p-3 bg-surface-container rounded-lg">
                  <schmancy-typography type="label" token="sm" class="block mb-2">
                    Active Filters:
                  </schmancy-typography>
                  <schmancy-chips>
                    <schmancy-input-chip removable elevated>
                      <schmancy-icon slot="icon">attach_money</schmancy-icon>
                      $100-500
                    </schmancy-input-chip>
                    <schmancy-input-chip removable elevated>
                      <schmancy-icon slot="icon">devices</schmancy-icon>
                      Electronics
                    </schmancy-input-chip>
                    <schmancy-input-chip removable elevated>
                      <schmancy-icon slot="icon">computer</schmancy-icon>
                      Computers
                    </schmancy-input-chip>
                    <schmancy-input-chip removable elevated>
                      <schmancy-icon slot="icon">local_shipping</schmancy-icon>
                      Free Shipping
                    </schmancy-input-chip>
                  </div>
                </div>

                <div class="flex gap-2">
                  <schmancy-button variant="filled" class="flex-1">
                    Apply Filters
                  </schmancy-button>
                  <schmancy-button variant="outlined">
                    Reset
                  </schmancy-button>
                </div>
              </div>
            </schmancy-card>
          </schmancy-code-preview>

          <!-- Programmatic Interaction Example -->
          <schmancy-code-preview language="javascript">
            // Interactive chip management
            class InteractiveChipManager {
              constructor() {
                this.chips = new Map();
                this.listeners = new Map();
              }

              // Create interactive chip group
              createChipGroup(container, options = {}) {
                const { type = 'filter', multi = false, onSelect } = options;

                const chips = container.querySelectorAll(\`schmancy-\${type}-chip\`);

                chips.forEach(chip => {
                  chip.addEventListener('click', (e) => {
                    if (multi) {
                      chip.selected = !chip.selected;
                    } else {
                      // Single selection - deselect others
                      chips.forEach(c => c.selected = false);
                      chip.selected = true;
                    }

                    // Collect selected values
                    const selected = Array.from(chips)
                      .filter(c => c.selected)
                      .map(c => c.getAttribute('value'));

                    onSelect?.(multi ? selected : selected[0]);
                  });
                });

                return {
                  getSelected: () => {
                    return Array.from(chips)
                      .filter(c => c.selected)
                      .map(c => c.getAttribute('value'));
                  },
                  setSelected: (values) => {
                    const valueArray = Array.isArray(values) ? values : [values];
                    chips.forEach(chip => {
                      chip.selected = valueArray.includes(chip.getAttribute('value'));
                    });
                  },
                  clear: () => {
                    chips.forEach(chip => chip.selected = false);
                  }
                };
              }

              // Dynamic chip creation with animation
              addChip(container, text, options = {}) {
                const { removable = true, animated = true } = options;

                const chip = document.createElement('schmancy-input-chip');
                if (removable) chip.setAttribute('removable', '');
                chip.textContent = text;

                if (animated) {
                  chip.style.opacity = '0';
                  chip.style.transform = 'scale(0.8)';
                }

                chip.addEventListener('remove', () => {
                  if (animated) {
                    chip.style.transition = 'all 0.3s';
                    chip.style.opacity = '0';
                    chip.style.transform = 'scale(0.8)';
                    setTimeout(() => chip.remove(), 300);
                  } else {
                    chip.remove();
                  }
                });

                container.appendChild(chip);

                if (animated) {
                  requestAnimationFrame(() => {
                    chip.style.transition = 'all 0.3s';
                    chip.style.opacity = '1';
                    chip.style.transform = 'scale(1)';
                  });
                }

                return chip;
              }
            }

            // Usage
            const manager = new InteractiveChipManager();
            const filterGroup = manager.createChipGroup(
              document.querySelector('.filter-chips'),
              {
                type: 'filter',
                multi: true,
                onSelect: (selected) => {
                  console.log('Filters:', selected);
                  updateResults(selected);
                }
              }
            );
          </schmancy-code-preview>
        </schmancy-grid>
      </schmancy-surface>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'demo-chips-interactive': DemoChipsInteractive;
  }
}