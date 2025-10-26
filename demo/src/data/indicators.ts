import { html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { $LitElement } from '@mhmo91/schmancy/mixins';
import '@mhmo91/schmancy';

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  status: 'online' | 'offline' | 'busy' | 'away';
  role: string;
  department: string;
  notifications: number;
  verified: boolean;
}

interface Task {
  id: string;
  title: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'todo' | 'in-progress' | 'review' | 'done';
  assignee: string;
  dueDate: string;
  tags: string[];
  progress: number;
}

@customElement('demo-data-display-indicators')
export class DataDisplayIndicators extends $LitElement() {
  @state() private selectedSection: 'avatars' | 'badges' | 'status' | 'progress' = 'avatars';

  private users: User[] = [
    {
      id: '1',
      name: 'Alice Johnson',
      email: 'alice@example.com',
      avatar: 'https://i.pravatar.cc/150?img=1',
      status: 'online',
      role: 'Admin',
      department: 'Engineering',
      notifications: 3,
      verified: true
    },
    {
      id: '2',
      name: 'Bob Smith',
      email: 'bob@example.com',
      avatar: 'https://i.pravatar.cc/150?img=2',
      status: 'busy',
      role: 'Developer',
      department: 'Engineering',
      notifications: 0,
      verified: true
    },
    {
      id: '3',
      name: 'Charlie Davis',
      email: 'charlie@example.com',
      avatar: 'https://i.pravatar.cc/150?img=3',
      status: 'away',
      role: 'Designer',
      department: 'Design',
      notifications: 7,
      verified: false
    },
    {
      id: '4',
      name: 'Diana Miller',
      email: 'diana@example.com',
      avatar: 'https://i.pravatar.cc/150?img=4',
      status: 'offline',
      role: 'Manager',
      department: 'Sales',
      notifications: 12,
      verified: true
    }
  ];

  private tasks: Task[] = [
    {
      id: '1',
      title: 'Update dashboard design',
      priority: 'high',
      status: 'in-progress',
      assignee: 'Alice Johnson',
      dueDate: '2024-01-15',
      tags: ['design', 'ui', 'urgent'],
      progress: 65
    },
    {
      id: '2',
      title: 'Fix login bug',
      priority: 'critical',
      status: 'review',
      assignee: 'Bob Smith',
      dueDate: '2024-01-10',
      tags: ['bug', 'auth'],
      progress: 90
    },
    {
      id: '3',
      title: 'Write documentation',
      priority: 'low',
      status: 'todo',
      assignee: 'Charlie Davis',
      dueDate: '2024-01-20',
      tags: ['docs'],
      progress: 0
    },
    {
      id: '4',
      title: 'Performance optimization',
      priority: 'medium',
      status: 'in-progress',
      assignee: 'Diana Miller',
      dueDate: '2024-01-18',
      tags: ['performance', 'backend'],
      progress: 40
    }
  ];

