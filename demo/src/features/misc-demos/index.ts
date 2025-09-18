// Miscellaneous demos navigation
export const miscDemos = [
	{
		title: 'Miscellaneous',
		demos: [
			{
				name: 'Animated Text',
				component: () => import('./animated-text'),
			},
			{
				name: 'Typewriter',
				component: () => import('./typewriter'),
			},
			{
				name: 'Boat Demo',
				component: () => import('../boat'),
			},
			{
				name: 'Context',
				component: () => import('../context'),
			},
			{
				name: 'Details Showcase',
				component: () => import('../details-showcase'),
			},
			{
				name: 'Map',
				component: () => import('../map'),
			},
			{
				name: 'Mailbox',
				component: () => import('../mailbox'),
			},
			{
				name: 'Steps',
				component: () => import('../steps'),
			},
			{
				name: 'Theme Service',
				component: () => import('../theme-service-demo'),
			},
		],
	},
]