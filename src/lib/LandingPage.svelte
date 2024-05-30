<script>
  import { Stage, Layer } from 'svelte-konva';
  import MapTiles from './MapTiles.svelte';
  import TitlePage from './landing_page/TitlePage.svelte';
  import Menu from './landing_page/Menu.svelte';
  import { onMount } from 'svelte';
  import { projectionForLandingPage } from '../utils/projections.js';
  import { fetchBlocksForProjection } from '../api/client.js';

  let isGroundZeroDataLoaded = false;
  let isMapTilesLoaded = false;

  onMount(async () => {
    await setGroundZeroData({ width: window.innerWidth, height: window.innerHeight });
    isGroundZeroDataLoaded = true;
  });

  const groundZeroCoordsGcs = [-79.466850201826205, 43.657227646269199];
  let projection, blocks;
  async function setGroundZeroData(screenPx) {
    projection = projectionForLandingPage(groundZeroCoordsGcs, screenPx);
    blocks = await fetchBlocksForProjection(projection, screenPx);
  }

  function mapTilesLoaded() {
    isMapTilesLoaded = true;
  }

  $: allDataLoaded = isGroundZeroDataLoaded && isMapTilesLoaded;
</script>


<MapTiles centreCoordsGcs={ groundZeroCoordsGcs } on:loaded={ mapTilesLoaded } />
<div id='landing-page'>
  <Stage config={{ width: window.innerWidth, height: window.innerHeight }}>
    <TitlePage stopCoinFlipIntro={ allDataLoaded } on:go />
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