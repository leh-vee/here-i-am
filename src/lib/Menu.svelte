<script>
  import { totalPoints, nPiesScored } from '../stores/base';
  import { currentPiSliceRomanized, currentVerseIndex, wordIndices } from '../stores/text.js';
  import { serializeCountDown } from '../utils/textJson.js';

  export let isDropDownVisible = false;

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

<div id='drop-down' class='menu' class:hide={!isDropDownVisible}>
  <div id='score'>
    <span id='min-read'>{ $totalPoints }</span>
    <span id='pies'>
      {#each isPieEaten as eaten}
      <span class:eaten>🥧</span>
      {/each}
    </span>
  </div>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div id='verse-number' on:click={ togglePiMenu }>{ $currentPiSliceRomanized }</div>
  <div id='info'>?</div>
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
    color: white;
    font-family: "Wellfleet";
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: scroll;
    font-size: 20vh;
    color: white;
    transition: top 500ms ease;
  }

  #pi.menu.hide {
    top: 100%;
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

  #pi.menu.hide #close-btn {
    visibility: hidden;
  }

  #drop-down.menu {
    top: 0;
    left: 0;
    height: 25px;
    width: 100%;
    border-bottom: 2px dimgrey solid;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: Arial, Helvetica, sans-serif;
    transition: top 1s ease-in-out;
  }

  #drop-down.menu.hide {
    top: -27px;
  }
  
  .menu #score {
    position: absolute;
    left: 10px;
  }

  #score #min-read {
    color: white;    
    margin-right: 5px;
    font-size: 18px;
    font-family: "love ya like a sister";
  }

  .menu #pies {
    font-size: 16px;
    position: relative;
    bottom: 3px;
    font-family: monospace;
  }

  .menu #verse-number {
    font-size: 18px;
    color: gold;
    font-weight: bold;
    font-family: monospace;
  }
  
  .menu #info {
    font-family: Courier, monospace;
    text-align: center;
    background-color: white;
    color: black;
    width: 16px;
    font-size: 14px;
    border-radius: 50%;
    border: 1px solid white;
    position: absolute;
    right: 10px;
  }

  #pies span {
    padding-left: 1px;
  }

  #pies span:not(.eaten) {
    opacity: 0.3;
  }
</style>