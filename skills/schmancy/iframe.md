# schmancy-iframe

> Sandboxed iframe that auto-sizes to its content. Ships with sensible document resets (font, spacing, tables, pre, blockquote).

## Usage
```html
<schmancy-iframe .html=${emailBodyHtml}></schmancy-iframe>
```

## Properties
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `html` | string | `''` | Body HTML fragment to render |
| `css` | string | `''` | Extra CSS injected after `baseCss` |
| `baseCss` | string | default reset | Document CSS — override for fully custom styling |
| `sandbox` | string | `'allow-same-origin allow-popups'` | Iframe sandbox attribute |
| `minHeight` | number | `60` | Minimum iframe height in px |

## Events
| Event | When |
|-------|------|
| `load` | Native iframe load; height auto-syncs after |

## Default Resets
The built-in `baseCss` applies: system font, 14px/1.6 line-height, reset margins for headings/lists/paragraphs, bordered tables, blockquote styling, code/pre backgrounds, responsive images.

## Examples
```html
<!-- Email preview with extra styles -->
<schmancy-iframe
  .html=${this.email.bodyHtml}
  .css=${`h1 { color: #6200ee; }`}
></schmancy-iframe>

<!-- Fully custom base styling -->
<schmancy-iframe
  .html=${fragment}
  .baseCss=${'html,body{margin:0;background:#000;color:#fff}'}
></schmancy-iframe>
```

## When to Use
- Rendering untrusted / styled third-party HTML (emails, rich snippets, MD-rendered content) in isolation.
- Preview panes for user-generated HTML.
