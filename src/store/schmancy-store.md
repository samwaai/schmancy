# Schmancy Store

A type-safe, flexible state management library for TypeScript applications. Schmancy Store provides robust state management with powerful selectors, persistence, and excellent TypeScript support.

## Key Features

- **Type-safe APIs**: Full TypeScript support with generic types
- **Object & Collection Stores**: Support for both object-based and collection-based state
- **Persistent Storage**: Automatic state persistence in localStorage, sessionStorage, or IndexedDB
- **Reactive Updates**: Built on RxJS for efficient, reactive updates
- **Powerful Selectors**: Create derived state with memoized selectors
- **Filtering & Sorting**: Built-in utilities for filtering and sorting data
- **LitElement Integration**: Decorators for easy integration with web components
- **Developer Tools**: Built-in developer tools support for debugging

## Installation

```bash
npm install schmancy-store
```

## Quick Start

### Creating a Simple Object Store

```typescript
import { createObjectContext } from 'schmancy-store';

interface UserSettings {
  theme: 'light' | 'dark';
  fontSize: number;
  notifications: boolean;
}

// Create a type-safe store
const settingsStore = createObjectContext<UserSettings>({
  theme: 'light',
  fontSize: 16,
  notifications: true
}, 'user-settings', 'local');

// Update settings
settingsStore.set({ theme: 'dark' });

// Subscribe to changes
settingsStore.$.subscribe(settings => {
  console.log('Settings changed:', settings);
});
```

### Creating a Collection Store

```typescript
import { createCollectionContext } from 'schmancy-store';

interface TodoItem {
  id: string;
  title: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
}

// Create a collection store with type safety
const todosStore = createCollectionContext<TodoItem>(new Map(), 'todos', 'local');

// Add items
todosStore.set('task1', {
  id: 'task1',
  title: 'Learn TypeScript',
  completed: false,
  priority: 'high'
});

// Remove items
todosStore.delete('task1');
```

## Using with LitElement

Schmancy Store provides decorators for easy integration with LitElement components:

```typescript
import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { select } from 'schmancy-store';

@customElement('todo-list')
class TodoList extends LitElement {
  // Connect to the store
  @select(todosStore, state => Array.from(state.values()))
  todos!: TodoItem[];
  
  render() {
    return html`
      <ul>
        ${this.todos.map(todo => html`
          <li>${todo.title}</li>
        `)}
      </ul>
    `;
  }
}
```

## Advanced Features

### Selectors

Create efficient derived state with selectors:

```typescript
import { createFilterSelector, createSortSelector } from 'schmancy-store';

// Get only the incomplete todos
const incompleteTodosSelector = createFilterSelector(
  todosStore,
  todo => !todo.completed
);

// Sort todos by priority
const prioritizedTodosSelector = createSortSelector(
  todosStore,
  (a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  }
);

// Subscribe to derived state
incompleteTodosSelector.subscribe(todos => {
  console.log('Incomplete todos:', todos);
});
```

### Filtering Data

Filter collection data with advanced query conditions:

```typescript
import { filterMap, QueryCondition } from 'schmancy-store';

// Define filter conditions
const filters: QueryCondition[] = [
  ['priority', '==', 'high'],
  ['title', 'includes', 'important']
];

// Apply filters
const filteredTodos = filterMap(todosStore.value, filters);
```

## API Reference

### Store Types

- `IStore<T>`: Interface for object stores
- `ICollectionStore<T>`: Interface for collection stores

### Creation Functions

- `createContext<T>()`: Create a new store
- `createObjectContext<T>()`: Create an object store
- `createCollectionContext<T>()`: Create a collection store

### Store Methods

- `store.value`: Get current state
- `store.$`: Observable of state changes
- `store.set()`: Update state
- `store.delete()`: Remove items
- `store.clear()`: Reset state
- `store.destroy()`: Clean up resources

### Selectors

- `createSelector<T, R>()`: Create a derived state selector
- `createFilterSelector<T>()`: Filter collection items
- `createSortSelector<T>()`: Sort collection items
- `createItemSelector<T>()`: Select a single item
- `createMapSelector<T, R>()`: Map collection items
- `createCountSelector<T>()`: Count collection items
- `createCompoundSelector<T>()`: Combine multiple selectors

### Decorators

- `@select()`: Connect component property to store
- `@selectItem()`: Connect to a specific collection item

## License

MIT
