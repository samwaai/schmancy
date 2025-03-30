# Compound Selectors

Compound selectors allow you to derive state from multiple stores, creating reactive computed properties that automatically update when any of the source stores change.

## Overview

The Schmancy Store library now includes a `createCompoundSelector` function that lets you combine multiple stores to create derived state. This feature is useful for:

- Creating dashboard views that combine user, task, and notification data
- Building summary views that aggregate data from multiple collections
- Computing metrics that depend on multiple data sources
- Implementing complex UI state that pulls from different parts of your application

## Usage

### Basic Example

```typescript
import { createCompoundSelector } from '@mhmo91/schmancy';
import { select } from '@mhmo91/schmancy';

// Create a compound selector that derives state from multiple stores
const dashboardStore = createCompoundSelector(
  [userStore, tasksStore],          // Array of source stores
  [                                 // Array of selector functions for each store
    (user) => user,
    (taskMap) => Array.from(taskMap.values())
  ],
  (user, tasks) => ({               // Combiner function that produces the final value
    userName: user.name,
    userRole: user.role,
    userTasks: tasks.filter(t => t.assignedTo === user.id),
    completedCount: tasks.filter(t => t.assignedTo === user.id && t.completed).length,
    totalCount: tasks.filter(t => t.assignedTo === user.id).length
  })
);

// Use it with the @select decorator
@select(dashboardStore)
dashboardData: {
  userName: string;
  userRole: string;
  userTasks: TaskState[];
  completedCount: number;
  totalCount: number;
};
```

### With Web Components

Compound selectors work seamlessly with web components and the `@select` decorator:

```typescript
import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { createCompoundSelector, select } from '@mhmo91/schmancy';

@customElement('user-dashboard')
class UserDashboard extends LitElement {
  @select(dashboardStore)
  dashboardData: {
    userName: string;
    userRole: string;
    userTasks: TaskState[];
    completedCount: number;
    totalCount: number;
  };
  
  render() {
    if (!this.dashboardData) return html`<div>Loading...</div>`;
    
    const { userName, userRole, userTasks, completedCount, totalCount } = this.dashboardData;
    
    return html`
      <div>
        <h2>${userName} (${userRole})</h2>
        <div>Tasks: ${completedCount}/${totalCount} completed</div>
        <ul>
          ${userTasks.map(task => html`
            <li>
              <input type="checkbox" ?checked=${task.completed} 
                     @change=${() => this.toggleTask(task.id)}>
              ${task.title}
            </li>
          `)}
        </ul>
      </div>
    `;
  }
  
  toggleTask(taskId: string) {
    const task = tasksStore.value.get(taskId);
    if (task) {
      tasksStore.set(taskId, { ...task, completed: !task.completed });
    }
  }
}
```

## API Reference

### createCompoundSelector

```typescript
function createCompoundSelector<R>(
  stores: Array<IStore<any> | ICollectionStore<any>>,
  selectorFns: Array<(state: any) => any>,
  combinerFn: (...values: any[]) => R
): Partial<IStore<R>>
```

**Parameters:**

- `stores`: Array of source stores (can be a mix of object stores and collection stores)
- `selectorFns`: Array of selector functions, one for each store
- `combinerFn`: Function that combines the results of the selector functions into a single value

**Returns:**

A store-compatible object that can be used with the `@select` decorator.

## Best Practices

### 1. Keep Selectors Focused

Each compound selector should have a clear purpose. Avoid creating "kitchen sink" selectors that derive too many unrelated values.

### 2. Memoize Expensive Operations

If your combiner function performs expensive calculations, consider using memoization to avoid recalculating when inputs haven't changed.

```typescript
import { memoize } from 'lodash';

// Memoize the expensive calculation
const calculateStatistics = memoize((tasks) => {
  // Complex calculations...
  return { totalTime, averageCompletionTime, /* ... */ };
});

const statsStore = createCompoundSelector(
  [tasksStore],
  [(tasks) => Array.from(tasks.values())],
  (tasks) => calculateStatistics(tasks)
);
```

### 3. Use Type Definitions

Define interfaces for your derived state to improve type safety and code completion:

```typescript
interface DashboardData {
  userName: string;
  userRole: string;
  userTasks: TaskState[];
  completedCount: number;
  totalCount: number;
}

const dashboardStore = createCompoundSelector<DashboardData>(
  // ...
);
```

### 4. Handle Initial Values Carefully

The compound selector will calculate an initial value from the current state of the source stores. Make sure your selector functions and combiner function can handle initial/empty states gracefully.

## Performance Considerations

Compound selectors use RxJS's `distinctUntilChanged` with deep equality checking to avoid unnecessary updates. However, returning new object references in your selector functions can still cause re-renders.

To optimize performance:

1. Use primitive values when possible
2. Return stable references when values haven't changed
3. Consider using the `shareReplay(1)` operator for selectors that are used in multiple components
4. For very complex scenarios, consider implementing custom equality checking

## Advanced Example: Filtering and Sorting

This example shows how to create a compound selector that provides filtered and sorted tasks:

```typescript
interface TaskFilters {
  status: 'all' | 'completed' | 'active';
  searchTerm: string;
  sortBy: 'dueDate' | 'priority' | 'title';
  sortDirection: 'asc' | 'desc';
}

// Create stores
const tasksStore = createContext<TaskState>(new Map(), 'local', 'tasks');
const filtersStore = createContext<TaskFilters>({
  status: 'all',
  searchTerm: '',
  sortBy: 'dueDate',
  sortDirection: 'asc'
}, 'session', 'task-filters');

// Create compound selector
const filteredTasksStore = createCompoundSelector(
  [tasksStore, filtersStore],
  [
    (tasks) => Array.from(tasks.values()),
    (filters) => filters
  ],
  (tasks, filters) => {
    // Filter tasks
    let result = tasks;
    
    if (filters.status !== 'all') {
      result = result.filter(task => 
        filters.status === 'completed' ? task.completed : !task.completed
      );
    }
    
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      result = result.filter(task => 
        task.title.toLowerCase().includes(term) || 
        task.description.toLowerCase().includes(term)
      );
    }
    
    // Sort tasks
    result.sort((a, b) => {
      let comparison = 0;
      
      switch (filters.sortBy) {
        case 'dueDate':
          comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
          break;
        case 'priority':
          comparison = a.priority - b.priority;
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
      }
      
      return filters.sortDirection === 'asc' ? comparison : -comparison;
    });
    
    return result;
  }
);
```

## Troubleshooting

### Updates Not Being Detected

If changes to your source stores aren't triggering updates in your compound selector:

1. Check that your selector functions return new values when the source store changes
2. Verify your combiner function correctly processes the inputs
3. Ensure you're using the right selector type (collection vs. object store)

### Memory Leaks

The compound selector maintains subscriptions to source stores. When you no longer need a compound selector:

1. Make sure components using `@select` are properly disposed
2. For manual subscriptions, always unsubscribe when done
