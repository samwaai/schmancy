# Schmancy Development Guidelines

## 🚨 MANDATORY: ALWAYS USE AGENTS FOR COMPLEX TASKS 🚨

**FOR COMPLEX MULTI-STEP TASKS, YOU MUST USE THE APPROPRIATE AGENT.**

### QUICK REFERENCE:
- **UI/Component Development** → Use `ui-developer` agent  
- **Schmancy Demo Creation** → Use `schmancy-demo` agent
- **Complex Research/Multi-file Analysis** → Use `general-purpose` agent
- **Simple Edits** (config, types, small fixes) → Direct editing is OK

### When to Use Agents:

#### 1. **UI/Component Tasks** → **USE `ui-developer` AGENT**
   - Creating new Schmancy components in `/src/`
   - Complex UI features with state management
   - Component refactoring (wrapper div to host styling)
   - Theme system integration
   - Complex Tailwind styling implementations
   - **IMPORTANT**: Use `import.meta.env.VITE_*` for environment variables, NEVER `process.env`
   
#### 2. **Demo Creation** → **USE `schmancy-demo` AGENT**
   - Creating new demo showcases in `/demo/src/features/`
   - Following the Component Demo Guidelines structure
   - Integrating with nav system
   - Creating comprehensive examples with API documentation
   
#### 3. **Complex Research** → **USE `general-purpose` AGENT**
   - Multi-file analysis and refactoring
   - Searching for patterns across codebase
   - Complex architectural changes
   - Features requiring extensive codebase knowledge

#### 4. **Direct Editing is OK for:**
   - Type definitions in `/types/`
   - Simple bug fixes
   - Small styling adjustments
   - Adding properties to existing components
   - Updating documentation

## 🚨 CRITICAL PROJECT RULES 🚨

### 1. **NEVER MODIFY WORKING CODE WITHOUT VERIFICATION**
   - **ALWAYS** verify current implementation before changes
   - **ALWAYS** check similar components for patterns
   - **ALWAYS** preserve working patterns and conventions

### 2. **Type Safety**
   - **NEVER use `any` type** - use proper types or `unknown`
   - **ONE definition per type** - no duplicate interfaces
   - **ALWAYS** use proper generic types with DOM queries

### 3. **Component Patterns**
   - **Host Styling**: Use `:host` selectors, not wrapper divs
   - **Property Reflection**: Add `reflect: true` for CSS targeting
   - **CSS Custom Properties**: Use design system tokens
   - **No Runtime Styling**: Pure CSS rules, no JavaScript logic
   - **Environment Variables**: Use `import.meta.env.VITE_*` for Vite, NEVER use `process.env`

### 4. **Demo Requirements**
   - **ALWAYS** create demos as Lit components in `/demo/src/features/`
   - **ALWAYS** add to nav system
   - **ALWAYS** follow Component Demo Guidelines structure
   - **NEVER** create test*.html files

### Agent: schmancy-demo

**Purpose**: Specialized agent for creating comprehensive Schmancy component demos following strict established patterns

**Use this agent when:**
- Creating new demo showcases in `/demo/src/features/`
- Adding components to the demo navigation system
- Building API reference documentation tables
- Creating progressive example sets
- Updating existing demos with new examples

**Agent capabilities:**
- Follows exact demo structure patterns from existing demos
- Creates proper nav.ts integration
- Builds consistent API reference tables
- Generates progressive examples (basic → advanced)
- Uses proper Schmancy components and theme tokens
- Maintains consistent spacing (mb-4, mb-8, mb-12)
- Creates TypeScript demo components with proper decorators

## Theme System

Schmancy uses a Material Design 3-based theme system with Tailwind CSS integration. The theme provides semantic design tokens for colors, elevations, typography, and spacing.

### Core Principles

1. **Use semantic tokens, not raw colors** - Always use theme variables (`primary`, `surface`, etc.) instead of specific colors (`blue`, `red`)
2. **CSS variables for runtime theming** - All theme values are CSS custom properties that update dynamically
3. **Tailwind utilities for styling** - Use Tailwind classes with theme tokens for consistent styling
4. **Dark mode automatic** - Theme automatically adjusts for light/dark mode based on user preference

### Color System

The theme uses a hierarchical color system with semantic naming:

