<script>
  import { sefirotPoints, channelLines, channelProjections, 
    ilanProjection, ilanBlocks, groundZeroProjection, 
    groundZeroBlocks, groundZeroRotationBlocks } from './stores/treeOfLife.js';
  import { screenWidth, screenHeight, isDataInitialized } from './stores/base'; 
  import { projectionForGroundZero, projectionsForChannels, projectionForIlan } from './utils/projections.js';
  import { fetchSefirot, fetchBlocksForProjection } from './api/client.js';
  import { channelFeatures } from './utils/geoJson.js';
  import Conductor from './lib/Conductor.svelte';
  import LandingPage from './lib/LandingPage.svelte';

  let isLandingPage = true;
  let isGroundZeroFetched = false;
  let screenPx; 

  $: if (!isGroundZeroFetched) {
    screenPx = { width: $screenWidth, height: $screenHeight };
    console.log('screen dimensions set to', screenPx);
  }

  async function setIlanData() {
    isGroundZeroFetched = true;
    const sefirotGeoJson = await fetchSefirot();
    sefirotPoints.set(sefirotGeoJson);
    
    const zeroSefirah = sefirotGeoJson.features[0];
    const zeroProjection = projectionForGroundZero(zeroSefirah.geometry.coordinates, screenPx);
    groundZeroProjection.set(zeroProjection);
    const zeroBlocks = await fetchBlocksForProjection(zeroProjection, screenPx);
    groundZeroBlocks.set(zeroBlocks);
    const zeroRotationBlocks = await fetchBlocksForProjection(zeroProjection, screenPx, true);
    groundZeroRotationBlocks.set(zeroRotationBlocks);

    const channelLinesGeoJson = channelFeatures(sefirotGeoJson);
    channelLines.set(channelLinesGeoJson);
    channelProjections.set(projectionsForChannels(channelLinesGeoJson, screenPx));

    const iProjection = await projectionForIlan(sefirotGeoJson, screenPx);
    ilanProjection.set(iProjection);
    const iBlocks = await fetchBlocksForProjection(iProjection, screenPx);
    ilanBlocks.set(iBlocks);
    $isDataInitialized = true; 
    console.log('ilan data set');
  }
</script>


<div id='screen' bind:clientWidth={ $screenWidth } 
  bind:clientHeight={ $screenHeight }>
  {#if isLandingPage}
    <LandingPage on:groundZeroFetched={ setIlanData } 
      on:go={ () => { isLandingPage = false }  } />
  {:else}
    <Conductor />
  {/if}
</div>

<style>
  #screen {
    width: 100%;
    height: 100%;
    background-color: black;
  }
</style>