# Schmancy Component Library - AI Reference

This directory contains concise reference documentation for the Schmancy component library, formatted for AI assistance.

## Components

- [Area](./area.md) - Routing and subscription API for application areas
- [Button](./button.md) - Primary, secondary, and tertiary buttons with various states
- [Dialog](./dialog.md) - Modal dialog boxes for confirmations and custom content
- [Form](./form.md) - Form containers with validation capabilities
- [Input](./input.md) - Text input fields with various types and features
- [Layout](./layout.md) - Flex and grid layout components
- [List](./list.md) - Interactive lists with selection support
- [Notification](./notification.md) - Toast notifications and alerts
- [Sheet](./sheet.md) - Side panels and drawers
- [Store](./store.md) - State management system
- [Tabs](./tabs.md) - Tabbed interface components

## Reference Format

Each reference file follows a consistent pattern:

```js
// Component name and basic usage
<component-name attribute="value" boolean-attribute>
  Content or children
</component-name>

// Component variations and options
<component-name 
  option1="value"
  option2>
  <!-- Structure examples -->
</component-name>

// Component methods and events
component.method() -> returnType
@event // Event description with { detail: { properties } }

// Examples of common usage patterns (numbered for clarity)
// 1. Basic usage
<component-name attribute="value">
  Example content
</component-name>

// 2. Advanced configuration
<component-name attribute="value" advanced-config="true">
  Complex example
</component-name>
```

Each component documentation also includes:

- **Related Components**: Links to related components with relationship descriptions
- **Technical Details**: Interfaces, types, CSS custom properties
- **Common Use Cases**: Practical examples with explanations

This format is designed to quickly convey:
1. Component tag names and attributes
2. Available options and variations
3. Component methods and events
4. Relationships to other components
5. Practical usage patterns

For detailed documentation guidelines, see [template.md](./template.md).

## Library Structure

The Schmancy library is organized into individual component directories under `/src`, each exporting its components through an `index.ts` file. The main library entry point is `/src/index.ts` which re-exports all components.

Most components follow LitElement patterns with TypeScript typing and are designed to be used with a reactive rendering system like lit-html.