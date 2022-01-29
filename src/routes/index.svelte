<script>
	import Clock from '$lib/clock.svelte';

	export const views = ['moscowtime', 'usdprice', 'blockheight'];
	export const interval = '3000';
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
	<Clock {views} {interval} />
</div>
