# schmancy-code

> Syntax-highlighted code block with line numbers, copy button, and collapsible display.

## Usage
```html
<schmancy-code language="typescript" .code=${'const x = 42'}></schmancy-code>
```

## Properties
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| code | string | `''` | Code content to highlight |
| language | string | `'javascript'` | Language for syntax highlighting |
| filename | string | `undefined` | Filename shown in header |
| lineNumbers | boolean | `false` | Show line numbers |
| copyButton | boolean | `true` | Show copy-to-clipboard button |
| highlightLines | string | `undefined` | Lines to highlight (e.g., `'1-3,5,7-9'`) |
| maxHeight | string | `undefined` | Max height before scrolling |

## Supported Languages
javascript, typescript, html, xml, markdown, bash

## Examples
```html
<!-- TypeScript with line numbers and highlighted lines -->
<schmancy-code
  language="typescript"
  lineNumbers
  highlightLines="2-3"
  .code=${`import { html } from 'lit'
const greeting = 'Hello'
console.log(greeting)`}>
</schmancy-code>

<!-- Bash with filename -->
<schmancy-code language="bash" filename="install.sh"
  .code=${'npm install @mhmo91/schmancy'}>
</schmancy-code>

<!-- With max height -->
<schmancy-code language="javascript" maxHeight="300px"
  .code=${longCodeString}>
</schmancy-code>
```

Renders inside a collapsible `schmancy-details` with a macOS-style header (colored dots + language label). Uses highlight.js with schmancy color tokens.
