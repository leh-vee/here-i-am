<script>
  import { Stage, Layer } from 'svelte-konva';
  import Punctuation from './Punctuation.svelte';
  import ActionCallout from './ActionCallout.svelte';
  import Notepad from './Notepad.svelte';
  import VerseMap from './VerseMap.svelte';
  import StreetMap from './StreetMap.svelte';
  import PiWatch from './PiWatch.svelte';
  import HeaderMenu from './HeaderMenu.svelte';
  import Ellipsis from './Ellipsis.svelte';
  import { verseState, isNavigable, isCountingDown, isFullStop } from '../stores/verseState';
  import { blocksForCurrentChannel, currentChannelProjection } from '../stores/treeOfLife';
  import { wordIndices, isPunctuationNext, isLastVerseWord, isCaesura, isLineA, 
    likePiSlices, isGroundZero, isFirstVerseWord, isInBetweenWords } from '../stores/text';
  import { hasReadAhead, hasCompletedVerse, screenWidth, screenHeight } from '../stores/base';
  import { swipe } from 'svelte-gestures';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  let layerEl;

  function nextWord() {
    if ($isNavigable) {
      if ($isPunctuationNext) {
        isInBetweenWords.set(true);
        isCaesura.set(true);
      } else if ($isLastVerseWord) {
        verseState.set('full-stop');
        if (!$hasCompletedVerse) $hasCompletedVerse = true;
      } else {
        wordIndices.nextWord();
      }
      if (!$hasReadAhead) $hasReadAhead = true;
    }
  }

  $: if ($isFullStop) setTimeout(() => {
    verseState.set('post');
    fadeOut();
  }, Math.PI * 1000);

  function previousWord() {
    if ($isNavigable && !$isFirstVerseWord) wordIndices.previousWord();
  }

  const h = $screenHeight;
  const ySwipeBounds = { lower: h * 0.4, upper: h * 0.6 };
  function isPointerWithinBounds() {
    const yPos =  layerEl.getRelativePointerPosition().y;
    return yPos > ySwipeBounds.lower && yPos < ySwipeBounds.upper;
  }

  $: isSwipeDirectionReversed = $likePiSlices && !$isLineA;

  function swiped(event) {
    if (isPointerWithinBounds()) {
      const direction = event.detail.direction;
      if (direction === 'left') {
        isSwipeDirectionReversed ? previousWord() : nextWord();
      } else {
        isSwipeDirectionReversed ? nextWord() : previousWord();
      }
    }
  }

  function fadeOut() {
    layerEl.to({
      duration: Math.PI,
      opacity: 0,
      onFinish: () => {
        setTimeout(() => {
          if ($isGroundZero) {
            dispatch('groundZero');
          } else {
            wordIndices.nextVerse();
          }  
        }, 3000);
      }
    });
  }
</script>

<div id='verse-explorer' use:swipe={{ timeframe: 300, minSwipeDistance: 60 }} 
  on:swipe={(e) => { swiped(e) }}>
  <HeaderMenu />
  <Stage config={{ width: $screenWidth, height: $screenHeight }} >
    <Layer config={{ visible: !$isCountingDown }} bind:handle={ layerEl }>
      <StreetMap blocksGeoJson={ $blocksForCurrentChannel } 
        projection={ $currentChannelProjection } />
      <Punctuation />
      <PiWatch />  
      <Ellipsis />
      <Notepad />
      <VerseMap on:next-word={ nextWord } on:previous-word={ previousWord } />
    </Layer>
  </Stage>
  <ActionCallout />
</div>

<style>
  #verse-explorer {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
</style>