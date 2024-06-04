<script>
  import { Stage, Layer } from 'svelte-konva';
  import MapTiles from './MapTiles.svelte';
  import TitlePage from './landing_page/TitlePage.svelte';
  import { onMount } from 'svelte';
  import { projectionForGroundZero } from '../utils/projections.js';
  import { fetchBlocksForProjection } from '../api/client.js';
  import { createEventDispatcher } from 'svelte';
  
  const dispatch = createEventDispatcher();

  let isTileMapLoaded = false;
  let isMacroMapLoaded = false;
  let showMenuOptions = false;

  onMount(async () => {
    await loadMacroMapData({ width: window.innerWidth, height: window.innerHeight });
    isMacroMapLoaded = true;
  });

  const groundZeroCoordsGcs = [-79.466850201826205, 43.657227646269199];
  let projection, blocks;
  async function loadMacroMapData(screenPx) {
    projection = projectionForGroundZero(groundZeroCoordsGcs, screenPx, true);
    blocks = await fetchBlocksForProjection(projection, screenPx);
  }

  function mapTilesLoaded() {
    isTileMapLoaded = true;
  }
  
  $: allLandingPageMapsLoaded = isMacroMapLoaded && isTileMapLoaded;

  function showMenu() {
    showMenuOptions = true;
  }
</script>


<MapTiles centreCoordsGcs={ groundZeroCoordsGcs } on:loaded={ mapTilesLoaded } />
<div id='landing-page'>
  <Stage config={{ width: window.innerWidth, height: window.innerHeight }}>
    <Layer>
      <TitlePage stopCoinFlipIntro={ allLandingPageMapsLoaded } on:show-menu={ showMenu } />
    </Layer>
  </Stage>
</div>
{#if showMenuOptions}
  <div id='menu'>
    <h5 class='option'>Where are you?</h5>
    <!-- svelte-ignore a11y-missing-content -->
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <h5 class='option middle' on:click={ () => { dispatch('go') } }></h5>
    <h5 class='option'>What is this?</h5>
  </div>
{/if}

<style>
  #landing-page {
    position: absolute;
    top: 0;
    width: 0;
    height: 0;
    background-color: white;
  }

  #menu {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    color: black;
    font-family: Verdana, Geneva, Tahoma, sans-serif;
    text-align: center;
    font-size: 4.5dvh;
    text-decoration: underline;
  }
  
  #menu .option {
    margin: 0;
  }

  #menu .option.middle {
    height: 40%;
    width: 70%;
    border-radius: 50%;
    margin: 0 auto;
  }

</style>