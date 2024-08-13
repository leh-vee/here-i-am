<script>
  import { totalPoints, nPiesScored } from '../stores/base';
  import { currentPiSliceRomanized } from '../stores/text.js';

  let isPieEaten = [];
  $: {
    for (let i = 0; i < 3; i++) isPieEaten[i] = $nPiesScored > i;
  }
</script>

<div id='menu'>
  <div id='verse-number'>VERSE { $currentPiSliceRomanized }</div>
  <div id='score'>{ $totalPoints } MIN READ</div> 
  <div id='pies'>
    {#each isPieEaten as eaten}
      <span class:eaten>🥧</span>
    {/each}
  </div>
</div>

<style>
  #menu {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 25px;
    background-color: black;
    border-bottom: 2px dimgrey solid;
    z-index: 2;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: lightgrey;
    font-family: Arial, Helvetica, sans-serif;
  }
  
  #menu #verse-number {
    margin: 0 10px;
  }
  
  #menu #pies {
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