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