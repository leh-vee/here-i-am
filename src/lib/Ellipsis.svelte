<script>
  import EllipsisDot from "./EllipsisDot.svelte";
  import { isFirstVerseWord } from '../stores/text.js';

  let nDots = $isFirstVerseWord ? 1 : 3;
  $: dots = new Array(nDots);

  $: if ($isFirstVerseWord) getSetGo();

  function getSetGo() {
    setInterval(() => {
      nDots += 1;
    }, Math.PI * 333);
  }
  
</script>

{#each dots as dot, i (i)}
  <EllipsisDot dotIndex={i} />
{/each}

