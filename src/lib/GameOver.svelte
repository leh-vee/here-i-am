<script>
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  const gameOverStr = "GAME OVER";
  const goStrLength = gameOverStr.length;
  const fontFamily = "Press Start 2P";
  
  let goSubstrIndex = 0;
  let isTitleFontLoaded = false;

  $: goSubstr = gameOverStr.substring(0, goSubstrIndex);
  
  document.fonts.ready.then((fontFaceSet) => {
    const fontFaces = [...fontFaceSet];
    const loveYaFontFaces = fontFaces.filter(f => f.family === fontFamily);
    Promise.all(loveYaFontFaces.map(ff => ff.load())).then(() => { 
      isTitleFontLoaded = true;
    });
  });

  $: if (isTitleFontLoaded) typeGoStr();

  function typeGoStr() {
    const addGoChar = () => {
      if (goSubstrIndex < goStrLength) {
        goSubstrIndex += 1;
      } else {
        clearInterval(addCharIntervalId);
        dispatch('visible');
      }
    }
    let addCharIntervalId = setInterval(addGoChar, Math.PI * 100);
  }
</script>

<h5 id='title'>
  { goSubstr }
</h5>

<style>
  #title {
    color: gold;
    font-family: "Press Start 2P", serif;
    font-size: 4dvh;
  }
</style>