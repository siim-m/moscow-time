<script>
	// '$lib' is an alias to the src/lib folder created by Svelte.
	// jsconfig.json is for VS Code to know about this mapping.
	import Header from '$lib/header.svelte';

	import '../tailwind.css';
</script>

<Header />

<main class="bg-blue-400">
	<!--
    <slot /> is where "children" get mounted in the component.
    __layout.svelte is a special filename.
  -->
	<slot />
</main>

<footer>&copy; 2022</footer>

<style>
	/* Won't work – CSS is scoped in Svelte. */
	/* header {
		background-color: red;
	} */

	/* :global() helps get around this - NOT RECOMMENDED */
	:global(header) {
		background-color: red;
	}

	footer {
		background-color: red;
	}
</style>
