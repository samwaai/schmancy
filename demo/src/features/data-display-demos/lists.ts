import { html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { $LitElement } from '@mixins/index';
import { repeat } from 'lit/directives/repeat.js';
import '@schmancy';

interface ListItem {
  id: string;
  title: string;
  subtitle: string;
  avatar: string;
  timestamp: string;
  status: 'online' | 'offline' | 'busy' | 'away';
  unread?: number;
  starred?: boolean;
  category: string;
}

@customElement('demo-data-display-lists')
export class DataDisplayLists extends $LitElement() {
  @state() private basicItems: ListItem[] = this.generateItems(20);
  @state() private virtualItems: ListItem[] = this.generateItems(1000);
  @state() private groupedItems: ListItem[] = this.generateItems(50);
  @state() private selectedView: 'basic' | 'virtual' | 'grouped' | 'media' = 'basic';
  @state() private selectedItems = new Set<string>();
  @state() private expandedGroups = new Set<string>();

  private generateItems(count: number): ListItem[] {
    const names = ['Alice Johnson', 'Bob Smith', 'Charlie Davis', 'Diana Miller', 'Eve Wilson'];
    const categories = ['Work', 'Personal', 'Important', 'Archive', 'Drafts'];
    const statuses: Array<'online' | 'offline' | 'busy' | 'away'> = ['online', 'offline', 'busy', 'away'];

    return Array.from({ length: count }, (_, i) => ({
      id: `item-${i}`,
      title: `${names[i % names.length]} - Item ${i + 1}`,
      subtitle: `This is the description for item ${i + 1}. It contains some preview text...`,
      avatar: `https://i.pravatar.cc/150?img=${(i % 50) + 1}`,
      timestamp: `${Math.floor(Math.random() * 23)}:${Math.floor(Math.random() * 59).toString().padStart(2, '0')}`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      unread: Math.random() > 0.7 ? Math.floor(Math.random() * 10) + 1 : undefined,
      starred: Math.random() > 0.8,
      category: categories[Math.floor(Math.random() * categories.length)]
    }));
  }

  private handleItemClick(item: ListItem) {
    if (this.selectedItems.has(item.id)) {
      this.selectedItems.delete(item.id);
    } else {
      this.selectedItems.add(item.id);
    }
    this.requestUpdate();
  }

  private toggleGroup(category: string) {
    if (this.expandedGroups.has(category)) {
      this.expandedGroups.delete(category);
    } else {
      this.expandedGroups.add(category);
    }
    this.requestUpdate();
  }

  private getStatusColor(status: string) {
    switch (status) {
      case 'online': return '#4CAF50';
      case 'offline': return '#9E9E9E';
      case 'busy': return '#F44336';
      case 'away': return '#FF9800';
      default: return '#9E9E9E';
    }
  }

  private renderBasicList() {
    return html`
      <schmancy-surface type="outlined" class="overflow-hidden">
        <schmancy-list>
          ${repeat(
            this.basicItems,
            item => item.id,
            item => html`
              <schmancy-list-item
                class="${this.selectedItems.has(item.id) ? 'bg-primary-container' : ''}"
                @click=${() => this.handleItemClick(item)}
              >
                <div slot="start" class="relative">
                  <img
                    src="${item.avatar}"
                    alt="${item.title}"
                    class="w-10 h-10 rounded-full"
                  >
                  <div
                    class="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-surface"
                    style="background-color: ${this.getStatusColor(item.status)}"
                  ></div>
                </div>

                <div slot="headline">${item.title}</div>
                <div slot="supporting-text" class="line-clamp-1">${item.subtitle}</div>

                <div slot="end" class="flex items-center gap-2">
                  ${item.unread ? html`
                    <schmancy-badge color="primary">${item.unread}</schmancy-badge>
                  ` : ''}
                  ${item.starred ? html`
                    <schmancy-icon icon="star" class="text-warning"></schmancy-icon>
                  ` : ''}
                  <schmancy-typography type="body" token="sm" class="text-surface-onVariant">
                    ${item.timestamp}
                  </schmancy-typography>
                </div>
              </schmancy-list-item>
            `
          )}
        </schmancy-list>
      </schmancy-surface>
    `;
  }

  private renderVirtualList() {
    return html`
      <schmancy-surface type="outlined" class="overflow-hidden">
        <div class="p-4 bg-surface-containerHigh">
          <schmancy-typography type="body" token="md" class="text-surface-onVariant">
            Virtualized list with 1000 items - only visible items are rendered
          </schmancy-typography>
        </div>

        <lit-virtualizer
          class="h-96 overflow-y-auto"
          .items=${this.virtualItems}
          .renderItem=${(item: ListItem) => html`
            <div class="flex items-center gap-3 p-3 border-b border-outline-variant hover:bg-surface-containerLow cursor-pointer">
              <img
                src="${item.avatar}"
                alt="${item.title}"
                class="w-10 h-10 rounded-full"
              >
              <div class="flex-1 min-w-0">
                <schmancy-typography type="body" token="md" class="font-medium">
                  ${item.title}
                </schmancy-typography>
                <schmancy-typography type="body" token="sm" class="text-surface-onVariant line-clamp-1">
                  ${item.subtitle}
                </schmancy-typography>
              </div>
              <schmancy-chip size="small">${item.category}</schmancy-chip>
            </div>
          `}
        ></lit-virtualizer>

        <div class="p-4 bg-surface-containerHigh">
          <schmancy-typography type="body" token="sm" class="text-surface-onVariant">
            Scroll to see virtualization in action - DOM nodes are recycled
          </schmancy-typography>
        </div>
      </schmancy-surface>
    `;
  }

  private renderGroupedList() {
    const grouped = this.groupedItems.reduce((acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    }, {} as Record<string, ListItem[]>);

    return html`
      <schmancy-surface type="outlined" class="overflow-hidden">
        ${Object.entries(grouped).map(([category, items]) => html`
          <div class="border-b border-outline-variant">
            <div
              class="flex items-center justify-between p-3 bg-surface-containerHigh cursor-pointer hover:bg-surface-container"
              @click=${() => this.toggleGroup(category)}
            >
              <div class="flex items-center gap-2">
                <schmancy-icon
                  icon="${this.expandedGroups.has(category) ? 'expand_more' : 'chevron_right'}"
                ></schmancy-icon>
                <schmancy-typography type="title" token="md">
                  ${category}
                </schmancy-typography>
                <schmancy-badge>${items.length}</schmancy-badge>
              </div>
            </div>

            ${this.expandedGroups.has(category) ? html`
              <schmancy-list>
                ${repeat(
                  items.slice(0, 5),
                  item => item.id,
                  item => html`
                    <schmancy-list-item class="pl-8">
                      <div slot="start">
                        <img
                          src="${item.avatar}"
                          alt="${item.title}"
                          class="w-8 h-8 rounded-full"
                        >
                      </div>
                      <div slot="headline">${item.title}</div>
                      <div slot="supporting-text">${item.subtitle}</div>
                      <div slot="end">
                        <schmancy-typography type="body" token="sm" class="text-surface-onVariant">
                          ${item.timestamp}
                        </schmancy-typography>
                      </div>
                    </schmancy-list-item>
                  `
                )}
              </schmancy-list>
              ${items.length > 5 ? html`
                <div class="p-3 pl-8">
                  <schmancy-button variant="text" size="small">
                    Show ${items.length - 5} more items
                  </schmancy-button>
                </div>
              ` : ''}
            ` : ''}
          </div>
        `)}
      </schmancy-surface>
    `;
  }

  private renderMediaList() {
    return html`
      <schmancy-surface type="outlined" class="overflow-hidden">
        <schmancy-list>
          ${repeat(
            this.basicItems.slice(0, 10),
            item => item.id,
            (item, index) => html`
              <schmancy-list-item class="h-auto py-4">
                <div class="flex gap-4 w-full">
                  <img
                    src="https://picsum.photos/200/150?random=${index}"
                    alt="Media"
                    class="w-32 h-24 object-cover rounded-lg"
                  >
                  <div class="flex-1">
                    <div class="flex items-start justify-between mb-2">
                      <div>
                        <schmancy-typography type="headline" token="sm">
                          ${item.title}
                        </schmancy-typography>
                        <div class="flex items-center gap-2 mt-1">
                          <img
                            src="${item.avatar}"
                            alt="Author"
                            class="w-5 h-5 rounded-full"
                          >
                          <schmancy-typography type="body" token="sm" class="text-surface-onVariant">
                            ${item.title.split(' - ')[0]} • ${item.timestamp}
                          </schmancy-typography>
                        </div>
                      </div>
                      <schmancy-icon-button icon="more_vert" size="small"></schmancy-icon-button>
                    </div>
                    <schmancy-typography type="body" token="md" class="line-clamp-2">
                      ${item.subtitle}
                    </schmancy-typography>
                    <div class="flex items-center gap-4 mt-3">
                      <div class="flex items-center gap-1">
                        <schmancy-icon icon="thumb_up" class="text-surface-onVariant text-sm"></schmancy-icon>
                        <schmancy-typography type="body" token="sm">
                          ${Math.floor(Math.random() * 1000)}
                        </schmancy-typography>
                      </div>
                      <div class="flex items-center gap-1">
                        <schmancy-icon icon="comment" class="text-surface-onVariant text-sm"></schmancy-icon>
                        <schmancy-typography type="body" token="sm">
                          ${Math.floor(Math.random() * 100)}
                        </schmancy-typography>
                      </div>
                      <div class="flex items-center gap-1">
                        <schmancy-icon icon="share" class="text-surface-onVariant text-sm"></schmancy-icon>
                        <schmancy-typography type="body" token="sm">
                          Share
                        </schmancy-typography>
                      </div>
                    </div>
                  </div>
                </div>
              </schmancy-list-item>
            `
          )}
        </schmancy-list>
      </schmancy-surface>
    `;
  }

  render() {
    return html`
      <div class="container mx-auto p-4 max-w-7xl">
        <div class="mb-8">
          <schmancy-typography type="headline" token="lg" class="mb-2">
            List Patterns
          </schmancy-typography>
          <schmancy-typography type="body" token="lg" class="text-surface-onVariant">
            Various list layouts and virtualization techniques
          </schmancy-typography>
        </div>

        <!-- View Selector -->
        <schmancy-surface type="filled" class="p-4 mb-6">
          <schmancy-segmented-button>
            <schmancy-segmented-button-segment
              label="Basic List"
              ?selected=${this.selectedView === 'basic'}
              @click=${() => this.selectedView = 'basic'}
            ></schmancy-segmented-button-segment>
            <schmancy-segmented-button-segment
              label="Virtual List"
              ?selected=${this.selectedView === 'virtual'}
              @click=${() => this.selectedView = 'virtual'}
            ></schmancy-segmented-button-segment>
            <schmancy-segmented-button-segment
              label="Grouped List"
              ?selected=${this.selectedView === 'grouped'}
              @click=${() => this.selectedView = 'grouped'}
            ></schmancy-segmented-button-segment>
            <schmancy-segmented-button-segment
              label="Media List"
              ?selected=${this.selectedView === 'media'}
              @click=${() => this.selectedView = 'media'}
            ></schmancy-segmented-button-segment>
          </schmancy-segmented-button>
        </schmancy-surface>

        <!-- List Content -->
        ${this.selectedView === 'basic' ? this.renderBasicList() : ''}
        ${this.selectedView === 'virtual' ? this.renderVirtualList() : ''}
        ${this.selectedView === 'grouped' ? this.renderGroupedList() : ''}
        ${this.selectedView === 'media' ? this.renderMediaList() : ''}

        <!-- Features -->
        <schmancy-surface type="filled" class="mt-8 p-6">
          <schmancy-typography type="headline" token="sm" class="mb-4">
            List Features
          </schmancy-typography>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <schmancy-typography type="title" token="md" class="mb-2">
                Basic Lists
              </schmancy-typography>
              <ul class="space-y-1">
                <li class="flex items-start gap-2">
                  <span class="text-primary">•</span>
                  <schmancy-typography type="body" token="sm">
                    Avatar with status indicator
                  </schmancy-typography>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-primary">•</span>
                  <schmancy-typography type="body" token="sm">
                    Primary and secondary text
                  </schmancy-typography>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-primary">•</span>
                  <schmancy-typography type="body" token="sm">
                    Badges for unread counts
                  </schmancy-typography>
                </li>
              </ul>
            </div>

            <div>
              <schmancy-typography type="title" token="md" class="mb-2">
                Virtual Scrolling
              </schmancy-typography>
              <ul class="space-y-1">
                <li class="flex items-start gap-2">
                  <span class="text-primary">•</span>
                  <schmancy-typography type="body" token="sm">
                    Handles 1000+ items efficiently
                  </schmancy-typography>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-primary">•</span>
                  <schmancy-typography type="body" token="sm">
                    Only renders visible items
                  </schmancy-typography>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-primary">•</span>
                  <schmancy-typography type="body" token="sm">
                    Smooth scrolling performance
                  </schmancy-typography>
                </li>
              </ul>
            </div>

            <div>
              <schmancy-typography type="title" token="md" class="mb-2">
                Grouped Lists
              </schmancy-typography>
              <ul class="space-y-1">
                <li class="flex items-start gap-2">
                  <span class="text-primary">•</span>
                  <schmancy-typography type="body" token="sm">
                    Collapsible categories
                  </schmancy-typography>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-primary">•</span>
                  <schmancy-typography type="body" token="sm">
                    Item count badges
                  </schmancy-typography>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-primary">•</span>
                  <schmancy-typography type="body" token="sm">
                    Load more functionality
                  </schmancy-typography>
                </li>
              </ul>
            </div>
          </div>
        </schmancy-surface>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'demo-data-display-lists': DataDisplayLists;
  }
}