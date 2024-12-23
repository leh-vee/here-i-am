<script>
  import HeaderMenu from './HeaderMenu.svelte';

  const gameOverStr = "GAME OVER";
  const goStrLength = gameOverStr.length;
  let goSubstrIndex = 0;
  $: goSubstr = gameOverStr.substring(0, goSubstrIndex);

  let isGameOverOver = false;

  const fontFamily = "Press Start 2P";
  let isTitleFontLoaded = false;

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
        isGameOverOver = true;
      }
    }
    let addCharIntervalId = setInterval(addGoChar, Math.PI * 100);
  }
</script>

<div id='after-words'>
  <HeaderMenu isVisible={ isGameOverOver } />
  <div class='passage'>
    <p class:hide={!isGameOverOver}>
      Here I Am was designed and developed by Leon Lukashevsky. 
      My Hebrew name is Levi. Anyone keeping score will recall
      that as the name given to the <span class='italic'>me</span>
      character introduced in the help menu. Frequently Asked Questions,
      the dialogue therein, was written collaboratively, by the three of us
      at the very least.
    </p>
  </div>
  <h5 id='game-over'>{ goSubstr }</h5>
  <div class='passage'>
    <p class:hide={!isGameOverOver}>
      Intersections, our poetry collection published by Parking Lot Press
      is a companion work to this game. It opens with a reproduction of
      Here I Am as it appeared on flyers posted around my Toronto neighbourhood
      in the spring of 2021.  
    </p>
  </div>
</div>

<style>
  #after-words {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }

  .passage {
    margin: 10px;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }

  #game-over {
    margin: 0;
    color: gold;
    font-family: "Press Start 2P", serif;
    font-size: 8vw;
  }

  p {
    font-family: Georgia, 'Times New Roman', Times, serif;
    font-size: 12px;
    line-height: 200%;
    color: lightgray;
    margin: 0 20%;
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