<script>
  import { nPiesScored } from '../stores/base';
  import { isMenuVisible } from '../stores/verseState';
  import { currentPiSliceRomanized } from '../stores/text';
  import InfoDropDownMenu from './menus/InfoDropDownMenu.svelte';
  import PiDropDownMenu from './menus/PiDropDownMenu.svelte';

  export let isVisible = false;

  $: isHeaderVisible = $isMenuVisible || isVisible;

  let isInfoMenuVisible = false;
  function togglePiMenu() { isPiMenuVisible = !isPiMenuVisible }
  let isPiMenuVisible = false;
  function toggleInfoMenu() { isInfoMenuVisible = !isInfoMenuVisible }

  let isPieEaten = [];
  $: {
    for (let i = 0; i < 3; i++) isPieEaten[i] = $nPiesScored > i;
  }
</script>

<div id='header' class='menu' class:hide={!isHeaderVisible}>
  <span id='pies'>
    {#each isPieEaten as eaten}
    <span class:eaten>🥧</span>
    {/each}
  </span>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div id='verse-number' on:click={ togglePiMenu }>{ $currentPiSliceRomanized }</div>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div id='info' on:click={ toggleInfoMenu }>?</div>
</div>
<PiDropDownMenu isVisible={ isPiMenuVisible } />
<InfoDropDownMenu isVisible={ isInfoMenuVisible } />

<style>
  #header.menu {
    position: absolute;
    top: 0;
    left: 0;
    height: 25px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: black;
    border-bottom: 2px dimgrey solid;
    z-index: 2;
    transition: top 1s ease-in-out;
  }

  #header.menu.hide {
    top: -27px;
  }
  
  #header.menu #pies {
    position: absolute;
    left: 5px;
    font-size: 22px;
    bottom: 1px;
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