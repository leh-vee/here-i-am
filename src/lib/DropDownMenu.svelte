<script>
  import { totalPoints, nPiesScored } from '../stores/base';

  let isPieEaten = [];
  $: {
    for (let i = 0; i < 3; i++) isPieEaten[i] = $nPiesScored > i;
  }
</script>

<div id='menu'>
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
  }
  
  #menu #score {
    margin: 0 10px;
    font-family: Arial, Helvetica, sans-serif;
    color: lightgrey;
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