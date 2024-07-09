<script>
  import EllipsisDot from "./EllipsisDot.svelte";
  import { onMount } from 'svelte';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  const colours = ['red', 'yellow', 'green'];

  $: showDots = [false, false, false];

  onMount(async () => { 
    setTimeout(() => {
      getSetGo();
    }, (Math.PI - 3) * 1000);
  });

  function getSetGo() {
    if (!showDots[-1]) {
      setTimeout(() => {
        const nextFalseIndex = showDots.findIndex(s => s === false);
        showDots[nextFalseIndex] = true;
        showDots = showDots;
        getSetGo();
      }, 1000);
    } else {
      setTimeout(() => {
        dispatch('go')
      }, 1000);
    }
  }
  
</script>

{#each showDots as showDot, i (i)}
  <EllipsisDot dotIndex={i} fill={colours[i]} visible={showDot} />
{/each}

