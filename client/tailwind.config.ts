import type { Config } from 'tailwindcss'

const config: Config = {
	content: [
		'./src/pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/app/**/*.{js,ts,jsx,tsx,mdx}',
		'./node_modules/react-tailwindcss-datepicker/dist/index.esm.{js,ts}',
		'./node_modules/react-tailwindcss-select/dist/index.esm.js',
	],
	theme: {},
	plugins: [require('daisyui')],
	daisyui: {
		themes: ['corporate'],
	},
}
export default config
