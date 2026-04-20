import type { Constructor } from './constructor'
import { LitElement } from 'lit'
import { Subject, fromEvent, Observable } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import { classMap } from 'lit/directives/class-map.js'
import { styleMap } from 'lit/directives/style-map.js'
import { discoverComponent, DISCOVER_EVENT, DISCOVER_RESPONSE_EVENT, type DiscoverRequest } from './discovery.service'
import { consume } from '@lit/context'
import { themeContext } from '../src/theme/context'
import type { TSchmancyTheme } from '../src/theme/theme.interface'

export declare class IBaseMixin {
	disconnecting: Subject<boolean>
	classMap: typeof classMap
	styleMap: typeof styleMap
	discover<T extends HTMLElement>(tag: string): Observable<T | null>
	readonly stableId: string
	uid: string
	/**
	 * Current locale from theme context. Use with Intl.NumberFormat/DateTimeFormat.
	 * Defaults to navigator.language if no theme provider is found.
	 * @example new Intl.NumberFormat(this.locale).format(1234.56)
	 */
	readonly locale: string
	dispatchScopedEvent<T>(eventName: string, detail?: T, options?: { bubbles?: boolean; composed?: boolean }): void
}

export const BaseElement = <T extends Constructor<LitElement>>(superClass: T) => {
	class BaseElement extends superClass {
		disconnecting = new Subject<boolean>()
		private _stableId?: string
		private _uid?: string

		@consume({ context: themeContext, subscribe: true })
		private _theme?: Partial<TSchmancyTheme>

		/** Current locale from theme context. Falls back to navigator.language. */
		get locale(): string {
			return this._theme?.locale ?? (typeof navigator !== 'undefined' ? navigator.language : 'de-DE')
		}

		/** Stable ID from DOM path - lazy, only computed on first access */
		get stableId(): string {
			if (this._stableId) return this._stableId
			const path: string[] = []
			for (let el: Element | null = this; el?.parentElement && path.length < 5; el = el.parentElement) {
				const tag = el.tagName.toLowerCase()
				const siblings = Array.from(el.parentElement.children).filter(c => c.tagName === el!.tagName)
				path.unshift(siblings.length > 1 ? `${tag}:nth-of-type(${siblings.indexOf(el) + 1})` : tag)
			}
			const hash = Array.from(path.join('>')).reduce((h, c) => Math.imul(31, h) + c.charCodeAt(0) | 0, 0)
			return this._stableId = `el-${Math.abs(hash).toString(36)}`
		}

		/**
		 * Unique instance ID - can be overridden via attribute, otherwise auto-generated.
		 * Usage: <my-component uid="custom-id"> or let it auto-generate
		 */
		get uid(): string {
			// Check if uid was set via attribute
			const attrUid = this.getAttribute('uid')
			if (attrUid) return attrUid

			// Auto-generate if not set
			if (!this._uid) {
				this._uid = `el-${crypto.randomUUID()}`
			}
			return this._uid
		}

		set uid(value: string) {
			if (value) {
				this.setAttribute('uid', value)
			} else {
				this.removeAttribute('uid')
			}
		}

		/**
		 * Dispatch an event scoped to this component instance.
		 * Emits BOTH scoped event (eventName::uid) and generic event for backward compatibility.
		 * This prevents event collision between multiple instances of the same component.
		 */
		dispatchScopedEvent<T>(eventName: string, detail?: T, options: { bubbles?: boolean; composed?: boolean } = {}): void {
			const { bubbles = false, composed = true } = options

			// Emit scoped event for new code
			this.dispatchEvent(
				new CustomEvent(`${eventName}::${this.uid}`, {
					detail,
					bubbles,
					composed,
				})
			)

			// Emit generic event for backward compatibility
			this.dispatchEvent(
				new CustomEvent(eventName, {
					detail,
					bubbles,
					composed,
				})
			)
		}

		classMap(classes: Record<string, boolean>) {
			const newClasses: Record<string, boolean> = {}
			Object.keys(classes).forEach(key => {
				key
					.trim()
					.split(' ')
					.filter(Boolean)
					.forEach(k => {
						newClasses[k] = classes[key]
					})
			})
			return classMap(newClasses)
		}

		styleMap(styles: Record<string, string | number>) {
			return styleMap(styles)
		}

		connectedCallback() {
			super.connectedCallback()
			this.setupDiscoveryResponse()
		}

		private setupDiscoveryResponse() {
			const tagName = this.tagName.toLowerCase()
			const whereAreYouEvent = `${tagName}-where-are-you`
			const hereIAmEvent = `${tagName}-here-i-am`

			// 1. Component tag discovery (e.g., 'schmancy-fancy-where-are-you')
			fromEvent(window, whereAreYouEvent)
				.pipe(takeUntil(this.disconnecting))
				.subscribe(() => {
					window.dispatchEvent(
						new CustomEvent(hereIAmEvent, {
							detail: { component: this },
							bubbles: true,
							composed: true,
						}),
					)
				})

			// 2. CSS selector discovery (e.g., '#app-card', '.my-class', '[uid="xyz"]')
			fromEvent<CustomEvent<DiscoverRequest>>(window, DISCOVER_EVENT)
				.pipe(takeUntil(this.disconnecting))
				.subscribe(({ detail: { selector, requestId } }) => {
					let found: Element | null = null

					// Check if selector matches this component's id or uid
					if (selector.startsWith('#')) {
						const id = selector.slice(1)
						if (this.id === id || this.uid === id) {
							found = this
						}
					}

					// Check our shadow DOM for matching element
					if (!found && this.shadowRoot) {
						found = this.shadowRoot.querySelector(selector)
					}

					if (found) {
						window.dispatchEvent(
							new CustomEvent(DISCOVER_RESPONSE_EVENT, {
								detail: { requestId, element: found },
								bubbles: true,
								composed: true,
							}),
						)
					}
				})
		}

		// Make discover public to match the interface
		discover<T extends HTMLElement>(tag: string): Observable<T | null> {
			return discoverComponent<T>(tag)
		}

		disconnectedCallback() {
			this.disconnecting.next(true)
			this.disconnecting.complete()
			super.disconnectedCallback()
		}
	}
	return BaseElement as Constructor<IBaseMixin> & T
}
