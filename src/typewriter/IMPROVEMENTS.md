# Schmancy Typewriter - v2.0 Improvements

## Overview
The typewriter component has been significantly enhanced with a cleaner, more intuitive API that eliminates manual character counting and makes cycling text effortless.

## Key Improvements

### 1. **Cycle API - No More Manual Counting! 🎉**

**Before (Error-prone):**
```html
<schmancy-typewriter>
  We are developers
  <span action="delete" value="10"></span>  <!-- Had to count: "developers" = 10 chars -->
  designers
  <span action="delete" value="9"></span>   <!-- Had to count: "designers" = 9 chars -->
  innovators
</schmancy-typewriter>
```

**After (Clean & Simple):**
```html
<schmancy-typewriter>
  We are <span cycle="developers | designers | innovators"></span>
</schmancy-typewriter>
```

**Benefits:**
- ✅ Automatic character deletion
- ✅ No counting required
- ✅ Less error-prone
- ✅ Easier to maintain
- ✅ More readable

### 2. **Infinite Looping Support**

```html
<schmancy-typewriter loop>
  <span cycle="Amazing | Incredible | Fantastic"></span>
</schmancy-typewriter>
```

The animation now supports infinite cycling - perfect for hero sections and attention-grabbing headlines.

### 3. **Flexible Pause Controls**

```html
<!-- Global pause for all cycles -->
<schmancy-typewriter cyclePause="2000">
  <span cycle="Fast | Secure | Reliable"></span>
</schmancy-typewriter>

<!-- Override pause for specific cycle -->
<span cycle="Option1 | Option2 | Option3" pause="800"></span>
```

### 4. **Backward Compatible**

All old features still work:
- `action="pause"`
- `action="delete"`
- All existing properties

## New Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `cyclePause` | `number` | `1500` | Default pause between cycle items (ms) |
| `loop` | `boolean` | `false` | Loop animation infinitely |

## New Attributes (on `<span>` elements)

| Attribute | Type | Description |
|-----------|------|-------------|
| `cycle` | `string` | Pipe-separated list of text to cycle through |
| `pause` | `number` | Override cyclePause for this specific cycle |

## Real-World Example

**Samwa Homepage - Before:**
```html
<schmancy-typewriter speed="80" delay="500">
  Building systems that are
  <span action="pause" value="800"></span>
  <br />
  Trustless
  <span action="pause" value="1200"></span>
  <span action="delete" value="9"></span>
  Permissionless
  <span action="pause" value="1200"></span>
  <span action="delete" value="14"></span>
  Transparent
  <span action="pause" value="1200"></span>
  <span action="delete" value="11"></span>
  Borderless
  <span action="pause" value="1200"></span>
  <span action="delete" value="10"></span>
  Resilient
  <span action="pause" value="1500"></span>
  <br />
  empowering everyone to operate freely.
</schmancy-typewriter>
```

**Samwa Homepage - After:**
```html
<schmancy-typewriter speed="80" delay="500" cyclePause="1200">
  Building systems that are
  <span action="pause" value="800"></span>
  <br />
  <span cycle="Trustless | Permissionless | Transparent | Borderless | Resilient" pause="1500"></span>
  <br />
  empowering everyone to operate freely.
</schmancy-typewriter>
```

**Line reduction:** 20 lines → 10 lines (50% reduction!)

## Migration Guide

### Simple Cycle Pattern

```diff
- We are developers
- <span action="delete" value="10"></span>
- designers
- <span action="delete" value="9"></span>
- innovators
+ We are <span cycle="developers | designers | innovators"></span>
```

### With Pauses

```diff
- Feature 1
- <span action="pause" value="1500"></span>
- <span action="delete" value="9"></span>
- Feature 2
- <span action="pause" value="1500"></span>
- <span action="delete" value="9"></span>
- Feature 3
+ <span cycle="Feature 1 | Feature 2 | Feature 3" pause="1500"></span>
```

## Use Cases

Perfect for:
1. **Hero headlines** - Rotating value propositions
2. **Product features** - Cycling through benefits
3. **Job postings** - Dynamic role descriptions
4. **Testimonials** - Rotating quotes
5. **Brand values** - Cycling through company values

## Technical Details

### Implementation
- Auto-calculates string lengths for deletion
- Respects global `cyclePause` or element-specific `pause`
- Integrates seamlessly with TypeIt library
- Supports `loop` mode for infinite cycling
- Maintains backward compatibility

### Performance
- No performance impact
- Same TypeIt engine underneath
- Just smarter API on top

## Testing

See `test-typewriter.html` for interactive examples.

## Documentation

Full documentation updated in `/packages/schmancy/ai/typewriter.md`
