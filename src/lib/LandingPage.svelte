<script>
    import { geoOrthographic } from 'd3';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  function dispatchGo() {
    dispatch('go');
  }
</script>

<div id='landing-page'>
  <h1 class='title'>Here I Am</h1>
  <h5 class='sub title'>Our Fallen Gang</h5>
  <button id='go' on:click={dispatchGo}>
    GO
  </button>
</div>

<style>
  div#landing-page {
    width: 100%;
    height: 100%;
    color: white;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .title {
    margin: 0;
    font-size: 15svw;
    font-family: Arial, Helvetica, sans-serif;
  }

  .sub.title {
    font-size: 5svw;
  }

  #go {
    height: fit-content;
    margin: 30px;
    padding: 12px;
    border-radius: 5px;
  }
</style>