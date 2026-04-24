# Handover follow-up: schmancy agent runtime v2 loop-back

**From:** schmancy maintainers
**To:** Claude Design agent
**Status:** ready for loop-back validation when the PRs linked below merge and publish
**Parent:** [`agent-runtime-v1.md`](./agent-runtime-v1.md), [`agent-runtime-followups.md`](./agent-runtime-followups.md)

## What changed since v0.9.13

Four separable PRs, each shippable on its own:

| # | Title | Branch | Impact on your probe |
|---|---|---|---|
| 2 | CI smoke-test gate | `feat/ci-gate-and-version-templating` | None user-facing. `window.schmancy.help()` regressions now fail-closed at publish time instead of shipping silently. |
| 9 | `{{version}}` templating for handover docs | same branch as #2 | None user-facing. Future handover docs will have live esm.sh URLs instead of `<PENDING>` placeholders. |
| 3 | JSDoc backfill (46 components) | `feat/jsdoc-batch-{1,2,3}-*` | **This is what you'll notice.** Every form-control, container, and overlay/nav component now ships `@summary`, `@example`, and `@platform` tags in its manifest entry. `window.schmancy.help('schmancy-button')` returns a non-empty `summary`, a copy-pastable `examples[]`, and a `platformPrimitive` hint for graceful degradation. |
| 1 | Lazy vendor chunks | `feat/lazy-{typewriter,code-highlight,qr-scanner}` | Pages that don't render `<schmancy-code>`, `<schmancy-qr-scanner>`, or `<schmancy-typewriter>` no longer fetch `vendor-highlight`, `vendor-jsqr`, or the typewriter chunk on first paint. ~68 KB gzipped saved on cold starts for typical prototypes. |

The only one that changes the shape of `window.schmancy` is **#3**. The others are infra / perf.

## Pinned URLs (live once the PRs merge)

```
https://esm.sh/@mhmo91/schmancy/agent@{{version}}
https://esm.sh/@mhmo91/schmancy/agent/manifest@{{version}}
```

`{{version}}` is substituted at publish time — see [`agent-runtime-followups.md`](./agent-runtime-followups.md) #9. Until the PRs land, continue pinning `@0.9.14` (the last published version at time of writing).

## Minimum loop-back test

```html
<!doctype html>
<script type="module">
  import 'https://esm.sh/@mhmo91/schmancy/agent@{{version}}';
</script>

<schmancy-theme root scheme="dark">
  <schmancy-surface type="solid" fill="all">
    <schmancy-button variant="filled">Hi</schmancy-button>
    <schmancy-skill></schmancy-skill>
  </schmancy-surface>
</schmancy-theme>

<script>
  // Expected after the JSDoc backfill lands:
  // - summary: non-empty ("Trigger actions or navigate. Form-associated; …")
  // - examples: array with at least one <schmancy-button variant="filled"> snippet
  // - platformPrimitive: { tag: 'button', mode: 'click', note: 'Schmancy-skinned native <button>…' }
  const help = window.schmancy.help('schmancy-button');
  console.log(help.summary, help.examples, help.platformPrimitive);

  // Capability probe unchanged from v1
  console.log(window.schmancy.capabilities());
</script>
```

## What to report back

If anything surprises you, open an issue at `github.com/mhmo91/schmancy` with:
- The `window.schmancy.capabilities()` output from your sandbox
- Which component's `help()` surface looks wrong (empty summary, missing example, unexpected platform hint)
- The manifest schema version: `window.schmancy.manifest.schemaVersion`

Components that still have gaps after this pass — icons, tooltips, maps, charts, table internals — are on the long tail of the JSDoc campaign. They're not blockers; `help()` returns a class description when no `@summary` is present, so the response shape is still valid, just less useful.

## What did NOT ship

- **Theme service lazy-load.** ADR 0014 in the parent monorepo (`docs/adr/0014-lazy-vendor-chunks-in-schmancy-agent.md`) specifically defers this — the synchronous `theme.value` contract is load-bearing for every downstream consumer. Needs a separate ADR + migration plan.
- **Network-log regression guard.** Proposed in ADR 0014 as a Playwright assertion that a theme-only page loads zero `vendor-*` chunks. Requires a built-bundle test harness (existing tests use the dev bundle). Deferred to a follow-up; the CI smoke-test gate catches the class of regression that matters most.
- **MCP adapter package.** Tracked as follow-up #7. Ship it only when a concrete MCP consumer asks for it — writing the adapter without a real integration partner tends to produce a wrong API.
