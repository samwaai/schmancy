declare const Layout_base: import("@mixins/index").Constructor<CustomElementConstructor> & import("@mixins/index").Constructor<import("@mixins/index").ITailwindElementMixin> & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
/**
 * @deprecated Use Tailwind CSS utility classes directly on HTML elements instead of this base class.
 * This component will be removed in a future version.
 *
 * Migration guide:
 * - Use inline styles or Tailwind utility classes for layout properties
 * - Replace properties like padding, margin, width, etc. with their CSS equivalents
 *
 * @class Layout
 */
export default class Layout extends Layout_base {
    static styles: any;
    layout: boolean;
    center: boolean | undefined;
    padding: string | undefined;
    margin: string | undefined;
    width: string | undefined;
    height: string | undefined;
    minWidth: string | undefined;
    minHeight: string | undefined;
    maxWidth: string | undefined;
    maxHeight: string | undefined;
    display: 'block' | 'inline-block' | 'inline' | 'flex' | 'inline-flex' | 'grid' | 'inline-grid' | 'table' | 'inline-table' | 'flow-root' | 'none' | undefined;
    overflow: 'visible' | 'hidden' | 'scroll' | 'auto' | undefined;
    overflowX: 'visible' | 'hidden' | 'scroll' | 'auto' | undefined;
    overflowY: 'visible' | 'hidden' | 'scroll' | 'auto' | undefined;
    position: 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky' | undefined;
    top: string | undefined;
    right: string | undefined;
    bottom: string | undefined;
    left: string | undefined;
    inset: string | undefined;
    zIndex: string | undefined;
    border: string | undefined;
    borderTop: string | undefined;
    borderRight: string | undefined;
    borderBottom: string | undefined;
    borderLeft: string | undefined;
    borderColor: string | undefined;
    borderRadius: string | undefined;
    borderWidth: string | undefined;
    boxShadow: string | undefined;
    opacity: string | undefined;
    background: string | undefined;
    backgroundImage: string | undefined;
    backgroundPosition: string | undefined;
    backgroundSize: string | undefined;
    backgroundRepeat: string | undefined;
    backgroundAttachment: string | undefined;
    backgroundColor: string | undefined;
    backgroundClip: string | undefined;
    backgroundOrigin: string | undefined;
    backgroundBlendMode: string | undefined;
    filter: string | undefined;
    backdropFilter: string | undefined;
    connectedCallback(): void;
}
export {};
