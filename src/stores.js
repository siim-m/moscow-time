import { writable } from 'svelte/store';

export const clockViews = writable([
	{
		name: 'moscowtime',
		enabled: true,
	},
	{
		name: 'usdprice',
		enabled: true,
	},
	{
		name: 'blockheight',
		enabled: true,
	},
]);
