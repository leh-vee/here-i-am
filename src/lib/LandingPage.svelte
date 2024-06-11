<script>
  import LandingPageMarker from './landing_page/LandingPageMarker.svelte';
  import MapTiles from './MapTiles.svelte';

  const groundZeroCoordsGcs = [-79.466850201826205, 43.657227646269199];

  let isTileMapLoaded = false;
  let isInterior = false;

  function mapTilesLoaded() {
    isTileMapLoaded = true;
  }

  function showInterior() {
    isInterior = true;
  }
</script>

<MapTiles centreCoordsGcs={ groundZeroCoordsGcs } on:loaded={ mapTilesLoaded } />
<div id='landing-page'>
  <div id='marker'>
    <LandingPageMarker stopFlipping={ isTileMapLoaded } on:inverted={ showInterior } on:go />
  </div>
  {#if isInterior}
    <div id='interior'>
      <div class='question'>
        <h5>Where am I?</h5>
      </div>
      <div class='place-holder'>
      </div>
      <div class='question'>
        <h5>What is this?</h5>
      </div>
    </div>
  {/if}
</div> 

<style>
  #landing-page {
    width: 100%;
    height: 100%;
  }
  
  #landing-page #marker {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
  }
  
  #interior {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    color: black;
  }

  #interior div {
    width: 100%;
  }

  #interior .question {
    height: 25%;
    z-index: 1;
  }

  #interior .place-holder {
    height: 50%;
  }
  
  #interior .question h5 {
    font-family: Verdana, Geneva, Tahoma, sans-serif;
    text-align: center;
    font-size: 4.5dvh;
    color: black;
  }

</style>