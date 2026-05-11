---
name: schmancy
description: UI patterns, component APIs, and conventions for the @mhmo91/schmancy web-component library (Lit + RxJS + Tailwind) — the exclusive UI stack in this repo's `web/` workspace. Fire this skill on ANY web-UI work, even when the user doesn't name schmancy explicitly — including adding or editing a component, building a form, showing a dialog / toast / side drawer / bottom sheet, wiring routing, reading or writing a state, styling with theme tokens, adding a drop zone / file input / date picker / autocomplete, working with `SchmancyElement`, or touching any `<schmancy-*>` tag. Also fire on prompts like "build a page", "add a modal", "wire a route", "save user prefs in storage", "animate this", "style with our theme", "make a notification", "how do I do X in Lit", "my drag-and-drop", "dark mode toggle".
---

# Schmancy

Web-component UI library on Lit + RxJS + Tailwind CSS. This skill bundles the full library reference as supporting files alongside this SKILL.md.

## How to use this skill

All reference files live in this directory. Read by filename.

1. **Start with `INDEX.md`** for the full catalog organized by job (foundations / atoms / forms / navigation / overlays / interaction / feedback / display).
2. **Before writing any `<schmancy-X>` tag**, read `X.md`. Example: `<schmancy-button>` → `button.md`.
3. **Before editing foundations** (routing, state, base class, theme), read the matching foundation file below.
4. **Apply the conventions** at the end of this file.

## Foundations (the framework pieces — touch first)

| Piece | Read |
|-------|------|
| Routing (`<schmancy-area>`, `<schmancy-route>`, `area.push()`, `lazy()`) | `area.md` |
| State (`state()`, `bindState`, `computed`, `stateFromObservable`) | `state.md` |
| Base class (`SchmancyElement`) | `mixins.md` |
| Theme (`<schmancy-theme>`, `theme` service) | `theme.md` |
| Directives (`magnetic`, `cursorGlow`, `gravity`, `reveal`, `animateText`, …) | `directives.md` |
| Spring physics presets | `animation.md` |

## Overlay services (prefer over tags)

For modals, toasts, side drawers — reach for the **imperative service API** first.
`show()` is the single overlay primitive: layout (centered / anchored / sheet)
is chosen by the system based on viewport + anchor presence. There is no
`$dialog` or `sheet` service.

```typescript
import { show, confirm, prompt } from '@mhmo91/schmancy/overlay'
import { $notify, schmancyContentDrawer } from '@mhmo91/schmancy'

show(new EditForm())                                     // centered fallback
show(new QuickPicker(), { anchor: ev })                  // anchored at click
show(new Picker())                                       // narrow viewport → sheet (auto)
$notify.success('Saved'); $notify.error('Failed')        // toast
schmancyContentDrawer.push({ component: new Detail() })  // side panel
```

References: `overlay.md`, `notification.md`, `content-drawer.md`.

Use component tags (`<schmancy-menu>`, `<schmancy-dropdown>`, `<schmancy-tooltip>`, `<schmancy-lightbox>`, `<schmancy-expand>`) only when the tag is the natural fit (anchored panels, tooltips, galleries).

## Composition

- **Audit by grep** (`AUDIT_BY_GREP`). An agent's compliance report on a file under a rule is the list of file:line citations of the rule's forbidden patterns; an empty list is compliance. The rule applies to every other rule in this skill (`PRIMITIVE_FIRST`, `TOKEN_FIRST_NO_ARBITRARY`, `NO_LOCAL_CLASS_CSS`, `NO_TERNARY_NOTHING_DISPATCH`): a claim that a file complies is a claim about what the file does NOT contain, and that claim is verified by enumerating the rule's forbidden patterns and grepping each one.
  Sources: each rule above names its forbidden patterns explicitly — `TOKEN_FIRST_NO_ARBITRARY` forbids `[...]` arbitrary-value Tailwind utilities; `PRIMITIVE_FIRST` forbids raw HTML elements whose class attribute carries design-system styling (typography/color/surface/spacing-as-design); `NO_LOCAL_CLASS_CSS` forbids class/id/attribute selectors inside the `css` template; `NO_TERNARY_NOTHING_DISPATCH` forbids `${cond ? html\`...\` : nothing}` and `${cond && html\`...\`}` patterns.
  Remediation: before reporting any file compliant, run a grep against each forbidden pattern named by the rule under audit (e.g. `grep -nE '\[(?:[^]]+)\]' <file>` for `TOKEN_FIRST_NO_ARBITRARY`; `grep -nE 'class="[^"]*\b(text-|bg-|border-|rounded-|shadow-|tracking-|leading-|p[xy]?-)' <file>` plus a manual scan for raw `<div>`/`<span>` carrying those classes for `PRIMITIVE_FIRST`). The compliance report's body is the concatenation of those grep outputs annotated with their rule name; an empty body across every pattern under every rule is the only form of "compliant". A claim of compliance unaccompanied by the grep evidence is not a compliance report and is treated as an unverified assertion that the audit loop rejects.
