import { Directive, PartType, directive } from 'lit/directive.js'
import tippy from 'tippy.js/headless'

class TooltipDirective extends Directive {
	render(text: string) {
		return part => {
			// Ensure the directive is used on an element
			if (part === PartType.ELEMENT) {
				const element = part.element
				console.log(element)
				// Initialize Tippy.js with the provided text
				tippy(element, {
					content: 'hellloooo',
				})
			}
		}
	}
}

export const tooltip = directive(TooltipDirective)
