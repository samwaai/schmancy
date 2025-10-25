# Context API - Schmancy Framework

## Overview

The Context API in Schmancy provides a reactive state management solution with automatic persistence across browser storage mechanisms. It's built on RxJS observables and integrates seamlessly with Lit components.

## Core Concepts

### What is a Context?

A context is a reactive container that:
- Holds application state
- Automatically persists to browser storage
- Notifies all subscribers of changes
- Works across component boundaries without prop drilling

### Storage Types

| Type | Use Case | Size Limit | Persistence |
|------|----------|------------|-------------|
| `'local'` | User preferences, auth tokens | ~5-10MB | Survives browser restart |
| `'session'` | Temporary UI state, filters | ~5-10MB | Cleared on tab close |
| `'indexeddb'` | Large datasets, complex objects | GB+ | Survives browser restart |
| `null` | Non-persisted state | Memory only | Lost on page reload |

## Creating Contexts

### Basic Syntax

```typescript
import { createContext } from '@schmancy/index'
// Or specific import: import { createContext } from '@schmancy/store'

export const contextName = createContext<Type>(
  initialValue,    // Default value
  storageType,     // 'local' | 'session' | 'indexeddb' | null
  storageKey      // Unique key for storage
)
```

### Examples by Use Case

#### User Authentication
```typescript
// Single user object that persists across sessions
export const userContext = createContext<User>(
  new User(),
  'local',
  'auth_user'
)
```

#### Application Configuration
```typescript
// App-wide settings
export const configContext = createContext<AppConfig>(
  { theme: 'light', language: 'en' },
  'local',
  'app_config'
)
```

#### Collections (Use Maps for Performance)
```typescript
// Large collections with frequent lookups
export const productsContext = createContext<Map<string, Product>>(
  new Map(),
  'indexeddb',
  'products_collection'
)

// User collection with relationships
export const usersContext = createContext<Map<string, User>>(
  new Map(),
  'indexeddb', 
  'users_collection'
)
```

#### Temporary UI State
```typescript
// Filter state cleared on tab close
export const filterContext = createContext<ProductFilter>(
  { category: 'all', priceRange: [0, 1000] },
  'session',
  'product_filter'
)

// Selected items in current session
export const selectedIdsContext = createContext<Set<string>>(
  new Set(),
  'session',
  'selected_items'
)
```

#### Non-Persisted State
```typescript
// Loading states, temporary flags
export const loadingContext = createContext<boolean>(
  false,
  null,  // No persistence
  'loading_state'
)
```

## Using Contexts in Components

### @select Decorator Behavior

The `@select` decorator has specific behavior regarding `null` and `undefined` values:

- **`null` is a valid value** - Components will render when the selected value is `null`
- **`undefined` means "not ready"** - Components wait for a defined value before rendering
- **`required: true` (default)** - Component waits for any value (including `null`) before initial render
- **`required: false`** - Component renders immediately, even if value is `undefined`

```typescript
// This will render even when user is null
@select(userContext, state => state?.user)
user!: AuthUser | null

// This will wait for a non-undefined value
@select(userContext, state => state?.user, { required: true })
user!: AuthUser | null

// This renders immediately, even with undefined
@select(userContext, state => state?.user, { required: false })
user: AuthUser | null | undefined
```

### Basic Component Integration

```typescript
import { select } from '@schmancy/index'
import { $LitElement } from '@mixins/index'
// Or specific imports:
// import { select } from '@schmancy/store'
// import { $LitElement } from '@mixins/litElement'
import { userContext, productsContext } from './contexts'

@customElement('my-component')
export class MyComponent extends $LitElement() {
  // Basic selection
  @select(userContext) user!: User
  
  // With transformation
  @select(productsContext, products => Array.from(products.values()))
  productsList!: Product[]
  
  // Required context (waits for value before rendering, null is allowed)
  @select(configContext, config => config, { required: true })
  config!: AppConfig | null
  
  render() {
    return html`
      <div>Welcome, ${this.user.name}</div>
      <div>${this.productsList.length} products</div>
    `
  }
}
```

### Advanced Subscriptions

