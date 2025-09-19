import { LitElement } from 'lit';
declare const SchmancyCard_base: import("@mixins/index").Constructor<CustomElementConstructor> & import("@mixins/index").Constructor<import("@mixins/index").ITailwindElementMixin> & import("@mixins/index").Constructor<LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
export default class SchmancyCard extends SchmancyCard_base {
    protected static shadowRootOptions: {
        mode: string;
        delegatesFocus: boolean;
        serializable?: boolean;
        slotAssignment?: SlotAssignmentMode;
    };
    /**
     * The visual style of the card.
     * @default 'elevated'
     */
    type: 'elevated' | 'filled' | 'outlined';
    /**
     * Makes the card interactive (clickable).
     * @default false
     */
    interactive: boolean;
    /**
     * Disables the card.
     * @default false
     */
    disabled: boolean;
    /**
     * Indicates the card is being dragged.
     * @default false
     */
    dragged: boolean;
    /**
     * URL to navigate to when card is clicked (makes it act like a link).
     */
    href?: string;
    /**
     * Target for the link navigation.
     */
    target?: string;
    /**
     * ARIA role for accessibility.
     */
    role: string;
    /**
     * ARIA label for accessibility.
     */
    ariaLabel: string;
    pressed: boolean;
    private ripples;
    private nextRippleId;
    connectedCallback(): void;
    updated(changedProperties: Map<string, any>): void;
    private handleClick;
    private handleKeyDown;
    private handleKeyUp;
    private handleMouseDown;
    private handleMouseUp;
    private handleMouseLeave;
    protected render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-card': SchmancyCard;
    }
}
export {};
