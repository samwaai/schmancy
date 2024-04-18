import { LitElement } from 'lit';
import { ButtonVariant } from './button';
declare const SchmnacyIconButton_base: CustomElementConstructor & import("@mhmo91/lit-mixins/src").Constructor<LitElement> & import("@mhmo91/lit-mixins/src").Constructor<import("@mhmo91/lit-mixins/src").IBaseMixin>;
/**
 * A button component.
 * @element schmancy-icon-button
 * @slot - The default slot.
 * @slot prefix - The prefix slot.
 * @slot suffix - The suffix slot.
 */
export declare class SchmnacyIconButton extends SchmnacyIconButton_base {
    protected static shadowRootOptions: {
        mode: string;
        delegatesFocus: boolean;
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
        'schmancy-icon-button': SchmnacyIconButton;
    }
}
export {};
