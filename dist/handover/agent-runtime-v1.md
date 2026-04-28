# Handover response: schmancy agent runtime v1

**From:** schmancy maintainers
**To:** Claude Design agent (ref: `handover/schmancy-agent-runtime.md`)
**Status:** shipped. Pinned URLs below.

## The URLs you asked for

```
https://esm.sh/@mhmo91/schmancy/agent@0.9.27
https://esm.sh/@mhmo91/schmancy/agent/manifest@0.9.27
```

`0.9.13` is the first release containing `/agent`; every subsequent publish serves the same subpath. `npm view @mhmo91/schmancy version` always returns the current pin if you want to float forward.

## Minimum consumption

One script tag. No bundler, no bare specifiers, no npm install.

```html
<!doctype html>
<script type="module">
  import { $dialog, theme } from 'https://esm.sh/@mhmo91/schmancy/agent@0.9.27';
</script>
<schmancy-theme root scheme="dark">
  <schmancy-surface type="solid" fill="all">
    <schmancy-button variant="filled">Hi</schmancy-button>
    <schmancy-skill></schmancy-skill>
  </schmancy-surface>
</schmancy-theme>
```

Importing the URL side-effect registers every `<schmancy-*>` tag (111 of them, verified live) plus `<schmancy-skill>`. Named re-exports cover the full imperative surface: `$dialog`, `$notify`, `sheet`, `SchmancySheetPosition`, `schmancyContentDrawer`, `theme`, `area`, `lazy`, `createContext`, `select`, `selectItem`, `$LitElement`.

## Discovery API (installed by `<schmancy-skill>`)

Drop `<schmancy-skill>` anywhere on the page once; `window.schmancy` appears on connect. Every helper is synchronous and pure — the manifest is inlined into the bundle, no second fetch required.

| Call | Returns |
|---|---|
| `window.schmancy.help()` | `{ elements: Array<{ tag, summary }>, services: Array<{ name, summary }> }` — overview list |
| `window.schmancy.help('schmancy-button')` | Full CEM-v1 declaration: `attributes[]`, `events[]`, `slots[]`, `cssParts[]`, `cssProperties[]`, `examples[]`, `contexts[]` |
| `window.schmancy.help('$dialog')` | Service entry with `methods[]` signatures |
| `window.schmancy.tokens()` | Flat array of `schmancy-sys-color-*` custom-property names, extracted at build time from `theme.interface.ts` + `theme.style.css` |
| `window.schmancy.platformPrimitive('schmancy-dialog')` | `{ tag, mode?, note? }` when the component has an `@platform` JSDoc hint — tells the agent what native element the component wraps for graceful degradation |
| `window.schmancy.registeredTags()` | String list of every schmancy tag currently registered in `customElements` |
| `window.schmancy.a11yAudit()` | Walks the live DOM and reports `{ tag, role, ariaLabel, hasShadowRoot, formAssociated }` per instance |
| `window.schmancy.manifestUrl` | Blob URL pointing at the inlined manifest JSON — `fetch()` it if you want the raw bytes |
| `window.schmancy.manifest` | The inlined manifest object itself |
| `window.schmancy.capabilities()` | Runtime feature probe (see below) |

## Enum values for attribute types

Every attribute whose TypeScript type is a string-literal union (inline `'a' \| 'b'` or named alias like `ButtonVariant`) ships a resolved `values: string[]` field in its manifest entry. No re-parsing of TS type strings needed. Example:

```js
window.schmancy.help('schmancy-button').attributes
  .find(a => a.name === 'variant')
  .values
// ["elevated", "filled", "filled tonal", "tonal", "outlined", "text"]
```

## Runtime capability probe

Sandboxes differ. `capabilities()` feature-detects platform APIs at runtime so an agent can branch on what's actually available:

```ts
type Capabilities = {
  popover: boolean                 // HTML popover attribute
  declarativeShadowDom: boolean    // <template shadowrootmode>
  scopedRegistries: boolean        // native `new CustomElementRegistry()`
  trustedTypes: boolean            // require-trusted-types-for
  cssRegisteredProperties: boolean // CSS.registerProperty()
  elementInternalsAria: boolean    // ElementInternals.role etc.
  formAssociated: boolean          // ElementInternals (any)
  adoptedStyleSheets: boolean      // Document.adoptedStyleSheets
}
```

Use it to pick dialog implementation, fall back gracefully, or refuse to render when a required feature is missing.

## Acceptance test

Port `Procurement Lifecycle.html` (or any prototype) using only the two URLs above. The bundle handles everything — registration, theme tokens, service wiring. If the port works, the runtime is verified.

## Honest caveats

1. **Vendor chunks (`highlight.js`, `jsqr`, `@material/material-color-utilities`) are `manualChunks`-split but still eagerly fetched** on first load, because the owning components use module-top static imports. Total wire cost on HTTP/2: 373 KB gzipped across the primary bundle + 3 vendor chunks, fetched in parallel. Primary bundle is 284 KB gzipped (under handover's 300 KB target). Per-component dynamic imports would make the vendor chunks truly lazy; that refactor is tracked separately (see `docs/adr/` in the parent monorepo).

2. **Claude Artifacts CSP is observed, not officially published.** Current bundle works under the observed CSP (`'unsafe-inline'`, `'unsafe-eval'`, `cdnjs.cloudflare.com`, `blob:` in `worker-src`). It contains no `eval`, no string-concatenated HTML, no Trusted-Types-hostile patterns — if Anthropic tightens the CSP later it should still work. If Trusted Types becomes enforced, the runtime avoids all sinks (Lit templates only; Blob URL for `fetch` not `<script src>`).

3. **esm.sh availability.** We rely on esm.sh to serve the npm-published tarball. If esm.sh is down or slow, `https://cdn.jsdelivr.net/npm/@mhmo91/schmancy/agent/+esm` and `https://unpkg.com/@mhmo91/schmancy/agent` are drop-in alternatives.

4. **`services[]` and `examples[]` fill in as JSDoc backfills land.** The plugin that produces the manifest fails open — missing `@service` / `@example` JSDoc just means fewer entries, not a broken build. Expect this to grow with each release.

5. **`<schmancy-skill>` renders nothing.** The handover's §7 Q3 defaulted to invisible. A visible `<schmancy-devtools>` dev-overlay element is not shipped; it's a separate concept if you ever need one.

## Reporting issues

Open an issue at `github.com/mhmo91/schmancy` with:
- The `window.schmancy.capabilities()` output from your sandbox
- The minimum HTML that fails
- The manifest version (`window.schmancy.manifest.schemaVersion`)

## Follow-up tracker

- [ ] Per-component dynamic imports for `highlight.js`, `jsqr`, `@material/material-color-utilities` — cuts first-paint load for agents that don't use the heavy components. ADR pending in `docs/adr/NNNN-lazy-vendor-chunks-in-schmancy-agent.md`.
- [ ] JSDoc backfill pass — add `@example`, `@platform`, `@summary` tags to the remaining component set so the manifest's `examples[]` and `platformPrimitive` fields populate fully.
- [ ] CI smoke test that loads the built bundle in headless Chromium and asserts the handover's §4.4 acceptance criteria on every push (shipped as `src/agent/agent-bundle.test.ts` but not yet wired into the `publish-to-npm.yml` workflow as a blocking gate).
