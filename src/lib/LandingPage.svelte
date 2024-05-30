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
  
  $: allLandingPageMapsLoaded = isMacroMapLoaded && isTileMapLoaded;
</script>


<MapTiles centreCoordsGcs={ groundZeroCoordsGcs } on:loaded={ mapTilesLoaded } />
<div id='landing-page'>
  <Stage config={{ width: window.innerWidth, height: window.innerHeight }}>
    <TitlePage stopCoinFlipIntro={ allLandingPageMapsLoaded } on:go />
    <!-- <Menu projection={ projection } blocks={ blocks } /> -->
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