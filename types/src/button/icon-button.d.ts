import { LitElement, PropertyValueMap } from 'lit';
import { ButtonVariant } from './button';
declare const SchmnacyIconButton_base: CustomElementConstructor & import("@mixins/index").Constructor<LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
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
        serializable?: boolean;
        slotAssignment?: SlotAssignmentMode;
    };
    private nativeElement;
    private _ariaLabel;
    size: 'sm' | 'md' | 'lg';
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
    /** Sets focus in the button. */
    focus(options?: FocusOptions): void;
    /** Removes focus from the button. */
    blur(): void;
    click(): void;
    protected firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-icon-button': SchmnacyIconButton;
    }
}
export {};
