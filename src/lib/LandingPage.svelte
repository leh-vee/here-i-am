<script>
    import { geoOrthographic } from 'd3';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  function dispatchGo() {
    dispatch('go');
  }
</script>

<div id='landing-page'>
  <button id='go' on:click={dispatchGo}>
    GO
  </button>
</div>

<style>
  div#landing-page {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  #go {
    height: fit-content;
  }
</style>