# schmancy-theme

> Root theme provider that generates color tokens from a source color and distributes them as CSS custom properties.

## Usage
```html
<schmancy-theme color="#6200ee" scheme="auto" root>
  <your-app></your-app>
</schmancy-theme>
```

## Properties
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `color` | `string` | Random hex | Primary source color in hex format (e.g. `#6200ee`) |
| `scheme` | `'dark' \| 'light' \| 'auto'` | `'auto'` | Color scheme. `auto` follows system preference |
| `root` | `boolean` | `false` | Apply CSS variables to `document.body` instead of shadow host |
| `locale` | `string` | `navigator.language` | Locale for number/date formatting (e.g. `de-DE`, `ar-SA`) |
| `name` | `string` | Auto-generated | Unique name for session storage persistence |

## Theme Service (`theme`)
```typescript
import { theme } from '@mhmo91/schmancy'

theme.scheme          // 'dark' | 'light' | 'auto' (sync)
theme.color           // Current hex color (sync)
theme.scheme$         // Observable<string>
theme.resolvedScheme$ // Observable<'dark'|'light'> (resolves 'auto')

theme.setScheme('dark')
theme.setColor('#2196f3')
theme.toggleScheme()
theme.isDarkMode()    // Observable<boolean>
theme.setFullscreen(true)
```

## Examples
```html
<!-- App root with dark blue theme -->
<schmancy-theme color="#1565c0" scheme="dark" root>
  <my-app></my-app>
</schmancy-theme>

<!-- Nested theme override for a section -->
<schmancy-theme color="#e91e63" scheme="light">
  <div class="accent-section">...</div>
</schmancy-theme>

<!-- Arabic locale -->
<schmancy-theme color="#4caf50" locale="ar-SA" root>
  <my-app></my-app>
</schmancy-theme>
```

## Notes
- Color and scheme persist to `sessionStorage` per instance
- Generates success/warning/info/error semantic color tokens automatically
- Wraps content in a `schmancy-container` with `containerLowest` surface
