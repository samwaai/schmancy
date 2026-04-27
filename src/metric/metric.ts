import { TailwindElement } from '@mixins/index'
import { css, html, nothing } from 'lit'
import { customElement, property } from 'lit/decorators.js'

export type MetricTrend = 'up' | 'down' | 'neutral'
export type MetricSize = 'sm' | 'md' | 'lg'

/**
 * KPI metric — a label + value pair for dashboards, with optional trend + delta indicators.
 *
 * @element schmancy-metric
 * @summary The building block of dashboards and meta bars. Pass `label` + `value` for a basic stat; add `trend` / `delta` for the delta-from-last-period pattern. Use multiple metrics side-by-side with Tailwind flex/grid utilities.
 * @example
 * <schmancy-metric label="In flight" value="4"></schmancy-metric>
 * <schmancy-metric label="Open value" value="€165,900" trend="up" delta="+12%"></schmancy-metric>
 * <schmancy-metric label="Error rate" value="0.3%" trend="down" delta="-0.1%"></schmancy-metric>
 * @platform div - Styled `<div>` with two text lines + optional trend arrow. Degrades to a plain div+spans if the tag never registers.
 * @slot - Optional custom value rendering (overrides the `value` attribute if present).
 * @slot label - Optional custom label rendering (overrides the `label` attribute if present).
 * @csspart label - The label line.
 * @csspart value - The value line.
 * @csspart delta - The delta pill (only when `delta` is set).
 */
@customElement('schmancy-metric')
export class SchmancyMetric extends TailwindElement(css`
	:host {
		display: inline-flex;
		flex-direction: column;
		gap: 0.25rem;
		min-width: 0;
	}
	:host([size='sm']) .label { font-size: 0.6875rem; }
	:host([size='sm']) .value { font-size: 1.25rem; }
	:host([size='md']) .label { font-size: 0.75rem; }
	:host([size='md']) .value { font-size: 1.75rem; }
	:host([size='lg']) .label { font-size: 0.8125rem; }
	:host([size='lg']) .value { font-size: 2.5rem; }
	.label {
		font-weight: 500;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--schmancy-sys-color-surface-onVariant);
	}
	.value {
		font-weight: 600;
		line-height: 1.1;
		color: var(--schmancy-sys-color-surface-on);
		font-variant-numeric: tabular-nums;
	}
	.delta {
		display: inline-flex;
		align-items: center;
		gap: 0.125rem;
		font-size: 0.75rem;
		font-weight: 600;
		padding: 0.125rem 0.375rem;
		border-radius: 999px;
		font-variant-numeric: tabular-nums;
	}
	.delta[data-trend='up'] {
		color: var(--schmancy-sys-color-success-on);
		background: var(--schmancy-sys-color-success-default);
	}
	.delta[data-trend='down'] {
		color: var(--schmancy-sys-color-error-on);
		background: var(--schmancy-sys-color-error-default);
	}
	.delta[data-trend='neutral'] {
		color: var(--schmancy-sys-color-surface-on);
		background: var(--schmancy-sys-color-surface-containerHigh);
	}
	.arrow {
		font-size: 0.625rem;
		line-height: 1;
	}
	.row {
		display: inline-flex;
		align-items: baseline;
		gap: 0.5rem;
		flex-wrap: wrap;
	}
`) {
	/** Upper-case caption shown above the value. */
	@property({ type: String }) label = ''

	/** Primary metric value, rendered large. Pre-format numbers/currency yourself. */
	@property({ type: String }) value = ''

	/** Optional trend direction. Controls the color + arrow on the delta pill. */
	@property({ type: String, reflect: true }) trend?: MetricTrend

	/** Optional delta copy displayed in a pill next to the value (e.g. `+12%`). */
	@property({ type: String }) delta?: string

	/** Size scale affecting label + value typography. */
	@property({ type: String, reflect: true }) size: MetricSize = 'md'

	private _arrowFor(trend: MetricTrend | undefined): string {
		if (trend === 'up') return '↑'
		if (trend === 'down') return '↓'
		return '→'
	}

	protected render(): unknown {
		const trend = this.trend ?? 'neutral'
		return html`
			<span class="label" part="label"><slot name="label">${this.label}</slot></span>
			<span class="row">
				<span class="value" part="value"><slot>${this.value}</slot></span>
				${this.delta
					? html`
							<span class="delta" part="delta" data-trend=${trend}>
								${this.trend ? html`<span class="arrow" aria-hidden="true">${this._arrowFor(this.trend)}</span>` : nothing}
								${this.delta}
							</span>
						`
					: nothing}
			</span>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-metric': SchmancyMetric
	}
}
