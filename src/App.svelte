<script>
  import EllipsisPainter from './lib/EllipsisPainter.js';
  import StreetPainter from './lib/StreetPainter.js';
  import WordPainter from './lib/WordPainter.js';
  import { currentWord, wordIndices } from './store.js';
  // import { wordIndices, currentPiSlice } from './store.js';
  // import { onMount } from 'svelte';
  // import VerseNumberIllustrator from './lib/VerseNumberIllustrator.js';
  
  const screen = { 
    konvaEl: null,
    streetCanvasEl: null,
    textCanvasEl: null,
    width: window.innerWidth,
    height: window.innerHeight
  };

  const animate = {
    streetCrawl: false,
    wordDrop: false,
  } 

  $: if (screen.konvaEl) {
    const { konvaEl: el, width, height } = screen;
    const ellipsisPainter = new EllipsisPainter(el, width, height);
    ellipsisPainter.animate().then(complete => {
      animate.streetCrawl = true;
      setTimeout(() => {
        animate.wordDrop = true;
      }, 5000);
    });
  }

  $: if (animate.streetCrawl && screen.streetCanvasEl) {
    const { streetCanvasEl: el } = screen;
    const highParkAndHumberside = [ -79.466850201826219, 43.657227646269199 ];
    const streetPainter = new StreetPainter(el, highParkAndHumberside);
    streetPainter.drawBlocksFromNode(13465772);
  }

  $: if ($currentWord && animate.wordDrop && screen.textCanvasEl) {
    const { textCanvasEl: el } = screen;
    const wordPainter = new WordPainter(el);
    wordPainter.simpleText('face');
    // wordPainter.wordDrop($currentWord).then(hasDropped => {
    //   if (hasDropped) wordIndices.nextWord();
    // });
  }

</script>

<div class='screen'>
  <div class='konva-container' bind:this={screen.konvaEl}></div>
  <canvas
    class='text layer'
    bind:this={screen.textCanvasEl}
    width={screen.width}
    height={screen.height}
  ></canvas>
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
  .text.layer {
    z-index: 1;
  }
  .street.layer {
    z-index: -1;
  }
</style>