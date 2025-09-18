// Layout demos navigation
export const layoutDemos = [
	{
		title: 'Layout',
		demos: [
			{
				name: 'Layout Grid',
				component: () => import('./layout'),
			},
			{
				name: 'Content Drawer',
				component: () => import('./drawer'),
			},
		],
	},
]