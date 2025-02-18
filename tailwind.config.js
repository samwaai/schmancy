/** @type {import('tailwindcss').Config} */
module.exports = {
	// The 'content' key tells Tailwind where to scan for class names.
	content: [
		// If you're using JS/TS files
		'./demo/**/*.{js,ts,jsx,tsx}',
		"./src/**/*.{html,js,ts,jsx,tsx}", // Adjust this to your project's file structure
	],
	theme: {
		extend: {
			// your custom theme settings here
		},
	},
	plugins: [require("@tailwindcss/nesting")],
}