#### Surface Colors (Backgrounds & Containers)
| CSS Variable | Tailwind Class | Usage |
|-------------|----------------|--------|
| `--schmancy-sys-color-surface-default` | `bg-surface` | Main background surfaces |
| `--schmancy-sys-color-surface-dim` | `bg-surface-dim` | Dimmed/recessed surfaces |
| `--schmancy-sys-color-surface-bright` | `bg-surface-bright` | Emphasized/elevated surfaces |
| `--schmancy-sys-color-surface-container` | `bg-surface-container` | Card/container backgrounds |
| `--schmancy-sys-color-surface-low` | `bg-surface-low` | Low emphasis containers |
| `--schmancy-sys-color-surface-high` | `bg-surface-high` | High emphasis containers |
| `--schmancy-sys-color-surface-lowest` | `bg-surface-lowest` | Lowest elevation (pure white/black) |
| `--schmancy-sys-color-surface-highest` | `bg-surface-highest` | Highest elevation containers |

#### Color Roles (Primary, Secondary, Tertiary, Error, Success)
Each color role has four variants:
- `default` - The main color (e.g., `text-primary-default`, `bg-primary-default`)
- `on` - Content color on the main color (e.g., `text-primary-on`)
- `container` - Container background color (e.g., `bg-primary-container`)
- `onContainer` - Content color on container (e.g., `text-primary-onContainer`)

#### Text & Icon Colors
- `text-surface-on` - Primary text/icons on surfaces
- `text-surface-onVariant` - Secondary text/icons on surfaces
- `text-outline` - Borders, dividers, and outlined elements
- `text-outlineVariant` - Secondary borders and dividers

#### Utility Colors
- `bg-scrim` - Modal overlays and scrims
- `border-outline` - Default borders
- `border-outlineVariant` - Secondary borders

### Elevation System

Use elevation variables for consistent depth and hierarchy:

```css
/* CSS Variables */
--schmancy-sys-elevation-0    /* No shadow */
--schmancy-sys-elevation-1    /* Cards, list items */
--schmancy-sys-elevation-2    /* Raised buttons, elevated cards */
--schmancy-sys-elevation-3    /* Dialogs, pickers */
--schmancy-sys-elevation-4    /* Navigation drawers */
--schmancy-sys-elevation-5    /* FABs, tooltips */
```

**Usage in CSS:**
```css
box-shadow: var(--schmancy-sys-elevation-2);
```

### Typography

- Base font: `--schmancy-font-family` (defaults to system fonts)
- Use Schmancy typography components for consistent text styling
- Tailwind typography utilities work with theme colors

### Tailwind Integration

#### Complete Color Reference

**Surface Colors:**
- Backgrounds: `bg-surface`, `bg-surface-dim`, `bg-surface-bright`, `bg-surface-container`, `bg-surface-low`, `bg-surface-high`, `bg-surface-highest`, `bg-surface-lowest`
- Text: `text-surface`, `text-surface-dim`, `text-surface-bright`, etc.
- Borders: `border-surface`, `border-surface-dim`, etc.

**Primary Colors:**
- `bg-primary-default`, `text-primary-default`, `border-primary-default`
- `bg-primary-on`, `text-primary-on`, `border-primary-on`
- `bg-primary-container`, `text-primary-container`, `border-primary-container`
- `bg-primary-onContainer`, `text-primary-onContainer`, `border-primary-onContainer`

**Secondary, Tertiary, Error, Success Colors:**
- Follow the same pattern as Primary colors
- Example: `bg-secondary-default`, `text-error-container`, `border-success-on`

**Special Colors:**
- Text on surfaces: `text-surface-on`, `text-surface-onVariant`
- Outlines: `text-outline`, `text-outlineVariant`, `border-outline`, `border-outlineVariant`
- Scrim: `bg-scrim`, `text-scrim`, `border-scrim`

#### Quick Reference
```html
<!-- Backgrounds -->
<div class="bg-surface">Main surface</div>
<div class="bg-surface-container">Container</div>
<div class="bg-primary-container">Primary container</div>

<!-- Text -->
<p class="text-surface-on">Primary text</p>
<p class="text-surface-onVariant">Secondary text</p>
<p class="text-primary-default">Primary colored text</p>

<!-- Borders -->
<div class="border border-outline">Default border</div>
<div class="border-2 border-primary-default">Primary border</div>

<!-- Combined -->
<button class="bg-primary-default text-primary-on">
  Primary Button
</button>
<div class="bg-surface-container text-surface-on border border-outline">
  Card with border
</div>
```

### Theme Implementation

