# Schmancy Store Library: From Basic to Advanced

This guide will walk you through using the Schmancy Store library for state management in your applications, from basic usage to advanced patterns. The library provides robust, type-safe state management with built-in persistence and reactive updates.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Basic Usage](#basic-usage)
   - [Object Stores](#object-stores)
   - [Collection Stores](#collection-stores)
   - [Array Stores](#array-stores)
3. [Persistence Options](#persistence-options)
4. [Subscribing to Changes](#subscribing-to-changes)
5. [Selectors and Derived State](#selectors-and-derived-state)
   - [Basic Selectors](#basic-selectors)
   - [Collection Selectors](#collection-selectors)
   - [Compound Selectors](#compound-selectors)
6. [Integration with Web Components](#integration-with-web-components)
7. [Advanced Filtering and Querying](#advanced-filtering-and-querying)
8. [Immutability with Immer](#immutability-with-immer)
9. [Error Handling](#error-handling)
10. [AI Integration Patterns](#ai-integration-patterns)
11. [Performance Optimization](#performance-optimization)
12. [Testing Stores](#testing-stores)

## Getting Started

### Installation

```bash
npm install @mhmo91/schmancy
```

### Importing

```typescript
// Import the necessary components
import { createContext, createArrayContext } from '@mhmo91/schmancy'
```

## Basic Usage

Schmancy Store supports three types of stores: Object, Collection (Map-based), and Array.

### Object Stores

Perfect for storing structured data like user profiles, settings, or application state.

```typescript
// Create a store for user preferences
import { createContext } from 'schmancy-store'

interface UserPreferences {
	theme: 'light' | 'dark'
	fontSize: number
	notifications: boolean
}

// Initialize with default values
const prefsStore = createContext<UserPreferences>(
	{
		theme: 'light',
		fontSize: 16,
		notifications: true,
	},
	'local', // Storage type (localStorage)
	'user-preferences', // Unique key for storage
)

// Read values
console.log(prefsStore.value.theme) // 'light'

// Update values
prefsStore.set({ theme: 'dark' }) // Partial update
prefsStore.set({ theme: 'light', fontSize: 18 }) // Multiple properties

// Replace entire state
prefsStore.replace({
	theme: 'dark',
	fontSize: 20,
	notifications: false,
})

// Reset to default values
prefsStore.clear()

// Delete a specific property
prefsStore.delete('fontSize')

// Update a nested property
prefsStore.setPath('theme', 'dark')
```

### Collection Stores

Ideal for managing collections of items with unique identifiers, like todos, contacts, or product catalogs.

```typescript
// Create a store for a todo list
import { createContext } from 'schmancy-store'

interface Todo {
	id: string
	text: string
	completed: boolean
	priority: number
}

// Initialize with an empty Map
const todosStore = createContext<Todo>(new Map<string, Todo>(), 'local', 'todos')

// Add a todo
todosStore.set('todo1', {
	id: 'todo1',
	text: 'Learn Schmancy Store',
	completed: false,
	priority: 1,
})

// Get a specific todo
const todo = todosStore.value.get('todo1')

// Update a todo
todosStore.set('todo1', {
	...todo!,
	completed: true,
})

// Using the update method with Immer integration
todosStore.update('todo1', draft => {
	draft.completed = true
	draft.priority = 2
})

// Delete a todo
todosStore.delete('todo1')

// Batch update multiple todos
todosStore.batchUpdate({
	todo1: { id: 'todo1', text: 'Updated task', completed: false, priority: 1 },
	todo2: { id: 'todo2', text: 'New task', completed: false, priority: 2 },
})

// Clear all todos
todosStore.clear()
```

### Array Stores

Perfect for ordered lists, historical data, or any collection where order matters.

```typescript
// Create a store for a reading list
import { createArrayContext } from 'schmancy-store'

interface Book {
	title: string
	author: string
	yearPublished: number
}

// Initialize with some default books
const readingListStore = createArrayContext<Book>(
	[
		{ title: 'Dune', author: 'Frank Herbert', yearPublished: 1965 },
		{ title: 'Neuromancer', author: 'William Gibson', yearPublished: 1984 },
	],
	'reading-list',
)

// Add a book to the end
readingListStore.push({
	title: 'Snow Crash',
	author: 'Neal Stephenson',
	yearPublished: 1992,
})

// Add a book to the beginning
readingListStore.unshift({
	title: 'Foundation',
	author: 'Isaac Asimov',
	yearPublished: 1951,
})

// Remove the last book
const lastBook = readingListStore.pop()

// Remove the first book
const firstBook = readingListStore.shift()

// Update a book at a specific index
readingListStore.set(0, {
	title: 'Updated Title',
	author: 'Same Author',
	yearPublished: 2000,
})

// Update a book using an updater function
readingListStore.update(0, book => {
	book.title = 'Updated Title'
})

// Remove a book by value
readingListStore.remove({ title: 'Dune', author: 'Frank Herbert', yearPublished: 1965 })

// Custom comparison function for removal
readingListStore.remove({ title: 'Dune', author: 'Frank Herbert', yearPublished: 1965 }, (a, b) => a.title === b.title)

// Sort books by year
readingListStore.sort((a, b) => a.yearPublished - b.yearPublished)

// Filter books - keep only books published after 1980
readingListStore.filter(book => book.yearPublished > 1980)

// Replace the entire array
readingListStore.replace([
	{ title: 'New Book 1', author: 'Author 1', yearPublished: 2010 },
	{ title: 'New Book 2', author: 'Author 2', yearPublished: 2020 },
])

// Clear the array
readingListStore.clear()
```

## Persistence Options

Schmancy Store supports multiple persistence strategies:

```typescript
// Memory storage (no persistence, cleared on refresh)
const memoryStore = createContext(initialData, 'memory', 'key')

// LocalStorage (persists across sessions)
const localStore = createContext(initialData, 'local', 'key')

// SessionStorage (persists within the current tab)
const sessionStore = createContext(initialData, 'session', 'key')

// IndexedDB (for larger data, better performance)
const indexedDBStore = createContext(initialData, 'indexeddb', 'key')
```

## Subscribing to Changes

You can subscribe to changes in the store using RxJS observables:

```typescript
// Subscribe to all changes
const subscription = userStore.$.subscribe(state => {
	console.log('State updated:', state)
})

// Unsubscribe when done
subscription.unsubscribe()

// Subscribe to errors
userStore.error$.subscribe(error => {
	if (error) {
		console.error('Store error:', error)
	}
})
```

## Selectors and Derived State

Selectors let you create derived state that updates efficiently when source data changes.

### Basic Selectors

For simple transformations on a single store:

```typescript
import { createSelector } from '@mhmo91/schmancy'

// Create a selector for the theme
const themeSelector = createSelector(prefsStore, state => state.theme)

// Subscribe to theme changes
themeSelector.subscribe(theme => {
	console.log('Theme changed:', theme)
	// Update UI or perform other actions
})

// Create a selector for formatted user data
const userDisplaySelector = createSelector(userStore, user => ({
	fullName: `${user.firstName} ${user.lastName}`,
	displayRole: user.role.toUpperCase(),
	isAdmin: user.role === 'admin',
}))
```

### Collection Selectors

Special selectors for working with collection stores:

```typescript
import { createFilterSelector, createItemsSelector, createItemSelector } from '@mhmo91/schmancy'

// Get all items as an array
const allTodosSelector = createItemsSelector(todosStore)

// Get completed todos
const completedTodosSelector = createFilterSelector(todosStore, todo => todo.completed)

// Get a specific todo by key
const currentTodoSelector = createItemSelector(todosStore, 'todo1')
```

### Compound Selectors

Combine data from multiple stores into a single derived state:

```typescript
import { createCompoundSelector } from '@mhmo91/schmancy';

// Define the types we're working with
interface UserState {
  id: string;
  name: string;
  role: string;
}

interface TaskState {
  id: string;
  title: string;
  completed: boolean;
  assignedTo: string;
}

// Create the stores
const userStore = createContext<UserState>({
  id: 'user-1',
  name: 'John Doe',
  role: 'admin'
}, 'local', 'user-state');

const tasksStore = createContext<TaskState>(
  new Map<string, TaskState>(),
  'local',
  'tasks-state'
);

// Create a compound selector that derives state from both stores
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

// Or subscribe to it directly
dashboardStore.$.subscribe(data => {
  console.log('Dashboard data updated:', data);
});
```

## Integration with Web Components

The library provides decorators for easy integration with web components like Lit:

```typescript
import { LitElement, html } from 'lit'
import { select, selectItem } from '@mhmo91/schmancy'

class UserProfile extends LitElement {
	// Select the entire user object
	@select(userStore)
	user: User

	// Select a specific property
	@select(userStore, state => state.name)
	username: string

	// Select with options (required: true is default since v0.2.178)
	@select(userStore, state => state.preferences, {
		deepClone: true, // Deep clone values to prevent mutations
		updateOnly: false, // Set property and trigger update
		debug: false, // Enable debug logging
	})
	preferences: Preferences
	
	// Override the default required behavior
	@select(userStore, state => state.optionalData, {
		required: false // Don't wait for non-null value before rendering
	})
	optionalData: OptionalData

	// Select an item from a collection
	@selectItem(todosStore, function (this: TodoItem) {
		return this.todoId // Uses a property from the component
	})
	todo: Todo

	// Use compound selector with component
	@select(dashboardStore)
	dashboard: DashboardData

	render() {
		return html`
			<h1>Hello ${this.username}</h1>
			<p>Theme: ${this.preferences?.theme}</p>
			<p>Todo: ${this.todo?.text}</p>
			<div>
				<h2>Dashboard</h2>
				<p>Tasks: ${this.dashboard?.completedCount}/${this.dashboard?.totalCount} completed</p>
			</div>
		`
	}
}
```

## Advanced Filtering and Querying

The library provides powerful filtering capabilities for collections:

```typescript
import { filterMapItems, QueryCondition } from '@mhmo91/schmancy'

// Define query conditions
const conditions: QueryCondition[] = [
	// Simple condition: field, operator, expected value
	['completed', '==', true],

	// Condition with case-sensitivity
	['text', 'includes', 'important', true],

	// Object form
	{ key: 'priority', operator: '>', value: 2 },

	// Fuzzy search
	['text', 'any', 'task'],
]

// Apply filters to a collection
const filteredTodos = filterMapItems(todosStore.value, conditions)

// Apply filters to an array
import { filterArrayItems } from '@mhmo91/schmancy'
const filteredBooks = filterArrayItems(readingListStore.value, [
	['author', 'includes', 'Gibson'],
	['yearPublished', '>=', 1980],
])
```

Available operators:

- `==`, `!=`, `>`, `<`, `>=`, `<=` for equality and comparison
- `includes`, `notIncludes` for substring and collection membership
- `startsWith`, `endsWith` for string matching
- `in`, `notIn` for checking if a value is in a collection
- `any` for fuzzy search with smart scoring

## Immutability with Immer

The library uses Immer for immutable updates:

```typescript
import { updateMap, updateObject, updateItem } from '@mhmo91/schmancy'

// Update a Map immutably
const newMap = updateMap(oldMap, draft => {
	draft.set('key', 'value')
	draft.delete('oldKey')
})

// Update an object immutably
const newObj = updateObject(oldObj, draft => {
	draft.name = 'New Name'
	draft.count += 1
})

// Update a specific item in a Map
const newMap = updateItem(todosMap, 'todo1', draft => {
	draft.completed = true
	draft.text = 'Updated text'
})

// Create a readonly version of a type
import { asReadonly, freeze } from '@mhmo91/schmancy'
const immutableUser = asReadonly(user)
const frozenUser = freeze(user)
```

## Error Handling

The library provides robust error handling:

```typescript
// Subscribe to errors
userStore.error$.subscribe(error => {
	if (error) {
		console.error(`Store error: ${error.message}`, error)

		// Access additional context
		console.log('Context:', error.context)
		console.log('Cause:', error.cause)
		console.log('Timestamp:', error.timestamp)
	}
})

// Try/catch for sync operations
try {
	userStore.set({ invalidProp: 'value' })
} catch (err) {
	if (err instanceof StoreError) {
		console.error(`Store operation failed: ${err.message}`)
	}
}

// Async operations with error handling
async function saveUserData() {
	try {
		await userStore.storage.save(userData)
	} catch (err) {
		console.error(`Failed to save user data: ${err.message}`)
	}
}
```

## AI Integration Patterns

Schmancy Store works great with AI applications due to its type safety and immutability.

### Pattern 1: Storing and Managing AI Model Outputs

```typescript
interface AIModelOutput {
	id: string
	prompt: string
	result: string
	timestamp: Date
	metadata: {
		model: string
		temperature: number
		tokens: number
	}
}

// Create a store for AI model outputs
const aiOutputsStore = createArrayContext<AIModelOutput>([], 'ai-outputs')

// Add a new AI result
aiOutputsStore.push({
	id: crypto.randomUUID(),
	prompt: 'Write a short poem about technology',
	result: 'Digital dreams in silicon sleep...',
	timestamp: new Date(),
	metadata: {
		model: 'gpt-4',
		temperature: 0.7,
		tokens: 150,
	},
})

// Filter outputs by model type
const gpt4Outputs = aiOutputsStore.filter(output => output.metadata.model === 'gpt-4')
```

### Pattern 2: Managing Conversation History

```typescript
interface Message {
	id: string
	role: 'user' | 'assistant'
	content: string
	timestamp: Date
}

interface Conversation {
	id: string
	title: string
	messages: Message[]
	created: Date
	updated: Date
}

// Store for all conversations
const conversationsStore = createContext<Conversation>(new Map<string, Conversation>(), 'indexeddb', 'conversations')

// Create a new conversation
const newConversation: Conversation = {
	id: crypto.randomUUID(),
	title: 'New chat',
	messages: [],
	created: new Date(),
	updated: new Date(),
}
conversationsStore.set(newConversation.id, newConversation)

// Add a message to a conversation
conversationsStore.update(conversationId, conversation => {
	conversation.messages.push({
		id: crypto.randomUUID(),
		role: 'user',
		content: 'Hello AI assistant!',
		timestamp: new Date(),
	})
	conversation.updated = new Date()

	// Auto-generate title from first message if untitled
	if (conversation.title === 'New chat' && conversation.messages.length === 1) {
		conversation.title = `Chat about ${conversation.messages[0].content.substring(0, 20)}...`
	}
})
```

### Pattern 3: Caching AI Responses

```typescript
interface CachedResponse {
	prompt: string
	response: string
	timestamp: Date
	expiresAt: Date
}

// Create a cache store with TTL support
const aiCacheStore = createContext<CachedResponse>(new Map<string, CachedResponse>(), 'local', 'ai-response-cache')

// Function to get cached or fresh response
async function getAIResponse(prompt: string) {
	// Create a consistent hash of the prompt for the key
	const promptHash = await createHash(prompt)

	// Check if we have a valid cached response
	const cached = aiCacheStore.value.get(promptHash)
	const now = new Date()

	if (cached && cached.expiresAt > now) {
		console.log('Using cached response')
		return cached.response
	}

	// No valid cache, request new response
	const response = await fetchFromAI(prompt)

	// Cache the response with a 1-hour TTL
	const expiresAt = new Date()
	expiresAt.setHours(expiresAt.getHours() + 1)

	aiCacheStore.set(promptHash, {
		prompt,
		response,
		timestamp: now,
		expiresAt,
	})

	return response
}

// Helper to create a hash
async function createHash(text: string) {
	const msgUint8 = new TextEncoder().encode(text)
	const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8)
	const hashArray = Array.from(new Uint8Array(hashBuffer))
	return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}
```

### Pattern 4: Tracking AI Model Training Progress

```typescript
interface TrainingMetrics {
	epoch: number
	loss: number
	accuracy: number
	timestamp: Date
}

interface ModelTraining {
	modelId: string
	status: 'queued' | 'training' | 'completed' | 'failed'
	progress: number // 0-100
	metrics: TrainingMetrics[]
	startTime: Date
	endTime?: Date
	error?: string
}

// Create a store for training jobs
const trainingStore = createContext<ModelTraining>(new Map<string, ModelTraining>(), 'indexeddb', 'model-training-jobs')

// Update training progress
function updateTrainingProgress(trainingId: string, progress: number, metrics: TrainingMetrics) {
	trainingStore.update(trainingId, training => {
		training.progress = progress
		training.metrics.push(metrics)

		if (progress >= 100) {
			training.status = 'completed'
			training.endTime = new Date()
		}
	})
}

// Use compound selector to visualize training progress
const trainingDashboardStore = createCompoundSelector(
	[trainingStore, userStore],
	[state => Array.from(state.values()), user => user],
	(trainings, user) => {
		const userTrainings = trainings.filter(t => t.userId === user.id)
		return {
			activeCount: userTrainings.filter(t => t.status === 'training').length,
			completedCount: userTrainings.filter(t => t.status === 'completed').length,
			failedCount: userTrainings.filter(t => t.status === 'failed').length,
			averageAccuracy:
				userTrainings
					.filter(t => t.status === 'completed' && t.metrics.length > 0)
					.map(t => t.metrics[t.metrics.length - 1].accuracy)
					.reduce((sum, acc) => sum + acc, 0) / userTrainings.length || 0,
		}
	},
)
```

## Performance Optimization

For better performance in demanding applications:

```typescript
// Use optimized selectors with proper cleanup
import { createOptimizedSelector } from '@mhmo91/schmancy'

const optimizedSelector = createOptimizedSelector(userStore, state => state.preferences)

// Use throttled persistence for high-frequency updates
// (Already built into collection and array stores)

// Avoid unnecessary updates
todosStore.update('todo1', draft => {
	// Only if actually changing the value
	if (!draft.completed) {
		draft.completed = true
	}
})

// Memory optimization for large collections
function cleanupOldItems() {
	const now = Date.now()
	const oneMonthAgo = now - 30 * 24 * 60 * 60 * 1000

	// Get all keys first, then delete as needed
	for (const [key, item] of logsStore.value.entries()) {
		if (item.timestamp < oneMonthAgo) {
			logsStore.delete(key)
		}
	}
}
```

## Testing Stores

The library provides utilities for testing:

```typescript
import { createTestArrayContext } from '@mhmo91/schmancy'

// Create a test store with in-memory storage
const testTodosStore = createTestArrayContext<Todo>([{ id: '1', text: 'Test todo', completed: false }], 'test-todos')

// Test a component that uses the store
describe('TodoList component', () => {
	beforeEach(() => {
		// Reset store to initial state
		testTodosStore.clear()
		testTodosStore.push({ id: '1', text: 'Test todo', completed: false })
	})

	it('should mark a todo as completed', () => {
		// Arrange
		const component = new TodoList()
		component.todoId = '1'

		// Act
		component.markAsCompleted()

		// Assert
		expect(testTodosStore.value[0].completed).toBe(true)
	})
})
```

## Conclusion

The Schmancy Store library offers powerful state management capabilities for applications of all sizes. Its type-safe API, immutability, and built-in persistence make it ideal for both standard web applications and AI-powered systems.

For more advanced usage patterns, refer to the API documentation or explore the example repositories.
