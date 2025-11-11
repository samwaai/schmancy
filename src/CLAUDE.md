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

## Lit Directives - Complete Reference

### Core Principles
- Import only directives you use (modular design prevents bundle bloat)
- Directives are functions that customize rendering behavior
- Each directive is a separate module from `lit/directives/`

### Conditional Rendering Directives

**`when(condition, trueCase, falseCase?)`** - Best for clean inline conditionals
```typescript
import { when } from 'lit/directives/when.js'
${when(this.isExpanded, () => html`<div>Content</div>`, () => html`<div>Summary</div>`)}
```
- Cleaner than ternary operators
- Lazy evaluation of templates
- Use when readability matters

**`choose(value, cases, default?)`** - Template-level switch statement
```typescript
import { choose } from 'lit/directives/choose.js'
${choose(this.state, [
  ['loading', () => html`<spinner></spinner>`],
  ['error', () => html`<error-msg></error-msg>`],
  ['success', () => html`<content></content>`]
])}
```
- Strict equality matching
- Better than nested ternaries

**`ifDefined(value)`** - Conditional attributes
```typescript
import { ifDefined } from 'lit/directives/if-defined.js'
<img src=${ifDefined(this.imageUrl)}>
```
- Sets attribute only when value is defined
- Essential for URL attributes where undefined should prevent rendering

### List Rendering Directives

**`repeat(items, keyFn?, templateFn)`** - **USE THIS FOR ALL LISTS**
```typescript
import { repeat } from 'lit/directives/repeat.js'
${repeat(
  this.items,
  (item) => item.id,  // Key function for DOM stability
  (item, index) => html`<div>${item.name}</div>`
)}
```
- **MANDATORY for Schmancy**: Enables DOM diffing and stability
- Maintains DOM node association during list updates
- Most efficient for insertions/removals/reordering
- Prevents unnecessary re-renders

**`map(items, templateFn)`** - Simple iteration (use sparingly)
```typescript
import { map } from 'lit/directives/map.js'
${map(this.items, (item) => html`<div>${item}</div>`)}
```
- Smaller and faster than repeat, but NO keying
- Use ONLY when list never changes order
- Prefer `repeat` in 99% of cases

**`join(items, joiner)`** - Interleave with separator
```typescript
import { join } from 'lit/directives/join.js'
${join(this.tags.map(t => html`<span>${t}</span>`), html`, `)}
```

**`range(start, end?, step?)`** - Sequential integers
```typescript
import { range } from 'lit/directives/range.js'
${map(range(5), i => html`<item>${i}</item>`)}
```

### Performance Optimization Directives

**`cache(value)`** - **CRITICAL FOR TEMPLATE SWITCHING**
```typescript
import { cache } from 'lit/directives/cache.js'
${cache(
  this.view === 'detail'
    ? html`<detail-view>${content}</detail-view>`
    : html`<summary-view>${summary}</summary-view>`
)}
```
- Preserves DOM nodes when switching between templates
- Avoids re-creation costs for large, complex templates
- **USE WHEN:** Frequently toggling between views
- **AVOID WHEN:** Templates are simple or rarely toggle
- **PITFALL:** Cached DOM retains internal state (form values, scroll position)
- **WITH REFS:** Refs remain valid across switches since DOM is preserved
- **MEMORY:** Trades memory for rendering speed

**`guard(dependencies, valueFn)`** - Prevents unnecessary computation
```typescript
import { guard } from 'lit/directives/guard.js'
${guard([this.data], () => this.expensiveCalculation(this.data))}
```
- Only re-runs when dependency **identity** changes
- Perfect for immutable data patterns
- Implements memoization at template level
- Use for expensive calculations, transformations, hashing

**`keyed(key, value)`** - Forces DOM recreation on key change
```typescript
import { keyed } from 'lit/directives/keyed.js'
${keyed(this.userId, html`<user-profile .user=${this.user}></user-profile>`)}
```
- Removes old DOM before rendering new value
- Useful for clearing element state or resetting animations
- Opposite of cache - forces fresh DOM

