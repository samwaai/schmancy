import { LitElement } from 'lit';
export interface szkButtonEventMap {
    szkFocus: CustomEvent<void>;
    szkBlur: CustomEvent<void>;
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
     * @default 'primary'
     * @public
     */
    variant: 'primary' | 'secondary' | 'special' | 'basic';
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
    size: 'sm' | 'md' | 'lg';
    /**
     * The icon to display in the button.
     * @attr
     * @type {'next' | 'close' | undefined}
     * @default undefined
     */
    icon: 'next' | 'close' | undefined;
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
    protected get imgsClasses(): string[];
    protected get buttonClasses(): {
        'rounded-md inline-flex justify-center items-center focus:outline-none': boolean;
        'bg-white text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50': boolean;
        'text-white border-transparent bg-[#3F3F3F]': boolean;
        'opacity-40': boolean;
        'px-[10px] py-[5px] text-sm font-medium gap-[4px] rounded-full': boolean;
        'px-[12px] py-2 text-base gap-[4px]': boolean;
        'px-[20px] py-3 text-base font-medium gap-[10px]': boolean;
        'w-full tex-center': boolean;
    };
    firstUpdated(): void;
    buttonVariantToTextColor(): "white" | "primary";
    click(): void;
    protected render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-button': SchmnacyButton;
    }
}
export {};
