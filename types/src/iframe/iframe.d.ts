import { PropertyValues } from 'lit';
declare const SchmancyIframe_base: import("@mixins/index").Constructor<CustomElementConstructor> & import("@mixins/index").Constructor<import("@mixins/index").ITailwindElementMixin> & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
/**
 * Renders an HTML fragment inside a sandboxed, auto-sizing iframe.
 *
 * @slot - (none)
 * @fires load — native iframe load event
 *
 * @example
 * ```html
 * <schmancy-iframe .html=${bodyHtml} .css=${extraStyles}></schmancy-iframe>
 * ```
 */
export default class SchmancyIframe extends SchmancyIframe_base {
    /** HTML body fragment to render inside the iframe */
    html: string;
    /** Additional CSS injected after the base styles (consumer-specific) */
    css: string;
    /** Base document CSS (font, spacing, resets). Override for fully custom styling */
    baseCss: string;
    /** iframe sandbox attribute */
    sandbox: string;
    /** Minimum height in pixels */
    minHeight: number;
    private _height;
    private _srcdoc;
    protected willUpdate(changed: PropertyValues): void;
    private buildSrcdoc;
    private onLoad;
    protected render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-iframe': SchmancyIframe;
    }
}
export {};
