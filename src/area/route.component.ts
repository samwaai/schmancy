import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { $LitElement } from '@mixins/index';

export type GuardResult = boolean | string | { redirect: string };

export interface RouteConfig {
  when: string;
  component: any;
  exact?: boolean;
  guard?: () => GuardResult | Promise<GuardResult>;
}

/**
 * A marker component that holds route configuration.
 * This component doesn't render anything - it's used by schmancy-area
 * to configure routing via slot change detection.
 *
 * @example
 * ```html
 * <schmancy-area>
 *   <schmancy-route
 *     when="users"
 *     .component=${UserComponent}
 *     exact
 *   ></schmancy-route>
 * </schmancy-area>
 * ```
 */
@customElement('schmancy-route')
export class SchmancyRoute extends $LitElement(css`
  :host {
    display: none;
  }
`) {
  @property({ type: String })
  when!: string;

  @property({ type: Object })
  component!: any;

  @property({ type: Boolean })
  exact?: boolean = false;

  @property({ type: Object })
  guard?: () => GuardResult | Promise<GuardResult>;

  /**
   * Returns the route configuration object
   */
  getConfig(): RouteConfig {
    return {
      when: this.when,
      component: this.component,
      exact: this.exact,
      guard: this.guard
    };
  }

  render() {
    // This is a marker component - no visual output
    return html``;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'schmancy-route': SchmancyRoute;
  }
}