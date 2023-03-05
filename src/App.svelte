<script>
  import { currentVerse, isFirstVerseTriad } from './store.js';
  import VerseNumberIllustrator from './lib/VerseNumberIllustrator.js';
  // import EllipsisPainter from './lib/EllipsisPainter.js';
  // import StreetPainter from './lib/StreetPainter.js';
  // import BreadcrumbPainter from './lib/BreadcrumbPainter.js';
  // import LetterPainter from './lib/LetterPainter.js';
  // import { wordIndices } from './store.js';
  // import { onMount } from 'svelte';
  
  const verseMovements = {
    countDown: false,
    alphabetRoad: false,
    poeticContraction: false,
    wordByWord: false,
    ellipticalCollapse: false, 
    subLinearCrawl: false,
  } 

  const screenProps = {
    width: window.innerWidth,
    height: window.innerHeight,
    canvasEl: null
  };

  $: if (screenProps.canvasEl) {
    const verseNumberIllustrator = new VerseNumberIllustrator(screenProps.canvasEl);
    verseNumberIllustrator.showNumber($currentVerse.piSlice, $isFirstVerseTriad);
  }

  // $: if (screen.konvaEl) {
  //   const { konvaEl: el, width, height } = screen;
  //   const ellipsisPainter = new EllipsisPainter(el, width, height);
  //   ellipsisPainter.animate().then(complete => {
  //     verseMovements.subLinearCrawl = true;
  //   });
  // }

  // $: if (verseMovements.subLinearCrawl && screen.streetCanvasEl) {
  //   const { streetCanvasEl: el } = screen;
  //   const highParkAndHumberside = [ -79.466850201826219, 43.657227646269199 ];
  //   const streetPainter = new StreetPainter(el, highParkAndHumberside);
  //   streetPainter.drawBlocksFromNode(13465772);
  //   verseMovements.alphabetRoad = true;
  // }
  
  // $: if (verseMovements.alphabetRoad && screen.trailCanvasEl) {
  //   const { trailCanvasEl: el } = screen;
  //   const highParkAndHumberside = [ -79.466850201826219, 43.657227646269199 ];
  //   // const shipmanAndMaria = [ -79.475580356435302, 43.666354317159403 ];
  //   const breadcrumbPainter = new BreadcrumbPainter(el, highParkAndHumberside);
  //   const verseWords = [...$currentVerse.a, ...$currentVerse.b];
  //   breadcrumbPainter.renderTrail(verseWords);
  // }

</script>

<div class='screen'>
  <canvas
    bind:this={screenProps.canvasEl}
    width={screenProps.width}
    height={screenProps.height}
  ></canvas>
</div>

<!-- div class='screen'>
  <div class='breadcrumb layer' bind:this={screen.konvaEl}></div>
  <canvas
    class='street layer'
    bind:this={screen.streetCanvasEl}
    width={screen.width}
    height={screen.height}
  ></canvas>
  <canvas
    class='trail layer'
    bind:this={screen.trailCanvasEl}
    width={screen.width}
    height={screen.height}
  ></canvas>
</div -->

<style>
  .screen {
    width: 100%;
    height: 100%;
  }

  canvas {
    position: absolute;
    left: 0;
    top: 0;
  }
</style>