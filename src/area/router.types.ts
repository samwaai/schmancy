export type RouteAction = {
	component: CustomElementConstructor | string | Promise<NodeModule>
	area: string
	state?: object
	historyStrategy?: HISTORY_STRATEGY
}

export type ActiveRoute = {
	component: string
	area: string
	state?: object
}

export enum HISTORY_STRATEGY {
	push = 'push',
	replace = 'replace',
	pop = 'pop',
	silent = 'silent',
}