### DOM Reference Directives

**`ref(refObject)`** - Access rendered elements
```typescript
import { createRef, ref, Ref } from 'lit/directives/ref.js'
private containerRef: Ref<HTMLDivElement> = createRef()

// In template
<div ${ref(this.containerRef)}></div>

// Access via
this.containerRef.value?.focus()
```
- Enables imperative DOM manipulation
- Use for focus management, third-party library integration
- Callback form available: `ref((el) => { /* use el */ })`

### State Synchronization Directives

**`live(value)`** - Compares against live DOM value
```typescript
import { live } from 'lit/directives/live.js'
<input .value=${live(this.value)}>
```
- Critical for input elements that modify their own state
- Compares against actual DOM value, not last-rendered value
- Use with strict equality checks
- Essential for contenteditable or custom elements with external state

### Asynchronous Rendering Directives

**`until(...values)`** - Renders while promises resolve
```typescript
import { until } from 'lit/directives/until.js'
${until(
  fetch('/api/data').then(r => r.json()),
  html`<spinner></spinner>` // Placeholder
)}
```
- Highest-priority promises render on resolution
- Lower-priority values show during pending states

**`asyncAppend(asyncIterable)`** - Append values as they yield
```typescript
import { asyncAppend } from 'lit/directives/async-append.js'
${asyncAppend(this.streamData(), (item) => html`<div>${item}</div>`)}
```

**`asyncReplace(asyncIterable)`** - Replace with each new value
```typescript
import { asyncReplace } from 'lit/directives/async-replace.js'
${asyncReplace(this.counter(), (count) => html`<div>${count}</div>`)}
```

### Unsafe Content Directives (Use with Caution)

**`unsafeHTML(string)`** - Render trusted HTML strings
```typescript
import { unsafeHTML } from 'lit/directives/unsafe-html.js'
${unsafeHTML(this.trustedContent)}
```
- **ONLY for developer-controlled content**
- Enables XSS, CSS injection if misused
- Use for database-stored HTML from trusted sources

**`unsafeSVG(string)`** - Render trusted SVG strings
```typescript
import { unsafeSVG } from 'lit/directives/unsafe-svg.js'
${unsafeSVG(this.svgContent)}
```
- Same security constraints as unsafeHTML

**`templateContent(templateElement)`** - Clone from template elements
```typescript
import { templateContent } from 'lit/directives/template-content.js'
${templateContent(this.shadowRoot.querySelector('template'))}
```

### Schmancy Best Practices

1. **Always use `repeat` with key functions** for lists - prevents bugs and improves performance
2. **Use `cache` for view switching** (expanded/minimized, tabs, modals)
3. **Apply `guard` with immutable data** for expensive transformations
4. **Use `when` over ternaries** for readability
5. **Use `ref` for animations** and imperative DOM access
6. **Combine `cache` + `ref` carefully** - refs stay valid, but ensure proper lifecycle
7. **Use `live` for form inputs** that modify themselves
8. **Avoid `map`** unless you're certain list order never changes

### Common Patterns in Schmancy

**List with stable DOM:**
```typescript
${repeat(
  this.employees,
  (e) => e.id,
  (e, i) => html`<employee-card .employee=${e}></employee-card>`
)}
```

**Expensive calculation with caching:**
```typescript
${guard([this.data], () => this.calculateComplexStats(this.data))}
```

**View switching with cache:**
```typescript
${cache(
  this.isExpanded
    ? html`<expanded-content ${ref(this.contentRef)}></expanded-content>`
    : html``
)}
```

**Animation target with ref:**
```typescript
private iconRef: Ref<HTMLElement> = createRef()
<schmancy-icon ${ref(this.iconRef)}>close</schmancy-icon>
// Later: this.iconRef.value?.animate(...)
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
