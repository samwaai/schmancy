# Schmancy Tab Component

A set of Lit web components for creating customizable tabs with a sleek design.

## Installation

```bash
npm install @mhmo91/schmancy
```

## Usage

### SchmancyTabGroup

Use the `schmancy-tab-group` component to create a tab group. This component supports the following properties:

- **activeTab**: Reflects the currently active tab.

#### Example

```html
<schmancy-tab-group activeTab="Tab 1">
	<schmancy-tab active label="Tab 1"> Tab 1 content </schmancy-tab>
	<schmancy-tab label="Tab 2"> Tab 2 content </schmancy-tab>
</schmancy-tab-group>
```

### SchmancyTab

Use the `schmancy-tab` component to create individual tabs within a tab group. This component supports the following properties:

- **label**: The label for the tab.
- **active**: Reflects whether the tab is currently active.

#### Example

```html
<schmancy-tab active label="Passcodes">
	<wand-lock-passcodes .lock="${this.lock}"></wand-lock-passcodes>
</schmancy-tab>
<schmancy-tab label="Activities">
	<wand-lock-activities></wand-lock-activities>
</schmancy-tab>
```

## Styling

Feel free to customize the appearance of the tabs using Tailwind CSS classes.

## Import

```javascript
import '@mhmo91/schmancy/dist/tabs'
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Feel free to adjust the wording or structure as needed. If you have any further requests or modifications, let me know!
