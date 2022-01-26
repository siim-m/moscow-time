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
</script>

<svelte:head>
	<script async defer src="widget-with-frame.js"></script>
</svelte:head>

<div class="bg-blue-300 max-w-2xl mx-auto">
	<div id="blockclock-container" class="moscowtime usdprice blockheight interval-3000" />
</div>
