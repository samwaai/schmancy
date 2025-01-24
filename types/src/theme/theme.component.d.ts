import { TSchmancyTheme } from './theme.interface';
export declare const tailwindStyles: import("lit").CSSResult;
declare const SchmancyThemeComponent_base: import("../../mixins").Constructor<CustomElementConstructor> & import("../../mixins").Constructor<import("@mixins/tailwind.mixin").ITailwindElementMixin> & import("../../mixins").Constructor<import("lit").LitElement> & import("../../mixins").Constructor<import("../../mixins").IBaseMixin>;
export declare class SchmancyThemeComponent extends SchmancyThemeComponent_base {
    color: string;
    scheme: 'dark' | 'light';
    connectedCallback(): void;
    registerTheme(): void;
    registerThemeValues(prefix: string, path: string, value: Partial<TSchmancyTheme>): string | undefined;
    generateRandomColor(): string;
    protected render(): unknown;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-theme': SchmancyThemeComponent;
    }
}
export {};
