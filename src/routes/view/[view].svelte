<script>
	import { page } from '$app/stores';
	import Clock from '$lib/clock.svelte';

	export const { view } = $page.params;
</script>

<svelte:head>
	<title>Moscow Time | Snapshot</title>
</svelte:head>

<div class="px-6 pt-[189px]">
	<Clock className={`${view} interval-60000`} />
</div>
