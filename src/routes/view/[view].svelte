<script>
	import { addMilliseconds, format } from 'date-fns';
	import { page } from '$app/stores';
	import Clock from '$lib/clock.svelte';

	const localDate = $page.url.searchParams.get('timestamp')
		? new Date(parseInt($page.url.searchParams.get('timestamp')) * 1000)
		: new Date(Date.now());
	const offsetMinutes = localDate.getTimezoneOffset();
	const utcDate = addMilliseconds(new Date(offsetMinutes * 1000 * 60), localDate.getTime());

	export const { view } = $page.params;
	export const value = $page.url.searchParams.get('value');
	export const timestamp = `${format(utcDate, 'MMMM do, y @ HH:mm')} UTC`;
</script>

<svelte:head>
	<title>Moscow Time | Snapshot</title>
</svelte:head>

<div class="px-6 pt-[189px]">
	<!-- <Clock views={[view, 'blockheight']} interval={60000} {value} /> -->
	<Clock views={[view]} interval={60000} {value} />
	<p class="text-center pt-16 text-neutral-600 font-mono text-3xl">
		{timestamp} | BLOCKCLOCK is a registered trademark of Coinkite Inc.
	</p>
</div>
