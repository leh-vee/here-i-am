<script>
  import { totalPoints, nPiesScored } from '../stores/base';
  import { currentPiSliceRomanized, currentVerseIndex, wordIndices } from '../stores/text.js';
  import { serializeCountDown } from '../utils/textJson.js';

  const piCountDown = serializeCountDown(); 
  let isPiMenuVisible = false;
  let piSliceEl;

  let isPieEaten = [];
  $: {
    for (let i = 0; i < 3; i++) isPieEaten[i] = $nPiesScored > i;
  }

  $: if (isPiMenuVisible) piSliceEl.scrollIntoView({ behavior: "smooth", block: "start" });

  function togglePiMenu() { isPiMenuVisible = !isPiMenuVisible }

</script>

<div id='drop-down' class='menu'>
  <div id='score'>{ $totalPoints } MIN READ</div> 
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div id='verse-number' on:click={ togglePiMenu }>VERSE { $currentPiSliceRomanized }</div>
  <div id='pies'>
    {#each isPieEaten as eaten}
      <span class:eaten>🥧</span>
    {/each}
  </div>
</div>
<div id='pi' class='menu' class:hide={!isPiMenuVisible}>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div id='close-btn' on:click={ togglePiMenu }>x</div>
  {#each piCountDown as piSlice, i}
    {#if $currentVerseIndex === i}
      <div class='current slice' bind:this={piSliceEl}>{ piSlice }</div>
    {:else}
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <div class='slice' on:click={ () => { wordIndices.goToVerseIndex(i) } }>
        { piSlice }
      </div>
    {/if}
  {/each}
</div>


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

  #pi.menu.hide {
    visibility: hidden;
  }

  #pi.menu .current.slice {
    color: gold;
  }

  #close-btn {
    position: fixed;
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
  
  .menu #score {
    margin: 0 10px;
  }
  
  .menu #pies {
    margin: 0 10px;
    font-size: 20px;
    position: relative;
    bottom: 3px;
  }

  #pies span {
    padding-left: 1px;
  }

  #pies span:not(.eaten) {
    opacity: 0.3;
  }
</style>