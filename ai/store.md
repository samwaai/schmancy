# Store — State Foundation

> **Not a utility. The state backbone of a Schmancy app.**
> `createContext` + `@select` replaces Redux, Zustand, and a route-scoped cache without ceremony.

A real app runs *many* small contexts — not one monolith. Typical production apps sit around 8–10:

```
userContext          ('local')      — signed-in user (persists across sessions)
organizationContext  ('local')      — current org
appStateContext      ('local')      — core app state (lists, selections, flags)
agentsContext        ('memory')     — fetched data (re-fetched on reload)
contactsContext      ('memory')     — Map<id, Contact> — mass data
templatesContext     ('memory')     — list fetched from server
currentTemplateIdCtx ('local')      — small pointer ref that persists
composeContext       ('local')      — draft form state
draftCtx             ('session')    — per-thread chat input (tab-scoped)
strictCtx            ('session')    — per-thread toggles (tab-scoped)
```

**Split by persistence tier + lifetime**, not by feature area. Per-component ephemeral state → `session`. Cached fetches → `memory`. User-saved preferences → `local`. Large cached data → `indexeddb`.

## Creating a context

```typescript
import { createContext } from '@mhmo91/schmancy'

// Object store — persisted to localStorage
export const userContext = createContext<User>(new User(), 'local', 'user')

// Collection store — Map keyed by id
export const contactsContext = createContext<Map<string, Contact>>(new Map(), 'memory', 'contacts')

// Array store — ordered list
export const tagsContext = createContext<string[]>([], 'memory', 'tags')

// Session-scoped (per browser tab)
export const draftContext = createContext<{ text: string }>({ text: '' }, 'session', 'compose-draft')
```

### Storage tiers

| Mode | Backing | Survives refresh? | Survives tab close? | Size |
|------|---------|-------------------|---------------------|------|
| `'memory'` | JS heap | ❌ | ❌ | small |
| `'session'` | `sessionStorage` | ✅ | ❌ (per-tab) | ~5 MB |
| `'local'` | `localStorage` | ✅ | ✅ | ~5 MB |
| `'indexeddb'` | IndexedDB | ✅ | ✅ | GB |

Rule of thumb:
- **User session data, prefs, drafts meant to persist** → `'local'`
- **Per-tab ephemeral data** (wizard progress, per-thread drafts) → `'session'`
- **Fetched from API, regenerable** → `'memory'`
- **Large arrays, file-like data, offline-first** → `'indexeddb'`

## Reading with `@select`

```typescript
import { select } from '@mhmo91/schmancy'

@customElement('user-card')
class UserCard extends $LitElement() {
  // Auto-subscribes, re-renders on change
  @select(userContext) user!: User

  // Selector function narrows the dependency
  @select(contactsContext, m => m.size) contactCount!: number

  // Collection → stays as Map
  @select(contactsContext) contacts!: Map<string, Contact>
}
```

`@select` options:
- `required` (default `true`) — wait for context `.ready` before `connectedCallback` completes.
- `updateOnly` — only call `requestUpdate`, don't assign. Use when you read the value imperatively.
- `deepClone` — `structuredClone` the value to prevent accidental mutation.
- `debug` — log every emission.

### Pick one item from a collection
```typescript
@selectItem(contactsContext, component => component.contactId)
contact!: Contact | undefined
```

Use this on components that carry the key as a property (e.g. `this.contactId`) — avoids reading the whole map.

## Writing state

### Object store
```typescript
userContext.set({ name: 'Alice', email: 'alice@test.com' })
userContext.set({ ...userContext.value, name: 'Bob' })  // partial update pattern
```

### Collection (Map) store
```typescript
contactsContext.set('id-1', { id: 'id-1', name: 'Alice' })
contactsContext.delete('id-1')
contactsContext.replace(new Map([/* fresh batch */]))
```

### Array store
```typescript
tagsContext.push('new-tag')
tagsContext.replace(['a', 'b', 'c'])
```

## Observable API

```typescript
connectedCallback() {
  super.connectedCallback()

  userContext.$.pipe(
    filter(() => userContext.ready),               // gate on initialization
    distinctUntilChanged((a, b) => a.id === b.id), // ignore unrelated writes
    switchMap(user => this.loadForUser(user)),     // cascade load
    takeUntil(this.disconnecting),                 // cleanup
  ).subscribe(data => this.data = data)
}
```

- **`ctx.$`** — a `BehaviorSubject`. Use for chained transforms.
- **`ctx.value`** — synchronous snapshot.
- **`ctx.ready`** — boolean; becomes `true` after the backing store has loaded.

### The gating pattern
Every non-trivial subscription starts with `filter(() => ctx.ready)`. When your context is backed by `indexeddb` or re-hydrated from `localStorage`, the initial default value is emitted before the real stored value lands. Gate on `.ready` to skip the default.

## Dynamic contexts (per-instance)

For per-component ephemeral state that still benefits from persistence, instantiate the context **inside** `connectedCallback` with an instance-specific key:

```typescript
import { createContext, IStore } from '@mhmo91/schmancy'

@customElement('chat-input')
class ChatInput extends $LitElement() {
  @property() draftKey?: string

  private draftCtx: IStore<{ text: string }> | null = null

  connectedCallback() {
    super.connectedCallback()

    if (this.draftKey) {
      this.draftCtx = createContext<{ text: string }>(
        { text: '' },
        'session',
        this.draftKey,          // e.g. `chat-draft-${threadId}`
      )

      // Hydrate once
      this.draftCtx.$.pipe(
        filter(() => this.draftCtx!.ready),
        take(1),
        tap(v => { this.text = v.text }),
      ).subscribe()
    }
  }

  private onInput(v: string) {
    this.text = v
    this.draftCtx?.set({ text: v })
  }
}
```

This is the pattern for *every* "draft that persists until sent" input.

## Architectural rules

1. **Declare contexts at module scope**, not inside classes — except dynamic per-instance ones.
2. **Name the storage key** even for `'memory'` contexts — it helps debugging.
3. **Keep each context small and single-purpose**. 9 small contexts beat 1 god context.
4. **Subscribe with `takeUntil(this.disconnecting)`** — every time, no exceptions.
5. **Gate on `.ready`** before any async cascading work.
6. **Only the owning component writes**. Everyone else reads via `@select`.
7. **Don't put functions, observables, or class instances into context** — only plain serializable data (for `'local'` / `'session'` / `'indexeddb'`).

## Anti-patterns

- ❌ Storing Promises in context. Use `memory` contexts for cached fetch *results*, not the in-flight Promise.
- ❌ Cross-writing: component A writes to context X which is "owned" by component B. Centralize writes.
- ❌ One monolithic `appContext` holding everything. You lose `distinctUntilChanged` granularity.
- ❌ Forgetting `.ready` — causes double-fires on load with stale default values.
- ❌ Using `'local'` for large blobs — hits quota, blocks the main thread on stringify/parse.

## See also
- [mixins](./mixins.md) — `$LitElement` provides `disconnecting` for every subscription.
- [area](./area.md) — routing + contexts compose naturally (guards read context state).
