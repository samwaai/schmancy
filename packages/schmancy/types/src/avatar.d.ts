export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type AvatarColor = 'primary' | 'secondary' | 'tertiary' | 'success' | 'error' | 'neutral';
export type AvatarShape = 'circle' | 'square';
export type AvatarStatus = 'online' | 'offline' | 'busy' | 'away' | 'none';
declare const SchmancyAvatar_base: CustomElementConstructor & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
/**
 * A customizable avatar component that displays initials or an icon
 * Designed to match the Schmancy design system
 *
 * @element schmancy-avatar
 *
 * @property {string} initials - Text initials to display (limited to 2 characters)
 * @property {string} src - URL of an image to display
 * @property {string} icon - Name of an icon to display
 * @property {AvatarSize} size - Size of the avatar (xs, sm, md, lg, xl)
 * @property {AvatarColor} color - Color theme of the avatar
 * @property {AvatarShape} shape - Shape of the avatar (circle or square)
 * @property {boolean} bordered - Whether to add a border around the avatar
 * @property {AvatarStatus} status - Optional status indicator to display
 *
 * @example
 * <schmancy-avatar
 *   initials="JD"
 *   size="md"
 *   color="primary"
 * ></schmancy-avatar>
 */
export declare class SchmancyAvatar extends SchmancyAvatar_base {
    initials: string;
    src: string;
    icon: string;
    size: AvatarSize;
    color: AvatarColor;
    shape: AvatarShape;
    bordered: boolean;
    status: AvatarStatus;
    render(): import("lit-html").TemplateResult<1>;
    private getColorAttributes;
    private renderStatusIndicator;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-avatar': SchmancyAvatar;
    }
}
export {};
