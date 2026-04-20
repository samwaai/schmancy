# Schmancy Mixins

> Base classes and utilities: `$LitElement`, `disconnecting`, `classMap`, `styleMap`.

## $LitElement

The base class for all Schmancy components. Extends LitElement with Tailwind support and RxJS cleanup.

```typescript
import { $LitElement } from '@mhmo91/schmancy/dist/mixins'
import { css } from 'lit'

@customElement('my-component')
class MyComponent extends $LitElement(css`:host { display: block }`) {
  // ...
}
```

## Provided Features

### disconnecting (Subject)
RxJS Subject that emits when the component is disconnected. Use with `takeUntil` for automatic cleanup.

```typescript
connectedCallback() {
  super.connectedCallback()
  someObservable$.pipe(
    takeUntil(this.disconnecting)
  ).subscribe()
}
```

### classMap(classes)
Enhanced version of Lit's `classMap` that splits space-separated keys.

```typescript
// Supports space-separated class keys (unlike standard classMap)
class=${this.classMap({
  'flex items-center gap-2': true,
  'bg-primary-default': this.active,
})}
```

**Critical:** Must be the SOLE expression in `class=`. Never mix with string interpolation.

### styleMap(styles)
Direct passthrough to Lit's `styleMap` directive.

```typescript
style=${this.styleMap({ width: '100px', opacity: this.visible ? 1 : 0 })}
```

### discover(tag)
Find components by tag name via event-based discovery.

```typescript
this.discover<MyOtherComponent>('my-other-component').pipe(
  takeUntil(this.disconnecting)
).subscribe(component => { ... })
```

### stableId / uid
- `stableId`: Deterministic ID based on DOM path (stable across renders)
- `uid`: Unique instance ID (auto-generated or set via attribute)

### dispatchScopedEvent(name, detail, options)
Dispatches both a scoped event (`name::uid`) and generic event for backward compatibility.

### locale
Current locale from theme context, falls back to `navigator.language`.
