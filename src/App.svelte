<script>
  import { sefirotPoints, channelLines, channelProjections, 
    ilanProjection, ilanBlocks, groundZeroProjection, groundZeroBlocks } from './stores/treeOfLife.js';
  import Countdown from './lib/Countdown.svelte';
  import { onMount } from 'svelte';
  import { fetchSefirot, fetchBlocksForProjection } from './api/client.js';
  import { channelFeatures } from './utils/geoJson.js';
  import { projectionForSefirah, projectionsForChannels, projectionForIlan } from './utils/projections.js';
  import { Stage } from 'svelte-konva';
  import Overture from './lib/Overture.svelte';

  const v = {
    screenPx: {
      width: window.innerWidth,
      height: window.innerHeight
    },
    isDataInitialized: false,
    isOverture: true,
    isCountdown: false,
    isSwanSong: false
  }; 

  onMount(async () => {
    await setIlanData(v.screenPx);
    v.isDataInitialized = true;  
  });

  async function setIlanData(screenPx) {
    const sefirotGeoJson = await fetchSefirot();
    sefirotPoints.set(sefirotGeoJson);

    const zeroSefirah = sefirotGeoJson.features[0];
    const zeroProjection = projectionForSefirah(zeroSefirah, v.screenPx);
    groundZeroProjection.set(zeroProjection);
    const zeroBlocks = await fetchBlocksForProjection(zeroProjection, v.screenPx);
    groundZeroBlocks.set(zeroBlocks);
    
    const channelLinesGeoJson = channelFeatures(sefirotGeoJson);
    channelLines.set(channelLinesGeoJson);
    channelProjections.set(projectionsForChannels(channelLinesGeoJson, screenPx));

    const iProjection = await projectionForIlan(sefirotGeoJson, screenPx);
    ilanProjection.set(iProjection);
    const iBlocks = await fetchBlocksForProjection(iProjection, screenPx);
    ilanBlocks.set(iBlocks);
    console.log('ilan data set');
  }

  function commenceCountdown() {
    v.isOverture = false;
    v.isCountdown = true;
  }
</script>

<div class='screen'>
  <Stage config={{ width: window.innerWidth, height: window.innerHeight }}>
    {#if v.isOverture}
      <Overture startCollapse={ v.isDataInitialized } 
        on:allBlocksCrawled={ commenceCountdown } />
    {:else if v.isCountdown}
      <Countdown />
    {/if}
  </Stage>
</div>

<style>
  .screen {
    width: 100%;
    height: 100%;
    background-color: black;
  }
</style>