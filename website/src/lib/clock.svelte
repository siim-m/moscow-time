<script>
  import { clockViews } from '../stores';
  export let interval;
  export let value = undefined;
  export let model = undefined;
  export let noFrame = false;

  import { onMount, onDestroy } from 'svelte';

  let clock = {
    unMount: () => {}, // Temprarily assign an empty function, so Svelte doesn't complain about using it in onDestroy
  };

  onMount(() => {
    clock = mountBlockClock({ value, baseUrl: '.' });
  });

  onDestroy(() => {
    clock.unMount();
  });

  let className;

  clockViews.subscribe((value) => {
    className = `${value
      .slice()
      .reverse()
      .filter((v) => v.enabled)
      .map((v) => v.name)
      .reduce((cur, prev) => `${prev} ${cur}`, '')}interval-${interval} model-${model}${
      noFrame ? ' noframe' : ''
    }`;
  });
</script>

<div id="blockclock-container" class={className} />