#### In Components (CSS)
```css
:host {
  background-color: var(--schmancy-sys-color-surface-container);
  color: var(--schmancy-sys-color-surface-on);
  box-shadow: var(--schmancy-sys-elevation-1);
}

:host(:hover) {
  box-shadow: var(--schmancy-sys-elevation-2);
}
```

#### In Components (Tailwind)
```html
<div class="bg-surface-container text-surface-on shadow-elevation-1 hover:shadow-elevation-2">
  Content
</div>
```

#### TypeScript Access
```typescript
import schmancy from '@mhmo91/schmancy'

// Access theme values programmatically
const primaryColor = schmancy.theme.sys.color.primary.default
```

### Theme Context

Wrap your app or component tree with `<schmancy-theme>` to apply theming:

```html
<schmancy-theme color="#6750A4" scheme="auto">
  <!-- Your app content -->
</schmancy-theme>
```

- `color`: Source color for theme generation
- `scheme`: 'light', 'dark', or 'auto' (follows system preference)

### Best Practices

1. **Never hardcode colors** - Always use theme tokens
2. **Semantic over specific** - Use `surface-container` not `gray-100`
3. **Respect color relationships** - Use `on` variants for content on colored backgrounds
4. **Test in both modes** - Ensure your UI works in light and dark themes
5. **Use elevation meaningfully** - Higher elevation = higher importance/interactivity



## Component Refactoring Summary: From Wrapper Div to Clean Host Styling

### Before (Anti-pattern):
```typescript
// ❌ Problems: Wrapper div, class management complexity, external class issues
render() {
  const classes = {
    'rounded-md': true,
    'shadow-xs': this.elevation === 1,
    'bg-surface-low shadow-xs hover:shadow-sm': this.type === 'elevated',
    // ... many conditional classes
  }
  return html`<div class="${this.classMap(classes)} ${this.className || ''}">
    <slot></slot>
  </div>`
}
```

### After (Best Practice):
```typescript
// ✅ Solution: CSS :host selectors with custom properties
@customElement('schmancy-card')
export default class SchmancyCard extends TailwindElement(css`
  :host {
    display: block;
    position: relative;
    border-radius: 0.375rem;
  }
  :host([type="elevated"]) {
    background-color: var(--schmancy-sys-color-surface-low);
    box-shadow: var(--schmancy-sys-elevation-1);
  }
  /* ... other :host rules */
`) {
  @property({ reflect: true }) type: 'elevated' | 'filled' | 'outlined' = 'elevated'
  @property({ type: Number, reflect: true }) elevation: 0 | 1 | 2 | 3 | 4 | 5 = 0
  
  render() {
    return html`<slot></slot>`
  }
}
```

### Key Refactoring Principles:

1. **Remove Wrapper Elements**
   - Before: `<div class="..."><slot></slot></div>`
   - After: `<slot></slot>` (styles on host)

2. **Use CSS :host Instead of Classes**
   - Before: JavaScript class manipulation, string concatenation
   - After: CSS attribute selectors with `:host([prop="value"])`

3. **Enable Property Reflection**
   - Add `reflect: true` to `@property()` decorators
   - This creates HTML attributes that CSS can target

4. **Leverage CSS Custom Properties**
   - Before: Hardcoded Tailwind classes (`shadow-xs`, `bg-surface-low`)
   - After: Design system tokens (`var(--schmancy-sys-elevation-1)`)

5. **Eliminate Runtime Logic**
   - Before: Complex conditional logic in `render()` or `updated()`
   - After: Pure CSS rules, no JavaScript styling logic

### Benefits Achieved:
- ✅ **Performance**: CSS is parsed once, no runtime class updates
- ✅ **Simplicity**: ~50% less code, easier to understand
- ✅ **External Classes**: Users can add classes without conflicts
- ✅ **Design System**: Clean integration via CSS custom properties
- ✅ **Encapsulation**: Styles scoped to component
- ✅ **No Side Effects**: No DOM mutations after render

### When Refactoring Other Components:
1. Identify components with wrapper divs around `<slot>`
2. Check if using `classMap()` or dynamic class strings
3. Convert dynamic classes to `:host` CSS rules
4. Add `reflect: true` to properties used for styling
5. Replace hardcoded values with CSS custom properties
6. Remove all JavaScript styling logic

This pattern works best for components where:
- Styles are based on property values
- You need clean external API
- Performance is important
- Design system integration is needed

## Component Demo Guidelines

