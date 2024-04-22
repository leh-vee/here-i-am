<script>
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();
  const btnDiameter = Math.round(window.innerWidth * 0.7);

  let isTitleFontLoaded = false;
  document.fonts.load("12px Love Ya Like A Sister", "a").then(() =>{
    isTitleFontLoaded = true;
  });

  function dispatchGo() {
    dispatch('go');
  }
</script>

<div id='landing-page'>
  <button on:click={dispatchGo} id="go" style='--diameter:{btnDiameter};'>
    {#if isTitleFontLoaded}
      <span class="title">Here</span>
      <span class="title">I Am</span>
    {/if}
  </button>
</div>

<style>
  div#landing-page {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-image: url("/toronto-lines.png");
    background-size: cover;
  }
  
  button#go {
    background: black;
    text-align: center;
    width: calc( var(--diameter) * 1px );
    height: calc( var(--diameter) * 1px );
    border-radius: 100%;
    display: inline-flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .title {
    font-family: 'Love Ya Like A Sister';
    font-size: 10lvh;
    color: gold;
    font-weight: bold;
    text-decoration: none
  }
</style>