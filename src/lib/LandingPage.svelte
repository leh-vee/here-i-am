<script>
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
    ...
  </button>
</div>

<style>
  div#landing-page {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-image: url("/toronto-lines.png");
    background-size: cover;
  }
  .title {
    margin: 0;
    font-size: 18svw;
    font-family: Arial, Helvetica, sans-serif;
    color: gold;
    -webkit-text-stroke-width: 2px;
    -webkit-text-stroke-color: black;
  }
  
  .sub.title {
    color: white;
    font-size: 8svw;
    -webkit-text-stroke-width: 1px;
  }

  button#go {
    position: absolute;
    bottom: 5%;
    padding: 1px 36px;
    border-radius: 6px;
    background-color: white;
    color: gold;
    font-size: 40px;
    border: 2px solid black;
    box-shadow: 0 8px 8px -4px lightblue;
    font-family: 'Times New Roman', Times, serif;
  }
</style>