<script>
  import { Stage, Layer, Text } from 'svelte-konva';
  import { wordIndices, isLastVerseWord, isFirstVerseWord, 
    currentWord, nextWord, previousWord } from '../stores/text.js';
  import { swipe } from 'svelte-gestures';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  const textBoxes = new Array(3);
  const textProps = {
    width: window.innerWidth,
    height: window.innerHeight,
    align: 'center',
    verticalAlign: 'middle',
    fontSize: 90,
    fontFamily: 'Alexross-Regular, Reenie Beanie',
    fillEnabled: true,
    fill: 'gold',
    strokeWidth: 0
  }

  export let isEllipsis = false;
  export let isVisible = false;

  $: word = isEllipsis ? '...' : $currentWord;

  function wordSwiped(event) {
    const duration = 0.2;
    const direction = event.detail.direction;
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
        textBoxes[2].to({
          offsetX: 0,
          duration,
          onFinish: () => {
            wordIndices.nextWord();
            textBoxes[1].offsetX(0);
            textBoxes[2].offsetX(-window.innerWidth);
          }
        });
      }
    }  
  }
</script>

<div class='word' use:swipe={{ timeframe: 300, minSwipeDistance: 60 }} on:swipe={ wordSwiped }>
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
</div>

<style>
  .word {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
</style>