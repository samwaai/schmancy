declare const SchmancyTypography_base: import("../../mixins").Constructor<CustomElementConstructor> & import("../../mixins").Constructor<import("@mixins/tailwind.mixin").ITailwindElementMixin> & import("../../mixins").Constructor<import("lit").LitElement> & import("../../mixins").Constructor<import("../../mixins").IBaseMixin>;
/**
 * @element schmancy-typography
 * @slot - The text for the typography.
 */
export declare class SchmancyTypography extends SchmancyTypography_base {
    static shadowRootOptions: ShadowRootInit;
    /**
     * @attr type - The type of the typography.
     * @default 'body'
     * @type {'display' | 'headline' | 'title' | 'subtitle' | 'body' | 'label'}
     */
    type: 'display' | 'headline' | 'title' | 'subtitle' | 'body' | 'label';
    /**
     * @attr token - The size token.
     * @deprecated Prefer using Tailwind responsive text classes for better responsive design.
     * Set token="" and use class="text-sm md:text-base lg:text-lg" instead.
     * Example: <schmancy-typography type="display" token="" class="text-2xl sm:text-3xl md:text-4xl">
     * @default 'md'
     * @type {'xs' | 'sm' | 'md' | 'lg' | 'xl' | ''}
     */
    token: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '';
    /**
     * @attr
     * @default inherit
     * @type {'left' |'center' |'right'}
     */
    align: 'left' | 'center' | 'justify' | 'right' | undefined;
    /**
     * @attr
     * @default inherit
     * @type {'normal' | 'medium' |'bold'}
     * @public
     */
    weight: 'normal' | 'medium' | 'bold' | undefined;
    /**
     *
     * @attr
     * @default inherit
     * @type {'uppercase' |'lowercase' |'capitalize' |'normal'}
     * @public
     */
    transform: 'uppercase' | 'lowercase' | 'capitalize' | 'normal' | undefined;
    maxLines: 1 | 2 | 3 | 4 | 5 | 6 | undefined;
    /** When true, the element becomes contenteditable and dispatches 'change' events on blur/Enter */
    editable: boolean;
    /** The text value when in editable mode. Set via property binding: .value=${...} */
    value: string;
    /** Placeholder shown when editable and empty */
    placeholder: string;
    private _editRef;
    /** Focus and select all text in editable mode */
    selectAll(): void;
    connectedCallback(): void;
    protected updated(changedProperties: Map<string, unknown>): void;
    protected render(): unknown;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-typography': SchmancyTypography;
    }
}
export {};
