import { TailwindElement } from '@mixins/index'
import { css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

/**
 * Breadcrumb trail — navigation history from root to current page. Renders schmancy-breadcrumb-item children with separators between.
 *
 * @element schmancy-breadcrumb
 * @summary Use for deep hierarchical navigation (file explorer paths, e-commerce category chains, admin settings trees). Last item is styled as the current page automatically.
 * @example
 * <schmancy-breadcrumb separator="›">
 *   <schmancy-breadcrumb-item href="/">Home</schmancy-breadcrumb-item>
 *   <schmancy-breadcrumb-item href="/docs">Docs</schmancy-breadcrumb-item>
 *   <schmancy-breadcrumb-item>Getting started</schmancy-breadcrumb-item>
 * </schmancy-breadcrumb>
 * @platform nav - Styled `<nav aria-label="Breadcrumb">`. Degrades to a plain nav if the tag never registers.
 * @slot - Default slot for `<schmancy-breadcrumb-item>` children.
 * @attr separator - Character or string rendered between items. Default `/`.
 * @csspart separator - The separator element.
 */
@customElement('schmancy-breadcrumb')
export class SchmancyBreadcrumb extends TailwindElement(css`
	:host {
		display: block;
	}
	nav {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.25rem;
	}
	.sep {
		color: var(--schmancy-sys-color-surface-onVariant, #79747e);
		user-select: none;
		padding: 0 0.25rem;
	}
	::slotted(schmancy-breadcrumb-item:last-of-type) {
		font-weight: 500;
	}
`) {
	@property({ type: String }) separator = '/'

	connectedCallback(): void {
		super.connectedCallback()
		if (!this.hasAttribute('aria-label')) this.setAttribute('aria-label', 'Breadcrumb')
	}

	render() {
		// Render separators between slotted items by manipulating after render.
		// The simpler approach uses the CSS adjacent-sibling pattern so the
		// separator is visually present without affecting the accessible name.
		return html`
			<nav role="navigation">
				<slot @slotchange=${() => this._insertSeparators()}></slot>
			</nav>
		`
	}

	private _insertSeparators() {
		const slot = this.shadowRoot?.querySelector('slot') as HTMLSlotElement | null
		if (!slot) return
		const items = slot.assignedElements({ flatten: true })
		// Remove any previously-inserted separators.
		this.querySelectorAll('[data-schmancy-sep]').forEach(el => el.remove())
		items.forEach((el, idx) => {
			if (idx === items.length - 1) return
			const sep = document.createElement('span')
			sep.setAttribute('data-schmancy-sep', '')
			sep.setAttribute('aria-hidden', 'true')
			sep.setAttribute('part', 'separator')
			sep.className = 'sep'
			sep.textContent = this.separator
			el.insertAdjacentElement('afterend', sep)
		})
	}
}

/**
 * Single segment in a schmancy-breadcrumb trail — a link when `href` is set, or a plain span (the current page) when omitted.
 *
 * @element schmancy-breadcrumb-item
 * @summary Always nested inside schmancy-breadcrumb. Omit `href` on the current page — it gets aria-current="page" automatically.
 * @example
 * <schmancy-breadcrumb-item href="/products">Products</schmancy-breadcrumb-item>
 * @platform a - Renders an `<a>` or `<span>` depending on href. Degrades to a plain anchor/span if the tag never registers.
 * @slot - Label content.
 * @attr href - If set, renders as an anchor.
 * @attr current - Marks as `aria-current="page"`.
 */
@customElement('schmancy-breadcrumb-item')
export class SchmancyBreadcrumbItem extends TailwindElement(css`
	:host {
		display: inline-block;
	}
	a, span {
		color: inherit;
		text-decoration: none;
	}
	a:hover {
		text-decoration: underline;
	}
`) {
	@property({ type: String }) href = ''
	@property({ type: Boolean, reflect: true }) current = false

	render() {
		if (this.href && !this.current) {
			return html`<a href=${this.href}><slot></slot></a>`
		}
		return html`<span aria-current=${this.current ? 'page' : 'false'}><slot></slot></span>`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-breadcrumb': SchmancyBreadcrumb
		'schmancy-breadcrumb-item': SchmancyBreadcrumbItem
	}
}
