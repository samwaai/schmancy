# Follow-ups: schmancy agent runtime

**Status:** v0.9.13 of `@mhmo91/schmancy/agent` is live. The items below are improvements that did not ship in v1. They're ordered by impact, not urgency — v0.9.13 already satisfies the Claude Design handover's acceptance criteria.

**Parent:** `handover/schmancy-agent-runtime.md` (original ask), `handover/agent-runtime-v1.md` (response + live URLs).

---

## 1. Lazy vendor chunks (biggest performance win, biggest risk)

**Problem.** `highlight.js`, `jsqr`, and `@material/material-color-utilities` are `manualChunks`-split into `dist/agent/vendor-*.js` siblings, but they're **eagerly fetched** on first load because the owning components use module-top static imports. A blank page with only `<schmancy-theme>` + `<schmancy-button>` still pulls 22 KB (material-color) + 53 KB (jsqr) + 15 KB gzipped (highlight.js) — 90 KB of deps for components the page never renders.

**Fix.** Per-component dynamic imports inside the owning elements. Pattern (worked out in [agent-runtime-v1.md](./agent-runtime-v1.md)'s "lazy caveat" section):

```ts
// BEFORE — src/code-highlight/code-highlight.ts
import hljs from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'
// ... 5 more language imports
hljs.registerLanguage('javascript', javascript)
// ...

// AFTER — module-scope memoised Promise, async render
let hljsPromise: Promise<typeof import('highlight.js/lib/core').default> | null = null
function loadHljs() {
  if (hljsPromise) return hljsPromise
  hljsPromise = Promise.all([
    import('highlight.js/lib/core'),
    import('highlight.js/lib/languages/bash'),
    import('highlight.js/lib/languages/javascript'),
    // ... etc
  ]).then(([core, bash, js, /*…*/]) => {
    const hljs = core.default
    hljs.registerLanguage('bash', bash.default)
    hljs.registerLanguage('javascript', js.default)
    // ...
    return hljs
  })
  return hljsPromise
}

@customElement('schmancy-code')
export class SchmancyCode extends TailwindElement(/*…*/) {
  @state() private _highlighted = ''
  protected updated(changed: Map<string, unknown>) {
    if (changed.has('code') || changed.has('language')) {
      loadHljs().then(hljs => {
        this._highlighted = this.language
          ? hljs.highlight(this.code.trim(), { language: this.language }).value
          : hljs.highlightAuto(this.code.trim()).value
      })
    }
  }
}
```

Rollup auto-splits `await import(...)` — no more `manualChunks` entry needed.

**Per-component effort** (from [agent-runtime-v1.md](./agent-runtime-v1.md)):

| Component | File | Effort | Risk |
|---|---|---|---|
| `<schmancy-code>` | `src/code-highlight/code-highlight.ts` | ~1.5h | Low |
| `<schmancy-qr-scanner>` | `src/qr-scanner/qr-scanner.ts` | ~2.5h | Medium — camera lifecycle + jsqr timing |
| `<schmancy-typewriter>` | `src/typewriter/typewriter.ts` | ~1h | Low |
| `@material/material-color-utilities` in theme | `src/theme/theme.service.ts` + `theme.format.ts` + `theme.component.ts` | **~3–4h** | **High** — theme reads are currently synchronous; downstream subscribers expect `theme.value` immediately. Needs `Theme | Pending` Observable contract + audit of every consumer. |

**Total: ~8–10h** focused work. **Gate with a CI test** that loads the bundle on a theme-only page and asserts `vendor-highlight`, `vendor-jsqr`, and `vendor-material-color` are NOT in the network log. Without that gate, an innocent top-level `import` added later will silently re-eagerize them.

**Owner:** needs an ADR before touching the theme service. Stub at [`docs/adr/0009-lazy-vendor-chunks-in-schmancy-agent.md`](../../../docs/adr/0009-lazy-vendor-chunks-in-schmancy-agent.md) in the parent monorepo.

---

## 2. CI smoke-test gate (highest value per minute of work)

**Problem.** `src/agent/agent-bundle.test.ts` exists and passes locally (6/6 tests, verified in v0.9.13). It's not yet wired into `.github/workflows/publish-to-npm.yml` as a blocking step. A regression that breaks `window.schmancy.help('schmancy-button')` would publish silently.

**Fix.** One line in the workflow, before `yarn build`:

```yaml
      - name: Agent bundle smoke test
        run: yarn vitest run src/agent/
```

Requires Playwright in CI (already declared in `devDependencies` via `@vitest/browser-playwright`, but `yarn install` doesn't download Chromium by default). Add a step:

```yaml
      - name: Install Playwright Chromium
        run: yarn playwright install chromium --with-deps
```

**Effort:** ~15 min. Lowest effort, prevents every future regression.

---

## 3. JSDoc backfill campaign

**Problem.** The manifest plugin fails open on missing JSDoc. v0.9.13 ships:
- **25 / 111** components with `@example` (22% coverage)
- **0 / 111** with `@platform` (0%)
- **0 / 111** with `@summary` on the class (the plugin falls back to the class's JSDoc description, which works but is verbose)
- **6 / 6** services with `@service` (100% — done in v0.9.13)

The missing tags aren't a blocker — the fields just don't appear in the manifest. Backfill is mechanical, high-value, low-risk.

**Fix.** Per-component JSDoc additions in `src/**/*.ts`:

```ts
/**
 * @element schmancy-foo
 * @summary One-line "when to use" — goes into manifest `summary` field.
 * @example
 * <schmancy-foo variant="filled">Hello</schmancy-foo>
 * @platform button click - Schmancy-skinned native <button>; degrade to
 *   `<button class="..."` if the tag fails to register.
 */
@customElement('schmancy-foo')
```

**Effort.** ~5 min per component × ~86 remaining = **~7h**, easily split across PRs. Good "pair programming with Claude" task — each component takes one read + one edit.

**Gate:** add a lint rule (or a build warning) that fails the build if a `@customElement('schmancy-*')` class has no `@summary` tag after the backfill campaign is complete.

---

## 4. Semver bump to 0.10.0

**Problem.** CI's `yarn version patch` bumped `0.9.12 → 0.9.13` for a **new subpath**, which is arguably a MINOR version per semver. The handover author pinned `@0.9.13` in the response doc — that works, but consumers reading the package version may underestimate the surface change.

**Fix.** Once this is merged and the JSDoc backfill has had a few iterations, manually bump `package.json` version to `0.10.0` and push. CI will auto-patch it to `0.10.1` on the next source change, but the minor bump signals "new public subpath."

**Effort:** ~2 min.

**Alternative:** switch the CI workflow to use [`release-please`](https://github.com/googleapis/release-please) or [Changesets](https://github.com/changesets/changesets) for Conventional-Commit-driven semver. Higher upfront cost, eliminates the manual step forever.

---

## 5. wca → CEM analyzer migration

**Problem.** `yarn manifest` still runs `web-component-analyzer` (wca v2.0.0, last updated 2023-10). Lit officially endorses `@custom-elements-manifest/analyzer` ([lit-starter-ts](https://github.com/lit/lit/tree/main/packages/lit-starter-ts)). wca's output format differs from the current CEM v1 schema — our agent plugin already emits CEM v1 shape, so the `custom-elements.json` at the package root is the odd one out.

**Fix.** Replace:
```json
"manifest": "wca 'src/**/*.ts' --outFile custom-elements.json --format json"
```
with:
```json
"manifest": "cem analyze --litelement --globs \"src/**/*.ts\" --outfile custom-elements.json"
```

CEM analyzer's output is a different shape (`modules[].declarations[]` vs wca's `tags[]`). Downstream consumers of `custom-elements.json` (IDE tooling, `ts-lit-plugin`) may need adjustments.

**Effort:** ~1h to swap tools + verify IDE hover still works + update any script that reads the old shape.

**Alternative:** drop `custom-elements.json` entirely. The agent plugin already emits a richer CEM v1 manifest at `dist/agent/schmancy.manifest.json` on every build. The root `custom-elements.json` is a duplicate with a different shape. Eliminating it simplifies the build chain.

---

## 6. `<schmancy-devtools>` visible dev overlay

**Problem.** `<schmancy-skill>` renders nothing — by design, per handover §7 Q3. An agent (or a human debugging a prototype) has no visual feedback that the runtime is installed. They have to open DevTools and check `window.schmancy`.

**Fix.** A separate, OPT-IN element: `<schmancy-devtools>`. Renders a small floating badge showing:
- schmancy version (from `manifest.schemaVersion` + package version)
- count: 111 tags, 6 services, 130 tokens
- "Open console: `window.schmancy.help(…)`"
- Collapsible panel with search over the manifest

**Keep `<schmancy-skill>` silent.** This is additive.

**Effort:** ~3h for a minimal surface, ~6h for a polished one.

---

## 7. Real MCP adapter (optional, speculative)

**Problem.** [agent-runtime-v1.md](./agent-runtime-v1.md) caveats that the runtime is explicitly **NOT** MCP-branded because postMessage isn't an MCP transport in the current spec (2025-11-25). If an external agent framework (Claude Code, another MCP host) wants to drive the library through the MCP protocol, someone has to write an adapter.

**Shape.** A separate `@mhmo91/schmancy-mcp-server` npm package (not a subpath of schmancy — different product). Stdio transport. Reads `@mhmo91/schmancy/agent/manifest` as its source of truth. Exposes:
- `resources/list` — every schmancy tag as `schmancy://components/<tag>`
- `resources/read` — returns the manifest entry for one tag
- `completion/complete` — returns the `values: string[]` array for an enum attribute

The manifest already has everything needed; the package is just the JSON-RPC wrapper.

**Effort:** ~1 day for a minimal server, ~3 days with integration tests against the Claude Code MCP client. Do this only when a concrete consumer asks for it.

---

## 8. Publish-pipeline hardening

**Problem.** The workflow at `.github/workflows/publish-to-npm.yml` has a few known-fragile spots:

- **Workflow file changes don't retrigger the workflow.** To ship a fix to the workflow itself, you have to touch a file in the `paths:` filter. This session needed `chore(agent): add keywords` commits to force a retrigger. Fix: add `.github/workflows/**` to the filter.
- **`yarn version patch` can race** against a concurrent push. Two simultaneous commits would both try to bump and publish. Fix: wrap the publish step in a mutex (GitHub Actions concurrency group).
- **`npm publish` uses `NPM_TOKEN` secret**, fine today; if the token rotates, the workflow fails silently without telling the maintainer where to regenerate. Fix: add a step that checks `npm whoami` before publish and fails loudly if the token is invalid.

**Effort:** ~1h to wire all three.

---

## 9. Automate `<PENDING>` substitution in handover docs

**Problem.** `handover/agent-runtime-v1.md` had `<PENDING>` placeholders that we manually replaced with `0.9.13` after the first publish. Future handover docs will have the same issue.

**Fix.** A build step that substitutes `0.9.18` in `handover/**/*.md` against `package.json`'s `version` field on every build. `dist/handover/**/*.md` gets the rendered version; the source stays templated.

**Effort:** ~30 min (one sed step or a tiny script).

---

## 10. esm.sh health monitoring

**Problem.** We rely on esm.sh to serve the bundle. If esm.sh goes down, every consumer of `https://esm.sh/@mhmo91/schmancy/agent@0.9.13` breaks. No monitoring.

**Fix.** A lightweight GitHub Action that runs daily:
- `curl -sI` the esm.sh URL
- Verifies `content-type: application/javascript`, `access-control-allow-origin: *`
- On failure: open a GitHub issue with the response headers

**Alternative CDNs** (drop-in):
- `https://cdn.jsdelivr.net/npm/@mhmo91/schmancy@<version>/dist/agent/schmancy.agent.js`
- `https://unpkg.com/@mhmo91/schmancy@<version>/dist/agent/schmancy.agent.js`

Document both as fallbacks in `handover/agent-runtime-v1.md` (already listed there).

**Effort:** ~30 min for the monitoring action.

---

## Priority matrix (if you only have one week)

| # | Title | Impact | Effort | Risk | Ship order |
|---|---|---|---|---|---|
| 2 | CI smoke-test gate | High | 15m | Low | **1st** |
| 1 | Lazy vendor chunks (code + qr + typewriter) | High | 5h | Low | 2nd |
| 3 | JSDoc `@example` backfill (first 30 components) | Medium | 3h | None | 3rd |
| 9 | `<PENDING>` substitution | Low | 30m | None | 4th |
| 8 | Publish-pipeline hardening | Medium | 1h | Low | 5th |
| 4 | Semver bump to 0.10.0 | Low | 2m | None | any time |
| 1 | Lazy theme (material-color-utilities) | High | 4h | **High** | separate ADR, not this week |
| 5 | wca → CEM analyzer migration | Medium | 1h | Medium | after lazy chunks |
| 6 | `<schmancy-devtools>` visible panel | Medium | 3h | None | when someone asks |
| 7 | Real MCP adapter | Low today | 1d | Low | only on concrete request |
| 10 | esm.sh monitoring | Low | 30m | None | when burnt once |

**In one week:** 1 + 2 + 3 partial + 9 = meaningful delta, no architectural risk, keeps the CI gate as the safety net for everything after.
