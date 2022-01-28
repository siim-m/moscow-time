<script>
	import { addMilliseconds, format } from 'date-fns';
	import { page } from '$app/stores';
	import Clock from '$lib/clock.svelte';

	export const { view } = $page.params;

	const localDate = new Date(Date.now());
	const offsetMinutes = localDate.getTimezoneOffset();
	const utcDate = addMilliseconds(new Date(offsetMinutes * 1000 * 60), localDate.getTime());

	export const timestamp = `${format(utcDate, 'MMMM do, y @ HH:mm')} UTC`;

	console.log({ localDate, offsetMinutes, utcDate });
</script>

<svelte:head>
	<title>Moscow Time | Snapshot</title>
</svelte:head>

<div class="px-6 pt-[189px]">
	<Clock className={`${view} interval-60000`} />
	<p class="text-center pt-16 text-neutral-600 font-mono text-4xl">{timestamp}</p>
</div>
