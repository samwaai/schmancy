# schmancy-tab-group / schmancy-tab

> Tab container with tab navigation and scroll-spy mode.

## Usage
```html
<schmancy-tab-group activeTab="overview">
  <schmancy-tab label="Overview" value="overview">
    <p>Overview content</p>
  </schmancy-tab>
  <schmancy-tab label="Details" value="details">
    <p>Details content</p>
  </schmancy-tab>
</schmancy-tab-group>
```

## Properties (schmancy-tab-group)
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| activeTab | string | first tab | Currently active tab value |
| mode | `'tabs'\|'scroll'` | `'tabs'` | Display mode (tabs or scroll-spy) |
| rounded | boolean | `true` | Rounded tab bar |

## Properties (schmancy-tab)
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| label | string | - | Tab label text |
| value | string | - | Unique tab identifier |
| active | boolean | `false` | Whether this tab is active |

## Events (schmancy-tab-group)
| Event | Detail | Description |
|-------|--------|-------------|
| tab-changed | string | Active tab value when changed |

## Examples
```html
<!-- Scroll-spy mode (tabs follow scroll position) -->
<schmancy-tab-group mode="scroll">
  <schmancy-tab label="Section 1" value="s1">
    <div style="height: 500px">Long content</div>
  </schmancy-tab>
  <schmancy-tab label="Section 2" value="s2">
    <div style="height: 500px">More content</div>
  </schmancy-tab>
</schmancy-tab-group>
```

In `tabs` mode, only the active tab renders content. In `scroll` mode, all tabs render and the nav highlights the visible section.
