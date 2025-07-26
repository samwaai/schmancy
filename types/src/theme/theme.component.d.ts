import { TSchmancyTheme } from './theme.interface';
export type ThemeWhereAreYouEvent = CustomEvent<void>;
export declare const ThemeWhereAreYou = "theme-where-are-you";
export type ThemeHereIAmEvent = CustomEvent<{
    theme: HTMLElement;
}>;
export declare const ThemeHereIAm = "theme-here-i-am";
export declare const tailwindStyles: any;
declare const SchmancyThemeComponent_base: import("../../mixins").Constructor<CustomElementConstructor> & import("../../mixins").Constructor<import("@mixins/tailwind.mixin").ITailwindElementMixin> & import("../../mixins").Constructor<LitElement> & import("../../mixins").Constructor<import("../../mixins").IBaseMixin>;
export declare class SchmancyThemeComponent extends SchmancyThemeComponent_base {
    color: string;
    scheme: 'dark' | 'light' | 'auto';
    root: boolean;
    theme: Partial<TSchmancyTheme>;
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
