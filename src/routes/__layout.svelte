<script>
	// '$lib' is an alias to the src/lib folder created by Svelte.
	// jsconfig.json is for VS Code to know about this mapping.
	// import Header from '$lib/header.svelte';

	import '../tailwind.css';
</script>

<!-- <Header /> -->

<div class="mx-2 sm:mx-6 md:mx-10 lg:mx-14">
	<main>
		<!--
    <slot /> is where "children" get mounted in the component.
    __layout.svelte is a special filename.
  -->
		<slot />
	</main>

	<footer class="pt-[10vh] pb-2">
		<div class="prose md:prose-lg lg:prose-xl text-center font-medium mx-auto">
			<p>
				Check out our <a class="text-orange-400" href="/widget">JavaScript widget</a> · BLOCKCLOCK
				is a registered trademark of
				<a
					class="text-orange-400"
					href="https://www.coinkite.com"
					target="_blank"
					rel="external noopener">Coinkite Inc</a
				>
			</p>
		</div>
	</footer>
</div>
