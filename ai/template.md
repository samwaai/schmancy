# Schmancy AI Documentation Guidelines

This document provides a template and guidelines for creating consistent AI-friendly documentation for Schmancy components.

## Documentation Format

Each component's documentation should follow this structure:

1. **Component Title**: `# Schmancy [Component] - AI Reference`
2. **Code Block**: Main syntax reference with component usage patterns
3. **Related Components**: List of related components with links and relationship descriptions
4. **Technical Details**: Interfaces, types, CSS custom properties, etc.
5. **Common Use Cases**: Practical examples with explanations

## Code Block Template

```js
// Component Tag
<schmancy-[component]
  [primary-attribute]="value"
  [boolean-attribute]?
  @[event-name]=${handler}>
  <!-- Content/children if applicable -->
</schmancy-[component]>

// Component Variations (if applicable)
<schmancy-[component] 
  variant="[variant]"
  size="small|medium|large">
</schmancy-[component]>

// Component Methods
component.method() -> returnType
component.property = value

// Event details
@event-name // { detail: { relevantData } }

// Examples (always number examples for clarity)
// 1. Basic example
<schmancy-[component] [primary-attribute]="value">
  Content
</schmancy-[component]>

// 2. Advanced example
<schmancy-[component]
  [attribute]="value"
  @[event]=${() => handleEvent()}>
  <!-- Structured content -->
</schmancy-[component]>
```

## Related Components Section

Always include a "Related Components" section that links to other relevant components:

```markdown
## Related Components
- **[Related-1](./related-1.md)**: Brief description of relationship
- **[Related-2](./related-2.md)**: Brief description of relationship
- **[Related-3](./related-3.md)**: Brief description of relationship
```

## Technical Details Section

Include relevant technical information:

```markdown
## Technical Details

### Interfaces
```typescript
interface ComponentProps {
  property: type;
  optionalProperty?: type;
}
```

### CSS Custom Properties (if applicable)
```css
--schmancy-component-color: /* Controls the component color */
--schmancy-component-spacing: /* Controls internal spacing */
```
```

## Common Use Cases Section

Provide 2-4 practical use cases with code examples:

```markdown
### Common Use Cases

1. **Use Case 1**: Brief description
   ```html
   <schmancy-[component] specific-attribute="value"></schmancy-[component]>
   ```

2. **Use Case 2**: Brief description
   ```html
   <schmancy-[component] with="specific-configuration"></schmancy-[component]>
   ```
```

## Style Guide

1. **Code Examples**:
   - Number all examples sequentially (e.g., `// 1. Basic example`)
   - Include descriptive comments
   - Ensure examples are realistic and complete

2. **Component Descriptions**:
   - Focus on functionality and API usage
   - Avoid marketing language
   - Provide context for when and why to use the component

3. **Cross-Referencing**:
   - Always link to related components
   - Explain the relationship (e.g., "Used within", "Alternative to", "Extends")

4. **Formatting**:
   - Use backticks for inline code references
   - Use proper markdown headers for sections
   - Use TypeScript for type definitions

## Component Categories

Organize components according to these categories for better cross-referencing:

1. **Core Infrastructure**: Area, Store, Teleport, RxJS Utils
2. **Layout Components**: Layout, Surface, Card, Divider
3. **Navigation & Structure**: Tabs, Menu, Nav-Drawer, Content-Drawer, Sheet, Dialog
4. **Form Controls**: Form, Input, Textarea, Select, Autocomplete, Checkbox, Radio-Group, Option
5. **Interactive Elements**: Button, Dropdown, Chips, List, Tree, Table
6. **Feedback & Status**: Notification, Tooltip, Badge, Busy, Avatar
7. **Typography & Visual**: Typography, Icons, Animated-Text, Typewriter
8. **Utilities**: Directives, Theme, Theme-Button, Utils, Types, Delay, Date-Range, Steps

## Examples

See these files for examples of well-formatted component documentation:
- [area.md](./area.md): Complex service component
- [form.md](./form.md): Container component
- [input.md](./input.md): Form field component
- [store.md](./store.md): State management