import { html, css, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { $LitElement } from '@mixins/index';
import { Observable } from 'rxjs';

export type ObservableGuardResult = Observable<boolean>;

// Component types that can be passed to routes
export type RouteComponent =
  | string // Tag name
  | CustomElementConstructor // Constructor function
  | HTMLElement // Existing element
  | TemplateResult<1> // Lit template
  | (() => Promise<{ default: CustomElementConstructor }>) // Lazy loader
  | Promise<{ default: CustomElementConstructor }>; // Dynamic import

export interface RouteConfig {
  when: string;
  component: RouteComponent;
  exact?: boolean;
  guard?:  ObservableGuardResult;
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
  component!: RouteComponent;

  @property({ type: Boolean })
  exact?: boolean = false;

  @property({ type: Object })
  guard?:ObservableGuardResult ;

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