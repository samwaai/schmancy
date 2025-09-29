import { html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { $LitElement } from '@mixins/index';
import { repeat } from 'lit/directives/repeat.js';
import '@schmancy';

interface TreeNode {
  id: string;
  name: string;
  type: 'folder' | 'file';
  children?: TreeNode[];
  size?: string;
  modified?: string;
  icon?: string;
}

@customElement('demo-data-display-trees')
export default class DataDisplayTrees extends $LitElement() {
  @state() private expandedNodes = new Set<string>(['root', 'src', 'components']);
  @state() private selectedNode: string | null = null;
  @state() private checkedNodes = new Set<string>();
  @state() private viewMode: 'file' | 'org' | 'navigation' = 'file';

  private fileTree: TreeNode = {
    id: 'root',
    name: 'project',
    type: 'folder',
    children: [
      {
        id: 'src',
        name: 'src',
        type: 'folder',
        children: [
          {
            id: 'components',
            name: 'components',
            type: 'folder',
            children: [
              { id: 'button.ts', name: 'button.ts', type: 'file', size: '2.4 KB', modified: '2 days ago' },
              { id: 'input.ts', name: 'input.ts', type: 'file', size: '3.1 KB', modified: '3 days ago' },
              { id: 'card.ts', name: 'card.ts', type: 'file', size: '1.8 KB', modified: '1 week ago' }
            ]
          },
          {
            id: 'utils',
            name: 'utils',
            type: 'folder',
            children: [
              { id: 'helpers.ts', name: 'helpers.ts', type: 'file', size: '4.2 KB', modified: '5 days ago' },
              { id: 'constants.ts', name: 'constants.ts', type: 'file', size: '1.1 KB', modified: '2 weeks ago' }
            ]
          },
          { id: 'index.ts', name: 'index.ts', type: 'file', size: '0.8 KB', modified: '1 day ago' },
          { id: 'app.ts', name: 'app.ts', type: 'file', size: '5.6 KB', modified: '3 hours ago' }
        ]
      },
      {
        id: 'public',
        name: 'public',
        type: 'folder',
        children: [
          { id: 'index.html', name: 'index.html', type: 'file', size: '1.2 KB', modified: '1 week ago' },
          { id: 'favicon.ico', name: 'favicon.ico', type: 'file', size: '4.2 KB', modified: '1 month ago' }
        ]
      },
      {
        id: 'tests',
        name: 'tests',
        type: 'folder',
        children: [
          { id: 'unit.test.ts', name: 'unit.test.ts', type: 'file', size: '3.3 KB', modified: '2 days ago' },
          { id: 'integration.test.ts', name: 'integration.test.ts', type: 'file', size: '5.1 KB', modified: '4 days ago' }
        ]
      },
      { id: 'README.md', name: 'README.md', type: 'file', size: '2.8 KB', modified: '1 week ago' },
      { id: 'package.json', name: 'package.json', type: 'file', size: '1.5 KB', modified: '3 days ago' }
    ]
  };

  private orgTree: TreeNode = {
    id: 'ceo',
    name: 'CEO - Jane Smith',
    type: 'folder',
    icon: 'person',
    children: [
      {
        id: 'cto',
        name: 'CTO - John Davis',
        type: 'folder',
        icon: 'engineering',
        children: [
          {
            id: 'dev-lead',
            name: 'Dev Lead - Alice Johnson',
            type: 'folder',
            icon: 'code',
            children: [
              { id: 'dev1', name: 'Senior Developer - Bob Wilson', type: 'file', icon: 'person' },
              { id: 'dev2', name: 'Developer - Charlie Brown', type: 'file', icon: 'person' },
              { id: 'dev3', name: 'Junior Developer - Diana Lee', type: 'file', icon: 'person' }
            ]
          },
          {
            id: 'qa-lead',
            name: 'QA Lead - Eve Martinez',
            type: 'folder',
            icon: 'bug_report',
            children: [
              { id: 'qa1', name: 'QA Engineer - Frank Garcia', type: 'file', icon: 'person' },
              { id: 'qa2', name: 'QA Engineer - Grace Kim', type: 'file', icon: 'person' }
            ]
          }
        ]
      },
      {
        id: 'cfo',
        name: 'CFO - Michael Thompson',
        type: 'folder',
        icon: 'payments',
        children: [
          { id: 'accountant1', name: 'Senior Accountant - Helen White', type: 'file', icon: 'person' },
          { id: 'accountant2', name: 'Accountant - Ivan Rodriguez', type: 'file', icon: 'person' }
        ]
      },
      {
        id: 'cmo',
        name: 'CMO - Sarah Anderson',
        type: 'folder',
        icon: 'campaign',
        children: [
          { id: 'marketing1', name: 'Marketing Manager - Jack Taylor', type: 'file', icon: 'person' },
          { id: 'marketing2', name: 'Content Lead - Kate Moore', type: 'file', icon: 'person' }
        ]
      }
    ]
  };

  private navTree: TreeNode = {
    id: 'nav-root',
    name: 'Navigation',
    type: 'folder',
    children: [
      {
        id: 'dashboard',
        name: 'Dashboard',
        type: 'folder',
        icon: 'dashboard',
        children: [
          { id: 'overview', name: 'Overview', type: 'file', icon: 'insights' },
          { id: 'analytics', name: 'Analytics', type: 'file', icon: 'analytics' },
          { id: 'reports', name: 'Reports', type: 'file', icon: 'description' }
        ]
      },
      {
        id: 'products',
        name: 'Products',
        type: 'folder',
        icon: 'inventory',
        children: [
          { id: 'catalog', name: 'Catalog', type: 'file', icon: 'grid_view' },
          { id: 'inventory', name: 'Inventory', type: 'file', icon: 'inventory_2' },
          { id: 'categories', name: 'Categories', type: 'file', icon: 'category' }
        ]
      },
      {
        id: 'customers',
        name: 'Customers',
        type: 'folder',
        icon: 'people',
        children: [
          { id: 'list', name: 'Customer List', type: 'file', icon: 'list' },
          { id: 'segments', name: 'Segments', type: 'file', icon: 'pie_chart' },
          { id: 'reviews', name: 'Reviews', type: 'file', icon: 'rate_review' }
        ]
      },
      {
        id: 'settings',
        name: 'Settings',
        type: 'folder',
        icon: 'settings',
        children: [
          { id: 'general', name: 'General', type: 'file', icon: 'tune' },
          { id: 'security', name: 'Security', type: 'file', icon: 'security' },
          { id: 'billing', name: 'Billing', type: 'file', icon: 'payment' }
        ]
      }
    ]
  };

  private toggleNode(nodeId: string) {
    if (this.expandedNodes.has(nodeId)) {
      this.expandedNodes.delete(nodeId);
    } else {
      this.expandedNodes.add(nodeId);
    }
    this.requestUpdate();
  }

  private selectNode(nodeId: string) {
    this.selectedNode = nodeId;
  }

  private toggleCheckbox(nodeId: string, node: TreeNode) {
    const toggle = (n: TreeNode) => {
      if (this.checkedNodes.has(n.id)) {
        this.checkedNodes.delete(n.id);
      } else {
        this.checkedNodes.add(n.id);
      }
      n.children?.forEach(child => toggle(child));
    };

    toggle(node);
    this.requestUpdate();
  }

  private getFileIcon(fileName: string) {
    if (fileName.endsWith('.ts') || fileName.endsWith('.js')) return 'javascript';
    if (fileName.endsWith('.html')) return 'html';
    if (fileName.endsWith('.json')) return 'data_object';
    if (fileName.endsWith('.md')) return 'article';
    if (fileName.endsWith('.test.ts')) return 'science';
    return 'insert_drive_file';
  }

  private renderTreeNode(node: TreeNode, level = 0): any {
    const isExpanded = this.expandedNodes.has(node.id);
    const isSelected = this.selectedNode === node.id;
    const isChecked = this.checkedNodes.has(node.id);
    const hasChildren = node.children && node.children.length > 0;

    return html`
      <div class="select-none">
        <div
          class="flex items-center gap-2 px-2 py-1.5 hover:bg-surface-containerLow cursor-pointer rounded
                 ${isSelected ? 'bg-primary-container' : ''}"
          style="padding-left: ${level * 24}px"
          @click=${() => {
            if (hasChildren) this.toggleNode(node.id);
            this.selectNode(node.id);
          }}
        >
          <!-- Expand/Collapse Icon -->
          <schmancy-icon
            icon="${hasChildren ? (isExpanded ? 'expand_more' : 'chevron_right') : 'blank'}"
            class="text-surface-onVariant transition-transform"
            style="width: 20px"
          ></schmancy-icon>

          <!-- Checkbox (optional) -->
          ${this.viewMode === 'file' ? html`
            <schmancy-checkbox
              ?checked=${isChecked}
              @click=${(e: Event) => {
                e.stopPropagation();
                this.toggleCheckbox(node.id, node);
              }}
            ></schmancy-checkbox>
          ` : ''}

          <!-- Node Icon -->
          <schmancy-icon
            icon="${node.icon || (node.type === 'folder' ? (isExpanded ? 'folder_open' : 'folder') : this.getFileIcon(node.name))}"
            class="${node.type === 'folder' ? 'text-warning' : 'text-primary'}"
          ></schmancy-icon>

          <!-- Node Name -->
          <schmancy-typography type="body" token="md" class="flex-1">
            ${node.name}
          </schmancy-typography>

          <!-- Additional Info -->
          ${node.size ? html`
            <schmancy-typography type="body" token="sm" class="text-surface-onVariant">
              ${node.size}
            </schmancy-typography>
          ` : ''}
          ${node.modified ? html`
            <schmancy-typography type="body" token="sm" class="text-surface-onVariant">
              ${node.modified}
            </schmancy-typography>
          ` : ''}
        </div>

        <!-- Children -->
        ${hasChildren && isExpanded ? html`
          <div class="pl-6">
            ${repeat(
              node.children!,
              child => child.id,
              child => this.renderTreeNode(child, level + 1)
            )}
          </div>
        ` : ''}
      </div>
    `;
  }

  private getCurrentTree() {
    switch (this.viewMode) {
      case 'file': return this.fileTree;
      case 'org': return this.orgTree;
      case 'navigation': return this.navTree;
    }
  }

  render() {
    const currentTree = this.getCurrentTree();

    return html`
      <div class="container mx-auto p-4 max-w-7xl">
        <div class="mb-8">
          <schmancy-typography type="headline" token="lg" class="mb-2">
            Tree Views
          </schmancy-typography>
          <schmancy-typography type="body" token="lg" class="text-surface-onVariant">
            Hierarchical data structures with expand/collapse functionality
          </schmancy-typography>
        </div>

        <!-- View Mode Selector -->
        <schmancy-surface type="filled" class="p-4 mb-6">
          <div class="flex items-center justify-between">
            <schmancy-segmented-button>
              <schmancy-segmented-button-segment
                label="File System"
                leadingIcon="folder"
                ?selected=${this.viewMode === 'file'}
                @click=${() => this.viewMode = 'file'}
              ></schmancy-segmented-button-segment>
              <schmancy-segmented-button-segment
                label="Organization"
                leadingIcon="account_tree"
                ?selected=${this.viewMode === 'org'}
                @click=${() => this.viewMode = 'org'}
              ></schmancy-segmented-button-segment>
              <schmancy-segmented-button-segment
                label="Navigation"
                leadingIcon="menu"
                ?selected=${this.viewMode === 'navigation'}
                @click=${() => this.viewMode = 'navigation'}
              ></schmancy-segmented-button-segment>
            </schmancy-segmented-button>

            <div class="flex items-center gap-2">
              <schmancy-button
                variant="text"
                leadingIcon="unfold_more"
                @click=${() => {
                  const allNodes = (node: TreeNode): string[] => {
                    const ids = [node.id];
                    node.children?.forEach(child => ids.push(...allNodes(child)));
                    return ids;
                  };
                  allNodes(currentTree).forEach(id => this.expandedNodes.add(id));
                  this.requestUpdate();
                }}
              >
                Expand All
              </schmancy-button>
              <schmancy-button
                variant="text"
                leadingIcon="unfold_less"
                @click=${() => {
                  this.expandedNodes.clear();
                  this.requestUpdate();
                }}
              >
                Collapse All
              </schmancy-button>
            </div>
          </div>

          ${this.checkedNodes.size > 0 ? html`
            <div class="mt-4 flex items-center gap-2">
              <schmancy-chip removable @remove=${() => {
                this.checkedNodes.clear();
                this.requestUpdate();
              }}>
                ${this.checkedNodes.size} items selected
              </schmancy-chip>
            </div>
          ` : ''}
        </schmancy-surface>

        <!-- Tree View -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="lg:col-span-2">
            <schmancy-surface type="outlined" class="p-4 overflow-auto max-h-[600px]">
              ${this.renderTreeNode(currentTree)}
            </schmancy-surface>
          </div>

          <!-- Details Panel -->
          <div>
            <schmancy-surface type="filled" class="p-4">
              <schmancy-typography type="headline" token="sm" class="mb-4">
                Node Details
              </schmancy-typography>

              ${this.selectedNode ? html`
                <div class="space-y-3">
                  <div>
                    <schmancy-typography type="label" token="md" class="text-surface-onVariant">
                      Selected
                    </schmancy-typography>
                    <schmancy-typography type="body" token="md">
                      ${this.selectedNode}
                    </schmancy-typography>
                  </div>

                  <div>
                    <schmancy-typography type="label" token="md" class="text-surface-onVariant">
                      Type
                    </schmancy-typography>
                    <schmancy-typography type="body" token="md">
                      ${this.selectedNode.includes('.') ? 'File' : 'Folder'}
                    </schmancy-typography>
                  </div>

                  ${this.viewMode === 'file' ? html`
                    <div>
                      <schmancy-typography type="label" token="md" class="text-surface-onVariant">
                        Actions
                      </schmancy-typography>
                      <div class="flex gap-2 mt-2">
                        <schmancy-button variant="outlined" size="small" leadingIcon="edit">
                          Rename
                        </schmancy-button>
                        <schmancy-button variant="outlined" size="small" leadingIcon="content_copy">
                          Copy
                        </schmancy-button>
                        <schmancy-button variant="outlined" size="small" leadingIcon="delete">
                          Delete
                        </schmancy-button>
                      </div>
                    </div>
                  ` : ''}
                </div>
              ` : html`
                <schmancy-typography type="body" token="md" class="text-surface-onVariant">
                  Select a node to view details
                </schmancy-typography>
              `}
            </schmancy-surface>

            <!-- Features -->
            <schmancy-surface type="filled" class="mt-4 p-4">
              <schmancy-typography type="headline" token="sm" class="mb-3">
                Tree Features
              </schmancy-typography>
              <ul class="space-y-2">
                <li class="flex items-start gap-2">
                  <schmancy-icon icon="check" class="text-primary text-sm mt-0.5"></schmancy-icon>
                  <schmancy-typography type="body" token="sm">
                    Expand/collapse nodes
                  </schmancy-typography>
                </li>
                <li class="flex items-start gap-2">
                  <schmancy-icon icon="check" class="text-primary text-sm mt-0.5"></schmancy-icon>
                  <schmancy-typography type="body" token="sm">
                    Multi-select with checkboxes
                  </schmancy-typography>
                </li>
                <li class="flex items-start gap-2">
                  <schmancy-icon icon="check" class="text-primary text-sm mt-0.5"></schmancy-icon>
                  <schmancy-typography type="body" token="sm">
                    Keyboard navigation support
                  </schmancy-typography>
                </li>
                <li class="flex items-start gap-2">
                  <schmancy-icon icon="check" class="text-primary text-sm mt-0.5"></schmancy-icon>
                  <schmancy-typography type="body" token="sm">
                    Custom icons per node type
                  </schmancy-typography>
                </li>
                <li class="flex items-start gap-2">
                  <schmancy-icon icon="check" class="text-primary text-sm mt-0.5"></schmancy-icon>
                  <schmancy-typography type="body" token="sm">
                    Lazy loading for large trees
                  </schmancy-typography>
                </li>
              </ul>
            </schmancy-surface>
          </div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'demo-data-display-trees': DataDisplayTrees;
  }
}