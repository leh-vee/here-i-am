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
      Levi, the name of the <span class='italic'>me</span>
      character in the help menu happeneds to be his Hebrew name.
      The Frequently Asked Questions dialogue found there  
      was written by all of us in collaboration.
    </p>
  </div>
  <h5 id='game-over'>{ goSubstr }</h5>
  <div class='passage'>
    <p class:hide={!isGameOverOver}>
      Intersections, a collection of intersubjective lyrical poems,
      each inspired by brief conversations between strangers is a
      companion work to this project publishd by Parking Lot Press.
      It opens with Here I Am as it appeared printed on a flyer
      posted around my Toronto neighbourhood in the spring of 2021.
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