When creating demos for Schmancy components, follow this structure:

1. **Component Title & Description**
   - Use display/headline typography for the component name
   - Brief description using body text with `text-surface-onVariant`

2. **Installation Section** (use shared `installation-section` component)
   - Shows npm/yarn installation commands
   - Consistent across all demos

3. **Import Instructions**
   - Show the exact import statement needed
   - Use `schmancy-code-preview` with language="javascript"

4. **API Reference Table**
   - Present before examples
   - Include: Property, Type, Default, Description columns
   - Use `schmancy-surface type="surfaceDim"` for the table container
   - Use proper typography components for headers and cells

5. **Additional Reference Tables** (if applicable)
   - Type scales, size references, etc.
   - Format: value/line-height with annotations

6. **Examples Section**
   - Start with basic usage
   - Progress to real-world scenarios
   - Group related examples logically
   - Use `schmancy-grid gap="lg"` for layout
   - Each example in `schmancy-code-preview`

### Example Structure:
```typescript
<schmancy-surface class="p-8">
  <!-- Title -->
  <schmancy-typography type="display" token="lg" class="mb-4 block">
    Component Name
  </schmancy-typography>
  <schmancy-typography type="body" token="lg" class="mb-8 text-surface-onVariant block">
    Component description
  </schmancy-typography>

  <!-- Installation -->
  <installation-section></installation-section>

  <!-- Import -->
  <div class="mb-8">
    <schmancy-typography type="title" token="lg" class="mb-4 block">Import</schmancy-typography>
    <schmancy-code-preview language="javascript">
      import '@mhmo91/schmancy/component-name'
    </schmancy-code-preview>
  </div>

  <!-- API Reference -->
  <div class="mb-12">
    <schmancy-typography type="title" token="lg" class="mb-4 block">API Reference</schmancy-typography>
    <!-- Table here -->
  </div>

  <!-- Examples -->
  <div>
    <schmancy-typography type="title" token="lg" class="mb-6 block">Examples</schmancy-typography>
    <schmancy-grid gap="lg" class="w-full">
      <!-- Example blocks -->
    </schmancy-grid>
  </div>
</schmancy-surface>
```

### Best Practices:
- Keep examples concise and practical
- Show real-world use cases
- Avoid mixing inline and block display in examples
- Use consistent spacing (mb-4, mb-8, mb-12)
- Make examples self-contained and easy to copy

## Styling Guidelines

- Always prefer to use tailwind css over custom css

## Development Guidelines

