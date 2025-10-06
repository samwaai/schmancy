# Schmancy UI Library

[![npm version](https://img.shields.io/npm/v/@mhmo91/schmancy.svg)](https://www.npmjs.com/package/@mhmo91/schmancy)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

Schmancy is a modern, production-ready UI component library built as web components. It provides an elegant implementation of Material Design 3 (M3) with minimal deviations, powered by [Lit](https://lit.dev/), [Tailwind CSS](https://tailwindcss.com/), and [RxJS](https://rxjs.dev/).

**Built for developers who value:** Simplicity, type safety, reactive patterns, and accessibility.

## Key Features

- **🧩 Web Components Standard** - Framework-agnostic, works with React, Vue, Angular, or vanilla JS
- **🎨 Material Design 3** - Modern, cohesive design language with full theming support
- **⚡ Reactive & Type-Safe** - Built with TypeScript and RxJS for predictable state management
- **♿ Accessible by Default** - ARIA support, keyboard navigation, and screen reader compatibility
- **🎯 Tree-Shakeable** - Import only what you need for optimal bundle size
- **🛠️ Developer-Friendly** - Comprehensive TypeScript types and AI-assisted documentation

## Installation

### Using npm

```bash
npm install @mhmo91/schmancy
```

### Using yarn

```bash
yarn add @mhmo91/schmancy
```

### Peer Dependencies

Schmancy requires Lit and Tailwind CSS as peer dependencies:

```bash
npm install lit tailwindcss
```

## Quick Start

### Import All Components

```javascript
import '@mhmo91/schmancy'
```

This makes all Schmancy components available throughout your application.

### Import Individual Components

For better tree-shaking and smaller bundle sizes:

```javascript
import '@mhmo91/schmancy/button'
import '@mhmo91/schmancy/input'
import '@mhmo91/schmancy/select'
```

### Basic Usage

```html
<!-- Buttons with variants -->
<schmancy-button variant="filled">Primary Action</schmancy-button>
<schmancy-button variant="outlined">Secondary Action</schmancy-button>

<!-- Form inputs with validation -->
<schmancy-input
  label="Email"
  type="email"
  required
  placeholder="you@example.com"
></schmancy-input>

<!-- Select with options -->
<schmancy-select label="Choose an option" value="option1">
  <schmancy-option value="option1">Option 1</schmancy-option>
  <schmancy-option value="option2">Option 2</schmancy-option>
</schmancy-select>

<!-- Surfaces with elevation -->
<schmancy-surface elevation="2" rounded="all" class="p-6">
  <schmancy-typography type="headline" token="md">Card Title</schmancy-typography>
  <schmancy-typography type="body" token="md">Card content goes here</schmancy-typography>
</schmancy-surface>
```

## Documentation

### 📚 User Documentation

**[Interactive Component Demos](https://schmancy.samwa.ai/)** - Explore all components with live examples and code snippets

### 🤖 AI-Assisted Development

The `/ai/` directory contains concise reference documentation optimized for AI assistants and LLM-based tools:

- **[AI Documentation Index](./ai/index.md)** - Overview and quick reference
- **[Component Relationships](./ai/component-relationships.md)** - How components work together
- **[Documentation Template](./ai/template.md)** - Contribution guidelines

#### Component References

<details>
<summary><strong>Core Components</strong></summary>

- [Animated Text](./ai/animated-text.md) - Animated text effects
- [Autocomplete](./ai/autocomplete.md) - Searchable input with suggestions
- [Avatar](./ai/avatar.md) - User profile images
- [Badge](./ai/badge.md) - Status indicators
- [Button](./ai/button.md) - Action buttons
- [Busy/Spinner](./ai/busy.md) - Loading indicators
- [Card](./ai/card.md) - Content containers
- [Checkbox](./ai/checkbox.md) - Checkable inputs
- [Chips](./ai/chips.md) - Compact selection elements
- [Progress](./ai/progress.md) - Progress indicators
</details>

<details>
<summary><strong>Form Elements</strong></summary>

- [Form](./ai/form.md) - Form containers with validation
- [Input](./ai/input.md) - Text input fields
- [Option](./ai/option.md) - Select/autocomplete options
- [Radio Group](./ai/radio-group.md) - Radio button groups
- [Select](./ai/select.md) - Dropdown selection
- [Textarea](./ai/textarea.md) - Multi-line text input
- [Payment Card Form](./ai/payment-card-form.md) - Credit card input
</details>

<details>
<summary><strong>Layout & Navigation</strong></summary>

- [Area](./ai/area.md) - Routing system
- [Content Drawer](./ai/content-drawer.md) - Sliding panels
- [Details](./ai/details.md) - Expandable content
- [Divider](./ai/divider.md) - Visual separators
- [Layout](./ai/layout.md) - Layout utilities (deprecated)
- [Navigation Bar](./ai/navigation-bar.md) - Bottom navigation
- [Navigation Bar Item](./ai/navigation-bar-item.md) - Navigation items
- [Navigation Rail](./ai/navigation-rail.md) - Side navigation
- [Nav Drawer](./ai/nav-drawer.md) - Navigation drawer
- [Sheet](./ai/sheet.md) - Bottom/side sheets
- [Tabs](./ai/tabs.md) - Tabbed interfaces
</details>

<details>
<summary><strong>Feedback & Overlays</strong></summary>

- [Dialog](./ai/dialog.md) - Modal dialogs
- [Dropdown](./ai/dropdown.md) - Floating dropdowns
- [Menu](./ai/menu.md) - Context menus
- [Notification](./ai/notification.md) - Toast notifications
- [Tooltip](./ai/tooltip.md) - Contextual help
</details>

<details>
<summary><strong>Data Display</strong></summary>

- [List](./ai/list.md) - Interactive lists
- [Table](./ai/table.md) - Data tables
- [Tree](./ai/tree.md) - Hierarchical views
- [Slider](./ai/slider.md) - Content carousels
- [Steps](./ai/steps.md) - Step indicators
</details>

<details>
<summary><strong>Utilities & Advanced</strong></summary>

- [Code Highlight](./ai/code-highlight.md) - Syntax highlighting
- [Context](./ai/context.md) - Context API
- [Countries](./ai/countries.md) - Country selector
- [Date Range](./ai/date-range.md) - Date range picker
- [Date Range Inline](./ai/date-range-inline.md) - Inline date picker
- [Delay](./ai/delay.md) - Delayed rendering
- [Directives](./ai/directives.md) - Lit directives
- [Icons](./ai/icons.md) - Material icons
- [Mailbox](./ai/mailbox.md) - Message inbox
- [Map](./ai/map.md) - Map integration
- [Store](./ai/store.md) - State management
- [Surface](./ai/surface.md) - Elevation system
- [Teleport](./ai/teleport.md) - FLIP animations
- [Theme](./ai/theme.md) - Theming system
- [Theme Button](./ai/theme-button.md) - Theme switcher
- [Timezone](./ai/timezone.md) - Timezone selector
- [Typography](./ai/typography.md) - Text styling
- [Typewriter](./ai/typewriter.md) - Typing animations
- [Boat](./ai/boat.md) - Advanced layout system
</details>

### 👨‍💻 Developer Guidelines

If you're contributing to or extending Schmancy, read these essential guides:

- **[CLAUDE.md](./CLAUDE.md)** - Project structure and development workflow
- **[src/CLAUDE.md](./src/CLAUDE.md)** - Library component patterns and architecture
- **[demo/CLAUDE.md](./demo/CLAUDE.md)** - Demo creation and testing patterns

## Component Overview

### Core Categories

| Category | Components | Use Cases |
|----------|-----------|-----------|
| **Buttons & Actions** | Button, Icon Button, FAB | User interactions, form submissions |
| **Form Inputs** | Input, Textarea, Select, Autocomplete, Checkbox, Radio Group | Data collection, user preferences |
| **Navigation** | Tabs, Nav Drawer, Navigation Bar, Area Router | App navigation, content organization |
| **Feedback** | Dialog, Notification, Tooltip, Progress, Busy | User feedback, loading states |
| **Layout** | Surface, Card, Divider, Content Drawer | Content structure, visual hierarchy |
| **Data Display** | Table, List, Tree, Typography | Data presentation, content display |
| **Advanced** | Theme System, Store, Context API | Theming, state management |

### Architecture Highlights

- **$LitElement Mixin** - Base class providing reactive cleanup, classMap, styleMap, and component discovery
- **RxJS Integration** - Built-in reactive patterns with automatic cleanup via `takeUntil(this.disconnecting)`
- **Context System** - Type-safe state management with `@select` decorator and compound selectors
- **Theme System** - Material Design 3 theming with CSS custom properties and Tailwind integration
- **Accessibility First** - ARIA attributes, keyboard navigation, and screen reader support built-in

## Development

### Running the Demo Site

```bash
yarn dev
```

This starts the development server with live reload at `http://localhost:5173`.

### Building the Library

```bash
yarn build
```

Compiles TypeScript and bundles the library to `/dist`.

### Running Tests

```bash
yarn test          # Run tests once
yarn test:watch    # Watch mode
yarn test:ui       # Interactive UI
yarn test:coverage # With coverage report
```

### Project Structure

```plaintext
schmancy/
├── src/              # Library source code
│   ├── Button/       # Component directories
│   ├── Input/
│   └── ...
├── demo/             # Demo site
│   └── src/
│       └── features/ # Component demos
├── ai/               # AI reference docs
├── types/            # TypeScript definitions
└── dist/             # Build output
```

## Contributing

We welcome contributions! Please:

1. Read the [developer guidelines](./CLAUDE.md)
2. Check existing [issues](https://github.com/mhmo91/schmancy/issues)
3. Follow the established patterns in [src/CLAUDE.md](./src/CLAUDE.md)
4. Add demos following [demo/CLAUDE.md](./demo/CLAUDE.md)
5. Ensure tests pass and types are correct
6. Submit a pull request


## Browser Support

Schmancy supports all modern browsers that implement the Web Components standard:

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+


## License

Apache License 2.0 - see [LICENSE](LICENSE) file for details.

## Credits

Built with:
- [Lit](https://lit.dev/) - Efficient web components
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [RxJS](https://rxjs.dev/) - Reactive programming
- [Material Design 3](https://m3.material.io/) - Design system

## Links

- **npm Package**: [@mhmo91/schmancy](https://www.npmjs.com/package/@mhmo91/schmancy)
- **GitHub Repository**: [mhmo91/schmancy](https://github.com/mhmo91/schmancy)
- **Issue Tracker**: [GitHub Issues](https://github.com/mhmo91/schmancy/issues)
- **Demo Site**: [Component Demos](https://schmancy.samwa.ai/)

---

Made with ❤️ by [@mhmo91](https://github.com/mhmo91)
