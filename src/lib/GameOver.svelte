<script>
  import HeaderMenu from './HeaderMenu.svelte';
  import { onMount } from 'svelte';

  const gameOverStr = "GAME OVER";
  const goStrLength = gameOverStr.length;
  let goSubstrIndex = 0;
  $: goSubstr = gameOverStr.substring(0, goSubstrIndex);

  let showHeader = false;

  onMount(async () => {
    const addGoChar = () => {
      if (goSubstrIndex < goStrLength) {
        goSubstrIndex += 1;
      } else {
        clearInterval(addCharIntervalId);
        showHeader = true;
      }
    }
    let addCharIntervalId = setInterval(addGoChar, Math.PI * 100);
  });
</script>

<div id='after-words'>
  <HeaderMenu isVisible={ showHeader } />
  <h5>{ goSubstr }</h5>
</div>

<style>
  #after-words {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  h5 {
    margin: 0;
    color: gold;
    font-family: "Press Start 2P", serif;
    font-size: 8vw;
  }
</style>