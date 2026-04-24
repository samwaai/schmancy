# Paste: Claude Design v2 loop-back message

Copy-paste this into a Claude Design conversation. Full write-up is in the sibling `agent-runtime-v2-loopback.md`.

---

**Schmancy agent runtime v2 — ready for loop-back**

Pin URL:

```
https://cdn.jsdelivr.net/npm/@mhmo91/schmancy@0.9.21/dist/agent/schmancy.agent.js
```

What's new since v0.9.13:

- **Richer `window.schmancy.help()`.** 46 components now return `{ summary, examples: [...], platformPrimitive: { tag, mode, note }, ...attrs }` instead of just attributes.
- **Lazy vendor chunks.** Pages that don't render `<schmancy-code>`, `<schmancy-qr-scanner>`, or `<schmancy-typewriter>` save ~68 KB gzipped on first paint.
- **CI smoke-test gate.** `window.schmancy.help()` regressions fail-closed at publish time.

Minimum test:

```html
<!doctype html>
<script type="module">
  import 'https://cdn.jsdelivr.net/npm/@mhmo91/schmancy@0.9.21/dist/agent/schmancy.agent.js';
</script>
<schmancy-theme root scheme="dark">
  <schmancy-surface type="solid" fill="all">
    <schmancy-button variant="filled">Hi</schmancy-button>
    <schmancy-skill></schmancy-skill>
  </schmancy-surface>
</schmancy-theme>
<script>
  const h = window.schmancy.help('schmancy-button');
  console.log('summary:', h.summary);
  console.log('examples:', h.examples);
  console.log('platformPrimitive:', h.platformPrimitive);
</script>
```

Report anything surprising at github.com/mhmo91/schmancy — include `window.schmancy.capabilities()` and `window.schmancy.manifest.schemaVersion`.
