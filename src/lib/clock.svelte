<script>
	export let views;
	export let interval;
	export let value;

	import { onMount, onDestroy } from 'svelte';

	let clock = {
		unMount: () => {}, // Temprarily assign an empty function, so Svelte doesn't complain about using it in onDestroy
	};

	onMount(() => {
		clock = mountBlockClock({ value });
	});

	onDestroy(() => {
		clock.unMount();
	});

	export const className = `${views
		.reverse()
		.reduce((cur, prev) => `${prev} ${cur}`, '')}interval-${interval}`;
</script>

<svelte:head>
	<script src="/widget-v2.js"></script>
</svelte:head>

<div id="blockclock-container" class={className} />
