<script>
  import { totalPoints, nPiesScored } from '../stores/base';
  import { currentPiSliceRomanized, currentVerseIndex } from '../stores/text.js';
  import { serializeCountDown } from '../utils/textJson.js';

  const piCountDown = serializeCountDown(); 
  let isPiMenuVisible = false;
  let piSliceEl;

  let isPieEaten = [];
  $: {
    for (let i = 0; i < 3; i++) isPieEaten[i] = $nPiesScored > i;
  }

  function piMenuToggle() { isPiMenuVisible = !isPiMenuVisible }

  $: if (isPiMenuVisible && piSliceEl !== undefined) piSliceEl.scrollIntoView({ behavior: "smooth", block: "start" });

</script>

<div id='drop-down' class='menu'>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div id='verse-number' on:click={ piMenuToggle }>VERSE { $currentPiSliceRomanized }</div>
  <div id='score'>{ $totalPoints } MIN READ</div> 
  <div id='pies'>
    {#each isPieEaten as eaten}
      <span class:eaten>🥧</span>
    {/each}
  </div>
</div>
{#if isPiMenuVisible}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div id='close-btn' on:click={ piMenuToggle }>x</div>
  <div id='pi' class='menu'>
    {#each piCountDown as piSlice, i}
      {#if $currentVerseIndex === i}
        <div class='current slice' bind:this={piSliceEl}>{ piSlice }</div>
      {:else}
        <div class='slice'>{ piSlice }</div>
      {/if}
    {/each}
  </div>
{/if}

<style>
  .menu {
    position: absolute;
    background-color: black;
    z-index: 2;
  }

  #pi.menu {
    top: 27px;
    left: 0;
    bottom: 0;
    width: 100%;
  }

  #pi.menu {
    color: white;
    font-family: "Wellfleet";
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: scroll;
    font-size: 20vh;
    color: white;
  }

  #pi.menu .current.slice {
    color: gold;
  }

  #close-btn {
    position: absolute;
    top: 40px;
    right: 30px; 
    font-size: 30px;
    color: gray;
    z-index: 3;
    font-family: monospace;
  }

  #drop-down.menu {
    top: 0;
    left: 0;
    width: 100%;
    height: 25px;
    border-bottom: 2px dimgrey solid;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: lightgrey;
    font-family: Arial, Helvetica, sans-serif;
  }
  
  .menu #verse-number {
    margin: 0 10px;
  }
  
  .menu #pies {
    margin: 0 10px;
    font-size: 25px;
    position: relative;
    bottom: 3px;
  }

  #pies span {
    padding-left: 5px;
  }

  #pies span:not(.eaten) {
    opacity: 0.5;
  }
</style>