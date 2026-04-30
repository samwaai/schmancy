/**
 * Timeline tile — one cell in a procurement-stage rail.
 *
 * Three render states (one component, four `state` values):
 *   - `empty`         dashed-border outline + glyph
 *   - `filled`        paper-card with glyph; hoverable / focusable / clickable
 *   - `stack-top`     paper-card on top of N siblings; carries the ×N badge
 *   - `stack-sibling` paper-card behind the top; revealed when the wrapper
 *                     is fanned
 *
 * Stack fan is coordinated by a `data-fanned` attribute on the parent
 * wrapper element. The `stack-top` tile owns the orchestration: a
 * `pointerover` pipe on the wrapper element with hover-intent (immediate
 * enter, 800ms leave debounce) toggles the attribute. Sibling tiles read
 * the attribute via the `:host-context([data-fanned])` selector. Native
 * `:hover` would drop the moment the cursor crosses the gap between
 * fanned siblings; the attribute survives that crossing because the
 * pointerover stream stays on the wrapper subtree.
 */
import { SchmancyElement } from '@mixins/index'
import { css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { when } from 'lit/directives/when.js'
import {
	EMPTY,
	Observable,
	distinctUntilChanged,
	fromEvent,
	map,
	of,
	switchMap,
	takeUntil,
	timer,
} from 'rxjs'

export type TimelineTileState = 'empty' | 'filled' | 'stack-top' | 'stack-sibling'

export type TimelineTileClickEvent = CustomEvent<{
	glyph: string
	state: TimelineTileState
}>

@customElement('schmancy-timeline-tile')
export class SchmancyTimelineTile extends SchmancyElement {
	static styles = [css`
	:host {
		--schmancy-tile-w: 32px;
		--schmancy-tile-h: 40px;
		display: inline-block;
		position: relative;
		width: var(--schmancy-tile-w);
		height: var(--schmancy-tile-h);
		font-size: 14px;
		line-height: 1.45;
	}

	/* Inner box that paints the cell. The host is a layout container only;
	   the box owns the border / background / hover transform so the host
	   stays a clean focus target. */
	.tile {
		position: absolute;
		inset: 0;
		border-radius: 2px;
		overflow: visible;
		appearance: none;
		padding: 0;
		font: inherit;
		color: inherit;
		background: transparent;
		z-index: 1;
		transition:
			transform 120ms ease-in-out,
			box-shadow 120ms ease-in-out,
			border-color 120ms ease-in-out;
	}

	/* Empty state */
	:host([state='empty']) .tile {
		border: 1px dashed var(--schmancy-sys-color-outline);
		background: transparent;
		cursor: default;
	}

	:host([state='empty']) .glyph {
		color: var(--schmancy-sys-color-surface-onVariant);
		opacity: 0.7;
	}

	/* Shared filled-state card styling (filled / stack-top / stack-sibling) */
	:host([state='filled']) .tile,
	:host([state='stack-top']) .tile,
	:host([state='stack-sibling']) .tile {
		border: 1px solid var(--schmancy-sys-color-outline);
		background: var(--schmancy-sys-color-surface-containerLowest);
		cursor: pointer;
		box-shadow: 0 1px 0 rgba(0, 0, 0, 0.02);
	}

	/* Paper-card line texture: five thin lines emulating ruled paper */
	:host([state='filled']) .tile::before,
	:host([state='stack-top']) .tile::before,
	:host([state='stack-sibling']) .tile::before {
		content: '';
		position: absolute;
		left: 4px;
		right: 4px;
		top: 16px;
		bottom: 5px;
		background-image:
			linear-gradient(var(--schmancy-sys-color-outline) 1px, transparent 1px),
			linear-gradient(var(--schmancy-sys-color-outline) 1px, transparent 1px),
			linear-gradient(var(--schmancy-sys-color-outline) 1px, transparent 1px),
			linear-gradient(var(--schmancy-sys-color-outline) 1px, transparent 1px),
			linear-gradient(var(--schmancy-sys-color-outline) 1px, transparent 1px);
		background-repeat: no-repeat;
		background-size:
			100% 1px,
			80% 1px,
			92% 1px,
			65% 1px,
			78% 1px;
		background-position:
			0 0,
			0 4px,
			0 8px,
			0 12px,
			0 16px;
		opacity: 0.3;
		pointer-events: none;
		z-index: 0;
	}

	/* Tinted accent strip across the top edge */
	:host([state='filled']) .tile::after,
	:host([state='stack-top']) .tile::after,
	:host([state='stack-sibling']) .tile::after {
		content: '';
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		height: 11px;
		background: color-mix(
			in oklch,
			var(--schmancy-sys-color-primary-default) 10%,
			transparent
		);
		border-bottom: 1px solid
			color-mix(
				in oklch,
				var(--schmancy-sys-color-primary-default) 25%,
				var(--schmancy-sys-color-outline)
			);
		pointer-events: none;
	}

	:host([state='filled']) .glyph,
	:host([state='stack-top']) .glyph,
	:host([state='stack-sibling']) .glyph {
		color: var(--schmancy-sys-color-primary-onContainer);
	}

	/* Single-card hover: lift 1px + soft shadow */
	:host([state='filled']) .tile:hover {
		border-color: var(--schmancy-sys-color-primary-default);
		transform: translateY(-1px);
		box-shadow: 0 3px 8px rgba(0, 0, 0, 0.06);
	}

	/* Focus ring in primary color */
	:host([state='filled']) .tile:focus-visible,
	:host([state='stack-top']) .tile:focus-visible,
	:host([state='stack-sibling']) .tile:focus-visible {
		outline: 2px solid var(--schmancy-sys-color-primary-default);
		outline-offset: 3px;
	}

	/* Stacked tiles position absolutely on the host's grid cell so the
	   wrapper's --fan-count / --i custom properties drive the offset. */
	:host([state='stack-top']),
	:host([state='stack-sibling']) {
		position: absolute;
		top: 0;
		left: 0;
		transition:
			transform 200ms cubic-bezier(0.2, 0.8, 0.2, 1),
			box-shadow 200ms cubic-bezier(0.2, 0.8, 0.2, 1);
		transform: translate(
			calc((var(--fan-count, 1) - 1 - var(--i, 0)) * -3px),
			calc((var(--fan-count, 1) - 1 - var(--i, 0)) * 3px)
		);
	}

	/* Sibling tiles only become interactive once the wrapper is fanned —
	   otherwise they're stacked underneath and would steal pointer events
	   from the top card. */
	:host([state='stack-sibling']) {
		pointer-events: none;
	}

	/* Fanned: every tile slides edge-to-edge along the wrapper's row */
	:host([state='stack-top']:host-context([data-fanned])),
	:host-context([data-fanned]):host([state='stack-top']) {
		transform: translate(
			calc((var(--fan-count, 1) - 1 - var(--i, 0)) * var(--schmancy-tile-w) * -1),
			0
		);
		box-shadow: 0 3px 8px rgba(0, 0, 0, 0.06);
	}

	:host([state='stack-sibling']:host-context([data-fanned])),
	:host-context([data-fanned]):host([state='stack-sibling']) {
		pointer-events: auto;
		transform: translate(
			calc((var(--fan-count, 1) - 1 - var(--i, 0)) * var(--schmancy-tile-w) * -1),
			0
		);
		box-shadow: 0 3px 8px rgba(0, 0, 0, 0.06);
	}

	:host-context([data-fanned]):host([state='stack-top']) .tile:hover,
	:host-context([data-fanned]):host([state='stack-sibling']) .tile:hover {
		border-color: var(--schmancy-sys-color-primary-default);
		box-shadow: 0 6px 14px rgba(0, 0, 0, 0.1);
	}

	.glyph {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 11px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 7.5px;
		font-weight: 500;
		letter-spacing: 0.12em;
		line-height: 1;
		z-index: 1;
		font-variant-caps: all-petite-caps;
	}

	.tooltip {
		position: absolute;
		bottom: calc(100% + 6px);
		left: 50%;
		transform: translate(-50%, 2px);
		font-size: 10px;
		line-height: 1.2;
		color: var(--schmancy-sys-color-surface-on);
		background: var(--schmancy-sys-color-surface-containerLowest);
		border: 1px solid var(--schmancy-sys-color-outline);
		padding: 2px 6px;
		border-radius: 3px;
		white-space: nowrap;
		opacity: 0;
		pointer-events: none;
		transition:
			opacity 150ms ease-in-out,
			transform 150ms ease-in-out;
		z-index: 2;
	}

	.tile:hover .tooltip,
	.tile:focus-visible .tooltip {
		opacity: 1;
		transform: translate(-50%, 0);
	}

	.caption {
		position: absolute;
		top: calc(100% + 6px);
		left: 50%;
		transform: translateX(-50%);
		font-size: 11px;
		line-height: 1.2;
		font-weight: 500;
		white-space: nowrap;
		color: var(--schmancy-sys-color-surface-on);
		font-variant-numeric: tabular-nums;
	}

	.stack-count {
		position: absolute;
		top: -5px;
		right: -7px;
		min-width: 14px;
		height: 14px;
		padding: 0 4px;
		border-radius: 7px;
		background: var(--schmancy-sys-color-primary-default);
		color: var(--schmancy-sys-color-primary-on);
		font-size: 9px;
		font-weight: 500;
		line-height: 14px;
		text-align: center;
		z-index: 10;
		pointer-events: none;
		transition: opacity 150ms ease-in-out;
	}

	:host-context([data-fanned]) .stack-count {
		opacity: 0;
	}
`]

	@property({ type: String, reflect: true }) state: TimelineTileState = 'empty'

	@property({ type: String }) glyph = ''

	@property({ type: Number, attribute: 'stack-count' }) stackCount?: number

	@property({ type: Number, reflect: true }) index?: number

	@property({ type: String }) tooltip?: string

	@property({ type: String }) caption?: string

	override connectedCallback(): void {
		super.connectedCallback()

		// Mirror `index` onto the host's `--i` custom property so the
		// fan-offset transforms don't depend on the consumer setting both
		// the prop and an inline style.
		if (this.index !== undefined) {
			this.style.setProperty('--i', String(this.index))
		}

		// Stack-top owns the fan orchestration. The pointerover stream lives
		// on the parent wrapper (the element holding all sibling tiles); a
		// hover-intent pipe drives the `data-fanned` attribute on that
		// wrapper. Enter is immediate (`of(wrapper)`); leave waits 800ms
		// (`timer(800)`) so the cursor can cross the gap between fanned
		// cards without collapsing the stack. The inner Observable's
		// subscription lifetime IS the fanned state — subscribe sets the
		// attribute, teardown removes it.
		if (this.state !== 'stack-top') return
		const wrapper = this.parentElement
		if (!wrapper) return

		fromEvent<PointerEvent>(wrapper, 'pointerover')
			.pipe(
				map(
					(e) =>
						(e.target as HTMLElement | null)?.closest<HTMLElement>(
							'[data-stack-id]',
						) ?? null,
				),
				distinctUntilChanged(),
				switchMap((target) =>
					target === wrapper ? of(wrapper) : timer(800).pipe(map(() => null)),
				),
				distinctUntilChanged(),
				switchMap((target) =>
					target
						? new Observable<never>(() => {
								target.setAttribute('data-fanned', '')
								return () => target.removeAttribute('data-fanned')
							})
						: EMPTY,
				),
				takeUntil(this.disconnecting),
			)
			.subscribe()
	}

	protected override updated(changed: Map<string, unknown>): void {
		super.updated(changed)
		if (changed.has('index') && this.index !== undefined) {
			this.style.setProperty('--i', String(this.index))
		}
	}

	private _onClick = (): void => {
		if (this.state === 'empty') return
		this.dispatchEvent(
			new CustomEvent<TimelineTileClickEvent['detail']>('tile-click', {
				detail: { glyph: this.glyph, state: this.state },
				bubbles: true,
				composed: true,
			}),
		)
	}

	private _ariaLabel(): string {
		const parts = [this.glyph]
		if (this.caption) parts.push(this.caption)
		if (this.tooltip) parts.push(this.tooltip)
		if (this.state === 'empty') parts.push('empty')
		return parts.join(' · ')
	}

	protected override render(): unknown {
		const isInteractive = this.state !== 'empty'
		const ariaLabel = this._ariaLabel()
		return html`
			<button
				type="button"
				class="tile"
				role=${isInteractive ? 'button' : 'presentation'}
				tabindex=${isInteractive ? 0 : -1}
				aria-label=${ariaLabel}
				?disabled=${!isInteractive}
				@click=${this._onClick}
			>
				<span class="glyph">${this.glyph}</span>
				${when(
					this.tooltip && isInteractive,
					() => html`<span class="tooltip">${this.tooltip}</span>`,
				)}
				${when(
					this.caption && this.state !== 'stack-sibling',
					() => html`<span class="caption">${this.caption}</span>`,
				)}
				${when(
					this.state === 'stack-top' &&
						this.stackCount !== undefined &&
						this.stackCount > 1,
					() => html`<span class="stack-count">×${this.stackCount}</span>`,
				)}
			</button>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-timeline-tile': SchmancyTimelineTile
	}
}