```typescript
@customElement('advanced-component')
export class AdvancedComponent extends $LitElement() {
  connectedCallback() {
    super.connectedCallback()
    
    // React to context changes
    userContext.$.pipe(
      takeUntil(this.disconnecting),
      filter(user => user.isAuthenticated),
      debounceTime(300)
    ).subscribe(user => {
      console.log('Authenticated user changed:', user)
    })
    
    // Combine multiple contexts
    combineLatest([
      userContext.$,
      organizationContext.$
    ]).pipe(
      takeUntil(this.disconnecting)
    ).subscribe(([user, org]) => {
      // React to either changing
    })
  }
}
```

## Context Operations

### Reading Values

```typescript
// Get current value synchronously
const currentUser = userContext.value

// Subscribe to changes
userContext.$.subscribe(user => {
  console.log('User changed:', user)
})
```

### Updating Values

```typescript
// Partial update (merges with existing)
userContext.set({ name: 'New Name' })

// Full replacement
userContext.replace(new User({ id: '123', name: 'John' }))

// For Maps
productsContext.set(prevMap => {
  const newMap = new Map(prevMap)
  newMap.set('123', newProduct)
  return newMap
})
```

### Clearing Values

```typescript
// Reset to initial value and clear storage
userContext.clear()

// Clear all contexts (useful for logout)
export function clearAllContexts() {
  userContext.clear()
  configContext.clear()
  productsContext.clear()
}
```

## Best Practices

### 1. Organization

```typescript
// Feature-based structure
src/
  features/
    auth/
      context.ts    // Auth-related contexts
      components/
    products/
      context.ts    // Product-related contexts
      components/
```

### 2. Type Safety

```typescript
// Always provide explicit types
export const userContext = createContext<User>(...)  // ✅

// Avoid any
export const dataContext = createContext<any>(...)   // ❌

// Use discriminated unions for complex state
type AuthState = 
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'authenticated'; user: User }
  | { status: 'error'; error: string }

export const authStateContext = createContext<AuthState>(
  { status: 'idle' },
  'session',
  'auth_state'
)
```

### 3. Performance Optimization

```typescript
// Use Maps for collections with frequent lookups
export const itemsContext = createContext<Map<string, Item>>(new Map(), ...)

// Avoid storing derived state
// ❌ Bad: Storing filtered results
export const filteredProductsContext = createContext<Product[]>([], ...)

// ✅ Good: Compute in component
@select(productsContext, products => 
  Array.from(products.values()).filter(p => p.category === 'electronics')
)
filteredProducts!: Product[]
```

### 4. Memory Management

```typescript
// Always cleanup subscriptions
connectedCallback() {
  super.connectedCallback()
  
  // Use takeUntil with disconnecting
  someContext.$.pipe(
    takeUntil(this.disconnecting)
  ).subscribe()
}

// Avoid memory leaks
disconnectedCallback() {
  super.disconnectedCallback()
  // Subscriptions are automatically cleaned up
}
```

### 5. Storage Key Naming

```typescript
// Use consistent, descriptive keys
'auth_user'         // ✅ Clear purpose
'app_config'        // ✅ Namespaced
'products_v2'       // ✅ Versioned if needed
'data'              // ❌ Too generic
'u'                 // ❌ Too short
```

## Common Patterns

### Authentication Flow

```typescript
// contexts/auth.ts
export const userContext = createContext<User | null>(null, 'local', 'auth_user')
export const tokenContext = createContext<string>('', 'local', 'auth_token')

// components/login.ts
async function login(credentials: Credentials) {
  const response = await api.login(credentials)
  userContext.set(response.user)
  tokenContext.set(response.token)
}

async function logout() {
  userContext.clear()
  tokenContext.clear()
  // Clear other user-specific contexts
}
```

### Master-Detail Pattern

```typescript
// contexts/products.ts
export const productsContext = createContext<Map<string, Product>>(
  new Map(),
  'indexeddb',
  'products'
)

export const selectedProductIdContext = createContext<string | null>(
  null,
  'session',
  'selected_product'
)

// components/product-list.ts
@select(productsContext) products!: Map<string, Product>
@select(selectedProductIdContext) selectedId!: string | null

selectProduct(id: string) {
  selectedProductIdContext.set(id)
}

// components/product-detail.ts
@select(selectedProductIdContext) productId!: string | null
@select(productsContext, (products, productId) => 
  productId ? products.get(productId) : null
)
selectedProduct!: Product | null
```

