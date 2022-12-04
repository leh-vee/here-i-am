<script>
  import { onMount } from 'svelte';
  import { wordIndices, currentWord, isFirstWord, isEllipsisWord } from './store.js';
  import WordIllustrator from './lib/WordIllustrator.js';
  import StreetIllustrator from './lib/StreetIllustrator.js';

  let readerEl;
  let readerDimensions;
  let streetLayerEl;
  let fullstopLayerEl;
  let streetLayerCtx;
  let fullstopLayerCtx;

  let wordIllustrator;

  onMount(async () => {
    readerDimensions = readerEl.getBoundingClientRect();
	});

  $: if (streetLayerEl) {
    fullstopLayerCtx = fullstopLayerEl.getContext('2d');
    streetLayerCtx = streetLayerEl.getContext('2d');
    wordIllustrator = new WordIllustrator(fullstopLayerCtx);
  } 

  $: if ($currentWord && wordIllustrator) {
    const wordDropPromise = $isEllipsisWord ?
      wordIllustrator.fullStopDrop() : 
      wordIllustrator.wordDrop($currentWord);
    wordDropPromise.then(_ => {
      if ($isFirstWord) {
        const highParkAndHumberside = [ -79.466850201826219, 43.657227646269199 ];
        const vortexIllustrator = new StreetIllustrator(streetLayerCtx, highParkAndHumberside);
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
      class='street-layer'
      bind:this={streetLayerEl}
      width={readerDimensions.width}
      height={readerDimensions.height}
    ></canvas>
    <canvas
      class='full-stop-layer'
      bind:this={fullstopLayerEl}
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
  canvas {
    position: absolute;
    left: 0;
    top: 0;
  }
  .street-layer {
    z-index: 0;
  }
  .full-stop-layer {
    z-index: 1;
  }
</style>