- Never create test*.html files
- Always use the demo project to setup demos
- Always update ai/*.md upon code changes
- Never import schmancy components in demo
- **Package Manager**: This project uses Yarn, not npm 

## Component Demo Navigation

- Demo should always be demo as lit component added to nav

## Agent Configuration: schmancy-demo

### Description
Specialized agent for creating Schmancy component demos following strict established patterns from existing demos.

### Primary Responsibilities
1. **Demo File Creation**: Build demos in `/demo/src/features/[component].ts`
2. **Navigation Integration**: Update `/demo/src/nav.ts` with proper section placement
3. **API Documentation**: Create consistent API reference tables
4. **Example Generation**: Progressive examples from basic to advanced
5. **Pattern Compliance**: Follow exact patterns from existing demos

### Required Knowledge Base

#### File Structure
```typescript
// Standard imports
import { $LitElement } from '@mixins/index'
import { html } from 'lit'
import { customElement } from 'lit/decorators.js'
import '../shared/installation-section'

@customElement('demo-[component-name]')
export class Demo[ComponentName] extends $LitElement() {
  render() {
    return html`<!-- Demo content -->`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'demo-[component-name]': Demo[ComponentName]
  }
}
```

#### Demo Content Structure
1. **Title & Description**
   ```html
   <schmancy-typography type="display" token="lg" class="mb-4 block">
     Component Name
   </schmancy-typography>
   <schmancy-typography type="body" token="lg" class="mb-8 text-surface-onVariant block">
     Description of component purpose and features
   </schmancy-typography>
   ```

2. **Installation Section**
   ```html
   <installation-section></installation-section>
   ```

3. **Import Instructions**
   ```html
   <div class="mb-8">
     <schmancy-typography type="title" token="lg" class="mb-4 block">Import</schmancy-typography>
     <schmancy-code-preview language="javascript">
       import '@mhmo91/schmancy/component-name'
     </schmancy-code-preview>
   </div>
   ```

4. **API Reference Table**
   ```html
   <div class="mb-12">
     <schmancy-typography type="title" token="lg" class="mb-4 block">API Reference</schmancy-typography>
     <schmancy-surface type="surfaceDim" class="rounded-lg overflow-hidden">
       <table class="w-full">
         <thead class="bg-surface-container">
           <tr>
             <th class="text-left p-4">
               <schmancy-typography type="label" token="md">Property</schmancy-typography>
             </th>
             <th class="text-left p-4">
               <schmancy-typography type="label" token="md">Type</schmancy-typography>
             </th>
             <th class="text-left p-4">
               <schmancy-typography type="label" token="md">Default</schmancy-typography>
             </th>
             <th class="text-left p-4">
               <schmancy-typography type="label" token="md">Description</schmancy-typography>
             </th>
           </tr>
         </thead>
         <tbody>
           <!-- Property rows -->
         </tbody>
       </table>
     </schmancy-surface>
   </div>
   ```

5. **Examples Section**
   ```html
   <div>
     <schmancy-typography type="title" token="lg" class="mb-6 block">Examples</schmancy-typography>
     <schmancy-grid gap="lg" class="w-full">
       <!-- Example blocks with schmancy-code-preview -->
     </schmancy-grid>
   </div>
   ```

#### Navigation Integration
In `/demo/src/nav.ts`, add to appropriate section:
```typescript
import { DemoComponentName } from './features/component-name'

// In sections array
{
  title: 'Section Name',
  demos: [
    { name: 'Display Name', component: DemoComponentName },
  ]
}
```

### Styling Guidelines

#### Spacing Rules
- `mb-4`: Small gaps between related elements
- `mb-8`: Medium sections (after description, import)
- `mb-12`: Major sections (after API reference)
- `mb-6`: Before example grids
- `p-4`: Table cell padding
- `p-8`: Main surface padding

#### Typography Tokens
- Display title: `type="display" token="lg"`
- Body description: `type="body" token="lg"`
- Section headers: `type="title" token="lg"`
- Table headers: `type="label" token="md"`
- Table content: `type="body" token="sm"`
- Code in tables: `class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded"`

#### Color Classes
- Description text: `text-surface-onVariant`
- Table header bg: `bg-surface-container`
- Surface containers: `type="surfaceDim"`
- Code containers: `bg-primary-container text-primary-onContainer`

### Example Organization

#### Progressive Complexity Pattern
1. **Basic Usage** - Simplest possible example
2. **Variants** - Different types/styles
3. **Properties** - Key property demonstrations
4. **States** - Disabled, error, loading, etc.
5. **Interactive** - Event handlers, state changes
6. **Real-world** - Practical use cases
7. **Advanced** - Complex integrations

#### Code Preview Usage
```html
<!-- HTML examples (displayed and rendered) -->
<schmancy-code-preview language="html">
  <schmancy-component property="value">
    Content
  </schmancy-component>
</schmancy-code-preview>

<!-- JavaScript/Import examples (displayed only) -->
<schmancy-code-preview language="javascript">
  import '@mhmo91/schmancy/component'
</schmancy-code-preview>
```

### Workflow Steps
1. **Analyze Component** - Read component source, understand all properties
2. **Create Demo File** - Use exact file structure template
3. **Write Title/Description** - Clear, concise component overview
4. **Add Installation** - Always use `<installation-section>`
5. **Document Import** - Exact import path
6. **Build API Table** - All properties with types, defaults, descriptions
7. **Create Examples** - Progressive complexity, real-world focus
8. **Update Navigation** - Add to correct section in nav.ts
9. **Test Demo** - Verify all examples render correctly

### Quality Checklist
- ✅ Follows exact file structure from existing demos
- ✅ Uses consistent spacing (mb-4, mb-8, mb-12)
- ✅ All typography uses proper type/token combinations
- ✅ API table has all properties documented
- ✅ Examples progress from basic to advanced
- ✅ Code previews are self-contained and copyable
- ✅ Navigation entry added to correct section
- ✅ No hardcoded colors - only theme tokens
- ✅ Installation section included
- ✅ Import path is correct
- ✅ TypeScript decorators properly used
- ✅ Global interface declaration included

### Common Patterns to Follow
- Study existing demos in `/demo/src/features/` for patterns
- Match the exact structure of similar components
- Use same table styling as other demos
- Follow established example organization
- Maintain consistency with spacing and typography