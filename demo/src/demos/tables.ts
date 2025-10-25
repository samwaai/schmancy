import { html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { $LitElement } from '@mhmo91/schmancy/mixins';
import { repeat } from 'lit/directives/repeat.js';
import '@mhmo91/schmancy';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: 'available' | 'low' | 'out';
  lastUpdated: string;
}

@customElement('demo-data-display-tables')
export default class DataDisplayTables extends $LitElement() {
  @state() private products: Product[] = this.generateProducts();
  @state() private filteredProducts: Product[] = this.products;
  @state() private sortField: keyof Product = 'name';
  @state() private sortDirection: 'asc' | 'desc' = 'asc';
  @state() private filterText = '';
  @state() private selectedCategory = 'all';
  @state() private currentPage = 1;
  @state() private itemsPerPage = 10;
  @state() private selectedRows = new Set<string>();
  @state() private viewMode: 'compact' | 'comfortable' | 'spacious' = 'comfortable';

  private categories = ['all', 'Electronics', 'Clothing', 'Food', 'Books', 'Sports'];

  private generateProducts(): Product[] {
    const categories = ['Electronics', 'Clothing', 'Food', 'Books', 'Sports'];
    const products: Product[] = [];

    for (let i = 1; i <= 50; i++) {
      const stock = Math.floor(Math.random() * 100);
      products.push({
        id: `PRD-${i.toString().padStart(3, '0')}`,
        name: `Product ${i}`,
        category: categories[Math.floor(Math.random() * categories.length)],
        price: Math.floor(Math.random() * 1000) + 10,
        stock,
        status: stock === 0 ? 'out' : stock < 10 ? 'low' : 'available',
        lastUpdated: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toLocaleDateString()
      });
    }

    return products;
  }

  private handleSort(field: keyof Product) {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    this.applyFiltersAndSort();
  }

  private handleFilterChange(e: Event) {
    this.filterText = (e.target as HTMLInputElement).value;
    this.currentPage = 1;
    this.applyFiltersAndSort();
  }

  private handleCategoryChange(category: string) {
    this.selectedCategory = category;
    this.currentPage = 1;
    this.applyFiltersAndSort();
  }

