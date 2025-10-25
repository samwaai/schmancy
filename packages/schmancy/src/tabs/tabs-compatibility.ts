/**
 * Compatibility layer for schmancy-tabs-group (which is the more correct plural form)
 * that aliases to schmancy-tab-group for backward compatibility
 */
import SchmancyTabGroup from './tabs-group';

// Create a simple class extends the original tab group
class SchmancyTabsGroup extends SchmancyTabGroup {}

// Register the alias element
customElements.define('schmancy-tabs-group', SchmancyTabsGroup);

export default SchmancyTabsGroup;

// Add the type definition to ensure TypeScript recognizes the element
declare global {
  interface HTMLElementTagNameMap {
    'schmancy-tabs-group': SchmancyTabsGroup;
  }
}