<script>
  import EllipsisDot from "./EllipsisDot.svelte";
  import { onMount } from 'svelte';

  let nDots = 1;
  $: dots = new Array(nDots);

  onMount(async () => { getSetGo() });

  function getSetGo() {
    setInterval(() => {
      nDots += 1;
    }, Math.PI * 333);
  }
  
</script>

{#each dots as dot, i (i)}
  <EllipsisDot dotIndex={i} />
{/each}

