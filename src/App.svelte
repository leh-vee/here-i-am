<script>
  import EllipsisPainter from './lib/EllipsisPainter.js';
  import StreetPainter from './lib/StreetPainter.js';
  // import { onMount } from 'svelte';
  // import { wordIndices, currentPiSlice } from './store.js';
  // import WordIllustrator from './lib/WordIllustrator.js';
  // import VerseNumberIllustrator from './lib/VerseNumberIllustrator.js';
  
  const screen = { 
    konvaEl: null,
    streetCanvasEl: null,
    width: window.innerWidth,
    height: window.innerHeight
  };

  const animate = {
    streetCrawl: false
  } 

  $: if (screen.konvaEl) {
    const { konvaEl: el, width, height } = screen;
    const ellipsisPainter = new EllipsisPainter(el, width, height);
    ellipsisPainter.animate().then(complete => {
      animate.streetCrawl = true;
    });
  }

  $: if (animate.streetCrawl && screen.streetCanvasEl) {
    const { streetCanvasEl: el } = screen;
    const highParkAndHumberside = [ -79.466850201826219, 43.657227646269199 ];
    const streetPainter = new StreetPainter(el, highParkAndHumberside);
    streetPainter.drawBlocksFromNode(13465772);
  }
  
  // screenDimension = screenEl.getBoundingClientRect();

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

<div class='screen'>
  <div class='konva-container' bind:this={screen.konvaEl}></div>
  <canvas
    class='street layer'
    bind:this={screen.streetCanvasEl}
    width={screen.width}
    height={screen.height}
  ></canvas>
</div>

<style>
  .screen, .konva-container {
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
    z-index: -1;
  }
  /* .verse-number.layer {
    z-index: 1;
  } */
</style>