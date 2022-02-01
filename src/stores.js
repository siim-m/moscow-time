import { writable, readable } from 'svelte/store';

export const clockViews = writable([
	{
		name: 'moscowtime',
		label: 'Moscow Time',
		enabled: true,
	},
	{
		name: 'usdprice',
		label: 'USD Price',
		enabled: true,
	},
	{
		name: 'blockheight',
		label: 'Block Height',
		enabled: true,
	},
]);

export const navLinks = readable([
	{
		label: 'Home',
		path: '/',
		external: false,
	},
	{
		label: 'JavaScript Widget',
		path: '/widget-instructions',
		external: false,
	},
	{
		label: 'Twitter Bot',
		path: 'https://twitter.com/moscowtime_xyz',
		external: true,
	},
	{
		label: 'Donate Sats',
		path: 'https://coinos.io/moscowtime',
		external: true,
	},
]);
