<script>
  import { onMount } from 'svelte';
  import { wordIndices, currentWord, isFirstWord, isEllipsisWord } from './store.js';
  import WordIllustrator from './lib/WordIllustrator.js';
  import StreetIllustrator from './lib/StreetIllustrator.js';

  let readerEl;
  let readerDimensions;
  let canvasEl;
  let ctx;

  let wordIllustrator;

  onMount(async () => {
    readerDimensions = readerEl.getBoundingClientRect();
	});

  $: if (canvasEl) {
    ctx = canvasEl.getContext('2d');
    wordIllustrator = new WordIllustrator(ctx);
  } 

  $: if ($currentWord && wordIllustrator) {
    const wordDropPromise = $isEllipsisWord ?
      wordIllustrator.fullStopDrop() : 
      wordIllustrator.wordDrop($currentWord);
    wordDropPromise.then(_ => {
      if ($isFirstWord) {
        const highParkAndHumberside = [ -79.466850201826219, 43.657227646269199 ];
        const vortexIllustrator = new StreetIllustrator(ctx, highParkAndHumberside);
        vortexIllustrator.drawBlocksFromNode(13465772);
        setTimeout(() => {
          vortexIllustrator.renderSpiralBySteps();
        }, 10000);
      }
    });
  }

</script>

<div class='reader' bind:this={readerEl} on:click={ wordIndices.nextWord }>
  {#if readerDimensions}
    <canvas
      bind:this={canvasEl}
      width={readerDimensions.width}
      height={readerDimensions.height}
    ></canvas>
  {/if}
</div>

<style>
  .reader {
    width: 100%;
    height: 100%;
    text-align: center;
  }
</style>