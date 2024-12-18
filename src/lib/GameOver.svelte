<script>
  import HeaderMenu from './HeaderMenu.svelte';
</script>

<div id='after-words'>
  <HeaderMenu isVisible={ true } />
  <h5>Game Over</h5>
</div>

<style>
  #after-words {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: 'Courier New', Courier, monospace;
    font-size: xx-large;
  }
  h5 {
    margin: 0;
    color: gold;
  }
</style>