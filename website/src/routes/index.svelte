<script>
  import { clockViews } from '../stores';
  import Clock from '$lib/clock.svelte';
  import Toggle from '$lib/toggle.svelte';

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

<div class="mx-auto pt-[10vh] sm:max-w-screen-lg">
  <Clock {interval} />
  <div class="mx-auto grid w-4/5 grid-cols-3 pt-[3vh] sm:w-3/4 md:w-2/3 lg:w-1/2 lg:pt-12">
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