  private applyFiltersAndSort() {
    let filtered = [...this.products];

    // Apply text filter
    if (this.filterText) {
      const searchLower = this.filterText.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchLower) ||
        p.id.toLowerCase().includes(searchLower) ||
        p.category.toLowerCase().includes(searchLower)
      );
    }

    // Apply category filter
    if (this.selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === this.selectedCategory);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const aVal = a[this.sortField];
      const bVal = b[this.sortField];

      let comparison = 0;
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        comparison = aVal.localeCompare(bVal);
      } else {
        comparison = (aVal as number) - (bVal as number);
      }

      return this.sortDirection === 'asc' ? comparison : -comparison;
    });

    this.filteredProducts = filtered;
  }

  private get paginatedProducts() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredProducts.slice(start, start + this.itemsPerPage);
  }

  private get totalPages() {
    return Math.ceil(this.filteredProducts.length / this.itemsPerPage);
  }

  private handleSelectAll(e: Event) {
    const checked = (e.target as HTMLInputElement).checked;
    if (checked) {
      this.paginatedProducts.forEach(p => this.selectedRows.add(p.id));
    } else {
      this.paginatedProducts.forEach(p => this.selectedRows.delete(p.id));
    }
    this.requestUpdate();
  }

  private handleSelectRow(id: string) {
    if (this.selectedRows.has(id)) {
      this.selectedRows.delete(id);
    } else {
      this.selectedRows.add(id);
    }
    this.requestUpdate();
  }

  private getStatusColor(status: string) {
    switch (status) {
      case 'available': return 'success';
      case 'low': return 'warning';
      case 'out': return 'error';
      default: return 'neutral';
    }
  }

  private getRowPadding() {
    switch (this.viewMode) {
      case 'compact': return 'p-2';
      case 'comfortable': return 'p-3';
      case 'spacious': return 'p-4';
    }
  }

  render() {
    const allSelected = this.paginatedProducts.length > 0 &&
      this.paginatedProducts.every(p => this.selectedRows.has(p.id));

    return html`
      <div class="container mx-auto p-4 max-w-7xl">
        <div class="mb-8">
          <schmancy-typography type="headline" token="lg" class="mb-2">
            Data Tables
          </schmancy-typography>
          <schmancy-typography type="body" token="lg" class="text-surface-onVariant">
            Interactive tables with sorting, filtering, and pagination
          </schmancy-typography>
        </div>

        <!-- Controls -->
        <schmancy-surface type="filled" class="p-4 mb-4">
          <div class="flex flex-wrap items-center gap-4">
            <!-- Search -->
            <div class="flex-1 min-w-[200px]">
              <schmancy-input
                label="Search products"
                leadingIcon="search"
                .value=${this.filterText}
                @input=${this.handleFilterChange}
              ></schmancy-input>
            </div>

            <!-- Category Filter -->
            <schmancy-select
              label="Category"
              .value=${this.selectedCategory}
              @change=${(e: Event) => this.handleCategoryChange((e.target as any).value)}
            >
              ${this.categories.map(cat => html`
                <schmancy-option value="${cat}">
                  ${cat === 'all' ? 'All Categories' : cat}
                </schmancy-option>
              `)}
            </schmancy-select>

            <!-- View Mode -->
            <schmancy-segmented-button>
              <schmancy-segmented-button-segment
                label="Compact"
                ?selected=${this.viewMode === 'compact'}
                @click=${() => this.viewMode = 'compact'}
              ></schmancy-segmented-button-segment>
              <schmancy-segmented-button-segment
                label="Comfortable"
                ?selected=${this.viewMode === 'comfortable'}
                @click=${() => this.viewMode = 'comfortable'}
              ></schmancy-segmented-button-segment>
              <schmancy-segmented-button-segment
                label="Spacious"
                ?selected=${this.viewMode === 'spacious'}
                @click=${() => this.viewMode = 'spacious'}
              ></schmancy-segmented-button-segment>
            </schmancy-segmented-button>
          </div>

          ${this.selectedRows.size > 0 ? html`
            <div class="mt-4 flex items-center gap-4">
              <schmancy-chip removable @remove=${() => {
                this.selectedRows.clear();
                this.requestUpdate();
              }}>
                ${this.selectedRows.size} selected
              </schmancy-chip>
              <schmancy-button variant="text" leadingIcon="delete">
                Delete Selected
              </schmancy-button>
              <schmancy-button variant="text" leadingIcon="edit">
                Edit Selected
              </schmancy-button>
            </div>
          ` : ''}
        </schmancy-surface>

        <!-- Table -->
        <schmancy-surface type="outlined" class="overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-surface-containerHigh">
                <tr>
                  <th class="${this.getRowPadding()}">
                    <schmancy-checkbox
                      ?checked=${allSelected}
                      @change=${this.handleSelectAll}
                    ></schmancy-checkbox>
                  </th>
                  <th
                    class="${this.getRowPadding()} text-left cursor-pointer hover:bg-surface-container"
                    @click=${() => this.handleSort('id')}
                  >
                    <div class="flex items-center gap-1">
                      <schmancy-typography type="label" token="lg">ID</schmancy-typography>
                      ${this.sortField === 'id' ? html`
                        <schmancy-icon icon="${this.sortDirection === 'asc' ? 'arrow_upward' : 'arrow_downward'}" class="text-sm"></schmancy-icon>
                      ` : ''}
                    </div>
                  </th>
                  <th
                    class="${this.getRowPadding()} text-left cursor-pointer hover:bg-surface-container"
                    @click=${() => this.handleSort('name')}
                  >
                    <div class="flex items-center gap-1">
                      <schmancy-typography type="label" token="lg">Name</schmancy-typography>
                      ${this.sortField === 'name' ? html`
                        <schmancy-icon icon="${this.sortDirection === 'asc' ? 'arrow_upward' : 'arrow_downward'}" class="text-sm"></schmancy-icon>
                      ` : ''}
                    </div>
                  </th>
                  <th
                    class="${this.getRowPadding()} text-left cursor-pointer hover:bg-surface-container"
                    @click=${() => this.handleSort('category')}
                  >
                    <div class="flex items-center gap-1">
                      <schmancy-typography type="label" token="lg">Category</schmancy-typography>
                      ${this.sortField === 'category' ? html`
                        <schmancy-icon icon="${this.sortDirection === 'asc' ? 'arrow_upward' : 'arrow_downward'}" class="text-sm"></schmancy-icon>
                      ` : ''}
                    </div>
                  </th>
                  <th
                    class="${this.getRowPadding()} text-left cursor-pointer hover:bg-surface-container"
                    @click=${() => this.handleSort('price')}
                  >
                    <div class="flex items-center gap-1">
                      <schmancy-typography type="label" token="lg">Price</schmancy-typography>
                      ${this.sortField === 'price' ? html`
                        <schmancy-icon icon="${this.sortDirection === 'asc' ? 'arrow_upward' : 'arrow_downward'}" class="text-sm"></schmancy-icon>
                      ` : ''}
                    </div>
                  </th>
                  <th
                    class="${this.getRowPadding()} text-left cursor-pointer hover:bg-surface-container"
                    @click=${() => this.handleSort('stock')}
                  >
                    <div class="flex items-center gap-1">
                      <schmancy-typography type="label" token="lg">Stock</schmancy-typography>
                      ${this.sortField === 'stock' ? html`
                        <schmancy-icon icon="${this.sortDirection === 'asc' ? 'arrow_upward' : 'arrow_downward'}" class="text-sm"></schmancy-icon>
                      ` : ''}
                    </div>
                  </th>
                  <th class="${this.getRowPadding()} text-left">
                    <schmancy-typography type="label" token="lg">Status</schmancy-typography>
                  </th>
                  <th class="${this.getRowPadding()} text-left">
                    <schmancy-typography type="label" token="lg">Last Updated</schmancy-typography>
                  </th>
                  <th class="${this.getRowPadding()} text-center">
                    <schmancy-typography type="label" token="lg">Actions</schmancy-typography>
                  </th>
                </tr>
              </thead>
              <tbody>
                ${repeat(
                  this.paginatedProducts,
                  product => product.id,
                  product => html`
                    <tr class="border-t border-outline-variant hover:bg-surface-containerLow ${this.selectedRows.has(product.id) ? 'bg-primary-container' : ''}">
                      <td class="${this.getRowPadding()}">
                        <schmancy-checkbox
                          ?checked=${this.selectedRows.has(product.id)}
                          @change=${() => this.handleSelectRow(product.id)}
                        ></schmancy-checkbox>
                      </td>
                      <td class="${this.getRowPadding()}">
                        <schmancy-typography type="body" token="md" class="font-mono">
                          ${product.id}
                        </schmancy-typography>
                      </td>
                      <td class="${this.getRowPadding()}">
                        <schmancy-typography type="body" token="md">
                          ${product.name}
                        </schmancy-typography>
                      </td>
                      <td class="${this.getRowPadding()}">
                        <schmancy-chip>${product.category}</schmancy-chip>
                      </td>
                      <td class="${this.getRowPadding()}">
                        <schmancy-typography type="body" token="md">
                          $${product.price.toFixed(2)}
                        </schmancy-typography>
                      </td>
                      <td class="${this.getRowPadding()}">
                        <schmancy-typography type="body" token="md">
                          ${product.stock}
                        </schmancy-typography>
                      </td>
                      <td class="${this.getRowPadding()}">
                        <schmancy-badge color="${this.getStatusColor(product.status)}">
                          ${product.status}
                        </schmancy-badge>
                      </td>
                      <td class="${this.getRowPadding()}">
                        <schmancy-typography type="body" token="sm" class="text-surface-onVariant">
                          ${product.lastUpdated}
                        </schmancy-typography>
                      </td>
                      <td class="${this.getRowPadding()}">
                        <div class="flex items-center justify-center gap-1">
                          <schmancy-icon-button icon="edit" size="small"></schmancy-icon-button>
                          <schmancy-icon-button icon="delete" size="small"></schmancy-icon-button>
                        </div>
                      </td>
                    </tr>
                  `
                )}
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div class="flex items-center justify-between p-4 border-t border-outline-variant">
            <schmancy-typography type="body" token="sm" class="text-surface-onVariant">
              Showing ${((this.currentPage - 1) * this.itemsPerPage) + 1} -
              ${Math.min(this.currentPage * this.itemsPerPage, this.filteredProducts.length)} of
              ${this.filteredProducts.length} items
            </schmancy-typography>

            <div class="flex items-center gap-2">
              <schmancy-icon-button
                icon="chevron_left"
                ?disabled=${this.currentPage === 1}
                @click=${() => this.currentPage--}
              ></schmancy-icon-button>

              ${Array.from({ length: Math.min(5, this.totalPages) }, (_, i) => {
                let pageNum: number;
                if (this.totalPages <= 5) {
                  pageNum = i + 1;
                } else if (this.currentPage <= 3) {
                  pageNum = i + 1;
                } else if (this.currentPage >= this.totalPages - 2) {
                  pageNum = this.totalPages - 4 + i;
                } else {
                  pageNum = this.currentPage - 2 + i;
                }

                return html`
                  <schmancy-button
                    variant="${pageNum === this.currentPage ? 'filled' : 'text'}"
                    @click=${() => this.currentPage = pageNum}
                  >
                    ${pageNum}
                  </schmancy-button>
                `;
              })}

              <schmancy-icon-button
                icon="chevron_right"
                ?disabled=${this.currentPage === this.totalPages}
                @click=${() => this.currentPage++}
              ></schmancy-icon-button>
            </div>
          </div>
        </schmancy-surface>

        <!-- Table Variants -->
        <schmancy-surface type="filled" class="mt-8 p-6">
          <schmancy-typography type="headline" token="sm" class="mb-4">
            Table Features Demonstrated
          </schmancy-typography>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <schmancy-typography type="title" token="md" class="mb-2">Interactive Features</schmancy-typography>
              <ul class="space-y-1">
                <li class="flex items-center gap-2">
                  <schmancy-icon icon="check" class="text-primary text-sm"></schmancy-icon>
                  <schmancy-typography type="body" token="sm">Column sorting (click headers)</schmancy-typography>
                </li>
                <li class="flex items-center gap-2">
                  <schmancy-icon icon="check" class="text-primary text-sm"></schmancy-icon>
                  <schmancy-typography type="body" token="sm">Text search filtering</schmancy-typography>
                </li>
                <li class="flex items-center gap-2">
                  <schmancy-icon icon="check" class="text-primary text-sm"></schmancy-icon>
                  <schmancy-typography type="body" token="sm">Category filtering</schmancy-typography>
                </li>
                <li class="flex items-center gap-2">
                  <schmancy-icon icon="check" class="text-primary text-sm"></schmancy-icon>
                  <schmancy-typography type="body" token="sm">Row selection with bulk actions</schmancy-typography>
                </li>
              </ul>
            </div>
            <div>
              <schmancy-typography type="title" token="md" class="mb-2">Visual Features</schmancy-typography>
              <ul class="space-y-1">
                <li class="flex items-center gap-2">
                  <schmancy-icon icon="check" class="text-primary text-sm"></schmancy-icon>
                  <schmancy-typography type="body" token="sm">Density options (compact/comfortable/spacious)</schmancy-typography>
                </li>
                <li class="flex items-center gap-2">
                  <schmancy-icon icon="check" class="text-primary text-sm"></schmancy-icon>
                  <schmancy-typography type="body" token="sm">Status badges with colors</schmancy-typography>
                </li>
                <li class="flex items-center gap-2">
                  <schmancy-icon icon="check" class="text-primary text-sm"></schmancy-icon>
                  <schmancy-typography type="body" token="sm">Hover states and selection highlighting</schmancy-typography>
                </li>
                <li class="flex items-center gap-2">
                  <schmancy-icon icon="check" class="text-primary text-sm"></schmancy-icon>
                  <schmancy-typography type="body" token="sm">Pagination with page numbers</schmancy-typography>
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
    'demo-data-display-tables': DataDisplayTables;
  }
}