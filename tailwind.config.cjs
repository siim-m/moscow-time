const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
	content: ['./src/**/*.svelte', './src/**/*.html'],
	theme: {
		extend: {
			colors: {
				ckwhite: '#fcfbf7',
			},
			fontFamily: {
				mono: ['"Courier Prime Regular"', ...defaultTheme.fontFamily.mono],
				sans: ['Inter var', ...defaultTheme.fontFamily.sans],
			},
		},
	},
	plugins: [require('@tailwindcss/typography')],
	mode: 'jit',
};
