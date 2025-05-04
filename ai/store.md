# Schmancy Store - AI Reference

```js
// Store Creation
import { createStore } from 'schmancy/store';

// Basic store creation
const store = createStore({
  initialState: {
    count: 0,
    users: [],
    settings: {
      darkMode: false
    }
  }
});

// Creating a store with actions
const counterStore = createStore({
  initialState: { count: 0 },
  actions: {
    increment: (state, amount = 1) => {
      state.count += amount;
    },
    decrement: (state, amount = 1) => {
      state.count -= amount;
    },
    reset: (state) => {
      state.count = 0;
    }
  }
});

// Store Context Creation
import { createContext } from 'schmancy/store';

// Object context (plain object state)
const settingsContext = createContext(store, 'settings');

// Array context (array state)
const usersContext = createContext(store, 'users');

// Collection context (optimized for collections with IDs)
const todoCollection = createCollectionContext(store, 'todos');

// Actions
// Using actions
counterStore.actions.increment(5);
counterStore.actions.decrement();
counterStore.actions.reset();

// Creating custom actions
store.createAction('addUser', (state, user) => {
  state.users.push(user);
});

// Updates (direct state mutation, enabled by Immer)
store.update(state => {
  state.count++;
  state.users.push({ id: 1, name: 'John' });
  state.settings.darkMode = true;
});

// Context-specific updates
settingsContext.update(settings => {
  settings.darkMode = true;
  settings.fontSize = 'large';
});

usersContext.update(users => {
  users.push({ id: 2, name: 'Alice' });
});

// Collection operations
todoCollection.add({ id: '1', text: 'Buy milk', completed: false });
todoCollection.update('1', item => { item.completed = true; });
todoCollection.remove('1');

// Selectors
import { createSelector } from 'schmancy/store';

// Basic selectors
const getCount = state => state.count;
const getUsers = state => state.users;

// Computed selectors
const getActiveUsers = createSelector(
  getUsers,
  (users) => users.filter(user => user.active)
);

const getCompletedTodoCount = createSelector(
  state => state.todos,
  (todos) => todos.filter(todo => todo.completed).length
);

// Using hooks with selectors
import { useSelector } from 'schmancy/store';

// In a component
const count = useSelector(getCount);
const activeUsers = useSelector(getActiveUsers);

// Subscribe to state changes
const unsubscribe = store.subscribe(state => {
  console.log('State updated:', state);
});

// Unsubscribe when no longer needed
unsubscribe();

// Local Storage Integration
import { StorageManager } from 'schmancy/store';

// Persist store to localStorage
const storageManager = new StorageManager({
  key: 'app-store',
  storage: localStorage,
  serialize: JSON.stringify,
  deserialize: JSON.parse
});

storageManager.connect(store);

// Examples
// Complete store setup example
const appStore = createStore({
  initialState: {
    counter: { value: 0 },
    todos: [],
    theme: 'light'
  },
  actions: {
    incrementCounter: (state, amount = 1) => {
      state.counter.value += amount;
    },
    addTodo: (state, text) => {
      state.todos.push({
        id: Date.now().toString(),
        text,
        completed: false
      });
    },
    toggleTodo: (state, id) => {
      const todo = state.todos.find(todo => todo.id === id);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
    setTheme: (state, theme) => {
      state.theme = theme;
    }
  }
});

// Using in components
const TodoApp = () => {
  const todos = useSelector(state => state.todos);
  const theme = useSelector(state => state.theme);
  
  const addNewTodo = (text) => {
    appStore.actions.addTodo(text);
  };
  
  const toggleTodoStatus = (id) => {
    appStore.actions.toggleTodo(id);
  };
  
  // Render component
};
```