<script>
	import Footer from '$lib/footer.svelte';
	import '../tailwind.css';
</script>

<div class="mx-2 sm:mx-6 md:mx-10 lg:mx-14 flex flex-col h-full">
	<main class="flex-grow">
		<slot />
	</main>

	<Footer />
</div>
