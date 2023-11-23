<script>
  import { Stage, Layer, Text } from 'svelte-konva';
  import { wordIndices, isLastVerseWord, isFirstVerseWord } from '../stores/text.js';
  import { swipe } from 'svelte-gestures';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  export let currentWord;
  export let isVisible = false;

  function wordSwiped(event) {
    const direction = event.detail.direction;
    if (direction === 'right') {
      if (!$isFirstVerseWord) wordIndices.previousWord();
    } else {
      if ($isLastVerseWord) {
        dispatch('coda');
      } else {
        wordIndices.nextWord();
      }
    }  
  }
</script>

<div class='word' use:swipe={{ timeframe: 300, minSwipeDistance: 60 }} on:swipe={ wordSwiped }>
  <Stage config={{ width: window.innerWidth, height: window.innerHeight }}>
    <Layer config={{ visible: isVisible }} >
      <Text config={{
        text: currentWord,
        width: window.innerWidth,
        height: window.innerHeight,
        align: 'center',
        verticalAlign: 'middle',
        fontSize: 90,
        fontFamily: 'Alexross-Regular, Reenie Beanie',
        fillEnabled: true,
        fill: 'gold',
        strokeWidth: 0
      }} />
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