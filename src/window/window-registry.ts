/**
 * Window Registry — pure type definitions for the multi-window coordination system.
 *
 * Every schmancy-window instance is tracked as a WindowRecord in the registry.
 * The WindowManager service holds the reactive WindowRegistryState.
 */

export type WindowVisualState = 'minimized' | 'normal' | 'maximized'

export type SnapCorner = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'

export type SnapTarget = SnapCorner | 'free'

export interface WindowBounds {
	left: number
	top: number
	width: number
	height: number
}

export interface WindowRecord {
	id: string
	bounds: WindowBounds
	visualState: WindowVisualState
	zIndex: number
	open: boolean
	snapTarget: SnapTarget
}

export interface WindowRegistryState {
	windows: Map<string, WindowRecord>
	focusedId: string | null
	stackOrder: string[]
}
