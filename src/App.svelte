<script>
  import { onMount } from 'svelte';
  import { wordIndices, currentPiSlice } from './store.js';
  // import WordIllustrator from './lib/WordIllustrator.js';
  import StreetIllustrator from './lib/StreetIllustrator.js';
  import FullstopIllustrator from './lib/FullstopIllustrator.js';
  import VerseNumberIllustrator from './lib/VerseNumberIllustrator.js';

  const ANIME_SEQUENCE = [
    'verse-number',
    'ellipsis',
    'word-drop'
  ]
  let sequneceIndex = 0;

  $: animeState = ANIME_SEQUENCE[sequneceIndex];

  function nextAnimeState() {
    if (sequneceIndex < ANIME_SEQUENCE.length - 1) {
      sequneceIndex += 1;
    } else {
      sequneceIndex = 0;
    }
  }
  
  let readerEl;
  let readerDimensions;

  onMount(async () => {
    readerDimensions = readerEl.getBoundingClientRect();
	});

  let fullstopLayerEl;
  let fullstopLayerCtx;
  let fullstopIllustrator;
  
  $: if (fullstopLayerEl) {
    fullstopLayerCtx = fullstopLayerEl.getContext('2d');
    fullstopIllustrator = new FullstopIllustrator(fullstopLayerCtx);
  }

  let verseNumberLayerEl;
  let verseNumberLayerCtx;
  let verseNumberIllustrator;
  
  $: if (verseNumberLayerEl) {
    verseNumberLayerCtx = verseNumberLayerEl.getContext('2d');
    verseNumberIllustrator = new VerseNumberIllustrator(verseNumberLayerCtx);
  }

  let streetLayerEl;
  let streetLayerCtx;
  let streetIllustrator;
  const highParkAndHumberside = [ -79.466850201826219, 43.657227646269199 ];

  $: if (streetLayerEl) {
    streetLayerCtx = streetLayerEl.getContext('2d');
    streetIllustrator = new StreetIllustrator(streetLayerCtx, highParkAndHumberside);
  }

  $: if (animeState === 'verse-number' && verseNumberIllustrator) {
    verseNumberIllustrator.showNumber($currentPiSlice); 
    setTimeout(() => {
      nextAnimeState();
      verseNumberIllustrator.clearCanvas();
    }, 3000)
  } else if (animeState === 'ellipsis' && fullstopIllustrator) {
    fullstopIllustrator.fullStopDrop().then(() => {
      setTimeout(() => {  
        fullstopIllustrator.fullStopDrop().then(() => {
          setTimeout(() => {
            fullstopIllustrator.fullStopDrop().then(() => {
              streetIllustrator.drawBlocksFromNode(13465772);
              nextAnimeState();
            })
          }, 3000);
        });
      }, 3000);
    }); 
  }

</script>

<div class='reader' bind:this={readerEl} on:click={ wordIndices.nextWord }>
  {#if readerDimensions}
    <canvas
      class='street layer'
      bind:this={streetLayerEl}
      width={readerDimensions.width}
      height={readerDimensions.height}
    ></canvas>
    <canvas
      class='verse-number layer'
      bind:this={verseNumberLayerEl}
      width={readerDimensions.width}
      height={readerDimensions.height}
    ></canvas>
    <canvas
      class='full-stop layer'
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
  canvas.layer {
    position: absolute;
    left: 0;
    top: 0;
  }
  .street.layer {
    z-index: 0;
  }
  .verse-number.layer {
    z-index: 1;
  }
  .full-stop.layer {
    z-index: 2;
  }
</style>