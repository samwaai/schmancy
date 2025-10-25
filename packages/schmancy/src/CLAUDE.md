# Schmancy Library Source Patterns

## Component Architecture

### Base Mixin Pattern
All components extend `$LitElement(style?)` which provides:
- `disconnecting` Subject for RxJS cleanup via `takeUntil(this.disconnecting)`
- `classMap()` - enhanced to split space-separated keys
- `styleMap()` - direct passthrough to Lit directive
- `discover<T>(tag: string)` - event-based component discovery
- Auto-response to `{tagName}-where-are-you` events

### Component Registration
```typescript
@customElement('schmancy-{name}')
export class Schmancy{Name} extends $LitElement(style) {
  // Component implementation
}

declare global {
  interface HTMLElementTagNameMap {
    'schmancy-{name}': Schmancy{Name}
  }
}
```

## Styling Approach

### Inline SCSS Import
```typescript
import style from './component.scss?inline'
export class Component extends $LitElement(style) {}
```
- Components with complex styling use `.scss` files
- Simple components use inline CSS template literals
- All Tailwind classes work via TailwindMixin in base

### Tailwind Integration
- Theme CSS variables: `--schmancy-sys-color-{path}`
- Tailwind config maps to theme tokens
- Use Tailwind utility classes directly in templates

## State Management

### RxJS Patterns
```typescript
// Subject for internal state
private _value$ = new BehaviorSubject<T>(initial)

// Combine streams and auto-cleanup
combineLatest([stream1$, stream2$])
  .pipe(takeUntil(this.disconnecting))
  .subscribe(...)
```

### Property Binding with Display Sync
For form components (select, autocomplete, chips):
1. Track explicit property setting with flags: `_valueSet`, `_valuesSet`
2. Implement `_updateInputDisplay()` to sync label with value
3. Call in `firstUpdated()` for initial sync
4. Call when value changes programmatically

### Context/Store Pattern
```typescript
// Create typed context
const Context = createContext<T>(initial, 'local|memory|indexeddb', 'key')

// Use in component
@select(Context)
property!: T

// Or create compound selectors
const selector = createCompoundSelector(
  [Context1, Context2],
  [a => a.field, b => b.field],
  (val1, val2) => ({ combined: val1 + val2 })
)
```

## Event Patterns

### Custom Event Types
```typescript
export type ComponentChangeEvent = CustomEvent<{
  value: string
  additionalData?: any
}>

// Dispatch
this.dispatchEvent(
  new CustomEvent<ComponentChangeEvent['detail']>('change', {
    detail: { value: this.value },
    bubbles: true,
    composed: true,
  })
)
```

### Discovery Events
Components respond to `{tag}-where-are-you` by emitting `{tag}-here-i-am` with self reference.

## Accessibility Patterns

### Form Components
```typescript
// ARIA attributes
role="combobox"
aria-haspopup="listbox"
aria-expanded=${this._open}
aria-controls="listbox-id"

// Screen reader announcements
private _announceToScreenReader(message: string) {
  const liveRegion = this.shadowRoot?.querySelector('#live-status')
  if (liveRegion) liveRegion.textContent = message
}

// Live region in template
<div id="live-status" role="status" aria-live="polite" class="sr-only"></div>
```

### Focus Management
```typescript
protected static shadowRootOptions = {
  ...LitElement.shadowRootOptions,
  mode: 'open',
  delegatesFocus: true, // Auto-focus first focusable element
}
```

## Common Utilities

### Slot Content Processing
```typescript
@queryAssignedElements({ flatten: true })
private _options!: SchmancyOption[]

// Setup handlers in firstUpdated()
this._options.forEach((option, index) => {
  option.tabIndex = -1
  if (!option.id) option.id = `${this.id}-option-${index}`
  // Add event listeners
})
```

### Debouncing & Filtering
```typescript
this._inputValue$.pipe(
  distinctUntilChanged(),
  debounceTime(this.debounceMs),
  tap(value => this._handleChange(value)),
  takeUntil(this.disconnecting)
).subscribe()
```

## Theme Integration

Components consuming theme:
```typescript
@consume({ context: themeContext })
theme!: Partial<TSchmancyTheme>
```

Theme CSS custom properties are auto-generated from theme object structure as `--schmancy-{path}`.

## Area Router (Navigation)

```typescript
// Navigate programmatically
area.push({
  area: 'main',
  component: MyComponent,
  params?: { id: '123' }
})

// Lazy load
const LazyComponent = lazy(() => import('./component'))
```

## Testing Helpers

### Value Validation
```typescript
public checkValidity(): boolean {
  if (!this.required) return true
  return this.multi
    ? this._selectedValues$.value.length > 0
    : Boolean(this._selectedValue$.value)
}

public reportValidity(): boolean {
  return this._inputElementRef.value?.reportValidity() ?? this.checkValidity()
}
```
