<script>
  import { Stage, Layer, Text } from 'svelte-konva';
  import { wordIndices, isLastVerseWord, isFirstVerseWord, nVerseWords,
    currentWord, nextWord, previousWord, isLastWordInLineA } from '../stores/text.js';
  import { swipe } from 'svelte-gestures';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  const textBoxes = new Array(3);
  const textProps = {
    width: window.innerWidth,
    height: window.innerHeight,
    align: 'center',
    verticalAlign: 'middle',
    fontSize: 80,
    fontFamily: 'Alexross-Regular, Reenie Beanie',
    fillEnabled: true,
    fill: 'gold',
    strokeWidth: 0
  }

  export let isVisible = false;
  export let isEllipsis = false;
  export let isFlight = false;
  
  let isSwipable = false;

  $: if (isFlight) scanNextWord();

  async function scanNextWord() {
    const nScans = $nVerseWords - 1;
    const t = Math.PI * 1000 / nScans;
    if ($isLastVerseWord) {
      isSwipable = true;
      dispatch('nextMovement');
    } else {
      await wordSwiped();
      setTimeout(() => { scanNextWord() }, t)
    }
  }

  $: word = isEllipsis ? '...' : $currentWord; 

  function wordSwiped(event) {
    isSwipable = false;
    const duration = Math.PI / 10;
    const direction = event ? event.detail.direction : 'left';
    return new Promise(resolve => {
      if (direction === 'right') {
        if (!$isFirstVerseWord) {
          textBoxes[1].to({
            offsetX: -window.innerWidth,
            duration
          });
          textBoxes[0].to({
            offsetX: 0,
            duration,
            onFinish: () => {
              wordIndices.previousWord();
              textBoxes[1].offsetX(0);
              textBoxes[0].offsetX(window.innerWidth);
              isSwipable = true;
              resolve(true);
            }
          });
        }
      } else {
        if ($isLastVerseWord) {
          dispatch('coda');
        } else {
          textBoxes[1].to({
            offsetX: window.innerWidth,
            duration
          });
          const caesuraDelay = $isLastWordInLineA ? Math.PI * 200  : 0;
          setTimeout(() => {
            textBoxes[2].to({
              offsetX: 0,
              duration,
              onFinish: () => {
                wordIndices.nextWord();
                textBoxes[1].offsetX(0);
                textBoxes[2].offsetX(-window.innerWidth);
                isSwipable = true;
                resolve(true);
              }
            });
          }, caesuraDelay);
        }
      }  
    });
  }
</script>

<div class='word' use:swipe={{ timeframe: 300, minSwipeDistance: 60 }} on:swipe={ (e) => { if (isSwipable) wordSwiped(e) } }>
  <Stage config={{ width: window.innerWidth, height: window.innerHeight }}>
    <Layer config={{ visible: isVisible }} >
      <Text config={{
        text: $previousWord,
        offsetX: window.innerWidth,
        ...textProps
      }} bind:handle={textBoxes[0]} />
      <Text config={{
        text: word,
        ...textProps
      }} bind:handle={textBoxes[1]} />
      <Text config={{
        text: $nextWord,
        offsetX: -window.innerWidth,
        ...textProps
      }} bind:handle={textBoxes[2]} />
    </Layer>
  </Stage>
  <div class='controller'>
    <span class='back button'
      on:click={ () => { if (isSwipable) { wordSwiped({ detail: { direction: 'right' } })} } } ></span>
    <span class='forward button'
      on:click={ () => { if (isSwipable) { wordSwiped() } } } ></span>
  </div>
</div>

<style>
  .controller {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 25%;
    display: flex;
    z-index: 1;
  }

  .controller .button {
    width: 50%;
    text-align: center;
    vertical-align: baseline;
    font-size: 5vw;
  }

  .word {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
</style>