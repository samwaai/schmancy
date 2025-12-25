import { ComponentType } from '../area/router.types';
import { lightbox as lightboxDirective, type LightboxOptions } from './lightbox.directive';
export type LightboxConfig = {
    image?: string;
    images?: string[];
    index?: number;
    overlay?: ComponentType;
    component?: ComponentType;
    props?: Record<string, unknown>;
};
/**
 * Unified lightbox type - works as both directive and service
 */
export type LightboxAPI = {
    (options?: LightboxOptions): ReturnType<typeof lightboxDirective>;
    push: (config: LightboxConfig) => void;
    dismiss: () => void;
};
/**
 * Unified lightbox export - works as both directive and service:
 * - Directive: ${lightbox()} or ${lightbox({ overlay: html`...` })}
 * - Service: lightbox.push({ image, overlay: 'component-name', props })
 */
export declare const lightbox: LightboxAPI;