- **Schmancy primitive first** (`PRIMITIVE_FIRST`). Within `web/**`, every visible UI element is a custom element exported from `packages/schmancy/src/**`, and an element absent from that export set is added there before being imported into `web/**`. The rule sits above the styling rules: a `<div class="text-xs text-surface-on-variant">…</div>` whose role is typography is a violation even when every utility resolves to a registered token, because `<schmancy-typography>` already covers that role; the styling rules apply only to whatever class strings remain after the right primitive has been selected.
  Sources: [packages/schmancy/skills/schmancy/INDEX.md](../INDEX.md) catalogues the export set by job (foundations / atoms / forms / navigation / overlays / interaction / feedback / display); each role's reference file (`typography.md`, `surface.md`, `button.md`, `overlay.md`, …) names the props, slots, and events that displace the equivalent `<div>` + utility-class pattern. The export set is the single source — a primitive that is not exported from `packages/schmancy/src/**` does not satisfy this rule even if it lives in a private file inside the schmancy tree.
  Remediation: walk every `.ts` and `.html` file under `web/**` and list every raw HTML element whose class string carries design-system styling (typography, color, spacing-as-design-decision, surface, layout-as-design-decision, motion, overlay) — those are the violations. For each, look up the matching schmancy primitive in `INDEX.md` and rewrite the element through that primitive (`<schmancy-typography type=… token=…>` for type-scale text, `<schmancy-surface type=… fill=…>` for elevated/bounded surfaces, `<schmancy-grid>`/`<schmancy-flex>` for layout primitives with design intent, the imperative `show`/`$notify`/`schmancyContentDrawer.push` services for overlays, `<schmancy-scroll>` for scroll containers). When a needed primitive is absent from the export set, design and implement it as a new component under `packages/schmancy/src/<role>/` — extending `SchmancyElement` with `static styles = [css\`...\`]`, registered in `HTMLElementTagNameMap`, exported through the package barrel, and documented with a sibling `.md` in the skill's reference set — and only then introduce the first call site in `web/**`. The audit subagent iterates the whole `web/**` tree, surfaces the violation list, applies the rewrites, runs `yarn workspace @momo/web tsc --noEmit` plus the colocated `*-view.test.ts` suites, and reports pre-existing violations that require a new schmancy primitive as a separate punch list for designer/architect approval before the implementation lands. The loop exits when every `web/**` file's visible UI elements are schmancy primitives and the typecheck plus the test suites pass.
- **Module index re-exports the subpath surface** (`MODULE_INDEX_REEXPORTS_SUBPATH`). Each schmancy module exposed through the package's `./*` subpath export resolves to `src/<name>/index.ts`, and any other source file under `src/<name>/` is visible to consumers only through symbols that index re-exports.
  Sources: the `exports` field in [packages/schmancy/package.json](../../package.json) maps the `./*` subpath to `./dist/*.js` and the matching `./types/src/*/index.d.ts` types entry, so the only declaration a consumer reaches for `import … from '@mhmo91/schmancy/<name>'` is the one emitted from `src/<name>/index.ts`. Files placed in subdirectories of that module are bundled into the same dist output, but they cross the package boundary only through symbols re-exported up the chain into the module index. Past incident: `packages/schmancy/src/form/index.ts` exposed only `form`, `form-state`, and `form-summary`; consumers importing field types like `SchmancyInput` and `SchmancyFormSubmitDetail` from `@mhmo91/schmancy/form` saw nothing because `form/fields/*` had no path into the module index.
  Remediation: list every direct subdirectory of `packages/schmancy/src/<name>/` that owns its own `index.ts` with component exports, and for each one verify that `packages/schmancy/src/<name>/index.ts` carries an `export * from './<subdir>'` (directly, or via a grouping barrel such as `<subdir>/index.ts` re-exported by the module index). The audit subagent runs `ls -d packages/schmancy/src/<name>/*/` for every module under `./*`, greps each subdirectory's `index.ts` for `^export`, then greps the module's `index.ts` for `export \* from './<subdir>'` (or for an intermediate barrel that re-exports it), and lists every subdirectory that fails the second grep as a violation. The fix per violation is one line in the module's `index.ts`; when a module groups several subdirectories under one role (e.g. `form/fields/*`), the loop also adds an intermediate `<subdir>/index.ts` barrel and re-exports that single barrel from the module index rather than enumerating leaves. The loop exits when every direct subdirectory's symbols round-trip through the module index and `yarn workspace @momo/web tsc --noEmit` passes against the consumers that import from `@mhmo91/schmancy/<name>`.

