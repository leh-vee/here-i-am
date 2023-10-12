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
  import { fetchSefirot, fetchBlocksForProjection, fetchBlocksForSefirotProjections, fetchBlocksWithinRadius } from './api/client.js';
  import { projectionForIlan, projectionBaseForSefirah, projectionsForChannels } from './lib/utils/projections.js';
  import { renderBlocksAsBackground } from './lib/illustrators/streetBlocks.js';
  import { channelFeatures } from './lib/utils/geoJson.js';
  import { tenByTenArray } from './lib/utils/base.js';
  import distance from "@turf/distance";
  import VerseChart from './lib/illustrators/VerseChart.js';


  const v = {
    isMovementWordByWord: null,
    screenPx: {
      width: window.innerWidth,
      height: window.innerHeight
    },
    screenProps: {
      frameEl: null,
      canvasEl: null,
      konvaEl: null,
      konvaStage: null
    },
    channels: {
      geoJson: undefined,
      projections: undefined,
      blocks: undefined
    }
  }; 

  onMount(async () => {
    v.screenProps.konvaStage = new Konva.Stage({
      container: v.screenProps.konvaEl, width: v.screenPx.width, height: v.screenPx.height
    }); 
    v.konvaLayer = new Konva.Layer();
    v.screenProps.konvaStage.add(v.konvaLayer);

    v.sefirot = await fetchSefirot();

    channelFeatures(v.sefirot).then(channels => {
      v.channels.geoJson = channels;
      console.log('channel feature data set ready');
      v.channels.projections = projectionsForChannels(channels, v.screenPx);
      console.log('all channel projections ready');
      v.channels.blocks = tenByTenArray();
    });
    
    v.ilanProjection = projectionForIlan(v.sefirot, v.screenPx);
    v.baseSefirahProjection = projectionBaseForSefirah(v.screenPx);
    
    fetchBlocksForProjection(v.ilanProjection, v.screenPx).then(blocks => {
      v.ilanBlocks = blocks;
      console.log('ilan blocks fetched');
    });
    fetchBlocksForSefirotProjections(v.sefirot, v.baseSefirahProjection, v.screenPx).then(blocks => {
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
    fetchBlocksForCurrentChannelProjection();
    v.verseNumberIllustrator = new VerseNumberIllustrator(v.screenProps.canvasEl);
    v.verseNumberIllustrator.render($currentPiSlice, $isFirstVerseTriad);
    setTimeout(() => {
      v.verseNumberIllustrator.clearCanvas();
      letterTrail();
    }, 5000);
  }

  function fetchBlocksForCurrentChannelProjection() {
    const projection = v.channels.projections[$lastPiSlice][$currentPiSlice];
    let projectionRadius = distance(projection.center(), projection.invert([0,0]));
    fetchBlocksWithinRadius(projection.center(), projectionRadius).then(blocks => {
      v.channels.blocks[$lastPiSlice][$currentPiSlice] = blocks;
      console.log('blocks for current channel projection fetched');
    });
  }

  async function letterTrail() { //this function should be more to do with the channel
    const konvaLayer = new Konva.Layer();
    v.screenProps.konvaStage.add(konvaLayer);

    const projection = v.channels.projections[$lastPiSlice][$currentPiSlice];
    const blocks = v.channels.blocks[$lastPiSlice][$currentPiSlice];
    renderBlocksAsBackground(konvaLayer, projection, blocks);
    
    const channel = v.channels.geoJson[$lastPiSlice].features[$currentPiSlice];
    const verseChart = new VerseChart($currentVerse, konvaLayer, channel, projection);
    verseChart.markSefirah();
    setTimeout(() => {
      verseChart.removeFromSefirahMarker();
      verseChart.markVerseWords();
    }, 1000);

    // dropSefirahMarker(channelLineCoords[0], konvaLayer, projection);

    // dropVerseCrumbsOnLayer($currentVerse, konvaLayer, projection, channel);

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
    width={v.screenPx.width}
    height={v.screenPx.height}
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