<script>
  import { Stage } from 'svelte-konva';
  import MapTiles from './MapTiles.svelte';
  import TitlePage from './landing_page/TitlePage.svelte';
  import Menu from './landing_page/Menu.svelte';
</script>

<MapTiles />
<div id='landing-page'>
  <Stage config={{ width: window.innerWidth, height: window.innerHeight }}>
    <TitlePage />
    <!-- <Menu /> -->
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