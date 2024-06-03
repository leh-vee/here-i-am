<script>
  import { Stage, Layer } from 'svelte-konva';
  import MapTiles from './MapTiles.svelte';
  import TitlePage from './landing_page/TitlePage.svelte';
  import Menu from './landing_page/Menu.svelte';
  import { onMount } from 'svelte';
  import { projectionForGroundZero } from '../utils/projections.js';
  import { fetchBlocksForProjection } from '../api/client.js';

  let isTileMapLoaded = false;
  let isMacroMapLoaded = false;
  let showTitlePage = true;

  onMount(async () => {
    await loadMacroMapData({ width: window.innerWidth, height: window.innerHeight });
    isMacroMapLoaded = true;
  });

  const groundZeroCoordsGcs = [-79.466850201826205, 43.657227646269199];
  let projection, blocks;
  async function loadMacroMapData(screenPx) {
    projection = projectionForGroundZero(groundZeroCoordsGcs, screenPx);
    blocks = await fetchBlocksForProjection(projection, screenPx);
  }

  function mapTilesLoaded() {
    isTileMapLoaded = true;
  }

  function showMenu() {
    showTitlePage = false;
  }
  
  $: allLandingPageMapsLoaded = isMacroMapLoaded && isTileMapLoaded;
</script>

{#if showTitlePage}
  <MapTiles centreCoordsGcs={ groundZeroCoordsGcs } on:loaded={ mapTilesLoaded } />
{/if}
<div id='landing-page'>
  <Stage config={{ width: window.innerWidth, height: window.innerHeight }}>
    <Layer>
      {#if showTitlePage}
        <TitlePage stopCoinFlipIntro={ allLandingPageMapsLoaded } on:show-menu={ showMenu } />
      {:else}
        <Menu projection={ projection } blocks={ blocks } on:go />
      {/if}
    </Layer>
  </Stage>
</div>

<style>
  #landing-page {
    position: absolute;
    top: 0;
    width: 0;
    height: 0;
    background-color: white;
  }
</style>