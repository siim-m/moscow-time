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
			typography: {
				DEFAULT: {
					css: {
						code: {
							backgroundColor: 'var(--tw-prose-pre-bg)',
							color: 'var(--tw-prose-pre-code)',
							borderRadius: '0.25rem',
							paddingLeft: '0.3rem',
							paddingRight: '0.3rem',
						},
						'code::before': {
							content: '',
						},
						'code::after': {
							content: '',
						},
					},
				},
			},
		},
	},
	plugins: [require('@tailwindcss/typography')],
	mode: 'jit',
};
