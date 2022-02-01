<script>
	// '$lib' is an alias to the src/lib folder created by Svelte.
	// jsconfig.json is for VS Code to know about this mapping.
	// import Header from '$lib/header.svelte';

	import Footer from '$lib/footer.svelte';
	import '../tailwind.css';
</script>

<!-- <Header /> -->

<div class="mx-2 sm:mx-6 md:mx-10 lg:mx-14 flex flex-col h-full">
	<main class="flex-grow">
		<!--
    <slot /> is where "children" get mounted in the component.
    __layout.svelte is a special filename.
  -->
		<slot />
	</main>

	<Footer />
</div>
