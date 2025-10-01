import type { Constructor } from './constructor'
import { LitElement } from 'lit'
import { Subject, fromEvent, Observable } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import { classMap } from 'lit/directives/class-map.js'
import { styleMap } from 'lit/directives/style-map.js'
import { discoverComponent } from '../src/discovery/discovery.service'

export declare class IBaseMixin {
	disconnecting: Subject<boolean>
	classMap: typeof classMap
	styleMap: typeof styleMap
	discover<T extends HTMLElement>(tag: string): Observable<T | null>
}

export const BaseElement = <T extends Constructor<LitElement>>(superClass: T) => {
	class BaseElement extends superClass {
		disconnecting = new Subject<boolean>()

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
