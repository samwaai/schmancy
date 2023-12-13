import { directive, PartType } from 'lit/directive.js'
import { AsyncDirective } from 'lit/async-directive.js'

const rippleStyle = `.ripple {
    position: absolute;
    border-radius: 50%;
    background: var(--schmancy-sys-color-surface-high);
    transform: scale(0);
    animation: ripple 600ms linear;
}

@keyframes ripple {
    to {
        transform: scale(4);
        opacity: 0;
    }
}
`
class RippleDirective extends AsyncDirective {
	element: HTMLElement
	render() {
		return
	}

	addRippleEffect(event) {
		const element = event.target
		const circle = document.createElement('span')
		const diameter = Math.max(element.clientWidth, element.clientHeight)
		const radius = diameter / 2
		circle.style.width = circle.style.height = `${diameter}px`
		circle.style.left = `${event.clientX - element.getBoundingClientRect().left - radius}px`
		circle.style.top = `${event.clientY - element.getBoundingClientRect().top - radius}px`
		circle.classList.add('ripple')

		const ripple = element.getElementsByClassName('ripple')[0]
		if (ripple) {
			ripple.remove()
		}

		element.appendChild(circle)
	}

	update(part) {
		if (part.type !== PartType.ELEMENT) {
			throw new Error('The `ripple` directive can only be used on elements')
		}

		this.element = part.element
		const style = document.createElement('style')
		style.append(rippleStyle)
		this.element.append(style)
		this.element.addEventListener('click', this.addRippleEffect)
	}

	disconnected() {
		if (this.element) {
			this.element.removeEventListener('click', this.addRippleEffect)
		}
	}
}

export const ripple = directive(RippleDirective)
