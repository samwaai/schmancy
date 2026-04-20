/**
 * Backward compatibility alias — schmancy-float is now schmancy-window.
 *
 * Existing consumers using <schmancy-float> continue to work.
 * New code should use <schmancy-window> directly.
 */
import SchmancyWindow from '../window/window.js';
export default class SchmancyFloat extends SchmancyWindow {
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-float': SchmancyFloat;
    }
}
