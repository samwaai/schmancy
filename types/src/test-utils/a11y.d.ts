import { type ElementContext, type RunOptions, type Result } from 'axe-core';
/**
 * Run axe-core on the given element (or document) and assert no violations.
 * Throws a readable failure with a summary of violations so test output is
 * immediately actionable.
 *
 * Keep the axe rule set minimal and appropriate for component tests — the
 * defaults include many rules that only make sense at the page level (e.g.
 * `region`, `landmark-one-main`). Override via `options.rules` when needed.
 */
export declare function expectNoA11yViolations(context?: ElementContext, options?: RunOptions): Promise<Result[]>;
