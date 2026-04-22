# Schmancy — Documentation Index

A Web Component UI library on Lit + RxJS + Tailwind CSS.

## Foundations

The framework pieces — touch before components.

- [Area](./area.md) — `<schmancy-area>`, `<schmancy-route>`, `area.push()`, `lazy()` for routing.
- [Store](./store.md) — `createContext`, `@select`, `@selectItem`, storage backends.
- [Mixins](./mixins.md) — `$LitElement` base class.
- [Theme](./theme.md) — `<schmancy-theme>`, color scheme, CSS variables.
- [Directives](./directives.md) — Lit directives for physics, effects, text, visibility, interaction.
- [Animation](./animation.md) — Spring presets (`SPRING_SMOOTH`, etc.), `createAnimation`.

## Components by job

### Display
[Typography](./typography.md) · [Icons](./icons.md) · [Avatar](./avatar.md) · [Divider](./divider.md) · [Badge](./badge.md) · [Kbd](./kbd.md) · [Code Highlight](./code-highlight.md) · [Typewriter](./typewriter.md) · [JSON](./json.md) · [Iframe](./iframe.md) · [Map](./map.md) · [Charts](./charts.md)

### Surfaces & layout
[Surface](./surface.md) · [Card](./card.md) · [Scroll / Grid / Flex](./layout.md) · [Page](./page.md) · [Content Drawer](./content-drawer.md) · [Window](./window.md) · [Boat](./boat.md) · [Float](./float.md) · [Splash Screen](./splash-screen.md)

### Forms
[Form](./form.md) · [Input](./input.md) · [Textarea](./textarea.md) · [Select](./select.md) · [Autocomplete](./autocomplete.md) · [Option](./option.md) · [Checkbox](./checkbox.md) · [Switch](./switch.md) · [Radio Group](./radio-group.md) · [Chips](./chips.md) · [Date Range](./date-range.md) · [Date Range Inline](./date-range-inline.md) · [Range](./range.md) · [Extra (Country/Timezone)](./extra.md)

### Navigation
[Breadcrumb](./breadcrumb.md) · [Nav Drawer](./nav-drawer.md) · [Tabs](./tabs.md) · [Navigation Bar](./navigation-bar.md) · [Navigation Rail](./navigation-rail.md) · [Steps](./steps.md) · [Teleport](./teleport.md) · [Theme Button](./theme-button.md)

### Overlays
[Dialog](./dialog.md) · [Sheet](./sheet.md) · [Notification](./notification.md) · [Menu](./menu.md) · [Dropdown](./dropdown.md) · [Tooltip (directive)](./tooltip.md) · [Lightbox](./lightbox.md) · [Expand](./expand.md)

### Interactive
[Button](./button.md) · [List](./list.md) · [Details](./details.md) · [Table](./table.md) · [Tree](./tree.md) · [Slider](./slider.md) · [QR Scanner](./qr-scanner.md)

### Feedback
[Progress](./progress.md) · [Busy](./busy.md) · [Skeleton](./skeleton.md) · [Connectivity](./connectivity.md) · [Delay](./delay.md)

### Domain
[Mailbox](./mailbox.md)

## Services (imperative APIs)

| Service | Purpose |
|---------|---------|
| `area` | Route navigation (see [area](./area.md)) |
| `$dialog` | Open dialogs (see [dialog](./dialog.md)) |
| `$notify` | Toast notifications (see [notification](./notification.md)) |
| `schmancyContentDrawer` | Side panel (see [content-drawer](./content-drawer.md)) |
| `theme` | Theme state, `fullscreen$` (see [theme](./theme.md)) |
| `sound` | Audio feedback (see [audio](./audio.md)) |
| `overlayStack` | Z-index coordinator (see [utils](./utils.md)) |
| `windowManager` | Window registry (see [window](./window.md)) |

## Utilities

[Discovery](./discovery.md) — cross-shadow component lookup.
[RxJS Utils](./rxjs-utils.md) — `waitForElement`, `waitUntil`, `mutationObserver`.
[Utils](./utils.md) — `similarity`, `numbers`, `overlayStack`, `intersection$`, `hashContent`.
[Visually Hidden](./visually-hidden.md) — screen-reader-only content wrapper.
[Audio](./audio.md) — synthesized feedback sounds.

## Conventions

- Lists use `repeat(items, item => item.id, tpl)`.
- View switching uses `cache(...)`.
- Expensive work uses `guard([deps], fn)`.
- DOM access uses `ref(createRef())`.
- Conditionals use `when(...)`, `choose(...)`, `ifDefined(...)`.
- All RxJS subscriptions end with `.pipe(takeUntil(this.disconnecting))`.
- Don't use `setTimeout` / `setInterval` / `addEventListener` — use RxJS (`timer`, `interval`, `fromEvent`).
- Colors: prefer Tailwind shortcut utilities (`bg-surface-default`, `text-error-default`, `border-outline-variant`) over `bg-[var(--schmancy-sys-color-X)]`. Token map in [theme.md § Tailwind utilities](./theme.md#tailwind-utilities).
- `classMap(...)` must be the sole expression in `class=`; never mix with string interpolation.
