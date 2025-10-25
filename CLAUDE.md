# Schmancy Project Guidelines

## 📚 Project-Specific Knowledge Files

**CRITICAL: Before working on ANY task in this project, you MUST read the relevant knowledge file:**

- **Working on library components** (`/src/**`) → Read [src/CLAUDE.md](src/CLAUDE.md) first
- **Working on demos** (`/demo/**`) → Read [demo/CLAUDE.md](demo/CLAUDE.md) first
- **Working on both** → Read BOTH files

These files contain essential patterns, architecture decisions, and conventions that are NOT repeated here.

**Failure to read these files will result in code that doesn't follow project patterns.**

## 🎯 Quick Reference

### File Structure
- **Library source**: `/src/` - Component implementations (see [src/CLAUDE.md](src/CLAUDE.md))
- **Demo site**: `/demo/src/features/` - Component demos (see [demo/CLAUDE.md](demo/CLAUDE.md))
- **Types**: `/types/src/` - TypeScript type definitions
- **Build output**: `/dist/` - Compiled library

### Testing Changes
1. Run `yarn dev` to start demo development server
2. Navigate to the appropriate demo page in browser
3. **NEVER create test HTML files in project root** - use existing demo structure

### Agent Assignment for Schmancy

| Task | Agent | Must Read First |
|------|-------|-----------------|
| Library component work | `ui-developer` | [src/CLAUDE.md](src/CLAUDE.md) |
| Demo creation/updates | `ui-developer` | [demo/CLAUDE.md](demo/CLAUDE.md) |
| Full component + demo | `ui-developer` | Both CLAUDE.md files |

## 🚨 Critical Rules

1. **Always read project-specific CLAUDE.md files before starting work**
2. **Never create standalone test HTML files** - use demo structure
3. **Follow patterns in existing code** - consistency is critical
4. **Use `yarn dev` for testing** - not build commands (per global rules)

## 📝 MANDATORY: Documentation & Demo Updates After Code Changes

**ABSOLUTE RULE: ANY code change to a component MUST include:**

### 1. AI Documentation Updates (`/ai/{component}.md`)

After modifying a component, you MUST update its AI documentation file to reflect:

- ✅ All new properties/attributes added
- ✅ All new type options or variants
- ✅ Updated property signatures (if changed)
- ✅ New usage examples demonstrating new features
- ✅ Updated API reference showing complete current API

**Example:** If you add new surface types (`glass`, `transparent`, `primaryContainer`), the `/ai/surface.md` file MUST be updated to include these in:

- Property type definitions
- Surface types list
- Usage examples
- Common use cases section

### 2. Demo Updates (`/demo/src/features/{category}-demos/`)

After modifying a component, you MUST update its demo to include:

- ✅ Visual examples of ALL new features
- ✅ Interactive demonstrations of new functionality
- ✅ Updated API reference table showing all properties
- ✅ Real-world use case examples

**Example:** If you add new surface types, the demo MUST show:

- Visual comparison of all new types
- Interactive examples (e.g., selection states using `primaryContainer`)
- Practical use cases (e.g., glass effects, semantic containers)

### 3. Enforcement - Task Incomplete Without Documentation

**A code change is NOT complete until:**

1. ✅ Component code is updated
2. ✅ AI documentation (`/ai/*.md`) reflects ALL current features
3. ✅ Demo shows ALL current features with examples
4. ✅ Type definitions are updated (if applicable)

**Failure to update documentation = incomplete task = must go back and update.**

### Why This Matters

- Developers rely on AI docs for accurate API reference
- Demos serve as living documentation and testing ground
- Outdated docs lead to confusion and incorrect usage
- Complete documentation prevents feature discovery issues
