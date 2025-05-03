/**
 * Compatibility layer for schmancy-tabs-group (which is the more correct plural form)
 * that aliases to schmancy-tab-group for backward compatibility
 */
import SchmancyTabGroup from './tabs-group';
declare class SchmancyTabsGroup extends SchmancyTabGroup {
}
export default SchmancyTabsGroup;
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-tabs-group': SchmancyTabsGroup;
    }
}
