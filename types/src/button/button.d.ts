import { LitElement } from 'lit';
export interface SchmancyButtonEventMap {
    SchmancyFocus: CustomEvent<void>;
    SchmancyBlur: CustomEvent<void>;
}
export type ButtonVariant = 'elevated' | 'filled' | 'filled tonal' | 'outlined' | 'text';
declare const SchmnacyButton_base: CustomElementConstructor & import("@mixins/index").Constructor<LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
/**
 * A button component.
 * @element schmancy-button
 * @slot - The default slot.
 * @slot prefix - The prefix slot.
 * @slot suffix - The suffix slot.
 */
export declare class SchmnacyButton extends SchmnacyButton_base {
    protected static shadowRootOptions: {
        mode: string;
        delegatesFocus: boolean;
        serializable?: boolean;
        slotAssignment?: SlotAssignmentMode;
    };
    private nativeElement;
    private _ariaLabel;
    /**
     * The variant of the button. Defaults to undefined.
     * @attr
     * @default 'filled'
     * @public
     */
    variant: ButtonVariant;
    /**
     *  The width of the button. Defaults to 'auto'.
     *  @attr
     * @type {'full' | 'auto'}
     * @default 'auto'
     * @public
     */
    width: 'full' | 'auto';
    /**
     * The type of the button. Defaults to undefined.
     * @attr
     */
    type: 'button' | 'reset' | 'submit';
    /**
     * The URL the button points to.
     * @attr
     */
    href: string;
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
    protected get imgClasses(): string[];
    firstUpdated(): void;
    click(): void;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-button': SchmnacyButton;
    }
}
export {};
