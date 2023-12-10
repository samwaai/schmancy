import { LitElement } from 'lit';
import { ButtonVariant } from './types';
export interface SchmancyButtonEventMap {
    SchmancyFocus: CustomEvent<void>;
    SchmancyBlur: CustomEvent<void>;
}
declare const SchmnacyButton_base: import("..").Constructor<CustomElementConstructor> & import("..").Constructor<import("@schmancy/mixin/tailwind/tailwind.mixin").ITailwindElementMixin> & import("..").Constructor<LitElement> & import("..").Constructor<import("..").IBaseMixin>;
export declare class SchmnacyButton extends SchmnacyButton_base {
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
     * @default 'elevated'
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
    protected get buttonClasses(): {
        'h-[40px] shadow-0 px-[24px] rounded-full inline-flex justify-center items-center focus:outline-none': boolean;
        'opacity-40': boolean;
        'w-full tex-center': boolean;
        'bg-surface-low text-primary-default shadow-1 hover:shadow-2': boolean;
        'bg-transparent text-primary-default border-1 border-outline hover:shadow-1': boolean;
        'bg-primary-default text-primary-on hover:shadow-1 hover:bg-primary-default/80': boolean;
        'bg-secondary-container text-secondary-onContainer hover:shadow-1': boolean;
        'text-primary-default hover:shadow-1': boolean;
    };
    firstUpdated(): void;
    click(): void;
    protected render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-button': SchmnacyButton;
    }
}
export {};
