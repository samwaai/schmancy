# Schmancy Code Highlight - AI Reference

## Quick Start

```typescript
import '@mhmo91/schmancy/code-highlight'
```

## Component Overview

Code highlighting and preview components for displaying syntax-highlighted code with optional live preview.

## API

### Code Component

```typescript
// Code highlighting component
<schmancy-code
  language="javascript|typescript|html|xml|markdown|bash"  // Language for syntax highlighting
  code="string"                                           // Code to highlight
  copyButton?="boolean"                                   // Show copy button (default: false)
  wrap?="boolean"                                         // Wrap long lines (default: false)
>
</schmancy-code>

// Component properties
language: string     // Programming language for highlighting
code: string        // Code content to display
copyButton: boolean // Show copy to clipboard button
wrap: boolean       // Enable line wrapping
```

### Code Preview Component

```typescript
// Code preview with source and rendered output
<schmancy-code-preview
  language="html|javascript|typescript|etc"              // Language for syntax highlighting
  layout?="vertical|horizontal"                          // Layout direction (default: "vertical")
  preview?="boolean"                                     // Show preview pane (default: true)
>
  <!-- Place code here as content -->
  <div>This content will be shown as code and rendered</div>
</schmancy-code-preview>

// Component properties
language: string    // Programming language for highlighting
layout: string      // Layout direction for code/preview
preview: boolean    // Whether to show preview (HTML only)
```

## Examples

### Basic Usage

```typescript
// Simple code highlighting
<schmancy-code language="javascript" code="console.log('Hello World')">
</schmancy-code>

// With copy button
<schmancy-code 
  language="typescript" 
  code="const greeting: string = 'Hello TypeScript'" 
  copyButton="true">
</schmancy-code>
```

### Code Preview

```typescript
// HTML with live preview
<schmancy-code-preview language="html">
  <schmancy-button variant="filled">
    Click Me
  </schmancy-button>
</schmancy-code-preview>

// Horizontal layout
<schmancy-code-preview language="html" layout="horizontal">
  <div class="p-4 bg-primary-container rounded">
    <schmancy-typography type="headline" token="sm">
      Preview Example
    </schmancy-typography>
  </div>
</schmancy-code-preview>

// Code only (no preview)
<schmancy-code-preview language="javascript" preview="false">
  function calculateSum(a, b) {
    return a + b;
  }
</schmancy-code-preview>
```

### Multi-line Code

```typescript
// Long code with wrapping
<schmancy-code 
  language="typescript" 
  wrap="true"
  copyButton="true"
  code="${`
interface User {
  id: string;
  name: string;
  email: string;
  preferences: {
    theme: 'light' | 'dark';
    notifications: boolean;
  };
}

class UserService {
  async getUser(id: string): Promise<User> {
    const response = await fetch(\`/api/users/\${id}\`);
    return response.json();
  }
}
  `.trim()}">
</schmancy-code>
```

### Real-World Examples

```typescript
// Documentation example
<schmancy-surface class="p-6">
  <schmancy-typography type="title" token="lg" class="mb-4 block">
    API Example
  </schmancy-typography>
  
  <schmancy-code-preview language="html">
    <schmancy-form @submit="${handleSubmit}">
      <schmancy-input 
        label="Email" 
        type="email" 
        required>
      </schmancy-input>
      <schmancy-button type="submit" variant="filled">
        Submit
      </schmancy-button>
    </schmancy-form>
  </schmancy-code-preview>
</schmancy-surface>

// Component showcase
<schmancy-tabs>
  <schmancy-tab slot="tab" active>Preview</schmancy-tab>
  <schmancy-tab slot="tab">Code</schmancy-tab>
  
  <div slot="content">
    <schmancy-code-preview language="html" preview="true">
      <schmancy-card>
        <schmancy-card-content>
          <div slot="headline">Card Title</div>
          <div>Card content goes here</div>
        </schmancy-card-content>
      </schmancy-card>
    </schmancy-code-preview>
  </div>
  
  <div slot="content">
    <schmancy-code language="html" copyButton="true" code="${`
<schmancy-card>
  <schmancy-card-content>
    <div slot="headline">Card Title</div>
    <div>Card content goes here</div>
  </schmancy-card-content>
</schmancy-card>
    `.trim()}">
    </schmancy-code>
  </div>
</schmancy-tabs>
```

## Supported Languages

- `javascript` - JavaScript syntax
- `typescript` - TypeScript syntax
- `html` / `xml` - HTML/XML markup
- `markdown` - Markdown syntax
- `bash` - Shell scripts

## Implementation Details

- Uses **highlight.js** for syntax highlighting
- Automatic indentation detection and normalization
- Dark theme optimized for readability
- Shadow DOM encapsulation
- Responsive layout support
- Copy button uses clipboard API

## Accessibility

- Proper ARIA labels for copy button
- Keyboard navigation support
- Screen reader friendly code blocks
- High contrast syntax colors

## Best Practices

1. **Language Selection**: Always specify the correct language for accurate highlighting
2. **Code Formatting**: Pre-format code with proper indentation
3. **Preview Usage**: Only use preview for HTML content
4. **Long Code**: Enable wrapping for long lines to prevent horizontal scrolling
5. **Copy Button**: Include for code snippets users might want to reuse

## Common Pitfalls

- **Escaping**: HTML entities in code strings need proper escaping
- **Indentation**: Code preview component auto-detects minimum indentation
- **Performance**: Very large code blocks may impact rendering

## Related Components

- **[Surface](./surface.md)**: Often used as container for code examples
- **[Card](./card.md)**: Code blocks in documentation cards
- **[Typography](./typography.md)**: For code captions and descriptions
- **[Tabs](./tabs.md)**: Switching between code and preview

## TypeScript Interface

```typescript
interface SchmancyCodeElement extends HTMLElement {
  language: string;
  code: string;
  copyButton: boolean;
  wrap: boolean;
}

interface SchmancyCodePreviewElement extends HTMLElement {
  language: string;
  layout: 'vertical' | 'horizontal';
  preview: boolean;
}
```