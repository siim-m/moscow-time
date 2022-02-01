<script>
	import { clockViews } from '../stores';
	import Clock from '$lib/clock.svelte';
	import Toggle from '$lib/toggle.svelte';

	let availableViews = $clockViews.filter((view) => view.enabled).map((view) => view.name);
	let activeViews = $clockViews.map((view) => view.name);
	const interval = '3000';
</script>

<svelte:head>
	<title>Moscow Time</title>
	<meta name="twitter:title" content="Moscow Time" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:description" content="The best bitcoin meme of 2021" />
	<meta name="description" content="The best bitcoin meme of 2021" />
	<meta name="twitter:image" content="https://moscowtime.xyz/card.png" />
</svelte:head>

<div class="pt-[15vh] sm:max-w-screen-lg mx-auto">
	<Clock {interval} />
	{#each availableViews as availableView}
		<Toggle
			label={availableView}
			enabled={!!activeViews.find((v) => v === availableView)}
			handleStore={() => {
				$clockViews = $clockViews.map((v) => {
					if (v.name === availableView) {
						v.enabled = !v.enabled;
					}
					return v;
				});
			}}
		/>
	{/each}
</div>
