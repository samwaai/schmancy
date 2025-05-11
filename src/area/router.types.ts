export type RouteAction = {
	component: CustomElementConstructor | string | HTMLElement
	area: string
	state?: object
	params?: Record<string, any>
	historyStrategy?: THistoryStrategy
	clearQueryParams?: string[] | null
}

export type ActiveRoute = {
	component: string
	area: string
	state?: object
	params?: Record<string, any>
}

export type THistoryStrategy = 'push' | 'replace' | 'pop' | 'silent'

export enum HISTORY_STRATEGY {
	push = 'push',
	replace = 'replace',
	pop = 'pop',
	silent = 'silent',
}
