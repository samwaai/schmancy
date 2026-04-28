import { a11yAudit, capabilities, findFor, help, manifest, platformPrimitive, registeredTags, tokens } from './helpers';
declare global {
    interface Window {
        schmancy?: {
            manifest: typeof manifest;
            manifestUrl: string;
            help: typeof help;
            tokens: typeof tokens;
            platformPrimitive: typeof platformPrimitive;
            registeredTags: typeof registeredTags;
            a11yAudit: typeof a11yAudit;
            capabilities: typeof capabilities;
            findFor: typeof findFor;
        };
    }
}
declare const SchmancySkill_base: CustomElementConstructor & import("../../mixins/constructor").Constructor<import("lit").LitElement> & import("../../mixins/constructor").Constructor<import("../../mixins/baseElement").IBaseMixin>;
/**
 * Self-describing runtime helper. Drop `<schmancy-skill></schmancy-skill>`
 * once on a page and `window.schmancy.help('schmancy-button')` returns the
 * machine-readable entry for any tag. Renders nothing.
 *
 * @element schmancy-skill
 */
export declare class SchmancySkill extends SchmancySkill_base {
    connectedCallback(): void;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-skill': SchmancySkill;
    }
}
export {};
