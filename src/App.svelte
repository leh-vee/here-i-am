<script>
  import { sefirotPoints, channelLines, channelProjections, 
    ilanProjection, ilanBlocks, groundZeroProjection, 
    groundZeroBlocks, groundZeroRotationBlocks } from './stores/treeOfLife.js';
  import { screenWidth, screenHeight, isScreenDimensionsStored, 
    tossUpCoordinates, isDataInitialized } from './stores/base'; 
  import { projectionForGroundZero, projectionsForChannels, projectionForIlan } from './utils/projections.js';
  import { fetchSefirot, fetchBlocksForProjection, fetchRandoNodes } from './api/client.js';
  import { channelFeatures } from './utils/geoJson.js';
  import Conductor from './lib/Conductor.svelte';
  import LandingPage from './lib/LandingPage.svelte';

  let isLandingPage = true;
  let screenEl, screenElHieght, screenElWidth; 
  let isSkinnyScreen = false;  

  $: isScreenElMounted = screenEl !== undefined;
  $: isScreenBorder = !isLandingPage && isSkinnyScreen;
  
  $: if (isLandingPage) storeTossUpLocations();
  $: if (isLandingPage && isScreenElMounted) storeDimensions(screenElWidth, screenElHieght);
  $: if (!isLandingPage && $isScreenDimensionsStored) setIlanData();
  $: if (!isLandingPage && !$isScreenDimensionsStored && isScreenElMounted) {
    storeDimensions();
    setIlanData();
  }

  async function storeTossUpLocations() {
    const randoIntersectionsGeoJson = await fetchRandoNodes(3);
    const highParkAndGlenlakeCoords = [-79.466850201826205, 43.657227646269199];
    const tossUpCoords = [];
    randoIntersectionsGeoJson.features.forEach(feature => {
      tossUpCoords.push(feature.geometry.coordinates);
    });
    tossUpCoords.push(highParkAndGlenlakeCoords);
    $tossUpCoordinates = tossUpCoords;
  }

  function storeDimensions(w = screenElWidth, h = screenElHieght) {
    $screenWidth = w;
    $screenHeight = h;
    isSkinnyScreen =  window.innerWidth - $screenWidth > 10;
  }
  
  async function setIlanData() {
    isLandingPage = false;
    const screenPx = { width: $screenWidth, height: $screenHeight };
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
  }
</script>


<div id='screen' class:border={isScreenBorder}
  bind:this={ screenEl } bind:clientWidth={ screenElWidth } 
  bind:clientHeight={ screenElHieght }>
  {#if isLandingPage}
    {#key $screenWidth * $screenHeight}
      <LandingPage on:go={ () => { isLandingPage = false } } />
    {/key}
  {:else if $isScreenDimensionsStored}
    <Conductor />
  {/if}
</div>

<style>
  #screen {
    width: 100%;
    height: 100%;
    background-color: black;
    border-color: black;
    border-width: 0;
    transition: border-color 3.14s ease-in;
  }

  #screen.border {
    border-left: 1px dashed dimgrey;
    border-right: 1px dashed dimgrey;
  }
</style>