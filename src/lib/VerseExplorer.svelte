<script>
  import { Stage, Layer } from 'svelte-konva';
  import Punctuation from './Punctuation.svelte';
  import Notepad from './Notepad.svelte';
  import VerseMap from './VerseMap.svelte';
  import StreetMap from './StreetMap.svelte';
  import PiWatch from './PiWatch.svelte';
  import HeaderMenu from './HeaderMenu.svelte';
  import Ellipsis from './Ellipsis.svelte';
  import { verseState, isReaderEngaged } from '../stores/base';
  import { channelBlocks, blocksForCurrentChannel, 
    currentChannelProjection } from '../stores/treeOfLife';
  import { wordIndices, isPunctuationNext, isGroundZero,
    isLastVerseWord, isInBetweenWords, isCaesura,
    currentPiSlice, lastPiSlice, likePiSlices } from '../stores/text';
  import { fetchBlocksWithinRadius } from '../api/client.js';
  import distance from "@turf/distance";
  import { onDestroy } from 'svelte';
  import { createEventDispatcher } from 'svelte';
  import { swipe } from 'svelte-gestures';
  
  const dispatch = createEventDispatcher();

  export let isReading = false;
  
  $: isEllipsisReaveled = $verseState === 'ellipsisRevealed';
  $: isVerseMapReaveled = $verseState === 'verseMapReaveled';
  $: isEllipsisLit = $verseState === 'ellipsisLit';
  $: isFinished = $verseState === 'finished';
	onDestroy(() => { verseState.set(''); });
  
  let layerEl;

  $: isFetchingBlocks = $blocksForCurrentChannel === undefined;
  $: if (isFetchingBlocks) fetchBlocksForProjection();

  $: showExplorer = isReading && !isFetchingBlocks;
  $: showMenu = isEllipsisLit && !isFinished;

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
    if (!$isReaderEngaged || $isInBetweenWords || isFinished) return null;
    if ($isPunctuationNext) {
      isCaesura.set(true);
    } else if ($isLastVerseWord) {
      fadeOut();
    } else {
      wordIndices.nextWord();
    }
  }
  
  function click() {
    // implementation to come
  }

  function swiped(event) {
    const yPointerPosition =  layerEl.getRelativePointerPosition().y;
    const yLowerBound = window.innerHeight * 0.4;
    const yUpperBound = window.innerHeight * 0.6;
    if (yPointerPosition < yLowerBound || yPointerPosition > yUpperBound) return null;
    const direction = event.detail.direction;
    if (direction === 'left') {
      nextWord();
    } else {
      // previousWord();
    }
  }
  
  function postPunctuation() {
    isCaesura.set(false);
    wordIndices.nextWord();
  }

  function fadeOut() {
    if (isFinished) {
      return null;
    } else {
      verseState.set('finished');
    }
    layerEl.to({
      duration: Math.PI,
      opacity: 0,
      onFinish: () => {
        setTimeout(() => {
          verseState.set('');
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
  <HeaderMenu isDropDownVisible={ showMenu } />
  <Stage config={{ width: window.innerWidth, height: window.innerHeight }} 
    on:pointerclick={ click } >
    <Layer config={{ visible: showExplorer }} bind:handle={ layerEl }>
      <StreetMap blocksGeoJson={ $blocksForCurrentChannel } 
        projection={ $currentChannelProjection } />
      <Punctuation on:punctuated={ postPunctuation } />
      <PiWatch isStart={ $isReaderEngaged } isStop={ isFinished } />  
      <Ellipsis
        reveal={ isReading }
        on:revealed={ () => { verseState.set('ellipsisRevealed') } }
        light={ isVerseMapReaveled }
        on:lit={ () => { verseState.set('ellipsisLit') } }
      />
      <Notepad visible={ $isReaderEngaged } />
      <VerseMap reveal={ isEllipsisReaveled }
        on:revealed={ () => { verseState.set('verseMapReaveled') } } />
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