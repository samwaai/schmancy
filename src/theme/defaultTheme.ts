import { TSchmancyTheme } from './theme.interface'

// Example usage with camel color as primary
export const defaultTheme: TSchmancyTheme = {
	sys: {
		color: {
			outline: '#938F99',
			surface: {
				default: '#FFFFFF',
				low: '#F5F5F5',
				high: '#FFD54F',
				highest: '#E6E0E9',
				lowest: '#CCCCCC',
				on: '#1D1B20',
				onVariant: '#1D1B20',
			},

			primary: {
				default: '#6750A4', // Camel color
				on: '#FFFFFF',
				container: '#C19A6B',
				onContainer: '#FFFFFF',
			},

			secondary: {
				default: '#4CAF50',
				on: '#FFFFFF',
				container: '#4CAF50',
				onContainer: '#FFFFFF',
			},

			tertiary: {
				default: '#FFC107',
				on: '#000000',
				container: '#FFC107',
				onContainer: '#000000',
			},

			error: {
				default: '#6750A4',
				on: '#FFFFFF',
				container: '#FF0000',
				onContainer: '#FFFFFF',
			},

			success: {
				default: '#00FF00',
				on: '#000000',
				container: '#00FF00',
				onContainer: '#000000',
			},
		},
		elevation: {
			0: '0 0 0 0 rgba(0, 0, 0, 0)',
			1: 'rgba(0, 0, 0, 0.2) 0px 2px 1px -1px, rgba(0, 0, 0, 0.14) 0px 1px 1px 0px, rgba(0, 0, 0, 0.12) 0px 1px 3px 0px',
			2: 'rgba(0, 0, 0, 0.2) 0px 3px 3px -2px, rgba(0, 0, 0, 0.14) 0px 3px 4px 0px, rgba(0, 0, 0, 0.12) 0px 1px 8px 0px',
			3: 'rgba(0, 0, 0, 0.2) 0px 3px 5px -1px, rgba(0, 0, 0, 0.14) 0px 6px 10px 0px, rgba(0, 0, 0, 0.12) 0px 1px 18px 0px',

			4: 'rgba(0, 0, 0, 0.2) 0px 5px 5px -3px, rgba(0, 0, 0, 0.14) 0px 8px 10px 1px, rgba(0, 0, 0, 0.12) 0px 3px 14px 2px',
			5: 'rgba(0, 0, 0, 0.2) 0px 7px 8px -4px, rgba(0, 0, 0, 0.14) 0px 12px 17px 2px, rgba(0, 0, 0, 0.12) 0px 5px 22px 4px',
		},
		outline: {
			1: '1px',
		},
	},
}
