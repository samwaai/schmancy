import { html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { $LitElement } from '@mixins/index';
import { repeat } from 'lit/directives/repeat.js';
import '@schmancy';

interface DashboardMetric {
  title: string;
  value: string;
  change: number;
  trend: number[];
  icon: string;
  color: string;
}

interface Activity {
  id: string;
  user: string;
  avatar: string;
  action: string;
  target: string;
  timestamp: string;
  type: 'create' | 'update' | 'delete' | 'comment';
}

interface Project {
  id: string;
  name: string;
  description: string;
  progress: number;
  team: Array<{ name: string; avatar: string }>;
  deadline: string;
  status: 'on-track' | 'at-risk' | 'delayed' | 'completed';
  priority: 'low' | 'medium' | 'high';
  tasks: { total: number; completed: number };
}

@customElement('demo-data-display-examples')
export class DataDisplayExamples extends $LitElement(css`
  :host {
    display: block;
  }

  .sparkline {
    display: inline-block;
    width: 60px;
    height: 20px;
  }

  .team-avatars {
    display: flex;
    margin-left: 8px;
  }

  .team-avatars > * {
    margin-left: -8px;
  }
`) {
  @state() private selectedExample: 'dashboard' | 'kanban' | 'timeline' = 'dashboard';
  @state() private selectedTimeRange = '7d';

  private metrics: DashboardMetric[] = [
    {
      title: 'Revenue',
      value: '$124,563',
      change: 12.5,
      trend: [30, 35, 25, 40, 45, 50, 48],
      icon: 'payments',
      color: 'primary'
    },
    {
      title: 'Users',
      value: '8,721',
      change: 8.2,
      trend: [20, 22, 25, 23, 28, 30, 35],
      icon: 'people',
      color: 'secondary'
    },
    {
      title: 'Orders',
      value: '1,234',
      change: -3.4,
      trend: [40, 38, 42, 35, 30, 28, 25],
      icon: 'shopping_cart',
      color: 'tertiary'
    },
    {
      title: 'Conversion',
      value: '3.2%',
      change: 1.2,
      trend: [2.8, 2.9, 3.0, 2.7, 3.1, 3.2, 3.2],
      icon: 'trending_up',
      color: 'success'
    }
  ];

  private activities: Activity[] = [
    {
      id: '1',
      user: 'Alice Johnson',
      avatar: 'https://i.pravatar.cc/150?img=1',
      action: 'created',
      target: 'New Marketing Campaign',
      timestamp: '5 minutes ago',
      type: 'create'
    },
    {
      id: '2',
      user: 'Bob Smith',
      avatar: 'https://i.pravatar.cc/150?img=2',
      action: 'commented on',
      target: 'Q4 Sales Report',
      timestamp: '15 minutes ago',
      type: 'comment'
    },
    {
      id: '3',
      user: 'Charlie Davis',
      avatar: 'https://i.pravatar.cc/150?img=3',
      action: 'updated',
      target: 'Product Roadmap',
      timestamp: '1 hour ago',
      type: 'update'
    },
    {
      id: '4',
      user: 'Diana Miller',
      avatar: 'https://i.pravatar.cc/150?img=4',
      action: 'deleted',
      target: 'Outdated Documentation',
      timestamp: '2 hours ago',
      type: 'delete'
    }
  ];

  private projects: Project[] = [
    {
      id: '1',
      name: 'Website Redesign',
      description: 'Complete overhaul of company website',
      progress: 75,
      team: [
        { name: 'Alice', avatar: 'https://i.pravatar.cc/150?img=1' },
        { name: 'Bob', avatar: 'https://i.pravatar.cc/150?img=2' },
        { name: 'Charlie', avatar: 'https://i.pravatar.cc/150?img=3' }
      ],
      deadline: '2024-02-15',
      status: 'on-track',
      priority: 'high',
      tasks: { total: 24, completed: 18 }
    },
    {
      id: '2',
      name: 'Mobile App Development',
      description: 'Native iOS and Android apps',
      progress: 45,
      team: [
        { name: 'Diana', avatar: 'https://i.pravatar.cc/150?img=4' },
        { name: 'Eve', avatar: 'https://i.pravatar.cc/150?img=5' }
      ],
      deadline: '2024-03-30',
      status: 'at-risk',
      priority: 'high',
      tasks: { total: 36, completed: 16 }
    },
    {
      id: '3',
      name: 'Database Migration',
      description: 'Migrate from MySQL to PostgreSQL',
      progress: 90,
      team: [
        { name: 'Frank', avatar: 'https://i.pravatar.cc/150?img=6' }
      ],
      deadline: '2024-01-20',
      status: 'on-track',
      priority: 'medium',
      tasks: { total: 12, completed: 11 }
    },
    {
      id: '4',
      name: 'Marketing Campaign',
      description: 'Q1 2024 product launch campaign',
      progress: 25,
      team: [
        { name: 'Grace', avatar: 'https://i.pravatar.cc/150?img=7' },
        { name: 'Henry', avatar: 'https://i.pravatar.cc/150?img=8' },
        { name: 'Iris', avatar: 'https://i.pravatar.cc/150?img=9' }
      ],
      deadline: '2024-02-28',
      status: 'delayed',
      priority: 'low',
      tasks: { total: 20, completed: 5 }
    }
  ];

  private kanbanColumns = [
    { id: 'todo', title: 'To Do', color: 'neutral' },
    { id: 'in-progress', title: 'In Progress', color: 'primary' },
    { id: 'review', title: 'Review', color: 'warning' },
    { id: 'done', title: 'Done', color: 'success' }
  ];

  private kanbanTasks = [
    { id: '1', title: 'Setup project structure', column: 'done', assignee: 'Alice', priority: 'medium' },
    { id: '2', title: 'Design database schema', column: 'done', assignee: 'Bob', priority: 'high' },
    { id: '3', title: 'Implement authentication', column: 'review', assignee: 'Charlie', priority: 'high' },
    { id: '4', title: 'Create API endpoints', column: 'in-progress', assignee: 'Diana', priority: 'medium' },
    { id: '5', title: 'Build user dashboard', column: 'in-progress', assignee: 'Eve', priority: 'medium' },
    { id: '6', title: 'Add payment integration', column: 'todo', assignee: 'Frank', priority: 'high' },
    { id: '7', title: 'Write documentation', column: 'todo', assignee: 'Grace', priority: 'low' },
    { id: '8', title: 'Performance testing', column: 'todo', assignee: 'Henry', priority: 'medium' }
  ];

  private getStatusColor(status: string) {
    switch (status) {
      case 'on-track': return 'success';
      case 'at-risk': return 'warning';
      case 'delayed': return 'error';
      case 'completed': return 'primary';
      default: return 'neutral';
    }
  }

  private getPriorityIcon(priority: string) {
    switch (priority) {
      case 'high': return 'keyboard_double_arrow_up';
      case 'medium': return 'drag_handle';
      case 'low': return 'keyboard_double_arrow_down';
      default: return 'remove';
    }
  }

  private renderSparkline(data: number[]) {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min;
    const width = 60;
    const height = 20;
    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${x},${y}`;
    }).join(' ');

    return html`
      <svg class="sparkline" viewBox="0 0 ${width} ${height}">
        <polyline
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          points="${points}"
        />
      </svg>
    `;
  }

  private renderDashboard() {
    return html`
      <div class="space-y-6">
        <!-- Time Range Selector -->
        <schmancy-surface type="filled" class="p-4">
          <div class="flex items-center justify-between">
            <schmancy-typography type="headline" token="sm">
              Analytics Dashboard
            </schmancy-typography>
            <schmancy-segmented-button>
              <schmancy-segmented-button-segment
                label="24h"
                ?selected=${this.selectedTimeRange === '24h'}
                @click=${() => this.selectedTimeRange = '24h'}
              ></schmancy-segmented-button-segment>
              <schmancy-segmented-button-segment
                label="7d"
                ?selected=${this.selectedTimeRange === '7d'}
                @click=${() => this.selectedTimeRange = '7d'}
              ></schmancy-segmented-button-segment>
              <schmancy-segmented-button-segment
                label="30d"
                ?selected=${this.selectedTimeRange === '30d'}
                @click=${() => this.selectedTimeRange = '30d'}
              ></schmancy-segmented-button-segment>
              <schmancy-segmented-button-segment
                label="90d"
                ?selected=${this.selectedTimeRange === '90d'}
                @click=${() => this.selectedTimeRange = '90d'}
              ></schmancy-segmented-button-segment>
            </schmancy-segmented-button>
          </div>
        </schmancy-surface>

        <!-- Metrics Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          ${this.metrics.map(metric => html`
            <schmancy-surface type="outlined" class="p-4">
              <div class="flex items-start justify-between mb-2">
                <schmancy-icon
                  icon="${metric.icon}"
                  class="text-${metric.color}"
                ></schmancy-icon>
                <div class="text-${metric.change > 0 ? 'success' : 'error'}">
                  ${this.renderSparkline(metric.trend)}
                </div>
              </div>
              <schmancy-typography type="body" token="sm" class="text-surface-onVariant mb-1">
                ${metric.title}
              </schmancy-typography>
              <schmancy-typography type="headline" token="md" class="mb-2">
                ${metric.value}
              </schmancy-typography>
              <div class="flex items-center gap-1">
                <schmancy-icon
                  icon="${metric.change > 0 ? 'trending_up' : 'trending_down'}"
                  class="text-${metric.change > 0 ? 'success' : 'error'} text-sm"
                ></schmancy-icon>
                <schmancy-typography
                  type="body"
                  token="sm"
                  class="text-${metric.change > 0 ? 'success' : 'error'}"
                >
                  ${metric.change > 0 ? '+' : ''}${metric.change}%
                </schmancy-typography>
              </div>
            </schmancy-surface>
          `)}
        </div>

        <!-- Projects and Activity -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Projects List -->
          <div class="lg:col-span-2">
            <schmancy-surface type="outlined" class="overflow-hidden">
              <div class="p-4 bg-surface-containerHigh">
                <schmancy-typography type="headline" token="sm">
                  Active Projects
                </schmancy-typography>
              </div>
              <div class="p-4 space-y-4">
                ${this.projects.map(project => html`
                  <div class="border-b border-outline-variant pb-4 last:border-0">
                    <div class="flex items-start justify-between mb-2">
                      <div>
                        <schmancy-typography type="headline" token="sm">
                          ${project.name}
                        </schmancy-typography>
                        <schmancy-typography type="body" token="sm" class="text-surface-onVariant">
                          ${project.description}
                        </schmancy-typography>
                      </div>
                      <schmancy-badge color="${this.getStatusColor(project.status)}">
                        ${project.status}
                      </schmancy-badge>
                    </div>

                    <div class="mb-3">
                      <div class="flex items-center justify-between mb-1">
                        <schmancy-typography type="body" token="sm">
                          Progress: ${project.progress}%
                        </schmancy-typography>
                        <schmancy-typography type="body" token="sm" class="text-surface-onVariant">
                          ${project.tasks.completed}/${project.tasks.total} tasks
                        </schmancy-typography>
                      </div>
                      <schmancy-progress-linear
                        value="${project.progress}"
                        max="100"
                      ></schmancy-progress-linear>
                    </div>

                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-3">
                        <div class="team-avatars">
                          ${project.team.slice(0, 3).map(member => html`
                            <img
                              src="${member.avatar}"
                              alt="${member.name}"
                              class="w-8 h-8 rounded-full border-2 border-surface"
                              title="${member.name}"
                            >
                          `)}
                          ${project.team.length > 3 ? html`
                            <div class="w-8 h-8 rounded-full bg-surface-containerHigh flex items-center justify-center border-2 border-surface">
                              <schmancy-typography type="body" token="sm">
                                +${project.team.length - 3}
                              </schmancy-typography>
                            </div>
                          ` : ''}
                        </div>
                        <schmancy-chip size="small">
                          <schmancy-icon
                            slot="leading-icon"
                            icon="${this.getPriorityIcon(project.priority)}"
                            class="text-sm"
                          ></schmancy-icon>
                          ${project.priority}
                        </schmancy-chip>
                      </div>
                      <schmancy-typography type="body" token="sm" class="text-surface-onVariant">
                        Due: ${new Date(project.deadline).toLocaleDateString()}
                      </schmancy-typography>
                    </div>
                  </div>
                `)}
              </div>
            </schmancy-surface>
          </div>

          <!-- Activity Feed -->
          <div>
            <schmancy-surface type="outlined" class="overflow-hidden">
              <div class="p-4 bg-surface-containerHigh">
                <schmancy-typography type="headline" token="sm">
                  Recent Activity
                </schmancy-typography>
              </div>
              <schmancy-list>
                ${this.activities.map(activity => html`
                  <schmancy-list-item>
                    <img
                      slot="start"
                      src="${activity.avatar}"
                      alt="${activity.user}"
                      class="w-10 h-10 rounded-full"
                    >
                    <div slot="headline">
                      <schmancy-typography type="body" token="md">
                        <strong>${activity.user}</strong> ${activity.action}
                        <span class="text-primary">${activity.target}</span>
                      </schmancy-typography>
                    </div>
                    <div slot="supporting-text">
                      <schmancy-typography type="body" token="sm" class="text-surface-onVariant">
                        ${activity.timestamp}
                      </schmancy-typography>
                    </div>
                  </schmancy-list-item>
                `)}
              </schmancy-list>
              <div class="p-3 text-center">
                <schmancy-button variant="text" size="small">
                  View All Activity
                </schmancy-button>
              </div>
            </schmancy-surface>
          </div>
        </div>
      </div>
    `;
  }

  private renderKanban() {
    return html`
      <schmancy-surface type="filled" class="p-4">
        <schmancy-typography type="headline" token="sm" class="mb-4">
          Kanban Board
        </schmancy-typography>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          ${this.kanbanColumns.map(column => {
            const tasks = this.kanbanTasks.filter(task => task.column === column.id);
            return html`
              <div>
                <schmancy-surface type="outlined" class="overflow-hidden">
                  <div class="p-3 bg-surface-containerHigh">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <div
                          class="w-3 h-3 rounded-full"
                          style="background-color: var(--md-sys-color-${column.color})"
                        ></div>
                        <schmancy-typography type="title" token="md">
                          ${column.title}
                        </schmancy-typography>
                      </div>
                      <schmancy-badge>${tasks.length}</schmancy-badge>
                    </div>
                  </div>

                  <div class="p-3 space-y-3 min-h-[400px] bg-surface-containerLow">
                    ${tasks.map(task => html`
                      <schmancy-surface type="elevated" class="p-3 cursor-move hover:shadow-lg transition-shadow">
                        <schmancy-typography type="body" token="md" class="mb-2">
                          ${task.title}
                        </schmancy-typography>
                        <div class="flex items-center justify-between">
                          <schmancy-chip size="small">
                            <schmancy-icon
                              slot="leading-icon"
                              icon="${this.getPriorityIcon(task.priority)}"
                              class="text-sm"
                            ></schmancy-icon>
                            ${task.priority}
                          </schmancy-chip>
                          <schmancy-avatar size="small" alt="${task.assignee[0]}"></schmancy-avatar>
                        </div>
                      </schmancy-surface>
                    `)}

                    <schmancy-button variant="text" class="w-full" leadingIcon="add">
                      Add Task
                    </schmancy-button>
                  </div>
                </schmancy-surface>
              </div>
            `;
          })}
        </div>
      </schmancy-surface>
    `;
  }

  render() {
    return html`
      <div class="container mx-auto p-4 max-w-7xl">
        <div class="mb-8">
          <schmancy-typography type="headline" token="lg" class="mb-2">
            Complex Data Interfaces
          </schmancy-typography>
          <schmancy-typography type="body" token="lg" class="text-surface-onVariant">
            Real-world examples of data-heavy interfaces
          </schmancy-typography>
        </div>

        <!-- Example Selector -->
        <schmancy-surface type="filled" class="p-4 mb-6">
          <schmancy-segmented-button>
            <schmancy-segmented-button-segment
              label="Dashboard"
              leadingIcon="dashboard"
              ?selected=${this.selectedExample === 'dashboard'}
              @click=${() => this.selectedExample = 'dashboard'}
            ></schmancy-segmented-button-segment>
            <schmancy-segmented-button-segment
              label="Kanban Board"
              leadingIcon="view_kanban"
              ?selected=${this.selectedExample === 'kanban'}
              @click=${() => this.selectedExample = 'kanban'}
            ></schmancy-segmented-button-segment>
          </schmancy-segmented-button>
        </schmancy-surface>

        <!-- Content -->
        ${this.selectedExample === 'dashboard' ? this.renderDashboard() : ''}
        ${this.selectedExample === 'kanban' ? this.renderKanban() : ''}

        <!-- Tips -->
        <schmancy-surface type="filled" class="mt-8 p-6">
          <schmancy-typography type="headline" token="sm" class="mb-4">
            Building Complex Data Views
          </schmancy-typography>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <schmancy-typography type="title" token="md" class="mb-2">
                Dashboard Best Practices
              </schmancy-typography>
              <ul class="space-y-1">
                <li class="flex items-start gap-2">
                  <span class="text-primary">•</span>
                  <schmancy-typography type="body" token="sm">
                    Show most important metrics prominently
                  </schmancy-typography>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-primary">•</span>
                  <schmancy-typography type="body" token="sm">
                    Use sparklines for trend visualization
                  </schmancy-typography>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-primary">•</span>
                  <schmancy-typography type="body" token="sm">
                    Provide time range controls
                  </schmancy-typography>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-primary">•</span>
                  <schmancy-typography type="body" token="sm">
                    Group related information together
                  </schmancy-typography>
                </li>
              </ul>
            </div>

            <div>
              <schmancy-typography type="title" token="md" class="mb-2">
                Kanban Board Features
              </schmancy-typography>
              <ul class="space-y-1">
                <li class="flex items-start gap-2">
                  <span class="text-primary">•</span>
                  <schmancy-typography type="body" token="sm">
                    Visual column states with colors
                  </schmancy-typography>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-primary">•</span>
                  <schmancy-typography type="body" token="sm">
                    Drag and drop functionality
                  </schmancy-typography>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-primary">•</span>
                  <schmancy-typography type="body" token="sm">
                    Task priority indicators
                  </schmancy-typography>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-primary">•</span>
                  <schmancy-typography type="body" token="sm">
                    Quick add task buttons
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
    'demo-data-display-examples': DataDisplayExamples;
  }
}