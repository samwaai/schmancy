import { LitElement } from 'lit';
import { type SchmancyButtonSize } from './context';
export interface SchmancyButtonEventMap {
    SchmancyFocus: CustomEvent<void>;
    SchmancyBlur: CustomEvent<void>;
}
export type ButtonVariant = 'elevated' | 'filled' | 'filled tonal' | 'tonal' | 'outlined' | 'text';
export type ButtonColor = 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info' | 'neutral';
declare const SchmancyButton_base: CustomElementConstructor & import("@mixins/index").Constructor<LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
/**
 * Material Design button — primary interactive surface for triggering actions or navigation.
 * @element schmancy-button
 * @summary Trigger actions or navigate. Form-associated; participates in native form submission.
 * @example
 * <schmancy-button variant="filled" @click=${() => save()}>Save</schmancy-button>
 * <schmancy-button variant="outlined" href="/next">Continue</schmancy-button>
 * @platform button click - Schmancy-skinned native `<button type="submit">`. When `href` is set, degrades to `<a href="…">`. Falls back to plain `<button>` styled with Tailwind if the tag never registers.
 * @slot - The default slot.
 * @slot prefix - The prefix slot.
 * @slot suffix - The suffix slot.
 * @csspart base - The underlying native `<button>` (or `<a>` when `href` is set).
 */
export declare class SchmancyButton extends SchmancyButton_base {
    protected static shadowRootOptions: {
        mode: string;
        delegatesFocus: boolean;
        clonable?: boolean;
        customElementRegistry?: CustomElementRegistry;
        serializable?: boolean;
        slotAssignment?: SlotAssignmentMode;
    };
    static formAssociated: boolean;
    private internals;
    constructor();
    /** Associated form, when placed inside a <form>. */
    get form(): HTMLFormElement | null;
    formDisabledCallback(disabled: boolean): void;
    private nativeElement;
    private _ariaLabel;
    /**
     * The variant of the button.
     * @attr
     * @default 'text'
     * @public
     */
    variant: ButtonVariant;
    /**
     * The color of the button.
     * @attr
     * @default Depends on variant: 'primary' for filled/elevated/outlined/text, 'secondary' for tonal
     * @public
     */
    color?: ButtonColor;
    /**
     * The width of the button.
     * @attr
     * @type {'full' | 'auto'}
     * @default 'auto'
     * @public
     */
    width: 'full' | 'auto';
    /**
     * The size of the button.
     * Provided as `SchmancyButtonSizeContext` to descendant elements so children
     * (e.g. `<schmancy-icon>`) can auto-size against the enclosing button.
     * @attr
     * @type {'xxs' | 'xs' | 'sm' | 'md' | 'lg'}
     * @default 'md'
     * @public
     */
    size: SchmancyButtonSize;
    /**
     * The type of the button.
     * Defaults to 'button' (preventing accidental form submissions).
     * @attr
     */
    type: 'button' | 'reset' | 'submit';
    /**
     * The URL the button points to.
     * If provided, the component will render as an anchor element.
     * @attr
     */
    href?: string;
    /**
     * Determines whether the button is disabled.
     * @attr
     */
    disabled: boolean;
    set ariaLabel(value: string);
    get ariaLabel(): string;
    private prefixImgs;
    private suffixImgs;
    /** Sets focus in the button. */
    focus(options?: FocusOptions): void;
    /** Removes focus from the button. */
    blur(): void;
    /**
     * Get the effective color based on variant if not explicitly set
     * M3 spec: filled = primary, tonal = secondary, others = primary
     */
    protected get effectiveColor(): ButtonColor;
    protected get imgClasses(): string[];
    firstUpdated(): void;
    click(): void;
    private _preventDefault;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-button': SchmancyButton;
    }
}
export {};
