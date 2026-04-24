import { $LitElement } from '@mixins/index'
import { css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import '../layout/scroll/scroll'
import { Subject, fromEvent, merge, EMPTY, timer, combineLatest } from 'rxjs'
import { debounceTime, switchMap, takeUntil, distinctUntilChanged, map, tap, startWith } from 'rxjs/operators'
import { theme } from '../theme/theme.service'
import { fromResizeObserver } from '../directives/layout'

/**
 * Mobile-first page container — fills remaining viewport height, suppresses double-tap zoom / pull-to-refresh / rubber-banding. Lays children in a CSS grid whose row template is `rows`.
 *
 * @element schmancy-page
 * @summary The root of any app view — wraps header / main / footer children in a full-viewport grid. Use rows="auto_1fr_auto" to make the middle child scroll while header/footer stay pinned.
 * @example
 * <schmancy-page rows="auto_1fr_auto">
 *   <schmancy-nav-drawer-appbar>Title</schmancy-nav-drawer-appbar>
 *   <main>Scrollable content</main>
 *   <schmancy-navigation-bar></schmancy-navigation-bar>
 * </schmancy-page>
 * @platform div - Full-height CSS-grid container. Degrades to a plain div if the tag never registers — children still flow vertically but without the height fill and gesture suppression.
 */
@customElement('schmancy-page')
export class SchmancyPage extends $LitElement(css`
	:host {
		display: block;
		box-sizing: border-box;
		touch-action: pan-x pan-y;
		overscroll-behavior: none;
		-webkit-tap-highlight-color: transparent;
	}
`) {
	/** Custom grid-template-rows using underscores (e.g. "1fr_2fr_auto") */
	@property({ type: String })
	rows = 'auto_1fr_auto'

	@property({ type: Boolean, attribute: 'show-scrollbar' })
	showScrollbar = false

	@property({ type: Boolean, attribute: 'no-select' })
	noSelect = false

	private heightDisconnecting$ = new Subject<void>()

	private calculateHeight(): number {
		const viewportHeight = window.visualViewport?.height ?? window.innerHeight
		const topOffset = this.getBoundingClientRect().top
		return Math.max(0, viewportHeight - topOffset)
	}

	private applyHeight(height: number, bottomPadding: number) {
		this.style.height = `${height}px`
		this.style.paddingBottom = `${bottomPadding}px`
	}

	private setupHeightStream() {
		// Shared resize stream
		const windowResize$ = fromEvent(window, 'resize', { passive: true })
		const viewportEvents$ = window.visualViewport
			? merge(
					fromEvent(window.visualViewport, 'resize', { passive: true }),
					fromEvent(window.visualViewport, 'scroll', { passive: true })
				)
			: windowResize$
		const orientation$ = fromEvent(window, 'orientationchange')
		const focusOut$ = fromEvent(document, 'focusout', { passive: true }).pipe(
			switchMap(() => timer(100))
		)

		const globalEvents$ = merge(windowResize$, viewportEvents$, orientation$, focusOut$).pipe(
			debounceTime(16)
		)

		// Parent resize detects layout shifts
		const parentResize$ = this.parentElement
			? fromResizeObserver(this.parentElement)
			: EMPTY

		// Combine all sources, calculate height and padding, dedupe, apply
		combineLatest([
			merge(parentResize$, globalEvents$).pipe(startWith(null)),
			theme.bottomOffset$,
			theme.fullscreen$
		]).pipe(
			map(([, bottomOffset, isFullscreen]) => ({
				height: this.calculateHeight(),
				padding: isFullscreen ? 0 : bottomOffset
			})),
			distinctUntilChanged((a, b) => a.height === b.height && a.padding === b.padding),
			tap(({ height, padding }) => this.applyHeight(height, padding)),
			takeUntil(this.heightDisconnecting$)
		).subscribe()
	}

	connectedCallback() {
		super.connectedCallback()
		// Auto-assign semantic elements to slots
		this.querySelectorAll(':scope > header').forEach(el => el.setAttribute('slot', 'header'))
		this.querySelectorAll(':scope > footer').forEach(el => el.setAttribute('slot', 'footer'))
		// Setup fullHeight on host
		this.setupHeightStream()
	}

	disconnectedCallback() {
		super.disconnectedCallback()
		this.heightDisconnecting$.next()
	}

	protected render() {
		return html`
			<section
				class=${this.classMap({
					'grid overflow-hidden h-full': true,
					'select-none': this.noSelect,
				})}
				style="grid-template-rows: ${this.rows.replace(/_/g, ' ')}"
			>
				<slot name="header"></slot>
				<schmancy-scroll ?hide=${!this.showScrollbar}><slot></slot></schmancy-scroll>
				<schmancy-scroll ?hide=${!this.showScrollbar}>
					<slot name="footer"></slot>
				</schmancy-scroll>
			</section>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-page': SchmancyPage
	}
}
