# Schmancy Store - AI Reference

```js
// Store Creation
import { createStore } from '@mhmo91/schmancy';

// Basic store creation
const store = createStore({
  initialState: {
    count: 0,
    users: [],
    settings: { darkMode: false }
  }
});

// Store with actions
const counterStore = createStore({
  initialState: { count: 0 },
  actions: {
    increment: (state, amount = 1) => { state.count += amount; },
    decrement: (state, amount = 1) => { state.count -= amount; },
    reset: (state) => { state.count = 0; }
  }
});

// Store Context Creation
import { createContext, createCollectionContext } from '@mhmo91/schmancy';

// Object/array/collection contexts
const settingsContext = createContext(store, 'settings');           // Object
const usersContext = createContext(store, 'users');                 // Array
const todoCollection = createCollectionContext(store, 'todos');     // Collection with IDs

// State Manipulation Methods
store.createAction('addUser', (state, user) => {                    // Custom action
  state.users.push(user);
});

store.update(state => {                                             // Direct update
  state.count++;
  state.settings.darkMode = true;
});

todoCollection.add({ id: '1', text: 'Buy milk' });                  // Collection add
todoCollection.update('1', item => { item.completed = true; });     // Collection update
todoCollection.remove('1');                                         // Collection remove

// Selectors
import { createSelector, useSelector } from '@mhmo91/schmancy';

// Basic and computed selectors
const getCount = state => state.count;
const getActiveUsers = createSelector(
  state => state.users,
  (users) => users.filter(user => user.active)
);

// Component integration
function MyComponent() {
  const count = useSelector(getCount);
  const activeUsers = useSelector(getActiveUsers);
  
  // React to state changes
}

// Examples
// 1. Theme store with persistence
const themeStore = createStore({
  initialState: { mode: 'light', fontSize: 'medium' },
  actions: {
    toggleTheme: state => {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
    },
    setFontSize: (state, size) => {
      state.fontSize = size;
    }
  }
});

// LocalStorage persistence
import { StorageManager } from '@mhmo91/schmancy';
new StorageManager({
  key: 'theme-store',
  storage: localStorage
}).connect(themeStore);

// 2. Todo application store
const todoStore = createStore({
  initialState: {
    todos: [],
    filter: 'all'
  },
  actions: {
    addTodo: (state, text) => {
      state.todos.push({
        id: Date.now().toString(),
        text,
        completed: false
      });
    },
    toggleTodo: (state, id) => {
      const todo = state.todos.find(todo => todo.id === id);
      if (todo) todo.completed = !todo.completed;
    },
    setFilter: (state, filter) => {
      state.filter = filter;
    }
  }
});

// 3. Filtered todos selector
const getFilteredTodos = createSelector(
  state => state.todos,
  state => state.filter,
  (todos, filter) => {
    switch (filter) {
      case 'active': return todos.filter(t => !t.completed);
      case 'completed': return todos.filter(t => t.completed);
      default: return todos;
    }
  }
);
// 4. Using @select decorator in components
import { select } from '@mhmo91/schmancy';

@customElement('my-component')
class MyComponent extends LitElement {
  // Auto-subscribes to store state
  @select(store, state => state.count)
  count!: number;
  
  // With options
  @select(store, state => state.user, { required: false })
  user?: User;
  
  // The component will automatically update when these values change
}
```

## Related Components
- **[Area](./area.md)**: Uses similar reactive patterns for routing state
- **[Theme](./theme.md)**: Often uses store for theme state management
- **[Form](./form.md)**: Can use store for form state management

## Technical Details

### Store Interfaces
```typescript
interface StoreOptions<T> {
  initialState: T;
  actions?: Record<string, (state: T, ...args: any[]) => void>;
}

interface Store<T> {
  getState(): T;
  update(updater: (state: T) => void): void;
  subscribe(listener: (state: T) => void): () => void;
  createAction<Args extends any[]>(
    name: string,
    action: (state: T, ...args: Args) => void
  ): (...args: Args) => void;
}

interface Context<T> {
  get(): T;
  update(updater: (state: T) => void): void;
  subscribe(listener: (state: T) => void): () => void;
}

interface CollectionContext<T> extends Context<Record<string, T>> {
  add(item: T): void;
  update(id: string, updater: (item: T) => void): void;
  remove(id: string): void;
}
```

### Integration with Immer
The store uses Immer under the hood to enable immutable updates with mutable syntax. This means you can write code that appears to directly modify the state, but behind the scenes, it's creating a new immutable state tree.

```js
// This looks like direct mutation but is actually immutable
store.update(state => {
  state.count++;           // Modifying a primitive
  state.users.push(user);  // Modifying an array
  state.deep.nested.value = true; // Modifying a nested property
});
```

### @select Decorator
The `@select` decorator connects component properties to store state with automatic subscription management:

```typescript
@select(store, selectorFn, options?)
```

Options:
- `required: boolean` (default: true) - Wait for non-undefined value before calling connectedCallback
- `updateOnly: boolean` - Only trigger updates, don't set property value
- `deepClone: boolean` - Use structuredClone for deep cloning values
- `equals: (a, b) => boolean` - Custom equality function
- `debug: boolean` - Enable debug logging

The decorator ensures `connectedCallback` is called only once, even with multiple @select decorators.

### Common Use Cases

1. **Application theme state**
   ```js
   const themeStore = createStore({
     initialState: { mode: 'light' },
     actions: {
       toggleTheme: state => {
         state.mode = state.mode === 'light' ? 'dark' : 'light';
       }
     }
   });
   
   // In a component
   const mode = useSelector(state => state.mode);
   const toggleTheme = () => themeStore.actions.toggleTheme();
   ```

2. **Form state management**
   ```js
   const formStore = createStore({
     initialState: {
       values: { name: '', email: '' },
       errors: {},
       isDirty: false,
       isSubmitting: false
     },
     actions: {
       setField: (state, field, value) => {
         state.values[field] = value;
         state.isDirty = true;
       },
       setError: (state, field, error) => {
         state.errors[field] = error;
       },
       submit: (state) => {
         state.isSubmitting = true;
       },
       reset: (state) => {
         state.values = { name: '', email: '' };
         state.errors = {};
         state.isDirty = false;
       }
     }
   });
   ```

3. **Filtered data with memoization**
   ```js
   const getFilteredItems = createSelector(
     state => state.items,
     state => state.filters,
     (items, filters) => {
       return items.filter(item => {
         // Apply filters
         return Object.entries(filters).every(([key, value]) => 
           !value || item[key] === value
         );
       });
     }
   );
   ```