# Schmancy Autocomplete

The `schmancy-autocomplete` is a lightweight and customizable autocomplete web component built with [Lit](https://lit.dev/). It offers an intuitive interface for users to search and select options, supporting both single and multiple selections.

## Features

- **Dynamic Filtering:** Efficiently filters options based on user input using Levenshtein distance.
- **Single & Multiple Selection:** Choose between single or multiple options.
- **Accessible:** Supports keyboard navigation and screen readers.
- **Smart Positioning:** Utilizes Floating UI for optimal dropdown placement.

## Installation

### Using npm

To add `schmancy-autocomplete` to your project, install the `@mhmo91/schmancy` package via npm:

```bash
npm install @mhmo91/schmancy
```

Then, import the schmancy-autocomplete component into your application:

```js
import '@mhmo91/schmancy/autocomplete'
```

### Using a CDN (unpkg.com)

Alternatively, you can include the schmancy-autocomplete component directly in your HTML using a CDN like unpkg.com. This method doesn’t require npm installation and is ideal for quick prototypes or simple projects.

```html
<script type="module" src="https://unpkg.com/@mhmo91/schmancy/dist/autocomplete.js"></script>
```

## Usage

Lit Element Example with Multiple Use Cases

Below is a comprehensive example demonstrating various use cases of the schmancy-autocomplete component within a single LitElement-based component. This example showcases: 1. Single Selection: Users can select one option. 2. Multiple Selection: Users can select multiple options. 3. Custom Trigger: Using a custom trigger element.

1. Create the Lit Element Component

Create a new JavaScript module, for example, example-autocomplete.js:

```js
// example-autocomplete.js
import { LitElement, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import '@mhmo91/schmancy/autocomplete.js'
import '@mhmo91/schmancy/option.js'

@customElement('example-autocomplete')
export class ExampleAutocomplete extends LitElement {
	@state()
	singleSelectedValue = ''

	@state()
	multipleSelectedValues = []

	handleSingleChange(event) {
		this.singleSelectedValue = event.detail.value
		console.log('Single Selected Value:', this.singleSelectedValue)
	}

	handleMultipleChange(event) {
		// Use the new values property for array access
		this.multipleSelectedValues = event.detail.values || []
		console.log('Multiple Selected Values:', this.multipleSelectedValues)
		
		// Legacy value is also available as a comma-separated string
		console.log('Legacy value format:', event.detail.value)
	}

	render() {
		return html`
			<h2>Single Selection</h2>
			<schmancy-autocomplete
				label="Choose an option"
				placeholder="Start typing..."
				@change=${this.handleSingleChange}
				maxHeight="30vh"
			>
				<schmancy-option value="option1" label="Option 1"></schmancy-option>
				<schmancy-option value="option2" label="Option 2"></schmancy-option>
				<schmancy-option value="option3" label="Option 3"></schmancy-option>
				<schmancy-option value="option4" label="Option 4"></schmancy-option>
			</schmancy-autocomplete>
			<p>Selected Value: ${this.singleSelectedValue}</p>

			<hr />

			<h2>Multiple Selection</h2>
			<schmancy-autocomplete
				label="Select your hobbies"
				placeholder="Type to search..."
				multi
				@change=${this.handleMultipleChange}
				maxHeight="35vh"
			>
				<schmancy-option value="reading" label="Reading"></schmancy-option>
				<schmancy-option value="traveling" label="Traveling"></schmancy-option>
				<schmancy-option value="gaming" label="Gaming"></schmancy-option>
				<schmancy-option value="cooking" label="Cooking"></schmancy-option>
				<schmancy-option value="gardening" label="Gardening"></schmancy-option>
			</schmancy-autocomplete>
			<p>Selected Hobbies: ${this.multipleSelectedValues.join(', ')}</p>

			<hr />

			<h2>Custom Trigger</h2>
			<schmancy-autocomplete>
				<!-- Custom trigger button -->
				<button slot="trigger">Open Autocomplete</button>

				<schmancy-option value="custom1" label="Custom Option 1"></schmancy-option>
				<schmancy-option value="custom2" label="Custom Option 2"></schmancy-option>
				<schmancy-option value="custom3" label="Custom Option 3"></schmancy-option>
			</schmancy-autocomplete>
		`
	}
}
```

2. Use the Lit Element Component in Your Application

Include your custom Lit component in your HTML file, for example, index.html:

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<title>Schmancy Autocomplete with Lit</title>
		<!-- Import Lit library -->
		<script type="module" src="https://unpkg.com/lit@2.6.1/index.js"></script>
		<!-- Import the Schmancy Autocomplete component from unpkg.com -->
		<script type="module" src="https://unpkg.com/@mhmo91/schmancy/dist/autocomplete.js"></script>
		<!-- Import your custom Lit component -->
		<script type="module" src="./example-autocomplete.js"></script>
	</head>
	<body>
		<example-autocomplete></example-autocomplete>
	</body>
</html>
```

## API Documentation

### Properties

| Property      | Type      | Description                                                                                      |
|---------------|-----------|--------------------------------------------------------------------------------------------------|
| `value`       | `string`  | For single-select: the selected value. For multi-select: comma-separated list (legacy support).  |
| `values`      | `string[]`| Array of selected values for multi-select mode (preferred API for multi-select).                 |
| `multi`       | `boolean` | Enable multi-select mode. Default: `false`                                                       |
| `label`       | `string`  | Label displayed above the input.                                                                 |
| `placeholder` | `string`  | Input placeholder text.                                                                          |
| `required`    | `boolean` | Mark the input as required for form validation.                                                  |
| `maxHeight`   | `string`  | Maximum height of the dropdown. Default: `'300px'`                                               |
| `autocomplete`| `string`  | Value for the input's autocomplete attribute. Default: `'off'`                                   |
| `size`        | `string`  | Size of the input field: 'sm', 'md', 'lg'. Default: `'md'`                                       |
| `debounceMs`  | `number`  | Debounce delay in milliseconds for filtering. Default: `200`                                     |
| `description` | `string`  | Description text for screen readers.                                                             |

### Events

| Event    | Detail                                                | Description                          |
|----------|-------------------------------------------------------|--------------------------------------|
| `change` | `{ value: string \| string[], values?: string[] }`    | Fired when selection changes.        |

The `change` event for multi-select now includes both:
- `detail.value`: Comma-separated string of values (legacy support)
- `detail.values`: Array of selected values (new preferred API)

### Usage Example with the New API

```js
// Setting values with the new API
const autocomplete = document.querySelector('schmancy-autocomplete');

// For single-select:
autocomplete.value = 'option1';

// For multi-select:
autocomplete.values = ['option1', 'option2', 'option3'];

// Using the component with Lit
html`
  <schmancy-autocomplete
    multi
    .values=${this.selectedValues}
    @change=${(e) => {
      // Use the new array values property
      this.selectedValues = e.detail.values || [];
    }}
  >
    <!-- options -->
  </schmancy-autocomplete>
`;
```

## License

This project is licensed under the MIT License.
