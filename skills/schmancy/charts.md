# Schmancy Charts

> Canvas-rendered area chart and horizontal pill chart. Theme-aware, lazy-animated, with auto peak highlighting.

## schmancy-area-chart

> Smooth Catmull-Rom spline area chart with peak markers and hover tooltips.

```html
<schmancy-area-chart
  .data=${[
    { label: '9 AM', value: 12.4 },
    { label: '10 AM', value: 18.9 },
    { label: '11 AM', value: 42.1, metadata: { users: 320 } },
    { label: '12 PM', value: 56.7 },
  ]}
  value-prefix="EUR "
  value-decimals="2"
  peak-count="2"
  height="240"
></schmancy-area-chart>
```

### Properties
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `data` | `ChartDataPoint[]` | `[]` | `{ label, value, metadata? }[]` |
| `height` | number | `200` | Chart height in px |
| `showGrid` | boolean | `true` | Background grid lines |
| `showLabels` | boolean | `true` | X-axis labels |
| `showTooltip` | boolean | `true` | Hover tooltip |
| `peakCount` | number | `3` | Top-N points highlighted larger |
| `animationDuration` | number | `800` | Entrance animation ms |
| `animated` | boolean | `true` | Animate on first visible |
| `valuePrefix` | string | `''` | Display prefix (e.g. `"EUR "`) |
| `valueSuffix` | string | `''` | Display suffix (e.g. `"%"`) |
| `valueDecimals` | number | `2` | Decimal places |
| `theme` | `Partial<ChartTheme>` | `{}` | Override colors, stroke, radii |

### ChartTheme
| Key | Default | Description |
|-----|---------|-------------|
| `primaryColor` | `--schmancy-sys-color-primary` | Line + fill gradient color |
| `gradientOpacity` | `[0.4, 0.05]` | Top/bottom fill opacity |
| `strokeWidth` | `2` | Line thickness |
| `pointRadius` | `4` | Normal point radius |
| `peakRadius` | `6` | Peak point radius |

## schmancy-pills

> Horizontal bar chart with optional stacked segments, medal ranks, and peak/low styling.

```html
<schmancy-pills
  .data=${[
    { label: 'Mon', value: 1240, rank: 1 },
    { label: 'Tue', value: 980 },
    { label: 'Wed', value: 1830, rank: 2, segments: [
      { label: 'Pizza', value: 1200 },
      { label: 'Drinks', value: 630 }
    ]},
  ]}
></schmancy-pills>
```

### Properties
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `data` | `PillDataPoint[]` | `[]` | Rows with optional stacked `segments` |
| `valuePrefix` / `valueSuffix` / `valueDecimals` | — | — | Value formatting (same as area chart) |
| `showMedals` | boolean | `true` | Show 🥇🥈🥉 for rank 1/2/3 |

### PillDataPoint
```typescript
{
  label: string
  value: number
  segments?: { label, value, color }[]  // stacked
  isPeak?: boolean   // highlighted
  isLow?: boolean    // muted
  rank?: 1 | 2 | 3   // medal
  metadata?: Record<string, unknown>
}
```

## Behavior
- Both charts use an IntersectionObserver to defer animation until visible.
- Responsive — resize triggers a re-render.
- Dark/light aware via theme CSS variables.

## When to Use
- Area chart: time-series or comparative trends.
- Pills: ranked categorical data (leaderboards, top days, distribution).
