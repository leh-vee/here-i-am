<script>
  import { onMount } from 'svelte';
  import { wordIndices, currentWord, isFirstWord, isEllipsisWord } from './store.js';
  // import WordIllustrator from './lib/WordIllustrator.js';
  import StreetIllustrator from './lib/StreetIllustrator.js';
  import FullstopIllustrator from './lib/FullstopIllustrator.js';
  
  let readerEl;
  let readerDimensions;

  onMount(async () => {
    readerDimensions = readerEl.getBoundingClientRect();
	});

  let streetLayerEls = [];
  let streetIllustrators = [];
  const highParkAndHumberside = [ -79.466850201826219, 43.657227646269199 ];

  $: if (streetLayerEls.length === 3) {
    streetLayerEls.forEach((layerEl, i) => {
      const ctx = layerEl.getContext('2d');
      streetIllustrators.push(
        new StreetIllustrator(ctx, highParkAndHumberside, i*120+180)
      );
    });
  }
  
  let fullstopLayerEl;
  let fullstopLayerCtx;
  let fullstopIllustrator;
  
  $: if (fullstopLayerEl) {
    fullstopLayerCtx = fullstopLayerEl.getContext('2d');
    fullstopIllustrator = new FullstopIllustrator(fullstopLayerCtx);
  }
 

  $: if ($currentWord && $isEllipsisWord && fullstopIllustrator) {
    const fullstopDropPromise = fullstopIllustrator.fullStopDrop(); 
    fullstopDropPromise.then(_ => {
      streetIllustrators[$wordIndices.wordIndex].drawBlocksFromNode(13465772);
    });    
  }

</script>

<div class='reader' bind:this={readerEl} on:click={ wordIndices.nextWord }>
  {#if readerDimensions}
    <canvas
      class='street-layer one'
      bind:this={streetLayerEls[0]}
      width={readerDimensions.width}
      height={readerDimensions.height}
    ></canvas>
    <canvas
      class='street-layer two'
      bind:this={streetLayerEls[1]}
      width={readerDimensions.width}
      height={readerDimensions.height}
    ></canvas>
    <canvas
      class='street-layer three'
      bind:this={streetLayerEls[2]}
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