<script>
  import EllipsisPainter from './lib/EllipsisPainter.js';
  import StreetPainter from './lib/StreetPainter.js';
  import BreadcrumbPainter from './lib/BreadcrumbPainter.js';
  import { currentWord, wordIndices } from './store.js';
  // import LetterPainter from './lib/LetterPainter.js';
  // import { wordIndices, currentPiSlice } from './store.js';
  // import { onMount } from 'svelte';
  // import VerseNumberIllustrator from './lib/VerseNumberIllustrator.js';
  
  const screen = { 
    konvaEl: null,
    streetCanvasEl: null,
    trailCanvasEl: null,
    width: window.innerWidth,
    height: window.innerHeight
  };

  const animate = {
    streetCrawl: false,
    breadcrumbTrail: false,
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
    animate.breadcrumbTrail = true;
  }
  
  $: if (animate.breadcrumbTrail && screen.trailCanvasEl) {
    const { trailCanvasEl: el } = screen;
    const shipmanAndMaria = [ -79.475580356435302, 43.666354317159403 ];
    const breadcrumbPainter = new BreadcrumbPainter(el, shipmanAndMaria);
    breadcrumbPainter.renderGrid();
    // 13464314 
    // 13464237 
    // [ -79.475737962051795, 43.666806955878599 ]
  }

</script>

<div class='screen'>
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
</div>

<style>
  .screen, .breadcrumb.layer {
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

  .trail.layer {
    z-index: 2;
  }
</style>