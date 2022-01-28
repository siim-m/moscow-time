module.exports = {
	content: ['./src/**/*.svelte', './src/**/*.html'],
	theme: {
		extend: {
			colors: {
				ckwhite: '#fcfbf7',
			},
			fontFamily: {
				mono: [
					'"Courier Prime Regular"',
					'ui-monospace',
					'SFMono-Regular',
					'Menlo',
					'Monaco',
					'Consolas',
					'Liberation Mono',
					'Courier New',
					'monospace',
				],
			},
		},
	},
	plugins: [require('@tailwindcss/typography')],
	mode: 'jit',
};
