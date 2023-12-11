import { Part, nothing } from 'lit'
import { Directive, PartInfo, PartType, directive } from 'lit/directive.js'

export type ColorConfig = {
	bgColor?: string
	color?: string
}

class ColorDirective extends Directive {
	private config: ColorConfig

	constructor(partInfo: PartInfo) {
		super(partInfo)
		this.config = {}
	}

	update(part: Part, [config]: [ColorConfig]) {
		if (part.type !== PartType.ELEMENT) {
			throw new Error('The `classMap` directive must be used in the `class` attribute')
		}
		const element = part.element as HTMLElement
		this.config = config
		console.log(this.config)
		if (this.config.bgColor) {
			element.style.backgroundColor = this.config.bgColor
		}

		if (this.config.color) {
			element.style.color = this.config.color
		}
	}

	render(config: ColorConfig): unknown {
		this.config = config
		return nothing
	}
}

const color = directive(ColorDirective)

export { color }
