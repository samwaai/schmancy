# Setting up schmancy in Claude Design

Claude Design (Anthropic Labs) extracts a design system from a codebase at org-onboarding time. Once set up, every project inside the org uses schmancy automatically — no per-session paste.

## Prerequisites

- A Claude Pro, Max, Team, or Enterprise plan.
- Admin access to the org (Enterprise: admin may need to flip it on — it's default-off).

## Fill in the setup form like this

**Company name and blurb (or name of design system):**

```
schmancy — Material 3 web-component library (100+ <schmancy-*> Lit elements,
Tailwind 4 theme tokens, RxJS). Single-URL ESM runtime ships a discovery API
via `window.schmancy.help()`. Designs look like Material You: tonal surfaces,
rounded corners, dynamic color palette generated from a seed color.
```

**Link code on GitHub:**

```
https://github.com/mhmo91/schmancy
```

Leave the local-folder upload empty — the GitHub link is the source of truth and Claude Design will copy the files it needs.

**Upload a .fig file:** skip (schmancy doesn't ship a Figma file).

**Add fonts, logos and assets:** skip unless you're overlaying your own brand on top of schmancy. The library is theme-neutral — it generates its palette from a seed color at runtime.

**Any other notes?** paste this:

```
Use <schmancy-*> custom elements for every UI tag — never raw <button>, <input>, <li>.
Colors: Tailwind utility classes against schmancy theme tokens (bg-primary-default,
text-surface-on, border-outline-variant). Never hex. Never arbitrary values like bg-[#xxx].
App shell: wrap in <schmancy-theme root scheme="auto" color="#seed"> then
<schmancy-surface type="solid" fill="all">. Include one <schmancy-skill></schmancy-skill>
so window.schmancy.help() / tokens() / capabilities() are live for introspection.
Full operating manual + copy-pastable minimum page: handover/claude-design-brief.md
in the repo.
```

## After onboarding

1. **Review the extracted design system.** Colors should appear as named tokens (primary, surface, outline), not raw hex. Components should list the 100+ `<schmancy-*>` tags. Typography should pick up the schmancy type scale.
2. **Publish** (toggle the switch) to make the design system available to everyone in the org.
3. **Create a test project.** Ask for a small page ("dashboard with a sidebar, app bar, and a list"). Verify the output uses `<schmancy-*>` tags and Tailwind token classes. If it produces raw HTML / hex colors, open the project's context panel and attach `handover/claude-design-brief.md` directly.
4. **Handoff to Claude Code.** When a mockup is production-ready, export a handoff bundle from Claude Design. The matching consumer skill in this repo is `packages/schmancy/skills/schmancy/SKILL.md` — load it with `claude --plugin-dir ./packages/schmancy` and it enforces the same rules at the code-editing layer.

## Sources

- [Get started with Claude Design — support.claude.com](https://support.claude.com/en/articles/14604416-get-started-with-claude-design)
- [Set up your design system in Claude Design — support.claude.com](https://support.claude.com/en/articles/14604397-set-up-your-design-system-in-claude-design)
- [Introducing Claude Design by Anthropic Labs — anthropic.com](https://www.anthropic.com/news/claude-design-anthropic-labs)
