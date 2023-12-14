<script>
  import EllipsisDot from "./EllipsisDot.svelte";
  import { onMount } from 'svelte';
  import { isFirstVerseWord } from '../stores/text.js';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  const palette = ['red', 'yellow', 'green'];
  $: colours = $isFirstVerseWord ? palette : [...palette].reverse();

  let nDots = 0;
  $: dots = new Array(nDots);

  onMount(async () => { 
    setTimeout(() => {
      getSetGo();
    }, (Math.PI - 3) * 1000);
  });

  function getSetGo() {
    if (nDots < 3) {
      setTimeout(() => {
        nDots += 1;
        getSetGo();
      }, 1000);
    } else {
      setTimeout(() => {
        dispatch('go')
      }, 1000);
    }
  }
  
</script>

{#each dots as dot, i (i)}
  <EllipsisDot dotIndex={i} fill={colours[i]} />
{/each}

