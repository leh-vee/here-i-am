<script>
  import { sefirotPoints, channelLines, channelProjections, 
    ilanProjection, ilanBlocks, groundZeroProjection, 
    groundZeroBlocks, groundZeroRotationBlocks } from './stores/treeOfLife.js';
  import { isDataInitialized } from './stores/base.js'; 
  import { onMount } from 'svelte';
  import { fetchSefirot, fetchBlocksForProjection } from './api/client.js';
  import { channelFeatures } from './utils/geoJson.js';
  import { projectionForSefirah, projectionsForChannels, projectionForIlan } from './utils/projections.js';
  import { Stage } from 'svelte-konva';
  import Overture from './lib/Overture.svelte';
  import Countdown from './lib/Countdown.svelte';
  import SwanSong from './lib/SwanSong.svelte';
  import VerseNumber from './lib/VerseNumber.svelte';
  import LandingPage from './lib/LandingPage.svelte';

  const screenPx = {
    width: window.innerWidth,
    height: window.innerHeight
  }
  const movements = ['prologue', 'overture', 'countdown', 'swanSong'];
  let movementIndex = 0;
  $: movement = movements[movementIndex];

  onMount(async () => {
    await setIlanData(screenPx);
    isDataInitialized.set(true);  
  });

  async function setIlanData(screenPx) {
    const sefirotGeoJson = await fetchSefirot();
    sefirotPoints.set(sefirotGeoJson);
    
    const zeroSefirah = sefirotGeoJson.features[0];
    const zeroProjection = projectionForSefirah(zeroSefirah, screenPx);
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
    console.log('ilan data set');
  }

  function nextMovement() { movementIndex += 1 }
</script>

<div class='screen' class:landing-page={movement === 'prologue'}>
  <Stage config={{ width: window.innerWidth, height: window.innerHeight }}>
    {#if movement === 'prologue'} 
      <LandingPage on:go={ nextMovement } />
    {:else if movement === 'overture' }
      <Overture on:goneNova={ nextMovement } />
    {:else if movement === 'countdown' }
      <Countdown on:groundZero={ nextMovement } />
    {:else if movement === 'swanSong' }
      <SwanSong />
    {/if}
  </Stage>
  {#if isDataInitialized}
    <VerseNumber />
  {/if}
</div>

<style>
  .screen {
    width: 100%;
    height: 100%;
    background-color: black;
  }

  /* .screen.landing-page {
    background-image: url("/toronto-lines.png");
    background-size: cover;
  } */
</style>