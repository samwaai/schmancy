# Schmancy Store (Context System)

> Reactive state management with `createContext`, `@select` decorator, and persistent storage.

## Creating a Context
```typescript
import { createContext } from '@mhmo91/schmancy'

// Object store
const userContext = createContext({ name: '', email: '' }, 'local', 'user')

// Collection store (Map-based)
const itemsContext = createContext(new Map<string, Item>(), 'indexeddb', 'items')

// Array store
const tagsContext = createContext<string>([], 'memory', 'tags')
```

## Storage Types
| Type | Description |
|------|-------------|
| `'memory'` | In-memory only (lost on refresh) |
| `'local'` | localStorage (persistent) |
| `'session'` | sessionStorage (per tab) |
| `'indexeddb'` | IndexedDB (large data, persistent) |

## Reading State with @select
```typescript
import { select } from '@mhmo91/schmancy'

@customElement('my-component')
class MyComponent extends $LitElement() {
  // Auto-subscribes to context changes, triggers re-render
  @select(userContext)
  user!: { name: string; email: string }

  // With selector function
  @select(itemsContext, (items) => items.size)
  itemCount!: number

  // Collection as Map
  @select(itemsContext)
  items!: Map<string, Item>
}
```

## Writing State
```typescript
// Object store
userContext.set({ name: 'Alice', email: 'alice@test.com' })

// Collection store
itemsContext.set('item-1', { name: 'Widget' })
itemsContext.delete('item-1')
itemsContext.replace(new Map([...]))

// Array store
tagsContext.push('new-tag')
tagsContext.replace(['a', 'b', 'c'])
```

## Observable API
```typescript
// Subscribe to changes
userContext.$.pipe(
  takeUntil(this.disconnecting)
).subscribe(user => { ... })

// Current value (synchronous)
const current = userContext.value

// Ready state
if (userContext.ready) { ... }
```

## @select Options
`required` (default true): wait for value before connectedCallback. `updateOnly`: only requestUpdate. `deepClone`: structuredClone. `debug`: log activity.

## selectItem (Collection Helper)
```typescript
@selectItem(itemsContext, (component) => component.itemId)
selectedItem!: Item | undefined
```
