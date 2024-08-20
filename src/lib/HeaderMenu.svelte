<script>
  import { totalPoints, nPiesScored } from '../stores/base';
  import { currentPiSliceRomanized, currentVerseIndex, wordIndices } from '../stores/text.js';
  import { serializeCountDown } from '../utils/textJson.js';
  import DropDown from './DropDown.svelte';

  export let isDropDownVisible = false;

  const piCountDown = serializeCountDown(); 
  let isPiMenuVisible = false;
  let isInfoMenuVisible = false;
  let piSliceEl;

  let isPieEaten = [];
  $: {
    for (let i = 0; i < 3; i++) isPieEaten[i] = $nPiesScored > i;
  }

  // $: if (isPiMenuVisible) piSliceEl.scrollIntoView({ behavior: "smooth", block: "start" });

  function togglePiMenu() { isPiMenuVisible = !isPiMenuVisible }
  function toggleInfoMenu() { isInfoMenuVisible = !isInfoMenuVisible }

</script>

<div id='header' class='menu' class:hide={!isDropDownVisible}>
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
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div id='info' on:click={ toggleInfoMenu }>?</div>
</div>
<DropDown isHidden={ !isPiMenuVisible }>
  <div id='pi' class='dd-content'>
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
</DropDown>
<DropDown isHidden={ !isInfoMenuVisible }>
  <div id='info' class='dd-content'>
    <h1>Instructions</h1>
    <p>Read the poem. Eat the pies. Have a nice time.</p>
    <h1>Score</h1>
    <p>The score is calculated as a function of the number of total reading minutes multiplied by the number of pies eaten.</p>
    <h1>Here I Am</h1>
    <p>This an adaptation of the proen that introduces the book Me & My Shadow, avaiable from Publisher X</p>
    <h1>Playlist</h1>
    <ul>
      <li>Pi - Kate Bush</li>
      <li>Falling Down; Tom Waits</li>
    </ul>
  </div>
</DropDown>

<style>
  #header.menu {
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
    position: absolute;
    background-color: black;
    z-index: 2;
  }

  #header.menu.hide {
    top: -27px;
  }

  #header.menu #score {
    position: absolute;
    left: 10px;
  }

  #header.menu #score #min-read {
    color: white;    
    margin-right: 5px;
    font-size: 18px;
    font-family: "love ya like a sister";
  }

  #header.menu #score #pies {
    font-size: 22px;
    position: relative;
    bottom: 2px;
    font-family: monospace;
  }

  #header.menu #verse-number {
    font-size: 18px;
    color: gold;
    font-weight: bold;
    font-family: monospace;
  }
  
  #header.menu #info {
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


  #pi.dd-content {
    height: inherit;
    font-family: "Wellfleet";
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: scroll;
    font-size: 20vh;
  } 

  #pi.dd-content .current.slice {
    color: gold;
  }

  #info.dd-content {
    font-family: 'Courier New', Courier, monospace;
    padding: 0 10px;
  } 
</style>