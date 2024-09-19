<script>
  import { Stage, Layer } from 'svelte-konva';
  import Punctuation from './Punctuation.svelte';
  import Notepad from './Notepad.svelte';
  import VerseMap from './VerseMap.svelte';
  import StreetMap from './StreetMap.svelte';
  import PiWatch from './PiWatch.svelte';
  import HeaderMenu from './HeaderMenu.svelte';
  import Ellipsis from './Ellipsis.svelte';
  import { verseState, isNavigable, isCountingDown, isFullStop } from '../stores/verseState';
  import { channelBlocks, blocksForCurrentChannel, currentChannelProjection } from '../stores/treeOfLife';
  import { wordIndices, isPunctuationNext, isLastVerseWord, isCaesura, isLineA, 
    currentPiSlice, lastPiSlice, likePiSlices, isGroundZero, isFirstVerseWord, 
    isInBetweenWords } from '../stores/text';
  import { fetchBlocksWithinRadius } from '../api/client.js';
  import distance from "@turf/distance";
  import { swipe } from 'svelte-gestures';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  $: isFetchingBlocks = $blocksForCurrentChannel === undefined;
  $: if (isFetchingBlocks) fetchBlocksForProjection();  
  $: showExplorer = !isFetchingBlocks && !$isCountingDown;
  
  let layerEl;
  
  function fetchBlocksForProjection() {
    const pCentre = $currentChannelProjection.center();
    const pRadius = distance(pCentre, $currentChannelProjection.invert([0,0]));
    fetchBlocksWithinRadius(pCentre, pRadius).then(blocks => {
      console.log('blocks for current channel projection fetched');
      if (!$likePiSlices) {
        channelBlocks.setForIndices($lastPiSlice, $currentPiSlice, blocks);
      // @ts-ignore
      } else if ($lastPiSlice !== 0) {
        channelBlocks.setForIndices($lastPiSlice, 0, blocks);
      }
    });
    return true;
  }

  function nextWord() {
    if ($isNavigable) {
      if ($isPunctuationNext) {
        isInBetweenWords.set(true);
        isCaesura.set(true);
      } else if ($isLastVerseWord) {
        verseState.set('full-stop');
      } else {
        wordIndices.nextWord();
      }
    }
  }

  $: if ($isFullStop) setTimeout(() => {
    verseState.set('post');
    fadeOut();
  }, Math.PI * 1000);

  function previousWord() {
    if ($isNavigable && !$isFirstVerseWord) wordIndices.previousWord();
  }

  const h = window.innerHeight;
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
  <Stage config={{ width: window.innerWidth, height: window.innerHeight }} >
    <Layer config={{ visible: showExplorer }} bind:handle={ layerEl }>
      <StreetMap blocksGeoJson={ $blocksForCurrentChannel } 
        projection={ $currentChannelProjection } />
      <Punctuation />
      <PiWatch />  
      <Ellipsis />
      <Notepad />
      <VerseMap on:next-word={ nextWord } on:previous-word={ previousWord } />
    </Layer>
  </Stage>
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