import manifest from 'virtual:schmancy-manifest';
export type Manifest = typeof manifest;
export type ElementEntry = {
    kind: 'class';
    name: string;
    tagName?: string;
    description?: string;
    summary?: string;
    attributes?: Array<{
        name: string;
        description?: string;
        type?: {
            text?: string;
        };
        default?: string;
        values?: string[];
    }>;
    events?: Array<{
        name: string;
        description?: string;
        type?: {
            text?: string;
        };
    }>;
    slots?: Array<{
        name: string;
        description?: string;
    }>;
    cssProperties?: Array<{
        name: string;
        description?: string;
    }>;
    cssParts?: Array<{
        name: string;
        description?: string;
    }>;
    whenToUse?: string;
    platformPrimitive?: {
        tag: string;
        mode?: string;
        note?: string;
    };
    contexts?: {
        provides?: string[];
        consumes?: string[];
    };
};
export type ServiceEntry = {
    kind: 'variable';
    name: string;
    description?: string;
    summary?: string;
    service: true;
    methods?: Array<{
        signature: string;
        summary?: string;
    }>;
};
export declare function help(tag?: string): unknown;
export declare function tokens(): string[];
export declare function platformPrimitive(tag: string): ElementEntry['platformPrimitive'] | null;
export declare function registeredTags(): string[];
export declare function a11yAudit(): Array<{
    tag: string;
    role: string | null;
    ariaLabel: string | null;
    hasShadowRoot: boolean;
    formAssociated: boolean;
}>;
export type Capabilities = {
    popover: boolean;
    declarativeShadowDom: boolean;
    scopedRegistries: boolean;
    trustedTypes: boolean;
    cssRegisteredProperties: boolean;
    elementInternalsAria: boolean;
    formAssociated: boolean;
    adoptedStyleSheets: boolean;
};
/**
 * Runtime feature probe. Tells an agent which platform capabilities the
 * current sandbox exposes, so it can adapt without assuming the sandbox CSP
 * or browser version. Every check is feature-detect, not UA-sniff.
 */
export declare function capabilities(): Capabilities;
export declare function manifestUrl(): string;
export { manifest };
