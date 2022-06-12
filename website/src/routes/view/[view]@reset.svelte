<script>
  import { addMilliseconds, format } from 'date-fns';
  import { page } from '$app/stores';
  import Clock from '$lib/clock.svelte';
  import { clockViews } from '../../stores';

  const localDate = $page.url.searchParams.get('timestamp')
    ? new Date(parseInt($page.url.searchParams.get('timestamp')) * 1000)
    : new Date(Date.now());
  const offsetMinutes = localDate.getTimezoneOffset();
  const utcDate = addMilliseconds(new Date(offsetMinutes * 1000 * 60), localDate.getTime());

  const { view } = $page.params;
  const value = $page.url.searchParams.get('value');
  const model = $page.url.searchParams.get('model') || 'mini';
  const noFrame = $page.url.searchParams.get('noframe') === 'true' ? true : false
  const timestamp = `${format(utcDate, 'MMMM do, y @ HH:mm')} UTC`;

  $clockViews = [
    {
      name: view,
      enabled: true,
    },
  ];
</script>

<svelte:head>
  <title>Moscow Time | Snapshot</title>
</svelte:head>

<div class="px-6 pt-[189px]">
  <!-- <Clock views={[view, 'blockheight']} interval={60000} {value} /> -->
  <Clock interval={60000} {value} {model} {noFrame} />
  <p class="pt-16 text-center font-mono text-3xl text-neutral-600">
    {timestamp} | BLOCKCLOCK is a registered trademark of Coinkite Inc.
  </p>
</div>
