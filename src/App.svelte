<script>
  import { currentPiSlice, currentVerse, currentVerseIndex, lastPiSlice, isFirstVerseTriad, wordIndices } from './store.js';
  import EllipsisPainter from './lib/EllipsisPainter.js';
  import StreetPainter from './lib/StreetPainter.js';
  import VerseNumberIllustrator from './lib/VerseNumberIllustrator.js';
  import CrumbAnimator from './lib/CrumbAnimator.js';
  import Konva from 'konva/lib/Core';
  import Word from './lib/Word.svelte';
  import Controller from './lib/Controller.svelte';
  import Timer from './lib/Timer.svelte';
  import { onMount } from 'svelte';
  import { fetchSefirot, fetchBlocksForProjection, fetchBlocksForSefirotProjections } from './api/client.js';
  import { newIlanProjection, newBaseSefirahProjection } from './lib/projections.js';

  const v = {
    isMovementWordByWord: null,
    screenProps: {
      width: window.innerWidth,
      height: window.innerHeight,
      frameEl: null,
      canvasEl: null,
      konvaEl: null,
      konvaStage: null
    }
  }; 

  onMount(async () => {
    const { konvaEl, width, height } = v.screenProps;
    const screenPx = { width, height };
    
    v.screenProps.konvaStage = new Konva.Stage({
      container: konvaEl, width, height
    }); 
    v.konvaLayer = new Konva.Layer();
    v.screenProps.konvaStage.add(v.konvaLayer);

    v.sefirot = await fetchSefirot();
    
    v.ilanProjection = newIlanProjection(v.sefirot, screenPx);
    v.baseSefirahProjection = newBaseSefirahProjection(screenPx);
    
    fetchBlocksForProjection(v.ilanProjection).then(blocks => {
      v.ilanBlocks = blocks;
      console.log('ilan blocks fetched');
    });
    fetchBlocksForSefirotProjections(v.sefirot, v.baseSefirahProjection).then(blocks => {
      v.sefirotBlocks = blocks;
      console.log('sefirot blocks fetched');
    });

    elliplitcalCollapse();
  });

  function elliplitcalCollapse() {
    v.ellipsisPainter = new EllipsisPainter(v.konvaLayer);
    v.ellipsisPainter.animate().then(_ => subLinearCrawl()); 
  }

  function subLinearCrawl() {
    const { canvasEl: el } = v.screenProps;
    let sefirah = v.sefirot.features[$lastPiSlice];
    let blocks = v.sefirotBlocks[$lastPiSlice];
    v.streetPainter = new StreetPainter(el, sefirah.geometry.coordinates, blocks);
    v.streetPainter.drawBlocksFromNode(sefirah.id);
    setTimeout(() => {
      v.streetPainter.clearCanvas();
      v.ellipsisPainter.clearCanvas();
      countDown();
    }, 15000);
  }

  function countDown() {
    v.verseNumberIllustrator = new VerseNumberIllustrator(v.screenProps.canvasEl);
    v.verseNumberIllustrator.render($currentPiSlice, $isFirstVerseTriad);
    setTimeout(() => {
      v.verseNumberIllustrator.clearCanvas();
      alphabetRoad();
    }, 5000);
  }

  function alphabetRoad() {
    const konvaLayer = new Konva.Layer();
    v.screenProps.konvaStage.add(konvaLayer);
    v.crumbAnimator = new CrumbAnimator(konvaLayer, v.sefirot, v.ilanBlocks, v.ilanProjection);
  }

  // $: if (movements.poeticContraction) {
  //   crumbAnimator.gatherLetterCrumbs().then(complete => {
  //     movements.poeticContraction = false;
  //     movements.wordByWord = true;
  //   });
  // }

  // $: if (movements.wordByWord && $wordIndices) {
  //   const crumbVerseIndex = crumbAnimator.getVerseIndex();
  //   let { wordIndex, line } = $wordIndices;
  //   if ($currentVerseIndex === crumbVerseIndex) {
  //     crumbAnimator.highlightWordCrumb(wordIndex, line === 'b');
  //   } else {
  //     setTimeout(() => {
  //       movements.wordByWord = false;
  //       crumbAnimator.clearCanvas();
  //       movements.elliplitcalCollapse = true;
  //     }, 0);
  //   }
  // }

</script>

<div class='screen' bind:this={v.screenProps.frameEl}>
  <div bind:this={v.screenProps.konvaEl}></div>
  <canvas
    bind:this={v.screenProps.canvasEl}
    width={v.screenProps.width}
    height={v.screenProps.height}
  ></canvas>
  {#if v.isMovementWordByWord}
    <Timer /> 
    <Word />
    <Controller />
  {/if} 
</div>

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