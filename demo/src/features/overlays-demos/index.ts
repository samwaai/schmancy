// Main overlays demos component
export { default } from './overlays-demos';

// Individual demo exports (for backward compatibility if needed)
export const overlaysDemos = [
	{
		title: 'Overlays',
		demos: [
			{
				name: 'Dialog Showcase',
				component: () => import('./dialog-showcase'),
			},
			{
				name: 'Dialog Confirm',
				component: () => import('./dialog-confirm'),
			},
			{
				name: 'Sheet',
				component: () => import('./sheet'),
			},
		],
	},
]