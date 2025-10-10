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
				name: 'Divider',
				component: () => import('./divider'),
			},
			{
				name: 'Content Drawer',
				component: () => import('./drawer'),
			},
			{
				name: 'Content Drawer - User Management',
				component: () => import('./content-drawer-users'),
			},
		],
	},
]