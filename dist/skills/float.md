# schmancy-float (deprecated alias)

> Backward-compatibility alias for [`schmancy-window`](./window.md). Existing code keeps working — new code should use `schmancy-window` directly.

## Migration
```html
<!-- Before -->
<schmancy-float id="panel">…</schmancy-float>

<!-- After -->
<schmancy-window id="panel">…</schmancy-window>
```

All properties are identical. See [window.md](./window.md) for full API.