  private getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      'online': '#4CAF50',
      'offline': '#9E9E9E',
      'busy': '#F44336',
      'away': '#FF9800'
    };
    return colors[status] || '#9E9E9E';
  }

  private getPriorityColor(priority: string): string {
    switch (priority) {
      case 'critical': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'primary';
      case 'low': return 'neutral';
      default: return 'neutral';
    }
  }

  private getStatusBadgeColor(status: string): string {
    switch (status) {
      case 'done': return 'success';
      case 'in-progress': return 'primary';
      case 'review': return 'warning';
      case 'todo': return 'neutral';
      default: return 'neutral';
    }
  }

  private getProgressColor(progress: number): string {
    if (progress >= 80) return 'success';
    if (progress >= 50) return 'primary';
    if (progress >= 20) return 'warning';
    return 'error';
  }

  private renderAvatars() {
    return html`
      <schmancy-surface type="filled" class="p-6">
        <schmancy-typography type="headline" token="sm" class="mb-4">
          Avatar Variations
        </schmancy-typography>

        <!-- Basic Avatars -->
        <div class="mb-6">
          <schmancy-typography type="title" token="md" class="mb-3">
            Basic Avatars
          </schmancy-typography>
          <div class="flex items-center gap-4 flex-wrap">
            <schmancy-avatar
              src="https://i.pravatar.cc/150?img=5"
              alt="User"
            ></schmancy-avatar>

            <schmancy-avatar
              src="https://i.pravatar.cc/150?img=6"
              alt="User"
              size="large"
            ></schmancy-avatar>

            <schmancy-avatar
              alt="JD"
            ></schmancy-avatar>

            <schmancy-avatar
              icon="person"
            ></schmancy-avatar>
          </div>
        </div>

        <!-- Avatars with Status -->
        <div class="mb-6">
          <schmancy-typography type="title" token="md" class="mb-3">
            Avatars with Status Indicators
          </schmancy-typography>
          <div class="flex items-center gap-6 flex-wrap">
            ${this.users.map(user => html`
              <div class="flex flex-col items-center gap-2">
                <div class="relative">
                  <schmancy-avatar
                    src="${user.avatar}"
                    alt="${user.name}"
                  ></schmancy-avatar>
                  <div
                    class="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-surface"
                    style="background-color: ${this.getStatusColor(user.status)}"
                  ></div>
                </div>
                <schmancy-typography type="body" token="sm">
                  ${user.status}
                </schmancy-typography>
              </div>
            `)}
          </div>
        </div>

        <!-- Avatar Groups -->
        <div class="mb-6">
          <schmancy-typography type="title" token="md" class="mb-3">
            Avatar Groups
          </schmancy-typography>
          <div class="flex items-center gap-6">
            <div class="flex ml-3 *:-ml-3 *:border-2 *:border-surface">
              ${this.users.slice(0, 3).map(user => html`
                <schmancy-avatar
                  src="${user.avatar}"
                  alt="${user.name}"
                  class="ring-2 ring-surface"
                ></schmancy-avatar>
              `)}
              <schmancy-avatar
                alt="+5"
                class="ring-2 ring-surface"
              ></schmancy-avatar>
            </div>

            <schmancy-typography type="body" token="md" class="text-surface-onVariant">
              8 team members
            </schmancy-typography>
          </div>
        </div>

        <!-- Avatars with Badges -->
        <div>
          <schmancy-typography type="title" token="md" class="mb-3">
            Avatars with Notification Badges
          </schmancy-typography>
          <div class="flex items-center gap-6 flex-wrap">
            ${this.users.filter(u => u.notifications > 0).map(user => html`
              <div class="relative">
                <schmancy-avatar
                  src="${user.avatar}"
                  alt="${user.name}"
                ></schmancy-avatar>
                <schmancy-badge
                  color="error"
                  class="absolute -top-1 -right-1"
                >
                  ${user.notifications}
                </schmancy-badge>
              </div>
            `)}
          </div>
        </div>
      </schmancy-surface>
    `;
  }

  private renderBadges() {
    return html`
      <schmancy-surface type="filled" class="p-6">
        <schmancy-typography type="headline" token="sm" class="mb-4">
          Badge Variations
        </schmancy-typography>

        <!-- Color Variations -->
        <div class="mb-6">
          <schmancy-typography type="title" token="md" class="mb-3">
            Color Variations
          </schmancy-typography>
          <div class="flex items-center gap-3 flex-wrap">
            <schmancy-badge color="primary">Primary</schmancy-badge>
            <schmancy-badge color="secondary">Secondary</schmancy-badge>
            <schmancy-badge color="tertiary">Tertiary</schmancy-badge>
            <schmancy-badge color="error">Error</schmancy-badge>
            <schmancy-badge color="warning">Warning</schmancy-badge>
            <schmancy-badge color="success">Success</schmancy-badge>
            <schmancy-badge color="neutral">Neutral</schmancy-badge>
          </div>
        </div>

        <!-- Size Variations -->
        <div class="mb-6">
          <schmancy-typography type="title" token="md" class="mb-3">
            Size Variations
          </schmancy-typography>
          <div class="flex items-center gap-3 flex-wrap">
            <schmancy-badge size="small">Small</schmancy-badge>
            <schmancy-badge>Default</schmancy-badge>
            <schmancy-badge size="large">Large</schmancy-badge>
          </div>
        </div>

        <!-- Numeric Badges -->
        <div class="mb-6">
          <schmancy-typography type="title" token="md" class="mb-3">
            Numeric Badges
          </schmancy-typography>
          <div class="flex items-center gap-4 flex-wrap">
            <schmancy-badge color="primary">1</schmancy-badge>
            <schmancy-badge color="error">99</schmancy-badge>
            <schmancy-badge color="warning">999+</schmancy-badge>
            <div class="relative inline-block">
              <schmancy-icon-button icon="notifications"></schmancy-icon-button>
              <schmancy-badge color="error" class="absolute -top-1 -right-1">
                5
              </schmancy-badge>
            </div>
            <div class="relative inline-block">
              <schmancy-icon-button icon="mail"></schmancy-icon-button>
              <schmancy-badge color="primary" class="absolute -top-1 -right-1">
                12
              </schmancy-badge>
            </div>
          </div>
        </div>

        <!-- Label Badges -->
        <div>
          <schmancy-typography type="title" token="md" class="mb-3">
            Label Badges
          </schmancy-typography>
          <div class="flex items-center gap-3 flex-wrap">
            <schmancy-badge color="success">Verified</schmancy-badge>
            <schmancy-badge color="warning">Pending</schmancy-badge>
            <schmancy-badge color="error">Urgent</schmancy-badge>
            <schmancy-badge color="primary">New</schmancy-badge>
            <schmancy-badge color="secondary">Beta</schmancy-badge>
            <schmancy-badge color="neutral">Archive</schmancy-badge>
          </div>
        </div>
      </schmancy-surface>
    `;
  }

  private renderStatusChips() {
    return html`
      <schmancy-surface type="filled" class="p-6">
        <schmancy-typography type="headline" token="sm" class="mb-4">
          Status Chips & Tags
        </schmancy-typography>

        <!-- Task Priority Chips -->
        <div class="mb-6">
          <schmancy-typography type="title" token="md" class="mb-3">
            Priority Indicators
          </schmancy-typography>
          <div class="flex items-center gap-3 flex-wrap">
            ${['critical', 'high', 'medium', 'low'].map(priority => html`
              <schmancy-chip color="${this.getPriorityColor(priority)}">
                <schmancy-icon slot="leading-icon" icon="flag"></schmancy-icon>
                ${priority.charAt(0).toUpperCase() + priority.slice(1)}
              </schmancy-chip>
            `)}
          </div>
        </div>

        <!-- Status Chips -->
        <div class="mb-6">
          <schmancy-typography type="title" token="md" class="mb-3">
            Task Status
          </schmancy-typography>
          <div class="flex items-center gap-3 flex-wrap">
            ${['todo', 'in-progress', 'review', 'done'].map(status => html`
              <schmancy-chip outlined>
                <div
                  slot="leading-icon"
                  class="w-2 h-2 rounded-full"
                  style="background-color: var(--md-sys-color-${this.getStatusBadgeColor(status)})"
                ></div>
                ${status.replace('-', ' ')}
              </schmancy-chip>
            `)}
          </div>
        </div>

        <!-- Removable Tags -->
        <div class="mb-6">
          <schmancy-typography type="title" token="md" class="mb-3">
            Removable Tags
          </schmancy-typography>
          <div class="flex items-center gap-2 flex-wrap">
            ${['Frontend', 'Backend', 'Database', 'API', 'Security', 'Performance'].map(tag => html`
              <schmancy-chip removable size="small">
                ${tag}
              </schmancy-chip>
            `)}
          </div>
        </div>

        <!-- Combined Indicators -->
        <div>
          <schmancy-typography type="title" token="md" class="mb-3">
            Combined Indicators
          </schmancy-typography>
          ${this.tasks.map(task => html`
            <div class="flex items-center gap-3 p-3 border-b border-outline-variant">
              <schmancy-chip size="small" color="${this.getPriorityColor(task.priority)}">
                ${task.priority}
              </schmancy-chip>
              <schmancy-typography type="body" token="md" class="flex-1">
                ${task.title}
              </schmancy-typography>
              <schmancy-badge color="${this.getStatusBadgeColor(task.status)}">
                ${task.status}
              </schmancy-badge>
              <schmancy-typography type="body" token="sm" class="text-surface-onVariant">
                ${task.assignee}
              </schmancy-typography>
            </div>
          `)}
        </div>
      </schmancy-surface>
    `;
  }

  private renderProgressIndicators() {
    return html`
      <schmancy-surface type="filled" class="p-6">
        <schmancy-typography type="headline" token="sm" class="mb-4">
          Progress Indicators
        </schmancy-typography>

        <!-- Linear Progress -->
        <div class="mb-6">
          <schmancy-typography type="title" token="md" class="mb-3">
            Linear Progress Bars
          </schmancy-typography>
          <div class="space-y-4">
            ${this.tasks.map(task => html`
              <div>
                <div class="flex items-center justify-between mb-1">
                  <schmancy-typography type="body" token="md">
                    ${task.title}
                  </schmancy-typography>
                  <schmancy-typography type="body" token="sm" class="text-surface-onVariant">
                    ${task.progress}%
                  </schmancy-typography>
                </div>
                <schmancy-progress-linear
                  value="${task.progress}"
                  max="100"
                  color="${this.getProgressColor(task.progress)}"
                ></schmancy-progress-linear>
              </div>
            `)}
          </div>
        </div>

        <!-- Circular Progress -->
        <div class="mb-6">
          <schmancy-typography type="title" token="md" class="mb-3">
            Circular Progress Indicators
          </schmancy-typography>
          <div class="flex items-center gap-6 flex-wrap">
            <div class="text-center">
              <schmancy-progress-circular
                value="25"
                max="100"
                size="large"
              ></schmancy-progress-circular>
              <schmancy-typography type="body" token="sm" class="mt-2">
                25%
              </schmancy-typography>
            </div>
            <div class="text-center">
              <schmancy-progress-circular
                value="50"
                max="100"
                size="large"
                color="primary"
              ></schmancy-progress-circular>
              <schmancy-typography type="body" token="sm" class="mt-2">
                50%
              </schmancy-typography>
            </div>
            <div class="text-center">
              <schmancy-progress-circular
                value="75"
                max="100"
                size="large"
                color="warning"
              ></schmancy-progress-circular>
              <schmancy-typography type="body" token="sm" class="mt-2">
                75%
              </schmancy-typography>
            </div>
            <div class="text-center">
              <schmancy-progress-circular
                value="100"
                max="100"
                size="large"
                color="success"
              ></schmancy-progress-circular>
              <schmancy-typography type="body" token="sm" class="mt-2">
                Complete
              </schmancy-typography>
            </div>
          </div>
        </div>

        <!-- Loading States -->
        <div>
          <schmancy-typography type="title" token="md" class="mb-3">
            Loading States
          </schmancy-typography>
          <div class="flex items-center gap-6">
            <schmancy-progress-circular indeterminate size="small"></schmancy-progress-circular>
            <schmancy-progress-circular indeterminate></schmancy-progress-circular>
            <schmancy-progress-circular indeterminate size="large"></schmancy-progress-circular>
          </div>
          <div class="mt-4">
            <schmancy-progress-linear indeterminate></schmancy-progress-linear>
          </div>
        </div>
      </schmancy-surface>
    `;
  }

  render() {
    return html`
      <div class="container mx-auto p-4 max-w-7xl">
        <div class="mb-8">
          <schmancy-typography type="headline" token="lg" class="mb-2">
            Data Indicators
          </schmancy-typography>
          <schmancy-typography type="body" token="lg" class="text-surface-onVariant">
            Visual indicators for status, categories, and metadata
          </schmancy-typography>
        </div>

        <!-- Section Selector -->
        <schmancy-surface type="filled" class="p-4 mb-6">
          <schmancy-segmented-button>
            <schmancy-segmented-button-segment
              label="Avatars"
              leadingIcon="account_circle"
              ?selected=${this.selectedSection === 'avatars'}
              @click=${() => this.selectedSection = 'avatars'}
            ></schmancy-segmented-button-segment>
            <schmancy-segmented-button-segment
              label="Badges"
              leadingIcon="label"
              ?selected=${this.selectedSection === 'badges'}
              @click=${() => this.selectedSection = 'badges'}
            ></schmancy-segmented-button-segment>
            <schmancy-segmented-button-segment
              label="Status Chips"
              leadingIcon="sell"
              ?selected=${this.selectedSection === 'status'}
              @click=${() => this.selectedSection = 'status'}
            ></schmancy-segmented-button-segment>
            <schmancy-segmented-button-segment
              label="Progress"
              leadingIcon="donut_large"
              ?selected=${this.selectedSection === 'progress'}
              @click=${() => this.selectedSection = 'progress'}
            ></schmancy-segmented-button-segment>
          </schmancy-segmented-button>
        </schmancy-surface>

        <!-- Content -->
        ${this.selectedSection === 'avatars' ? this.renderAvatars() : ''}
        ${this.selectedSection === 'badges' ? this.renderBadges() : ''}
        ${this.selectedSection === 'status' ? this.renderStatusChips() : ''}
        ${this.selectedSection === 'progress' ? this.renderProgressIndicators() : ''}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'demo-data-display-indicators': DataDisplayIndicators;
  }
}