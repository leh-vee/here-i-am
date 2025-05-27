<script>
  import HeaderMenu from './HeaderMenu.svelte';
  import { screenWidth } from "../stores/base";
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  const gameOverStr = "GAME OVER";
  const goStrLength = gameOverStr.length;
  const fontFamily = "Press Start 2P";

  $: margin = `${Math.round($screenWidth * 0.1)}px`;
  
  let goSubstrIndex = 0;
  let isHeaderVisible = false;
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
        isHeaderVisible = true;
      }
    }
    let addCharIntervalId = setInterval(addGoChar, Math.PI * 100);
  }
</script>

<div id='game-over' style="--margin:{margin}">
  <HeaderMenu isVisible={ isHeaderVisible } />
  <div class='passage'>
    <p class:hide={!isHeaderVisible}>
      Here I Am is a concrete poetry video game
      <a href="https://github.com/leh-vee/here-i-am" target="_blank">designed and developed</a>
      by Leon Lukashevsky. It is an adaptation of a poem that was anonymously
      posted around my neighborhood during the pandemic and is dedicated to whoever wrote it.
    </p>
  </div>
  <h5 id='title'>
    { goSubstr }
  </h5>
  <div class='passage'>
    <p class:hide={!isHeaderVisible}>
      For the foreseeable future the countdown will continue as
      <a href="https://github.com/leh-vee/intersections" target="_blank">Intersections</a>,
      a companion project.
    </p>
  </div>
</div>

<style>
  #game-over {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
  }

  .passage {
    height: 45%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  #title {
    margin: 0;
    color: gold;
    font-family: "Press Start 2P", serif;
    font-size: 4dvh;
  }
  
  p {
    font-family: Georgia, 'Times New Roman', Times, serif;
    font-size: 1.6dvh;
    line-height: 3dvh;
    color: lightgray;
    margin: 0 var(--margin);
    opacity: 1;
    transition: opacity 3s ease-in-out;
  }

  p.hide {
    opacity: 0;
  }
</style>