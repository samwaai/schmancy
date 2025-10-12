import { LitElement, PropertyValueMap } from 'lit';
import { ButtonVariant } from './button';
declare const SchmnacyIconButton_base: CustomElementConstructor & import("@mixins/index").Constructor<LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
/**
 * An icon button component.
 * @element schmancy-icon-button
 * @slot - The default slot.
 */
export declare class SchmnacyIconButton extends SchmnacyIconButton_base {
    protected static shadowRootOptions: {
        mode: string;
        delegatesFocus: boolean;
        clonable?: boolean;
        customElementRegistry?: CustomElementRegistry;
        serializable?: boolean;
        slotAssignment?: SlotAssignmentMode;
    };
    private nativeElement;
    private _ariaLabel;
    /**
     * The size of the icon.
     * @attr
     * @default 'md'
     */
    size: 'sm' | 'md' | 'lg' | 'xl';
    /**
     * The variant of the button.
     * @attr
     * @default 'text'
     */
    variant: ButtonVariant;
    /**
     * The width of the button.
     * @attr
     * @type {'full' | 'auto'}
     * @default 'auto'
     */
    width: 'full' | 'auto';
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
    /**
     * Render slot content as text instead of wrapping in schmancy-icon.
     * Use this when you want to display text labels in the button.
     * @attr
     */
    text: boolean;
    set ariaLabel(value: string);
    get ariaLabel(): string;
    /** Sets focus in the button. */
    focus(options?: FocusOptions): void;
    /** Removes focus from the button. */
    blur(): void;
    click(): void;
    private _preventDefault;
    protected firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-icon-button': SchmnacyIconButton;
    }
}
export {};