### Form State Management

```typescript
// contexts/form.ts
export interface FormData {
  name?: string
  email?: string
  message?: string
}

export const formContext = createContext<FormData>(
  {},
  'session',  // Don't persist incomplete forms
  'contact_form'
)

// components/form.ts
@select(formContext) formData!: FormData

updateField(field: keyof FormData, value: string) {
  formContext.set({ [field]: value })
}

submitForm() {
  const data = formContext.value
  // Submit logic
  formContext.clear() // Clear after submit
}
```

### Optimistic Updates

```typescript
// Immediately update UI, then sync with server
async function updateProduct(id: string, updates: Partial<Product>) {
  // Optimistic update
  productsContext.set(prev => {
    const newMap = new Map(prev)
    const product = newMap.get(id)
    if (product) {
      newMap.set(id, { ...product, ...updates })
    }
    return newMap
  })
  
  try {
    // Sync with server
    const updated = await api.updateProduct(id, updates)
    
    // Update with server response
    productsContext.set(prev => {
      const newMap = new Map(prev)
      newMap.set(id, updated)
      return newMap
    })
  } catch (error) {
    // Revert on error
    productsContext.set(prev => {
      // Restore original state
    })
  }
}
```

## Testing Contexts

```typescript
// test/setup.ts
import { beforeEach } from 'vitest'

beforeEach(() => {
  // Clear all contexts before each test
  localStorage.clear()
  sessionStorage.clear()
  
  // Reset to initial values
  userContext.clear()
  productsContext.clear()
})

// test/auth.test.ts
describe('Authentication', () => {
  it('should update user context on login', async () => {
    const mockUser = { id: '1', name: 'Test User' }
    
    // Set context value
    userContext.set(mockUser)
    
    // Verify update
    expect(userContext.value).toEqual(mockUser)
    expect(localStorage.getItem('auth_user')).toBeTruthy()
  })
})
```

## Troubleshooting

### Context Not Updating

```typescript
// Check if component is subscribing correctly
@select(userContext) user!: User  // ✅ Will update

// Manual subscription needs cleanup
userContext.$.pipe(
  takeUntil(this.disconnecting)  // ✅ Important!
).subscribe()
```

### Storage Quota Exceeded

```typescript
// For large data, use IndexedDB
export const largeDataContext = createContext<LargeData>(
  {},
  'indexeddb',  // ✅ Much larger quota
  'large_data'
)
```

### Type Errors with Collections

```typescript
// When using Maps, remember to transform for templates
@select(itemsContext, items => Array.from(items.values()))
itemsList!: Item[]  // ✅ Array for template iteration
```

### Debugging Tips

```typescript
// Log all context changes
if (import.meta.env.DEV) {
  userContext.$.subscribe(user => 
    console.log('[Context] User:', user)
  )
  
  productsContext.$.subscribe(products => 
    console.log('[Context] Products:', products.size)
  )
}

// Check storage directly
console.log('LocalStorage:', localStorage.getItem('auth_user'))
console.log('SessionStorage:', sessionStorage.getItem('filter_state'))
```

## Migration Guide

### From Redux/Vuex

```typescript
// Redux pattern
dispatch({ type: 'SET_USER', payload: user })

// Context pattern
userContext.set(user)
```

### From React Context

```typescript
// React Context
const UserContext = React.createContext()
<UserContext.Provider value={user}>

// Schmancy Context
export const userContext = createContext<User>(...)
// No provider needed - works globally
```

### From Local Component State

```typescript
// Before: Component state
class MyComponent {
  @state() private user?: User
  
  updateUser(user: User) {
    this.user = user
  }
}

// After: Shared context
class MyComponent {
  @select(userContext) user!: User
  
  updateUser(user: User) {
    userContext.set(user)  // Updates all subscribers
  }
}
```