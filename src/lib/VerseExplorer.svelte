<script>
  import { Stage, Layer } from 'svelte-konva';
  import Punctuation from './Punctuation.svelte';
  import Notepad from './Notepad.svelte';
  import VerseMap from './VerseMap.svelte';
  import StreetMap from './StreetMap.svelte';
  import PiWatch from './PiWatch.svelte';
  import HeaderMenu from './HeaderMenu.svelte';
  import Ellipsis from './Ellipsis.svelte';
  import { verseState, isFinished, isNavigable, isCountingDown } from '../stores/verseState';
  import { channelBlocks, blocksForCurrentChannel, currentChannelProjection } from '../stores/treeOfLife';
  import { wordIndices, isPunctuationNext, isLastVerseWord, isCaesura, 
    currentPiSlice, lastPiSlice, likePiSlices, isGroundZero, isFirstVerseWord } from '../stores/text';
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
        isCaesura.set(true);
      } else if ($isLastVerseWord) {
        fadeOut();
      } else {
        wordIndices.nextWord();
      }
    }
  }

  function previousWord() {
    if ($isNavigable && !$isFirstVerseWord) wordIndices.previousWord();
  }
  
  function click() {
    // implementation to come
  }

  const h = window.innerHeight;
  const ySwipeBounds = { lower: h * 0.4, upper: h * 0.6 };
  function isPointerWithinBounds() {
    const yPos =  layerEl.getRelativePointerPosition().y;
    return yPos > ySwipeBounds.lower && yPos < ySwipeBounds.upper;
  }

  function swiped(event) {
    if (isPointerWithinBounds()) {
      const direction = event.detail.direction;
      if (direction === 'left') {
        nextWord();
      } else {
        previousWord();
      }
    }
  }

  function fadeOut() {
    if ($isFinished) {
      return null;
    } else {
      verseState.set('finished');
    }
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
  <Stage config={{ width: window.innerWidth, height: window.innerHeight }} 
    on:pointerclick={ click } >
    <Layer config={{ visible: showExplorer }} bind:handle={ layerEl }>
      <StreetMap blocksGeoJson={ $blocksForCurrentChannel } 
        projection={ $currentChannelProjection } />
      <Punctuation />
      <PiWatch />  
      <Ellipsis />
      <Notepad />
      <VerseMap />
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