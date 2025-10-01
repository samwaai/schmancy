interface ColorPreset {
    name: string;
    value: string;
    category?: 'primary' | 'secondary' | 'accent';
}
declare const ThemeControls_base: CustomElementConstructor & import("../../mixins").Constructor<import("lit").LitElement> & import("../../mixins").Constructor<import("../../mixins").IBaseMixin>;
export declare class ThemeControls extends ThemeControls_base {
    private currentScheme;
    private currentColor;
    resolvedScheme: 'dark' | 'light';
    customColors?: ColorPreset[];
    private colorInput$;
    private get presetColors();
    connectedCallback(): void;
    private setScheme;
    private setColor;
    private handleColorInput;
    private randomColor;
    private triggerColorPicker;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-theme-controls': ThemeControls;
    }
}
export {};
