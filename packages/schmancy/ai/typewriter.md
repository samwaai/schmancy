# Typewriter Component

An engaging text animation component that simulates typing effects with customizable speed, delays, and advanced sequencing capabilities.

## Quick Start

```html
<!-- Basic typewriter effect -->
<schmancy-typewriter>
  Hello, World! This text will be typed out character by character.
</schmancy-typewriter>

<!-- With custom speed -->
<schmancy-typewriter speed="30" delay="500">
  Fast typing with a delay before starting.
</schmancy-typewriter>

<!-- With actions -->
<schmancy-typewriter>
  Type this first.
  <span action="pause" value="1000"></span>
  Then type this after a pause.
  <span action="delete" value="10"></span>
  And finally this!
</schmancy-typewriter>
```

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `speed` | `number` | `50` | Typing speed (ms per character) |
| `delay` | `number` | `0` | Initial delay before typing starts |
| `autoStart` | `boolean` | `true` | Start typing automatically |
| `cursorChar` | `string` | `''` | Custom cursor character |
| `deleteSpeed` | `number` | `25` | Speed for deletion (ms per character) |
| `once` | `boolean` | `true` | Only animate once per session |

## Events

### typeit-complete
Fired when typing animation completes.

```javascript
element.addEventListener('typeit-complete', () => {
  console.log('Typing finished!');
});
```

## Examples

### Hero Section
```html
<div class="hero">
  <h1>
    <schmancy-typewriter speed="100" delay="300">
      Welcome to the Future
    </schmancy-typewriter>
  </h1>
  <p>
    <schmancy-typewriter delay="2000" speed="40">
      Where innovation meets possibility.
    </schmancy-typewriter>
  </p>
</div>
```

### Multi-line Typing
```html
<schmancy-typewriter speed="60">
  <p>First paragraph of text.</p>
  <p>Second paragraph appears on a new line.</p>
  <p>Third paragraph continues the story.</p>
</schmancy-typewriter>
```

### Terminal Effect
```html
<div class="terminal">
  <schmancy-typewriter cursorChar="|" speed="30">
    $ npm install schmancy-ui
    <span action="pause" value="500"></span>
    <p>Installing dependencies...</p>
    <span action="pause" value="1000"></span>
    <p>✓ Installation complete!</p>
  </schmancy-typewriter>
</div>
```

### Dynamic Typing Sequence
```html
<schmancy-typewriter>
  We are
  <span action="pause" value="500"></span>
  developers
  <span action="delete" value="10"></span>
  designers
  <span action="delete" value="9"></span>
  innovators
  <span action="pause" value="1000"></span>
  !
</schmancy-typewriter>
```

### Code Tutorial
```html
<schmancy-typewriter speed="40">
  <code>
    function greet(name) {
      <span action="pause" value="300"></span>
      return `Hello, ${name}!`;
      <span action="pause" value="300"></span>
    }
  </code>
</schmancy-typewriter>
```

## Actions System

Special action elements control typing behavior:

| Action | Value | Description |
|--------|-------|-------------|
| `pause` | milliseconds | Pause typing for specified duration |
| `delete` | character count | Delete specified number of characters |

```html
<span action="pause" value="1000"></span> <!-- 1 second pause -->
<span action="delete" value="5"></span> <!-- Delete 5 characters -->
```

## Features

### Session Memory
When `once` is true, remembers completion state per session:
- Uses sessionStorage with content hash
- Skips animation on repeat views
- Clears on session end

### Context Integration
Inherits delay from parent `schmancy-delay` components:

```html
<schmancy-delay delay="1000">
  <schmancy-typewriter> <!-- Inherits 1000ms delay -->
    This starts typing after 1 second
  </schmancy-typewriter>
</schmancy-delay>
```

### Intersection Observer
Only starts typing when element is in viewport:
- Efficient performance
- Better user experience
- Automatic trigger on scroll

### TypeIt Integration
Powered by the TypeIt library for smooth, reliable animations.

## Styling

```css
/* Hide cursor after completion */
schmancy-typewriter {
  --ti-cursor-display: none;
}

/* Custom cursor styling */
schmancy-typewriter .ti-cursor {
  color: var(--schmancy-sys-color-primary-default);
  font-weight: normal;
}
```

## Advanced Configuration

```javascript
// TypeIt options passed through
const typeItOptions = {
  speed: this.speed,
  startDelay: this.delay,
  cursor: !!this.cursorChar,
  cursorChar: this.cursorChar,
  deleteSpeed: this.deleteSpeed,
  afterComplete: () => {
    // Custom completion logic
  }
};
```

## Accessibility

- Uses `aria-live="polite"` for screen reader support
- Completed text remains in DOM
- Semantic HTML structure maintained

## Best Practices

1. **Speed**: 40-80ms for comfortable reading speed
2. **Delays**: Use pauses for emphasis
3. **Content**: Keep animations short and meaningful
4. **Performance**: Limit concurrent typewriters
5. **Mobile**: Test on various devices

## Related Components

- [Animated Text](./animated-text.md) - Word/letter animations
- [Delay](./delay.md) - Coordinated delays
- [Typography](./typography.md) - Text styling

## Use Cases

1. **Landing Pages**: Engaging hero text
2. **Tutorials**: Step-by-step code examples
3. **Storytelling**: Narrative experiences
4. **Loading States**: Entertaining wait messages
5. **Terminal UIs**: Command-line interfaces