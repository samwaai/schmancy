# Schmancy UI Library

Schmancy is a UI library built as web components, designed to provide a collection of reusable and customizable UI elements for modern web applications. It offers an uncomplicated implementation of Material Design 3 (M3), with minor deviations, utilizing [lit.dev](https://lit.dev/) and [Tailwind CSS](https://tailwindcss.com/), and employs [Vite](https://vitejs.dev/) as the build process.

## Features

- **Web Components**: Built using the Web Components standard, ensuring encapsulation and reusability across different projects.
- **Material Design 3**: Adheres to M3 guidelines, providing a modern and cohesive design language.
- **Customizable**: Easily style and configure components to match your application's design requirements.
- **Lightweight**: Minimal dependencies to keep your application performant.

## Installation

To install Schmancy
use yarn:
```bash
yarn add @mhmo91/schmancy
```
use npm:
```bash
npm install @mhmo91/schmancy
```


Alternatively, if you're using Yarn:

```bash
yarn add @mhmo91/schmancy
```

## Usage

After installation, you can import and use Schmancy components in your project.

### Importing All Components

To import all components:

```javascript
import '@mhmo91/schmancy'
```

This will make all Schmancy components available for use in your application.

### Importing Individual Components

To import a specific component, such as the `schmancy-button`:

```javascript
import '@mhmo91/schmancy/button'
```

This will load only the `schmancy-button` component, which can be used as follows:

```html
<schmancy-button>Click Me</schmancy-button>
```

_Note: Replace `'button'` with the desired component name to import other components individually._

## Documentation

For detailed documentation and examples, please visit the [Schmancy Wiki](https://github.com/mhmo91/schmancy/wiki).

Below is a table linking to each component’s documentation on the GitHub Wiki:

| Component                 | Description                     | Documentation                                                                                     |
| ------------------------- | ------------------------------- | ------------------------------------------------------------------------------------------------- |
| `schmancy-area`           | Area component                  | [Wiki - schmancy-area](https://github.com/mhmo91/schmancy/wiki/schmancy-area)                     |
| `schmancy-typewriter`     | Typewriter component            | [Wiki - schmancy-area](https://github.com/mhmo91/schmancy/wiki/schmancy-typewriter)               |
| `schmancy-autocomplete`   | Autocomplete field              | [Wiki - schmancy-autocomplete](https://github.com/mhmo91/schmancy/wiki/schmancy-autocomplete)     |
| `schmancy-busy`           | Loading/busy indicator          | [Wiki - schmancy-busy](https://github.com/mhmo91/schmancy/wiki/schmancy-busy)                     |
| `schmancy-button`         | Customizable button             | [Wiki - schmancy-button](https://github.com/mhmo91/schmancy/wiki/schmancy-button)                 |
| `schmancy-card`           | Card for content display        | [Wiki - schmancy-card](https://github.com/mhmo91/schmancy/wiki/schmancy-card)                     |
| `schmancy-checkbox`       | Checkbox component              | [Wiki - schmancy-checkbox](https://github.com/mhmo91/schmancy/wiki/schmancy-checkbox)             |
| `schmancy-chips`          | Chips for display or selection  | [Wiki - schmancy-chips](https://github.com/mhmo91/schmancy/wiki/schmancy-chips)                   |
| `schmancy-content-drawer` | Collapsible drawer component    | [Wiki - schmancy-content-drawer](https://github.com/mhmo91/schmancy/wiki/schmancy-content-drawer) |
| `schmancy-divider`        | Divider for separating sections | [Wiki - schmancy-divider](https://github.com/mhmo91/schmancy/wiki/schmancy-divider)               |
| `schmancy-form`           | Form component                  | [Wiki - schmancy-form](https://github.com/mhmo91/schmancy/wiki/schmancy-form)                     |
| `schmancy-icons`          | Icon set                        | [Wiki - schmancy-icons](https://github.com/mhmo91/schmancy/wiki/schmancy-icons)                   |
| `schmancy-input`          | Input field component           | [Wiki - schmancy-input](https://github.com/mhmo91/schmancy/wiki/schmancy-input)                   |
| `schmancy-layout`         | Layout utility                  | [Wiki - schmancy-layout](https://github.com/mhmo91/schmancy/wiki/schmancy-layout)                 |
| `schmancy-list`           | List component                  | [Wiki - schmancy-list](https://github.com/mhmo91/schmancy/wiki/schmancy-list)                     |
| `schmancy-menu`           | Menu component                  | [Wiki - schmancy-menu](https://github.com/mhmo91/schmancy/wiki/schmancy-menu)                     |
| `schmancy-nav-drawer`     | Navigation drawer               | [Wiki - schmancy-nav-drawer](https://github.com/mhmo91/schmancy/wiki/schmancy-nav-drawer)         |
| `schmancy-notification`   | Notification component          | [Wiki - schmancy-notification](https://github.com/mhmo91/schmancy/wiki/schmancy-notification)     |
| `schmancy-option`         | Option selector                 | [Wiki - schmancy-option](https://github.com/mhmo91/schmancy/wiki/schmancy-option)                 |
| `schmancy-radio-group`    | Radio button group              | [Wiki - schmancy-radio-group](https://github.com/mhmo91/schmancy/wiki/schmancy-radio-group)       |
| `schmancy-select`         | Select dropdown                 | [Wiki - schmancy-select](https://github.com/mhmo91/schmancy/wiki/schmancy-select)                 |
| `schmancy-sheet`          | Sheet component                 | [Wiki - schmancy-sheet](https://github.com/mhmo91/schmancy/wiki/schmancy-sheet)                   |
| `schmancy-surface`        | Surface element                 | [Wiki - schmancy-surface](https://github.com/mhmo91/schmancy/wiki/schmancy-surface)               |
| `schmancy-table`          | Table component                 | [Wiki - schmancy-table](https://github.com/mhmo91/schmancy/wiki/schmancy-table)                   |
| `schmancy-tabs`           | Tabbed navigation               | [Wiki - schmancy-tabs](https://github.com/mhmo91/schmancy/wiki/schmancy-tabs)                     |
