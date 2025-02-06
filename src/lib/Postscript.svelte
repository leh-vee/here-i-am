<script>
  import HeaderMenu from './HeaderMenu.svelte';
  import GameOver from './GameOver.svelte';

  let isGameOver = false;
</script>

<div id='postscript'>
  <HeaderMenu isVisible={ isGameOver } />
  <GameOver on:visible={ () => { isGameOver = true } } />
</div>

<style>
  #postscript {
    height: 100%;
    width: 100%;
  }
</style>