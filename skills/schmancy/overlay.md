# Overlay — `show` / `<schmancy-overlay>`

> One overlay primitive. Anchored by default. Observable lifecycle. Replaces `sheet` + `$dialog`.

## Import

```ts
import {
  show, confirm, prompt,
  openOverlays$, overlayEvents,
  dismissAll, lazy,
} from '@mhmo91/schmancy/overlay'
```

## The novel default — anchored

When you're triggering an overlay from a user gesture (click, touch), pass the event as `anchor`. The overlay blooms from the point of attention instead of materializing at the viewport center.

```ts
private handlePick = (ev: MouseEvent) => {
  show(TemplatePicker, { anchor: ev, props: { kind: 'email' } })
    .pipe(takeUntil(this.disconnecting))
    .subscribe(picked => { if (picked) this.template = picked })
}
```

Centered is the fallback (no anchor given). Sheet is the responsive adaptation (narrow viewport / touch / oversized content). You never pick layout — the system does.

## Content forms

`show()` accepts four content forms:

| Form | When to use |
|---|---|
| `show(MyComponent)` | Component class — most common |
| `show(html\`...\`)` | Inline template (eager — values frozen at call site) |
| `show(() => html\`...\`)` | **Preferred for templates** — factory called at mount time; closed-over variables are read lazily, no snapshot staleness |
| `show(lazy(() => import('./x')))` | Async / code-split component |

Always prefer `() => html\`...\`` over `html\`...\`` when the template closes over any variable — the factory form evaluates those variables at mount time rather than baking them in at the call site.

## Default padding

The overlay surface applies `padding: var(--schmancy-overlay-padding, 1.5rem)` to all content — `show()`, `confirm()`, and `prompt()` alike. Content components do **not** need their own padding against the surface edge. Override the token via `style="--schmancy-overlay-padding: 0"` on the host if a component supplies its own full-bleed layout.

## API

| Export | Signature | Purpose |
|---|---|---|
| `show<T>(content, opts?)` | `Observable<T \| undefined>` | Primary verb. Cold stream — subscribe to mount, unsubscribe to dismiss. |
| `confirm(opts)` | `Promise<boolean>` | Yes/no dialog. `variant: 'danger'` for destructive. |
| `prompt(opts)` | `Promise<string \| null>` | Single-line input. |
| `dismissAll()` | `void` | Close every open overlay (LIFO). |
| `openOverlays$` | `Observable<readonly OverlayEntry[]>` | Mechanical state — the current stack. |
| `overlayEvents<E>(tag, evt)` | `Observable<E>` | Third-party subscription to events from any overlay of `tag`. |
| `lazy(loader)` | `LazyComponent` | Re-exported from area for lazy-loaded content. |

## Subscription IS the overlay lifecycle

Inside any `SchmancyElement`, pipe `takeUntil(this.disconnecting)`. When the caller unmounts, the overlay auto-dismisses — no handles to track, no leaks.

```ts
show(MyForm, { props: { id }, anchor: ev })
  .pipe(takeUntil(this.disconnecting))
  .subscribe(saved => saved && this.store.persist(saved))
```

Programmatic dismiss = unsubscribe. Either store the Subscription and call `.unsubscribe()`, or compose a terminator stream via `takeUntil(merge(this.disconnecting, saveTrigger$))`.

## How content returns a result — three platform paths

Priority order:

1. **CustomEvent('close', { detail })** — dispatched from content. `detail` becomes the Observable emission.
2. **`<form method="dialog">`** — native submit. The dialog's `returnValue` is emitted.
3. **User dismissal** — Esc / backdrop click / swipe / back-button / `.unsubscribe()` / `dismissAll()` emits `undefined`.

```ts
// Inside a content component:
this.dispatchEvent(new CustomEvent('close', {
  detail: savedRecord,
  bubbles: true,
  composed: true,   // cross shadow-DOM
}))
```

```ts
// Inline template with native form — zero JS
show<string>(html`
  <form method="dialog">
    <button value="save">Save</button>
    <button value="discard">Discard</button>
    <button value="">Cancel</button>
  </form>
`)
```

## Options

```ts
interface ShowOptions {
  props?: Record<string, unknown>                    // merged into component
  anchor?: MouseEvent | HTMLElement | { x, y }       // NOVEL DEFAULT
  dismissable?: boolean                              // default true
  persist?: boolean                                  // reuse DOM on re-show
  signal?: AbortSignal                               // standard cancellation
  modal?: boolean                                    // force focus trap; rare
  historyStrategy?: 'push' | 'replace' | 'silent'    // default 'push'
}
```

