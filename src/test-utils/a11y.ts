import axe, { type ElementContext, type RunOptions, type Result } from 'axe-core'
import { expect } from 'vitest'

/**
 * Run axe-core on the given element (or document) and assert no violations.
 * Throws a readable failure with a summary of violations so test output is
 * immediately actionable.
 *
 * Keep the axe rule set minimal and appropriate for component tests — the
 * defaults include many rules that only make sense at the page level (e.g.
 * `region`, `landmark-one-main`). Override via `options.rules` when needed.
 */
export async function expectNoA11yViolations(
	context: ElementContext = document.body,
	options: RunOptions = {
		// Exclude page-level rules that don't apply to a component-in-isolation.
		rules: {
			region: { enabled: false },
			'landmark-one-main': { enabled: false },
			'page-has-heading-one': { enabled: false },
			'html-has-lang': { enabled: false },
			'document-title': { enabled: false },
			bypass: { enabled: false },
		},
	},
): Promise<Result[]> {
	const results = await axe.run(context, options)
	if (results.violations.length > 0) {
		const summary = results.violations
			.map(v => `  • ${v.id} (${v.impact}): ${v.help}\n    ${v.helpUrl}`)
			.join('\n')
		expect.fail(`axe-core found ${results.violations.length} a11y violation(s):\n${summary}`)
	}
	return results.violations
}
