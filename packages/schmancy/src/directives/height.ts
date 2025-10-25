import { Subject, debounceTime, fromEvent, startWith, takeUntil } from 'rxjs'

const $SchmancyResize = new Subject<Window>()
fromEvent<Event>(window, 'resize')
	.pipe(
		debounceTime(10), // Adjust the debounce time as needed
		startWith(window),
	)
	.subscribe({
		next: () => {
			$SchmancyResize.next(window)
		},
	})

import { directive, PartInfo, PartType } from 'lit/directive.js'
import { AsyncDirective } from 'lit/async-directive.js'
import { LitElement } from 'lit'

class FullHeight extends AsyncDirective {
	element: HTMLElement & LitElement
	disconnecting = new Subject<boolean>()
	render() {
		return
	}

	constructor(_partInfo: PartInfo) {
		super(_partInfo)
		$SchmancyResize.pipe(takeUntil(this.disconnecting)).subscribe(() => {
			this.element.style.setProperty('height', `${window.innerHeight}px`)
			setTimeout(() => {
				this.element.style.setProperty('height', `${window.innerHeight}px`)
			})
		})
	}

	update(part) {
		if (part.type !== PartType.ELEMENT) {
			throw new Error('The `ripple` directive can only be used on elements')
		}
		this.element = part.element
		$SchmancyResize.next(window)
	}

	disconnected() {
		this.disconnecting.next(true)
	}

	reconnected() {}
}

export const fullHeight = directive(FullHeight)