## History integration

Each `show()` pushes a history sentinel unless `historyStrategy: 'silent'`. Browser back dismisses the overlay instead of navigating the page. For forward-restore on routed callers, pair with `area.on(name)` — your overlay sits inside a route-observer's `switchMap`, so forward-navigation re-subscribes and re-opens the overlay naturally.

```ts
area.on('root').pipe(
  map(route => route.params?.editId),
  distinctUntilChanged(),
  switchMap(id => id ? show(TaskEditor, { props: { id } }) : EMPTY),
  takeUntil(this.disconnecting),
).subscribe()
```

## Layout dispatch — internal

Pure function of (anchor, content size, viewport):

- Narrow viewport (< 640px) or coarse-pointer → **sheet**
- Content > 80% viewport height or 90% width → **sheet**
- Anchor provided → **anchored**
- Fallback → **centered**

Callers never override. The `modal: true` escape hatch forces focus trap on an anchored overlay for the rare "menu-with-destructive-item" case.

## Examples

### 1. Confirm / prompt / danger

```ts
if (await confirm({ title: 'Delete?', message: '...', variant: 'danger', anchor: ev })) {
  await store.delete(id)
}
const name = await prompt({ label: 'Name', defaultValue: 'Untitled', anchor: ev })
```

### 2. Cancellable via AbortSignal

```ts
const ac = new AbortController()
this.routeChange$.pipe(take(1)).subscribe(() => ac.abort())
show(LoadingOverlay, { signal: ac.signal })
  .pipe(takeUntil(this.disconnecting))
  .subscribe()
```

### 3. Observe events from any open overlay without owning it

```ts
// A header progress bar reflects any upload overlay's progress.
overlayEvents<CustomEvent<{ pct: number }>>('image-upload', 'progress')
  .pipe(map(e => e.detail.pct), takeUntil(this.disconnecting))
  .subscribe(pct => this.progress = pct)
```

### 4. Stack-driven UI

```ts
openOverlays$.pipe(
  map(s => s.length > 1),
  distinctUntilChanged(),
  takeUntil(this.disconnecting),
).subscribe(many => this.showCloseAllButton = many)
```

### 5. Lazy-loaded heavy overlay with error recovery

```ts
show(lazy(() => import('./canvas-editor')))
  .pipe(
    catchError(err => { $notify.error('Load failed'); return EMPTY }),
    takeUntil(this.disconnecting),
  )
  .subscribe()
```

### 6. Non-component caller (service / test)

```ts
const saved = await firstValueFrom(
  show<Record>(MyPicker).pipe(defaultIfEmpty(undefined))
)
```

## Migration cheatsheet — from `sheet` / `$dialog`

```
sheet.push({ component, props })               → show(C, { props }).pipe(takeUntil(...)).subscribe()
sheet.push({ ..., position: 'side'|'bottom' }) → show(C, { props })          // engine decides
sheet.dismiss(uid)                             → sub.unsubscribe() | dismissAll()
sheet.isOpen(uid)                              → openOverlays$.pipe(map(s => s.some(...)))

$dialog.confirm(opts)                          → confirm(opts)
$dialog.ask(msg, ev)                           → confirm({ message: msg, anchor: ev })
$dialog.danger(opts)                           → confirm({ ...opts, variant: 'danger' })
$dialog.prompt(opts)                           → prompt(opts)
$dialog.component(tpl, { position: ev })       → show(tpl, { anchor: ev })
$dialog.dismiss()                              → dismissAll()
```

## Principles (why this shape)

- **rxjs SUBSCRIPTION_IS_STATE.** The overlay lifecycle is a subscription — setup on subscribe, teardown on unsubscribe. No imperative handles.
- **Fewer APIs, smarter system.** Caller declares intent (`show(X, { anchor })`); the system decides layout, focus trap, positioning, scroll lock, inert, back-button handling.
- **Native platform first.** `<dialog>` + `::backdrop` + `returnValue` carry the weight. `CustomEvent('close', { detail })` is the typed overlay on top.
- **Anchored is novel default.** Overlays bloom from the user's gesture instead of center-of-viewport.
- **Content identity is the key.** `overlayEvents` keys on tag name (stable across HMR). No uid strings in the public API.
