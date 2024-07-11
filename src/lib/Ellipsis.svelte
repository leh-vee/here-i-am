<script>
  import EllipsisDot from "./EllipsisDot.svelte";
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  export let reveal = false;
  export let light = false;
  export let fadeAway = false;

  const piFractionSecs = (Math.PI - 3) * 1000;
  const showDots = [false, false, false];
  const lightDots = [false, false, false];

  $: if (reveal) setTimeout(slowReveal, piFractionSecs);

  function slowReveal() {
    const nDots = showDots.length;
    const revealDot = (i) => {
      showDots[i] = true;
      if (i < nDots - 1) {
        setTimeout(() => { revealDot(i + 1) }, 1000);
      } else { 
        setTimeout(() => { dispatch('revealed') }, piFractionSecs);
      }
    }
    revealDot(0);
  }  

  $: if (light) setTimeout(slowLight, piFractionSecs);

  function slowLight() {
    const nDotsToLight = lightDots.length;
    const lightDot = (i) => {
      lightDots[i] = true;
      if (i < nDotsToLight - 1) {
        setTimeout(() => { lightDot(i + 1) }, 1000);
      } else { 
        setTimeout(() => {
          dispatch('lit');
        }, 1000);
      }
    }
    lightDot(0);
  }
</script>

{#each showDots as showDot, i (i)}
  <EllipsisDot 
    dotIndex={i} 
    show={showDot}
    light={ lightDots[i] } 
    isFade={ fadeAway }
  />
{/each}