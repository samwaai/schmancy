/**
 * Nebula Directive v3 - Surreal Dimensional Rift
 *
 * A surreal, otherworldly cosmic loading effect inspired by deep-space imagery
 * but rendered as a dimensional rift — chromatic aberration channels, iridescent
 * hue-cycling core, event horizon pulse, bioluminescent tendrils, and quantum
 * particles — all implemented with CSS @keyframes for GPU-composited performance.
 *
 * ## Performance (v3 architecture):
 * - 6 DOM layers with CSS @keyframes (no JS in hot path)
 * - Shared NebulaCoordinator singleton (1 IntersectionObserver for all instances)
 * - Visibility gating via CSS class toggle (`paused`/`running`)
 * - `contain: strict` + `translateZ(0)` for compositor promotion
 * - `animation-play-state` pauses when off-screen or tab hidden
 *
 * ## Visual layers (back to front):
 * 1. Cosmic Dust + Void — static dark filaments, vignette, void pockets (multiply, zero animation cost)
 * 2. Chromatic Red — aberration channel shifted right (screen blend)
 * 3. Chromatic Blue — aberration channel shifted left (screen blend)
 * 4. Iridescent Core + Event Horizon — hue-rotate cycling center (screen blend)
 * 5. Bioluminescent Tendrils — organic breathing gas wisps (screen blend)
 * 6. Quantum Particles — scattered hue-shifting dots (screen blend)
 *
 * Uses spring physics from Blackbird animation system for organic motion.
 * Respects prefers-reduced-motion for accessibility.
 *
 * Usage:
 * ```ts
 * html`<div ${nebula()}>Content</div>`
 * html`<div ${nebula({ active: this.loading })}>Content</div>`
 * html`<div ${nebula({ active: true, temperature: -0.5 })}>Content</div>`
 * ```
 */
import { AsyncDirective } from 'lit/async-directive.js';
import type { ElementPart } from 'lit';
export interface NebulaOptions {
    /** Whether the nebula is active/visible. Default: true (auto-shows, auto-hides after autoHideDuration) */
    active?: boolean;
    /** Auto-hide after this duration (ms). Set to 0 to disable. Default: 3000 */
    autoHideDuration?: number;
    /** Render behind content instead of on top. Default: true */
    background?: boolean;
    /** Overall brightness/intensity (0-1). Default: 1 */
    intensity?: number;
    /** Blur amount multiplier. Default: 1 */
    blur?: number;
    /** Animation speed multiplier (0.5 = half speed, 2 = double speed). Default: 1 */
    speed?: number;
    /** Fade-in duration (ms). Default: 1000 */
    fadeInDuration?: number;
    /** Fade-out duration (ms). Default: 8000 */
    fadeOutDuration?: number;
    /** Opacity when idle/dimmed (0-1). Set to 0 to fully hide. Default: 0.6 */
    idleOpacity?: number;
    /** Whether idle state continues breathing. Default: true */
    idleBreathe?: boolean;
    /** Color temperature shift (-1 = cool/blue, 0 = neutral, 1 = warm/pink). Default: 0 */
    temperature?: number;
    /** Chromatic aberration intensity (0-1). Default: 1 */
    chromaticAberration?: number;
    /** Number of quantum particles. Default: 8 */
    particleCount?: number;
}
declare class NebulaDirective extends AsyncDirective {
    private state;
    private coordinator;
    render(_options?: NebulaOptions): symbol;
    update(part: ElementPart, [options]: [NebulaOptions?]): symbol;
    onVisibilityChange(isVisible: boolean): void;
    private show;
    private awakenOverlay;
    private createOverlay;
    private scheduleAutoHide;
    private hide;
    private cleanup;
    disconnected(): void;
    reconnected(): void;
}
export declare const nebula: (_options?: NebulaOptions) => import("lit-html/directive").DirectiveResult<typeof NebulaDirective>;
export {};
