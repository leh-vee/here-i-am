<script>
  import { totalPoints, nPiesScored } from '../stores/base';
  import { currentPiSliceRomanized } from '../stores/text.js';
  import InfoDropDownMenu from './menus/InfoDropDownMenu.svelte';
  import PiDropDownMenu from './menus/PiDropDownMenu.svelte';

  export let isDropDownVisible = false;

  let isInfoMenuVisible = false;
  function togglePiMenu() { isPiMenuVisible = !isPiMenuVisible }
  let isPiMenuVisible = false;
  function toggleInfoMenu() { isInfoMenuVisible = !isInfoMenuVisible }

  let isPieEaten = [];
  $: {
    for (let i = 0; i < 3; i++) isPieEaten[i] = $nPiesScored > i;
  }
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
<PiDropDownMenu isVisible={ isPiMenuVisible } />
<InfoDropDownMenu isVisible={ isInfoMenuVisible } />

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
</style>