## Non-negotiable conventions

**Component authoring**
- Every component extends `SchmancyElement` and declares its component-local CSS via `static styles = [css\`...\`]`. Never raw `LitElement`. Never wrap with `SignalWatcher` — the base already includes it; double-wrapping creates two nested Computeds and panics with "Detected cycle in computations" at runtime.
- Every RxJS subscription ends with `.pipe(takeUntil(this.disconnecting))`.
- Register the tag in `HTMLElementTagNameMap` for TypeScript.

**SIGNALS_ARE_THE_API**
State signals are the integration layer between co-located Schmancy view components; each view component owns its IO directly and has zero property inputs and zero custom event outputs when state signals cover the shared state.

- Detection signals: a view component with `.property=${value}` inputs from a parent; a view component dispatching `CustomEvent`s that a sibling or parent handles; an orchestrator file co-located with a view where routing complexity does not exceed schmancy's `.guard`+`@redirect` capability (i.e., the flow is a linear sequence with no branching or cross-route hand-off).
- Remediation: move shared state into schmancy state signals; have each component read/write signals directly in render() and connectedCallback(); delete the orchestrator if its only job was to pass data down and receive events up.

**EVENTS_UP_PROPS_DOWN** (cross-component communication when signals don't cover it)
When two components genuinely cannot share a signal (e.g., a generic reusable component that must not import app state), user actions travel upward via `CustomEvent` dispatch and data travels downward via Lit property bindings — not via callable property bindings (`onXxx`, `handleXxx`) set on child elements.

- Detection signals: `.onXxx=${fn}` or `.handleXxx=${fn}` callable property bindings in a parent template.
- Remediation: dispatch `new CustomEvent('xxx', { detail, bubbles: true, composed: true })` in the child; bind `@xxx=${handler}` in the parent.

**State**
- States live at module scope. Many small states beat one monolith. Use `state('feature/name').{memory,session,local,idb}(initial)` from `@mhmo91/schmancy/state`.
- Reading `state.value` inside `render()` auto-tracks via the base class's `SignalWatcher` — no decorator or binding needed for the default case.
- `await state.ready` (or `if (state.loaded)`) before reading persisted-backend values that hydrate asynchronously.
- Storage tiers: `.memory()` (regenerable) · `.session()` (per-tab) · `.local()` (user prefs) · `.idb()` (>100-entry collections).

**Routing**
- Route guards are `Observable<boolean>`, never cached booleans.
- `when="tag-name"` must exactly match `@customElement('tag-name')`.
- Lazy-load route components: `lazy(() => import('./page'))`.
- After auth/permission guards, use `historyStrategy: 'replace'` or `'pop'` — never `'push'`.

**Templates**
- Lists: `repeat(items, i => i.id, tpl)`. Never `.map()`.
- View switching: `cache(...)`.
- Expensive work: `guard([deps], () => expensive())`.
- Conditionals: every `${...}` placeholder whose value is a `TemplateResult` or `nothing` uses a directive imported from `lit/directives/` — `when(condition, () => html\`...\`, () => html\`...\`?)` for a two-way branch, `choose(value, [['case', () => html\`...\`], …])` for a three-or-more-way dispatch, `ifDefined(maybeUndef)` for nullable attribute values. A chain of `?:` or `&&` expressions whose else-arm is `nothing` evaluates every branch on every render and defeats lit's directive-aware diffing; the pre-edit hook flags this as `NO_TERNARY_NOTHING_DISPATCH`.
- DOM access: `ref(createRef())`.
- `classMap(this.classMap({...}))` must be the sole expression in `class=` — never mix with string interpolation.

**Styling**
- Styling uses Tailwind and schmancy tokens. The `css` block in `static styles` contains only `:host` rules, `@keyframes`, and selectors targeting vendor pseudo-elements (`::-webkit-*`, `::-moz-*`). Other styling is set through Tailwind utility classes and schmancy theme tokens on the `class=` attribute. The `style=` attribute holds per-instance dynamic values only (e.g. `style="--tide: ${value}"`).
  Remediation: move declarations to Tailwind on the `class=` attribute (`backdrop-filter: blur(20px)` → `backdrop-blur-xl`; `color-mix(in oklch, Canvas 72%, transparent)` → `bg-surface/70`; `border-radius: 14px` → `rounded-2xl`; `transition: opacity 80ms linear` → `transition-opacity duration-75 ease-linear`). When a visual pattern seems to want its own class (like `.glass`), check `INDEX.md` — schmancy likely ships the component.
- Colors: Tailwind utility classes (`bg-surface-on`, `text-primary-default`, `border-outline-variant`) are the preferred surface — every `--schmancy-sys-color-*` token is auto-aliased to `--color-*`, which Tailwind v4 turns into the full `bg-X` / `text-X` / `border-X` / `ring-X` / `fill-X` / `stroke-X` namespace. Reach for raw `var(--schmancy-sys-color-*)` only inside the `css` template literal (where Tailwind doesn't apply) or for custom tokens you've registered yourself. Never hardcoded hex.
- **No arbitrary-value escape** (`TOKEN_FIRST_NO_ARBITRARY`). Within `web/src/**` and `packages/schmancy/src/**`, no Tailwind arbitrary-value utility (`[...]`) appears; a value not yet covered by `packages/schmancy/src/theme/theme.style.css` or the Tailwind default theme is added as a token to that file before being used. This rule supersedes the prior `TOKEN_FIRST_LITERALS_COMPLETION` annotation form: an inline `// token-gap: <namespace>` comment is no longer a valid resolution, since color and size namespaces are exhaustively covered by schmancy and Tailwind, and any uncovered namespace (aspect ratio, motion curve, custom breakpoint) is itself a token-registry extension waiting to be made.
  Sources: `theme.md` enumerates the schmancy color tokens (every `--schmancy-sys-color-*` auto-aliases to a Tailwind class); `typography.md` enumerates the type scale; `theme.style.css` declares the spacing, radius, shadow, font, text, tracking, leading, aspect, breakpoint, container, ease, and animate namespaces, every entry of which Tailwind v4 lifts into a named utility. A bracket-syntax utility in either glob is by construction either a value the registry already covers (rule violation, replace with the token) or a value the registry does not yet cover (rule violation, extend the registry first).
  Remediation: list every `[...]` arbitrary-value utility in the changeset; for each whose value matches a `--<namespace>-*` variable, replace with the named utility (`bg-[#faf7f2]` → `bg-surface-containerLowest`, `max-w-[720px]` → `max-w-3xl`); for each whose value has no matching variable, register the variable in `packages/schmancy/src/theme/theme.style.css` first, then mirror the same `--<namespace>-x: …` declaration inside an `@theme {}` block in the consumer's stylesheet (e.g. `web/src/styles.css`) — schmancy ships the variable to its own shadow-DOM TailwindMixin, the consumer mirror lets Tailwind v4 generate the named utility for document-scope code. When the variable lives in both places but the utility class still does not apply inside a shadow-DOM component (the mixin's utility subset is frozen at schmancy build time, so consumer-introduced class names can't be added), bind the registered variable through an inline `style="<property>: var(--<namespace>-x);"` attribute on the element — the bracket-syntax rule is satisfied because no Tailwind arbitrary-value utility appears in the markup, and the `style=` attribute consuming a registered CSS custom property fits the per-instance dynamic-value clause of `NO_LOCAL_CLASS_CSS`. When the value's design rationale is one-off (a vendor-dictated pixel width, a single-use marketing graphic) the rule still requires a registered token — the alternative is to drop the value as a design violation.
- No `setTimeout` / `setInterval` / `addEventListener` — use RxJS (`timer`, `interval`, `fromEvent`).

**Accessibility (combobox forms)**
```typescript
role="combobox"
aria-haspopup="listbox"
aria-expanded=${this._open}
aria-controls="listbox-id"
```
Plus a live region: `<div id="live-status" role="status" aria-live="polite" class="sr-only"></div>`.

## Minimal app skeleton

```typescript
<schmancy-theme root scheme="dark">
  <schmancy-surface type="solid" fill="all">
    <schmancy-scroll>
      <schmancy-area
        name="root"
        .default=${lazy(() => import('./home.page'))}
      >
        <schmancy-route when="home-page"
          .component=${lazy(() => import('./home.page'))}></schmancy-route>

        <schmancy-route when="app-index"
          .component=${lazy(() => import('./app.page'))}
          .guard=${authState$.pipe(
            map(u => !!u),
            takeUntil(this.disconnecting),
          )}
          @redirect=${() => area.push({
            component: 'home-page', area: 'root', historyStrategy: 'replace',
          })}></schmancy-route>
      </schmancy-area>
    </schmancy-scroll>
  </schmancy-surface>
</schmancy-theme>
```

## Workflow

1. User describes a UI task.
2. Read `INDEX.md` to find the relevant components or foundations.
3. Read the specific `.md` files for the APIs involved.
4. Write code that follows the conventions above.
