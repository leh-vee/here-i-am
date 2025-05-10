<script>
  import HeaderMenu from './HeaderMenu.svelte';
  import { screenWidth } from "../stores/base";
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  const gameOverStr = "GAME OVER";
  const goStrLength = gameOverStr.length;
  const fontFamily = "Press Start 2P";

  $: margin = `${Math.round($screenWidth * 0.2)}px`;
  
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
      Here I Am was designed and developed by Leon Lukashevsky. 
      My Hebrew name is Levi. Anyone keeping score will remember
      that the <span class='italic'>me</span> character
      in the user menu is called that too. The Frequently Asked
      Questions dialogue following his introudctuon was written
      collaboratively, by all three of us at the very least.
    </p>
  </div>
  <h5 id='title'>
    { goSubstr }
  </h5>
  <div class='passage'>
    <p class:hide={!isHeaderVisible}>
      Intersections, our poetry collection published by Placeholder Press
      is a companion work to this game. It opens with a reproduction of
      Here I Am as it appeared on flyers anonymously posted around my Toronto
      neighbourhood in the spring of 2021. Each poem in the book is inspired
      by a brief encounter between imperfect strangers.
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

  .italic {
    font-style: italic;
  }
</style>