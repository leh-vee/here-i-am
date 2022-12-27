<script>
  import EllipsisPainter from './lib/EllipsisPainter.js';
  // import { onMount } from 'svelte';
  // import { wordIndices, currentPiSlice } from './store.js';
  // import WordIllustrator from './lib/WordIllustrator.js';
  // import VerseNumberIllustrator from './lib/VerseNumberIllustrator.js';
  
  const screen = { 
    el: null,
    width: window.innerWidth,
    height: window.innerHeight
  };
  let ellipsisPainter;
  
  $: if (screen.el) {
    ellipsisPainter = new EllipsisPainter(screen);
    ellipsisPainter.agogsCollapseAnime();
  }
  
  // screenDimension = screenEl.getBoundingClientRect();
  // const ANIME_SEQUENCE = [
  //   'verse-number',
  //   'ellipsis',
  //   'word-drop'
  // ]
  // let sequneceIndex = 0;

  // $: animeState = ANIME_SEQUENCE[sequneceIndex];

  // function nextAnimeState() {
  //   if (sequneceIndex < ANIME_SEQUENCE.length - 1) {
  //     sequneceIndex += 1;
  //   } else {
  //     sequneceIndex = 0;
  //   }
  // }

  // let verseNumberLayerEl;
  // let verseNumberLayerCtx;
  // let verseNumberIllustrator;
  
  // $: if (verseNumberLayerEl) {
  //   verseNumberLayerCtx = verseNumberLayerEl.getContext('2d');
  //   verseNumberIllustrator = new VerseNumberIllustrator(verseNumberLayerCtx);
  // }

  // let streetLayerEl;
  // let streetLayerCtx;
  // let streetIllustrator;
  // const highParkAndHumberside = [ -79.466850201826219, 43.657227646269199 ];

  // $: if (streetLayerEl) {
  //   streetLayerCtx = streetLayerEl.getContext('2d');
  //   streetIllustrator = new StreetIllustrator(streetLayerCtx, highParkAndHumberside);
  // }

  // $: if (animeState === 'verse-number' && verseNumberIllustrator) {
  //   verseNumberIllustrator.showNumber($currentPiSlice); 
  //   setTimeout(() => {
  //     nextAnimeState();
  //     verseNumberIllustrator.clearCanvas();
  //   }, 0)
  // } else if (animeState === 'ellipsis' && fullstopIllustrator) {
    // fullstopIllustrator.drawEllipsis();
    // fullstopIllustrator.ellipsisAnimation().then(() => {
    //   streetIllustrator.drawBlocksFromNode(13465772);
    //   nextAnimeState();
    // });
  // }

</script>

<div class='screen' bind:this={screen.el} >
  <!-- {#if readerDimensions}
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
  {/if} -->
</div>

<style>
  .screen {
    width: 100%;
    height: 100%;
    text-align: center;
  }
  /* canvas.layer {
    position: absolute;
    left: 0;
    top: 0;
  }
  .street.layer {
    z-index: 0;
  }
  .verse-number.layer {
    z-index: 1;
  } */
</style>