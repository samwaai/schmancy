import { LitElement } from 'lit';
declare const SchmancyCard_base: import("@mixins/index").Constructor<CustomElementConstructor> & import("@mixins/index").Constructor<import("@mixins/index").ITailwindElementMixin> & import("@mixins/index").Constructor<LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
/**
 * Material Design card — a surface-level container for grouping related content with media / content / actions slots.
 *
 * @element schmancy-card
 * @summary Use for discrete pieces of content that appear in a list (a product, a note, a message). Combine with schmancy-card-media / schmancy-card-content / schmancy-card-action children.
 * @example
 * <schmancy-card type="elevated" href="/items/42">
 *   <schmancy-card-media src="/thumb.jpg" alt="Thumbnail"></schmancy-card-media>
 *   <schmancy-card-content>
 *     <h3>Title</h3>
 *     <p>One-line description of the card's content.</p>
 *   </schmancy-card-content>
 *   <schmancy-card-action>
 *     <schmancy-button variant="text">Open</schmancy-button>
 *   </schmancy-card-action>
 * </schmancy-card>
 * @platform div - Styled `<div>`; becomes an `<a>` when `href` is set so the whole card is a single interactive surface. Degrades to a plain div/a if the tag never registers.
 */
export default class SchmancyCard extends SchmancyCard_base {
    protected static shadowRootOptions: {
        mode: string;
        delegatesFocus: boolean;
        clonable?: boolean;
        customElementRegistry?: CustomElementRegistry;
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
    private _updateAriaAttributes;
    private _addRipple;
    private _navigate;
    private _triggerAction;
    private handleClick;
    private handleKeyDown;
    private handleKeyUp;
    private _setPressed;
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
