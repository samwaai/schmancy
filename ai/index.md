# Schmancy Component Library - AI Reference

This directory contains concise reference documentation for the Schmancy component library, formatted for AI assistance.

## Components

### Core Components
- [Animated Text](./animated-text.md) - Animated text effects with word and letter animations
- [Area](./area.md) - Routing and subscription API for application areas
- [Autocomplete](./autocomplete.md) - Searchable input with dropdown suggestions
- [Avatar](./avatar.md) - User profile images with fallback initials
- [Badge](./badge.md) - Status indicators and notification counts
- [Busy](./busy.md) - Loading states and progress indicators
- [Button](./button.md) - Primary, secondary, and tertiary buttons with various states
- [Card](./card.md) - Content containers with headers and actions
- [Checkbox](./checkbox.md) - Checkable input with indeterminate state
- [Chips](./chips.md) - Compact elements for input or selection

### Layout & Navigation
- [Content Drawer](./content-drawer.md) - Sliding panel system for navigation and overlays
- [Date Range](./date-range.md) - Date range selector with presets
- [Delay](./delay.md) - Delayed content rendering with animations
- [Dialog](./dialog.md) - Modal dialog boxes for confirmations and custom content
- [Divider](./divider.md) - Visual separators with animations
- [Dropdown](./dropdown.md) - Floating dropdown menus
- [Layout](./layout.md) - Flex and grid layout components
- [List](./list.md) - Interactive lists with selection support
- [Menu](./menu.md) - Context and dropdown menus
- [Nav Drawer](./nav-drawer.md) - Responsive navigation drawer system

### Form Elements
- [Form](./form.md) - Form containers with validation capabilities
- [Input](./input.md) - Text input fields with various types and features
- [Option](./option.md) - Option elements for selects and autocomplete
- [Radio Group](./radio-group.md) - Single-selection radio button groups
- [Select](./select.md) - Dropdown selection components
- [Textarea](./textarea.md) - Multi-line text input

### Feedback & Interaction
- [Notification](./notification.md) - Toast notifications and alerts
- [Sheet](./sheet.md) - Side panels and drawers
- [Slider](./slider.md) - Carousel component for content
- [Steps](./steps.md) - Multi-step process indicators
- [Tabs](./tabs.md) - Tabbed interface components
- [Tooltip](./tooltip.md) - Contextual help text

### Utilities
- [Icons](./icons.md) - Material Design icon system
- [Store](./store.md) - State management system
- [Surface](./surface.md) - Elevation and container system
- [Table](./table.md) - Data table components
- [Teleport](./teleport.md) - FLIP animations between DOM positions
- [Theme](./theme.md) - Material Design 3 theming system
- [Theme Button](./theme-button.md) - Theme switching button
- [Tree](./tree.md) - Hierarchical tree view
- [Typography](./typography.md) - Text styling system
- [Typewriter](./typewriter.md) - Typing animation effects

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