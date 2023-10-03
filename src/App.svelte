<script>
  import { currentPiSlice, lastPiSlice, currentVerse, currentVerseIndex, isFirstVerseTriad, wordIndices } from './store.js';
  import EllipsisPainter from './lib/EllipsisPainter.js';
  import StreetPainter from './lib/StreetPainter.js';
  import VerseNumberIllustrator from './lib/VerseNumberIllustrator.js';
  import Konva from 'konva/lib/Core';
  import Word from './lib/Word.svelte';
  import Controller from './lib/Controller.svelte';
  import Timer from './lib/Timer.svelte';
  import { onMount } from 'svelte';
  import { fetchSefirot, fetchBlocksForProjection, fetchBlocksForSefirotProjections } from './api/client.js';
  import { newIlanProjection, newBaseSefirahProjection } from './lib/utils/projections.js';
  import { renderBlocksAsBackground } from './lib/illustrators/streetBlocks.js';
  import { channelFeatures, wordCrumbFeatures } from './lib/utils/geoJson.js';
  import { dropCrumbsOnLayer } from './lib/illustrators/wordCrumbs.js';

  const v = {
    isMovementWordByWord: null,
    screenProps: {
      width: window.innerWidth,
      height: window.innerHeight,
      frameEl: null,
      canvasEl: null,
      konvaEl: null,
      konvaStage: null
    },
    channels: []
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
    channelFeatures(v.sefirot).then(channels => {
      v.channels = channels;
      console.log('all tree of life channel permutations composed')
    });
    
    v.ilanProjection = newIlanProjection(v.sefirot, screenPx);
    v.baseSefirahProjection = newBaseSefirahProjection(screenPx);
    
    fetchBlocksForProjection(v.ilanProjection, screenPx).then(blocks => {
      v.ilanBlocks = blocks;
      console.log('ilan blocks fetched');
    });
    fetchBlocksForSefirotProjections(v.sefirot, v.baseSefirahProjection, screenPx).then(blocks => {
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
      letterTrail();
    }, 5000);
  }

  function letterTrail() {
    const konvaLayer = new Konva.Layer();
    v.screenProps.konvaStage.add(konvaLayer);
    renderBlocksAsBackground(konvaLayer, v.ilanProjection, v.ilanBlocks);
    let channel = v.channels[$lastPiSlice].features[$currentPiSlice]; 
    let crumbs = wordCrumbFeatures($currentVerse, channel); // should do this right at the beginning of the movement / in an conductor object or module
    dropCrumbsOnLayer(crumbs, konvaLayer, v.ilanProjection);
    // dropLetterCrumbs(verse, fromSefirot, toSefirot); 
    // v.crumbAnimator = new CrumbAnimator(konvaLayer, v.sefirot, v.ilanBlocks, v.ilanProjection);
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