<script>
  import { sefirotPoints, channelLines, channelProjections } from './stores/ilan.js';
  import { currentPiSlice, lastPiSlice } from './stores/text.js';
  import EllipsisPainter from './lib/EllipsisPainter.js';
  import StreetPainter from './lib/StreetPainter.js';
  import Konva from 'konva';
  import VerseExplorer from './lib/VerseExplorer.svelte';
  import { onMount } from 'svelte';
  import { renderBlocksAsBackground } from './lib/illustrators/streetBlocks.js';
  import { fetchSefirot } from './api/client.js';
  import { channelFeatures } from './lib/utils/geoJson.js';
  import { projectionsForChannels } from './lib/utils/projections.js';

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
    isReader: false
  }; 

  onMount(async () => {
    // v.screenProps.konvaStage = new Konva.Stage({
    //   container: v.screenProps.konvaEl, width: v.screenPx.width, height: v.screenPx.height
    // }); 
    // v.konvaLayer = new Konva.Layer();
    // v.screenProps.konvaStage.add(v.konvaLayer);

    await setIlanData(v.screenPx);
    v.isReader = true;

    // v.ilanProjection = projectionForIlan($sefirotPoints, v.screenPx);
    // v.baseSefirahProjection = projectionBaseForSefirah(v.screenPx);
    
    // fetchBlocksForProjection(v.ilanProjection, v.screenPx).then(blocks => {
    //   v.ilanBlocks = blocks;
    //   console.log('ilan blocks fetched');
    // });
    // fetchBlocksForSefirotProjections(v.sefirot, v.baseSefirahProjection, v.screenPx).then(blocks => {
    //   v.sefirotBlocks = blocks;
    //   console.log('sefirot blocks fetched');
    // });

    // elliplitcalCollapse();
  });

  async function setIlanData(screenPx) {
    const sefirotGeoJson = await fetchSefirot();
    sefirotPoints.set(sefirotGeoJson);
    const channelLinesGeoJson = channelFeatures(sefirotGeoJson);
    channelLines.set(channelLinesGeoJson);
    channelProjections.set(projectionsForChannels(channelLinesGeoJson, screenPx));
    console.log('ilan data set');
  }

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
    }, 15000);
  }

  async function letterTrail() { //this function should be more to do with the channel
    const konvaLayer = new Konva.Layer();
    v.screenProps.konvaStage.add(konvaLayer);

    const projection = v.channels.projections[$lastPiSlice][$currentPiSlice];
    const blocks = v.channels.blocks[$lastPiSlice][$currentPiSlice];
    renderBlocksAsBackground(konvaLayer, projection, blocks);
    
    // const channel = $chLines[$lastPiSlice].features[$currentPiSlice];
    // const verseChart = new VerseChart($currentVerse, konvaLayer, channel, projection);
    // verseChart.markSefirah();
    // setTimeout(() => {
    //   verseChart.removeFromSefirahMarker();
    //   verseChart.markVerseWords();
    // }, 1000);

    // dropSefirahMarker(channelLineCoords[0], konvaLayer, projection);

    // dropVerseCrumbsOnLayer($currentVerse, konvaLayer, projection, channel);

    // v.crumbAnimator = new CrumbAnimator(konvaLayer, v.sefirot, v.ilanBlocks, v.ilanProjection);
  }

</script>

<div class='screen'>
  {#if v.isReader}
    <VerseExplorer />
  {/if}
</div>

<style>
  .screen {
    width: 100%;
    height: 100%;
  }
</style>