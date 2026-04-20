# Store — Context System

Reactive state management: `createContext`, `@select`, `@selectItem`.

## Creating a context

```typescript
import { createContext } from '@mhmo91/schmancy'

// Object
const userContext = createContext<User>(new User(), 'local', 'user')

// Map (collection)
const itemsContext = createContext<Map<string, Item>>(new Map(), 'indexeddb', 'items')

// Array
const tagsContext = createContext<string[]>([], 'memory', 'tags')
```

Signature: `createContext(initial, storage, key)`.

## Storage backends

| Mode | Backing | Survives refresh | Survives tab close | Capacity |
|------|---------|------------------|--------------------|----------|
| `'memory'` | JS heap | ❌ | ❌ | RAM |
| `'session'` | `sessionStorage` | ✅ | ❌ (per-tab) | ~5 MB |
| `'local'` | `localStorage` | ✅ | ✅ | ~5 MB |
| `'indexeddb'` | IndexedDB | ✅ | ✅ | GB |

Pick by data size and lifetime:
- User prefs, long-lived drafts → `'local'`
- Per-tab ephemeral (cart, wizard) → `'session'`
- Fetched from API, regenerable → `'memory'`
- Collections with >100 entries you want cached → `'indexeddb'`

## Reading with `@select`

```typescript
import { select } from '@mhmo91/schmancy'

@customElement('my-component')
class MyComponent extends $LitElement() {
  @select(userContext) user!: User

  // Selector narrows the dependency
  @select(itemsContext, m => m.size) count!: number

  @select(itemsContext) items!: Map<string, Item>
}
```

`@select` options:
- `required` (default `true`) — wait for `.ready` before `connectedCallback` completes.
- `updateOnly` — call `requestUpdate` without assigning.
- `deepClone` — `structuredClone` the value.
- `debug` — log every emission.

## `@selectItem`

Pick one entry from a collection context, keyed off a component property:

```typescript
@selectItem(itemsContext, component => component.itemId)
item!: Item | undefined
```

## Writing

```typescript
// Object
userContext.set({ name: 'Alice' })
userContext.set({ ...userContext.value, name: 'Bob' })

// Map
itemsContext.set('id-1', item)
itemsContext.delete('id-1')
itemsContext.replace(newMap)

// Array
tagsContext.push('new')
tagsContext.replace(['a', 'b'])
```

## Observable API

```typescript
userContext.$.pipe(
  filter(() => userContext.ready),
  takeUntil(this.disconnecting),
).subscribe(user => { /* ... */ })

userContext.value       // synchronous snapshot
userContext.ready       // true once the backing store has loaded
```

Gate subscriptions on `.ready` — `'local'` / `'session'` / `'indexeddb'` contexts emit their default value before the real stored value hydrates.

## Dynamic contexts

For per-instance state with persistence, create the context inside `connectedCallback` with an instance-scoped key:

```typescript
private draftCtx: IStore<{ text: string }> | null = null

connectedCallback() {
  super.connectedCallback()
  if (this.draftKey) {
    this.draftCtx = createContext<{ text: string }>(
      { text: '' },
      'session',
      this.draftKey,
    )
  }
}
```

## Rules

- Declare contexts at module scope (except dynamic per-instance ones).
- Name the storage key even for `'memory'` contexts — it helps debugging.
- Keep each context single-purpose. One write shouldn't invalidate unrelated readers.
- Only the owning component writes. Others read via `@select`.
- Every subscription uses `takeUntil(this.disconnecting)`.
- Gate on `.ready` before async cascading work.
- Don't store Promises, Observables, functions, or class instances in persistent contexts.
