module.exports = {
	content: ['./src/**/*.svelte', './src/**/*.html'],
	theme: {
		extend: {
			colors: {
				ckwhite: '#fcfbf7',
			},
		},
	},
	plugins: [require('@tailwindcss/typography')],
	mode: 'jit',
};
