<script>
	import { page } from '$app/stores';
	import { navLinks } from '../stores';
</script>

<footer class="pt-2 pb-2">
	<div class="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
		<nav class="-mx-5 -my-2 flex flex-wrap justify-center" aria-label="Footer">
			{#each $navLinks as link}
				{#if $page.url.pathname !== link.path}
					<div class="px-5 py-2">
						<a
							sveltekit:prefetch={!link.external}
							target={link.external ? '_blank' : ''}
							rel={link.external ? 'external noopener' : ''}
							href={link.path}
							class="underline text-xs sm:text-base text-gray-600 hover:text-orange-500"
						>
							{link.label}
						</a>
					</div>
				{/if}
			{/each}
		</nav>

		<p class="mt-8 text-center text-xs sm:text-xs sm:text-base text-gray-500">
			BLOCKCLOCK is a registered trademark of <a
				class="text-gray-700 hover:text-orange-500 underline"
				href="https://www.coinkite.com"
				target="_blank"
				rel="external noopener">Coinkite Inc</a
			>
		</p>
	</div>
</footer>
