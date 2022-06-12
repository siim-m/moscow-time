<script>
  import { page } from '$app/stores';
  import { clockViews } from '../stores';
  import Clock from '$lib/clock.svelte';
  import Toggle from '$lib/toggle.svelte';

  const interval = '3000';
  const model = $page.url.searchParams.get('model') || 'mini';
  const noFrame = $page.url.searchParams.get('noframe') === 'true' ? true : false;
</script>

<svelte:head>
  <title>Moscow Time</title>
  <meta name="twitter:title" content="Moscow Time" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:description" content="The best bitcoin meme of 2021" />
  <meta name="description" content="The best bitcoin meme of 2021" />
  <meta name="twitter:image" content="https://moscowtime.xyz/card.png" />
</svelte:head>

<div class="mx-auto pt-[10vh] sm:max-w-screen-lg">
  <Clock {interval} {model} {noFrame} />
  <div class="mx-auto grid w-4/5 grid-cols-2 gap-y-6 pt-[3vh] sm:grid-cols-4 sm:w-3/4 md:w-4/5 lg:w-5/6 lg:pt-16">
    {#each $clockViews as clockView}
      <Toggle
        label={clockView.label}
        enabled={clockView.enabled}
        handleStore={() => {
          $clockViews = $clockViews.map((v) => {
            if (v.name === clockView.name) {
              v.enabled = !v.enabled;
            }
            return v;
          });
        }}
      />
    {/each}
  </div>
</div>
