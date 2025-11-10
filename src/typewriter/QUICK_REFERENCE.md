# Typewriter Quick Reference

## Basic Usage

```html
<!-- Simple typing -->
<schmancy-typewriter>
  Hello, World!
</schmancy-typewriter>

<!-- With speed and delay -->
<schmancy-typewriter speed="80" delay="500">
  This starts typing after 500ms at 80ms per character
</schmancy-typewriter>
```

## Cycling Text (NEW! ⭐)

```html
<!-- Simple cycle -->
<span cycle="Option1 | Option2 | Option3"></span>

<!-- With custom pause -->
<span cycle="Fast | Quick | Rapid" pause="800"></span>

<!-- Complete example -->
<schmancy-typewriter speed="80" cyclePause="1200">
  We are <span cycle="developers | designers | innovators"></span>
</schmancy-typewriter>
```

## Looping (NEW! ⭐)

```html
<!-- Cycle forever -->
<schmancy-typewriter loop>
  <span cycle="Amazing | Incredible | Fantastic"></span>
</schmancy-typewriter>

<!-- With cursor -->
<schmancy-typewriter loop cursorChar="|">
  <span cycle="Fast ⚡ | Secure 🔒 | Reliable ✅"></span>
</schmancy-typewriter>
```

## Actions (Classic API)

```html
<!-- Pause -->
<span action="pause" value="1000"></span>

<!-- Manual delete -->
<span action="delete" value="5"></span>

<!-- Combined -->
<schmancy-typewriter>
  Type this first.
  <span action="pause" value="1000"></span>
  Then this after a pause.
</schmancy-typewriter>
```

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `speed` | number | 50 | Typing speed (ms per char) |
| `delay` | number | 0 | Initial delay (ms) |
| `deleteSpeed` | number | 25 | Delete speed (ms per char) |
| `cyclePause` | number | 1500 | Pause between cycles (ms) |
| `cursorChar` | string | '' | Cursor character (empty = none) |
| `loop` | boolean | false | Loop infinitely |
| `once` | boolean | true | Only animate once per session |
| `autoStart` | boolean | true | Start automatically |

## Common Patterns

### Hero Headline
```html
<schmancy-typewriter speed="100" delay="300">
  Welcome to the <span cycle="Future | Innovation | Revolution"></span>
</schmancy-typewriter>
```

### Product Features
```html
<schmancy-typewriter cyclePause="2000">
  Our product is <span cycle="Fast ⚡ | Secure 🔒 | Reliable ✅ | Modern 🚀"></span>
</schmancy-typewriter>
```

### Job Posting
```html
<h2>
  We're hiring <span cycle="Frontend Developers | Backend Engineers | UI/UX Designers"></span>
</h2>
```

### Value Propositions
```html
<schmancy-typewriter speed="80" cyclePause="1200">
  Building systems that are
  <br />
  <span cycle="Trustless | Permissionless | Transparent | Borderless | Resilient" pause="1500"></span>
  <br />
  empowering everyone to operate freely.
</schmancy-typewriter>
```

### Terminal Effect
```html
<schmancy-typewriter cursorChar="|" speed="30">
  $ npm install schmancy-ui
  <span action="pause" value="500"></span>
  <p>Installing dependencies...</p>
  <span action="pause" value="1000"></span>
  <p>✓ Installation complete!</p>
</schmancy-typewriter>
```

## Events

```javascript
element.addEventListener('typeit-complete', () => {
  console.log('Typing finished!');
});
```

## Tips

1. **Speed**: 40-80ms for comfortable reading
2. **Delays**: Use pauses for emphasis
3. **Cycling**: Use for rotating content
4. **Looping**: Great for hero sections
5. **Cursor**: Only use when needed (terminal effects)

## When to Use What

| Use Case | Recommended API |
|----------|----------------|
| Rotating words | `cycle` attribute |
| Simple pause | `action="pause"` |
| Manual delete | `action="delete"` |
| Forever animation | `loop` property |
| Hero headlines | `cycle` + `cyclePause` |
| Complex timing | Classic `action` API |

## Migration Examples

### Before (Manual counting)
```html
Fast
<span action="pause" value="1500"></span>
<span action="delete" value="4"></span>
Secure
<span action="pause" value="1500"></span>
<span action="delete" value="6"></span>
Reliable
```

### After (Automatic)
```html
<span cycle="Fast | Secure | Reliable" pause="1500"></span>
```

**Lines reduced:** 7 → 1 (86% reduction!)
