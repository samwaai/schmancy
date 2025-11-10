# Typewriter Component

An engaging text animation component that simulates typing effects with customizable speed, delays, and advanced sequencing capabilities. Features a simple API for cycling through text with automatic character deletion.

## Quick Start

```html
<!-- Basic typewriter effect -->
<schmancy-typewriter>
  Hello, World! This text will be typed out character by character.
</schmancy-typewriter>

<!-- Cycling through words (auto-calculates delete counts) -->
<schmancy-typewriter>
  We are <span cycle="developers | designers | innovators"></span>
</schmancy-typewriter>

<!-- With custom speed and cursor -->
<schmancy-typewriter speed="30" delay="500" cursorChar="|">
  Fast typing with a blinking cursor.
</schmancy-typewriter>

<!-- Infinite loop -->
<schmancy-typewriter loop>
  This will type and delete forever!
  <span cycle="Amazing | Incredible | Fantastic"></span>
</schmancy-typewriter>
```

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `speed` | `number` | `50` | Typing speed (ms per character) |
| `delay` | `number` | `0` | Initial delay before typing starts |
| `autoStart` | `boolean` | `true` | Start typing automatically |
| `cursorChar` | `string` | `''` | Custom cursor character (empty = no cursor) |
| `deleteSpeed` | `number` | `25` | Speed for deletion (ms per character) |
| `cyclePause` | `number` | `1500` | Default pause between cycle items (ms) |
| `once` | `boolean` | `true` | Only animate once per session |
| `loop` | `boolean` | `false` | Loop animation infinitely (overrides `once`) |

## Events

### typeit-complete
Fired when typing animation completes.

```javascript
element.addEventListener('typeit-complete', () => {
  console.log('Typing finished!');
});
```

## Examples

### Hero Section with Cycling
```html
<div class="hero">
  <h1>
    <schmancy-typewriter speed="100" delay="300">
      Welcome to the <span cycle="Future | Innovation | Revolution"></span>
    </schmancy-typewriter>
  </h1>
  <p>
    <schmancy-typewriter delay="2000" speed="40">
      Where innovation meets possibility.
    </schmancy-typewriter>
  </p>
</div>
```

### Rotating Value Propositions
```html
<schmancy-typewriter speed="80" cyclePause="1200">
  Building systems that are
  <br />
  <span cycle="Trustless | Permissionless | Transparent | Borderless | Resilient" pause="1500"></span>
  <br />
  empowering everyone to operate freely.
</schmancy-typewriter>
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

### Product Features Carousel
```html
<schmancy-typewriter loop cursorChar="_">
  <span cycle="Lightning Fast ⚡ | Fully Typed 📘 | Zero Config 🎯 | Production Ready 🚀"></span>
</schmancy-typewriter>
```

### Dynamic Job Titles
```html
<h2>
  We're hiring <span cycle="Frontend Developers | Backend Engineers | UI/UX Designers | DevOps Specialists"></span>
</h2>
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

## Cycling API (NEW!)

The `cycle` attribute makes it effortless to rotate through text with **automatic character deletion**. No need to manually count characters!

### Basic Usage

```html
<!-- Simple cycling -->
<span cycle="Option 1 | Option 2 | Option 3"></span>

<!-- With custom pause duration -->
<span cycle="Fast | Quick | Rapid" pause="800"></span>

<!-- In context -->
<schmancy-typewriter>
  We are <span cycle="developers | designers | innovators"></span>
</schmancy-typewriter>
```

### Cycle Attributes

| Attribute | Type | Description |
|-----------|------|-------------|
| `cycle` | `string` | Pipe-separated list of text items to cycle through |
| `pause` | `number` | Override default pause between items (milliseconds) |

### Benefits

- ✅ **Auto-calculated deletes** - no manual character counting
- ✅ **Clean syntax** - just list your items with `|` separator
- ✅ **Consistent timing** - uses `cyclePause` property or custom `pause`
- ✅ **Works with `loop`** - infinite cycling made simple

### Advanced Cycling

```html
<!-- Hero headline that cycles forever -->
<schmancy-typewriter loop cyclePause="2000">
  <h1>Welcome to <span cycle="the Future | Innovation | Tomorrow"></span></h1>
</schmancy-typewriter>

<!-- Mixed static and cycling text -->
<schmancy-typewriter>
  Our product is
  <span action="pause" value="500"></span>
  <span cycle="Fast ⚡ | Secure 🔒 | Reliable ✅ | Modern 🚀" pause="1800"></span>
  for your business.
</schmancy-typewriter>
```

## Actions System

Special action elements for fine-grained control:

| Action | Value | Description |
|--------|-------|-------------|
| `pause` | milliseconds | Pause typing for specified duration |
| `delete` | character count | Delete specified number of characters (manual) |

```html
<span action="pause" value="1000"></span> <!-- 1 second pause -->
<span action="delete" value="5"></span> <!-- Delete 5 characters manually -->
```

**Note:** For cycling text with automatic deletion, use the `cycle` attribute instead!

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

### Perfect for:

1. **Hero Headlines**: Rotating value propositions and key messages
   ```html
   <span cycle="Fast | Secure | Reliable"></span>
   ```

2. **Product Features**: Cycling through benefits and capabilities
   ```html
   <span cycle="Zero Config 🎯 | Type-Safe 📘 | Lightning Fast ⚡"></span>
   ```

3. **Job Postings**: Dynamic role descriptions
   ```html
   We're hiring <span cycle="Developers | Designers | Engineers"></span>
   ```

4. **Testimonials**: Rotating customer quotes
   ```html
   <span cycle="Amazing product! | Best tool ever! | Game changer!"></span>
   ```

5. **Tutorials**: Step-by-step code examples with timing
6. **Storytelling**: Narrative experiences with dramatic pauses
7. **Loading States**: Entertaining wait messages that cycle
8. **Terminal UIs**: Command-line interface simulations

## Migration Guide

### From Manual Deletes to Cycle API

**Before (Manual counting - error prone!):**
```html
<schmancy-typewriter>
  We are
  developers
  <span action="delete" value="10"></span>
  designers
  <span action="delete" value="9"></span>
  innovators
</schmancy-typewriter>
```

**After (Automatic - clean & simple!):**
```html
<schmancy-typewriter>
  We are <span cycle="developers | designers | innovators"></span>
</schmancy-typewriter>
```

### Benefits of the New API

- 🚫 **No more counting characters** - automatic deletion
- ✨ **Cleaner markup** - one line instead of many
- 🛡️ **Less error-prone** - no typos in character counts
- 🔄 **Easy updates** - just add/remove words from the list
- 🎨 **Better readability** - see all options at a glance