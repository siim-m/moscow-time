<script>
	import { onMount, onDestroy } from 'svelte';

	let clock = {
		unMount: () => {}, // Temprarily assign an empty function, so Svelte doesn't complain about using it in onDestroy
	};

	onMount(() => {
		clock = mountBlockClock();
	});

	onDestroy(() => {
		clock.unMount();
	});

	export let className;
</script>

<svelte:head>
	<script src="/widget-v2.js"></script>
</svelte:head>

<div id="blockclock-container" class={className} />
