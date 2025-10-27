# Schmancy Animated Text - AI Reference

```js
// Animated Text Component
<schmancy-animated-text
  ease="outExpo"
  delay="0"
  stagger="50"
  duration="750"
  scale="[0, 1]"
  opacity="[0, 1]"
  translateX="['0.55em', '0em']"
  translateY="['1.1em', '0em']"
  rotate3d="[0, 0, 1, 45]">
  Text to animate
</schmancy-animated-text>

// Animation Properties
ease: string           // Animation easing function (default: "outExpo")
delay: number          // Initial delay in milliseconds (default: 0)
stagger: number        // Delay between letter animations (default: 50)
duration: number       // Animation duration in milliseconds (default: 750)
scale: number[]        // Scale transformation [from, to] (default: [0, 1])
opacity: number[]      // Opacity transition [from, to] (default: [0, 1])
translateX: string[]   // X translation ["from", "to"] (default: ['0.55em', '0em'])
translateY: string[]   // Y translation ["from", "to"] (default: ['1.1em', '0em'])
rotate3d: number[]     // 3D rotation [x, y, z, angle] (default: [0, 0, 1, 45])

// Examples
// 1. Basic fade in
<schmancy-animated-text>
  Welcome to our application
</schmancy-animated-text>

// 2. Custom stagger effect
<schmancy-animated-text
  stagger="100"
  duration="1000"
  translateY="['2em', '0em']">
  Cascading Letters
</schmancy-animated-text>

// 3. Scale and rotate effect
<schmancy-animated-text
  scale="[0.5, 1]"
  rotate3d="[0, 1, 0, 180]"
  duration="1500">
  Dramatic Entrance
</schmancy-animated-text>

// 4. No translation effect
<schmancy-animated-text
  translateX="['0em', '0em']"
  translateY="['0em', '0em']"
  opacity="[0, 1]">
  Fade Only
</schmancy-animated-text>
```

## Related Components

- **[Typography](./typography.md)**: Base text styling component
- **[Typewriter](./typewriter.md)**: Alternative text animation with typing effect

## Technical Details

### Animation Behavior
- Text is split into individual letter spans
- Each letter animates with the specified stagger delay
- Uses Web Animations API for performance
- Animations trigger on component mount and when text changes
- Responsive to viewport visibility

### CSS Classes
- `.ml7`: Main wrapper class
- `.text-wrapper`: Container for animated text
- `.letter`: Individual animated letter span

## Common Use Cases

1. **Hero Text**: Large headings with dramatic entrance animations
   ```html
   <h1>
     <schmancy-animated-text duration="2000" scale="[0.3, 1]">
       Welcome to Schmancy
     </schmancy-animated-text>
   </h1>
   ```

2. **Loading Messages**: Staggered letter animations for loading states
   ```html
   <schmancy-animated-text stagger="100" translateY="['1em', '0em']">
     Loading...
   </schmancy-animated-text>
   ```

3. **Notifications**: Subtle fade-in for status messages
   ```html
   <schmancy-animated-text 
     duration="500" 
     translateX="['0em', '0em']"
     translateY="['0em', '0em']">
     Operation completed successfully
   </schmancy-animated-text>
   ```

4. **Interactive Reveals**: Combined with visibility triggers
   ```html
   <schmancy-animated-text 
     delay="500"
     stagger="75"
     opacity="[0, 1]">
     Scroll to reveal this text
   </schmancy-animated-text>
   ```