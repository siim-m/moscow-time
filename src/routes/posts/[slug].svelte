<!-- Module context is necessary for the code to run before render. -->
<script context="module">
	// See SvelteKit doco for more info on params and what to return.
	export async function load({ params }) {
		const post = {
			title: params.slug,
			date: new Date(),
			body: 'lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
		};

		return {
			props: {
				post
			}
		};
	}
</script>

<script>
	export let post;
</script>

<h3 class="text-xl">{post.title}</h3>
