# Schmancy Typography Component

`schmancy-typography` is a customizable LitElement component for displaying styled typography based on the Schmancy design system. It provides a simple way to create consistent and visually appealing text elements in your web application.

## Installation

```bash
npm install
```

````

## Usage

### Import the Component

```javascript
import '@mhmo91/schmancy/typography'
```

### Use the Component in HTML

```html
<schmancy-typography color="primary" type="body" token="medium" align="left" weight="normal">
  Your text goes here.
</schmancy-typography>
```

### Properties

- `color`: Color of the typography. Possible values: 'primary', 'primary-muted', 'secondary', 'success', 'error', 'warning', 'white', or null.
- `type`: Type of the typography. Possible values: 'display', 'headline', 'title', 'body', 'label'.
- `token`: Token of the typography. Possible values: 'small', 'medium', 'large'.
- `align`: Alignment of the text. Possible values: 'left', 'center', 'justify', 'right'.
- `weight`: Font weight. Possible values: 'normal', 'bold'.

### Styling

The component uses Tailwind CSS for styling. You can further customize the appearance by applying Tailwind utility classes.

## Development

To run the development server:

```bash
npm run dev
```

## Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature`)
3. Make changes and commit (`git commit -am 'Add feature'`)
4. Push to the branch (`git push origin feature`)
5. Create a pull request

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

```

Remember to replace placeholders like `@your-namespace/schmancy-typography` and provide actual details about your project, such as license information. Additionally, if there are specific build or configuration steps required, you should include those in the documentation.
```
````
