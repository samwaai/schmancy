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
    examples?: string[];
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
export type FindForResult = {
    tag: string;
    score: number;
    summary?: string;
    examples?: string[];
};
/**
 * Keyword search over the component manifest. Tokenizes the query the same
 * way each component's `summary + description + examples` were tokenized,
 * and returns the components with the most overlap. Tag-name token matches
 * count for 3× a body-text match.
 *
 * Designed to catch the "I'm reaching for a custom component, what does
 * schmancy ship?" gap without bringing in a vector-embedding dependency.
 *
 * @example
 * window.schmancy.findFor('status pill')
 * // → [{ tag: 'schmancy-badge', score: 4, summary: '…', examples: [...] }]
 *
 * window.schmancy.findFor('initials avatar')
 * // → [{ tag: 'schmancy-avatar', score: 5, ... }]
 *
 * window.schmancy.findFor('xyz123nonexistent') // → []
 */
export declare function findFor(query: string, limit?: number): FindForResult[];
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
