<script>
  import { page } from '$app/stores';
  import { navLinks } from '../stores';
</script>

<footer class="pt-2 pb-2">
  <div class="mx-auto max-w-7xl overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
    <nav class="-mx-5 -my-2 flex flex-wrap justify-center" aria-label="Footer">
      {#each $navLinks as link}
        {#if $page.url.pathname !== link.path}
          <div class="px-5 py-2">
            <a
              sveltekit:prefetch={link.external ? undefined : ''}
              target={link.external ? '_blank' : undefined}
              rel={link.external ? 'external noopener' : undefined}
              href={link.path}
              class="text-xs text-gray-600 underline hover:text-orange-500 sm:text-base"
            >
              {link.label}
            </a>
          </div>
        {/if}
      {/each}
    </nav>

    <p class="mt-8 text-center text-xs text-gray-500 sm:text-base">
      BLOCKCLOCK is a registered trademark of <a
        class="text-gray-700 underline hover:text-orange-500"
        href="https://www.coinkite.com"
        target="_blank"
        rel="external noopener">Coinkite Inc</a
      >
    </p>
  </div>
</footer>
