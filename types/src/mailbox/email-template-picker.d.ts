import type { EmailTemplate } from './types';
declare const SchmancyEmailTemplatePicker_base: CustomElementConstructor & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
/**
 * Email template picker content component (for use inside sheets)
 *
 * Features:
 * - Grid layout for template preview
 * - Search/filter templates
 * - Category filtering
 * - Inline preview with direct selection
 * - Single-click template selection
 *
 * @example
 * ```typescript
 * // Open as sheet
 * const picker = new SchmancyEmailTemplatePicker()
 * picker.templates = templates
 * picker.addEventListener('template-selected', handleSelection)
 * sheet.open({ component: picker, title: 'Choose Template' })
 * ```
 */
export declare class SchmancyEmailTemplatePicker extends SchmancyEmailTemplatePicker_base {
    /** Available templates */
    templates: EmailTemplate[];
    /** Search query */
    private searchQuery;
    /** Filtered templates based on search */
    private filteredTemplates;
    /** Selected category filter */
    private selectedCategory;
    connectedCallback(): void;
    updated(changed: Map<string, any>): void;
    /** Get unique categories from templates */
    get categories(): string[];
    /** Update filtered templates */
    private updateFilteredTemplates;
    /** Handle search input */
    private handleSearch;
    /** Handle category selection */
    private handleCategorySelect;
    /** Select template directly */
    private selectTemplate;
    /** Close the picker */
    private close;
    render(): import("lit-html").TemplateResult<1>;
    /** Render template list with inline previews */
    private renderTemplateList;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-email-template-picker': SchmancyEmailTemplatePicker;
    }
}
export {};
