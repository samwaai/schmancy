import { type PropertyValues } from 'lit';
/**
 * Preset → (type, token) shorthand. Saves the two-decision-per-text-node
 * fatigue that 50+ typography nodes in a single page cause.
 */
export type TypographyPreset = 'display' | 'display-lg' | 'display-md' | 'display-sm' | 'heading-lg' | 'heading-md' | 'heading-sm' | 'title-lg' | 'title-md' | 'title-sm' | 'body-lg' | 'body-md' | 'body-sm' | 'label-lg' | 'label-md' | 'label-sm' | 'caption';
/**
 * Allowed semantic tag names for the `as` prop. Closed enum so we can
 * use `literal` template parts safely with `lit/static-html`.
 */
export type TypographyTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
declare const SchmancyTypography_base: import("../../mixins").Constructor<CustomElementConstructor> & import("../../mixins").Constructor<import("@mixins/tailwind.mixin").ITailwindElementMixin> & import("../../mixins").Constructor<import("lit").LitElement> & import("../../mixins").Constructor<import("../../mixins").IBaseMixin>;
/**
 * @element schmancy-typography
 * @slot - The text for the typography.
 * @fires change - When `editable` is true, fires on blur or Enter with `detail.value` set to the new text content. Not fired when `editable` is unset (the default).
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
     * Shorthand for picking a (type, token) pair in one go. When set, derives
     * `type` and `token` automatically — saves the two-decisions-per-text-node
     * fatigue that hits when a single page has 50+ typography nodes.
     *
     * @attr preset
     * @type {TypographyPreset}
     * @example <schmancy-typography preset="heading-md">Title</schmancy-typography>
     */
    preset?: TypographyPreset;
    /**
     * Render the slot wrapped in the requested semantic HTML element so screen
     * readers expose the right role / heading level. Without `as`, the slot
     * sits directly in the shadow root and the host is a generic element.
     *
     * @attr as
     * @type {TypographyTag}
     * @example <schmancy-typography preset="heading-md" as="h2">Section</schmancy-typography>
     */
    as?: TypographyTag;
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
    protected willUpdate(changed: PropertyValues): void;
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
