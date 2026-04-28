# Paste: Claude Design loop-back message

Copy-paste this into a Claude Design conversation. Full write-up is in the sibling `claude-design-brief.md`.

---

**Schmancy: building with the manifest**

Manifest URL (this is the integration point — fetch and search before authoring any custom component):

```
https://cdn.jsdelivr.net/npm/@mhmo91/schmancy@{{version}}/dist/agent/schmancy.manifest.json
```

Distribution bundle (load when running schmancy live in the rendered output):

```
https://cdn.jsdelivr.net/npm/@mhmo91/schmancy@{{version}}/dist/agent/schmancy.agent.js
```

What the manifest gives you:

- **`modules[].declarations[]`** — every component declaration with `tagName`, `summary`, `description`, `whenToUse`, `attributes` (extracted enum `values[]`), `events`, `slots`, `examples`, `platformPrimitive`. Search by `summary` text before reaching for a custom build.
- **`rules[]`** — 16 structured rule descriptors (`id`, `scope`, `severity`, `validator`). Encodes the same constraints the brief states in prose.
- **`tokens: string[]`** — every `--schmancy-sys-*` CSS custom property name available at runtime.

Minimum app shell:

```html
<!doctype html>
<script type="module">
  import 'https://cdn.jsdelivr.net/npm/@mhmo91/schmancy@{{version}}/dist/agent/schmancy.agent.js';
</script>
<schmancy-theme root scheme="dark">
  <schmancy-surface type="solid" fill="all">
    <schmancy-button variant="filled">Hi</schmancy-button>
  </schmancy-surface>
</schmancy-theme>
```

Report anything surprising at github.com/mhmo91/schmancy — include the manifest's `schemaVersion` and the minimum failing HTML.
