# Mo Kit

Mo Kit is a collection of web components built using Lit Element and RxJS. This project aims to provide a set of reusable components that can enhance the user experience and simplify development in web applications.

## Components

### Mo-Teleport

The `mo-teleport` component allows you to dynamically move elements in the DOM without losing their state. It provides a convenient way to teleport elements from one location to another within your web application. With `mo-teleport`, you can easily create smooth transitions and animations when elements need to be moved around.

#### Usage

```html
<mo-teleport to="destination">
  <!-- Elements to be teleported -->
</mo-teleport>
```

- The `to` attribute specifies the destination where the elements will be teleported. It can be an element ID or a CSS selector.

### Mo-Animate

The `mo-animate` component provides a simple yet powerful way to add animations to your web application. It leverages the power of RxJS to create smooth and interactive animations that can bring your UI to life. With `mo-animate`, you can easily define animations based on events or time intervals.

#### Usage

```html
<mo-animate
  @start="${handleAnimationStart}"
  @end="${handleAnimationEnd}"
  .duration="${300}"
  .easing="${'ease-out'}"
>
  <!-- Elements to be animated -->
</mo-animate>
```

- The `start` and `end` events allow you to listen for animation start and end events respectively.
- The `duration` attribute specifies the duration of the animation in milliseconds.
- The `easing` attribute defines the easing function to be used for the animation.

## Getting Started

To use Mo Kit in your project, follow these steps:

1. Install the package using your preferred package manager:

   ```bash
   npm install mo-kit
   ```

2. Import the components you want to use in your JavaScript or TypeScript file:

   ```javascript
   import { MoTeleport, MoAnimate } from "mo-kit";
   ```

3. Use the components in your HTML templates:

   ```html
   <mo-teleport to="#destination">
     <!-- Elements to be teleported -->
   </mo-teleport>

   <mo-animate
     @start="${handleAnimationStart}"
     @end="${handleAnimationEnd}"
     .duration="${300}"
     .easing="${'ease-out'}"
   >
     <!-- Elements to be animated -->
   </mo-animate>
   ```

4. Customize the components and explore their various options according to your specific needs. Refer to the documentation for detailed information on available properties, events, and methods.

## Contributing

Contributions to Mo Kit are welcome! If you would like to contribute, please follow the guidelines outlined in the [CONTRIBUTING.md](CONTRIBUTING.md) file.

## License

Mo Kit is released under the [MIT License](LICENSE).

## Acknowledgments

Mo Kit is built on top of the amazing Lit Element and RxJS libraries. We would like to express our gratitude to the respective development teams for their hard work and dedication.

## Contact

For any questions, suggestions, or feedback, please reach out to the project maintainers at [mo-kit@example.com](mailto:mo-kit@example.com).
