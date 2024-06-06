<script>
  import LandingPageMarker from './landing_page/LandingPageMarker.svelte';
  import MapTiles from './MapTiles.svelte';

  const groundZeroCoordsGcs = [-79.466850201826205, 43.657227646269199];

  let isTileMapLoaded = false;
  let isMenu = false;

  function mapTilesLoaded() {
    isTileMapLoaded = true;
  }

  function showMenu() {
    isMenu = true;
  }

  function lightbox() {
    console.log('show lightbox');
  }
</script>

<MapTiles centreCoordsGcs={ groundZeroCoordsGcs } on:loaded={ mapTilesLoaded } />
<div id='landing-page'>
  <div id='marker'>
    <LandingPageMarker stopFlipping={ isTileMapLoaded } on:inverted={ showMenu } on:go />
  </div>
  {#if isMenu}
    <div id='menu'>
      <div class='question'>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <h5 on:click={ lightbox }>Where are you?</h5>
      </div>
      <div class='place-holder'>
      </div>
      <div class='question'>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <h5 on:click={ lightbox }>What is this?</h5>
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
  
  #menu {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    color: black;
  }

  #menu div {
    width: 100%;
  }

  #menu .question {
    height: 25%;
    z-index: 1;
  }

  #menu .place-holder {
    height: 50%;
  }
  
  #menu .question h5 {
    font-family: Verdana, Geneva, Tahoma, sans-serif;
    text-align: center;
    font-size: 4.5dvh;
    text-decoration: underline;
    color: black;
  }

</style>