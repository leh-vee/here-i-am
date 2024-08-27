<script>
  import { Stage, Layer } from 'svelte-konva';
  import Punctuation from './Punctuation.svelte';
  import Notepad from './Notepad.svelte';
  import VerseMap from './VerseMap.svelte';
  import StreetMap from './StreetMap.svelte';
  import PiWatch from './PiWatch.svelte';
  import HeaderMenu from './HeaderMenu.svelte';
  import { isReaderEngaged, isVerseEllipsisLit } from '../stores/base';
  import { channelBlocks, blocksForCurrentChannel, 
    currentChannelProjection } from '../stores/treeOfLife';
  import { wordIndices, isPunctuationNext, isGroundZero,
    isLastVerseWord, isInBetweenWords, isCaesura,
    currentPiSlice, lastPiSlice, likePiSlices } from '../stores/text';
  import { fetchBlocksWithinRadius } from '../api/client.js';
  import distance from "@turf/distance";
  import { onDestroy } from 'svelte';
  import { createEventDispatcher } from 'svelte';
  
  const dispatch = createEventDispatcher();

	onDestroy(() => {
    isReaderEngaged.set(false);
	});

  export let isReading = false;
  let isFinished = false;
  let layerEl;
  let verseMapCom;

  $: isFetchingBlocks = $blocksForCurrentChannel === undefined;
  $: if (isFetchingBlocks) fetchBlocksForProjection();

  $: showExplorer = isReading && !isFetchingBlocks;
  $: showMenu = $isVerseEllipsisLit && !isFinished;

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
    if ($isInBetweenWords || isFinished) return null;
    if ($isPunctuationNext) {
      isCaesura.set(true);
    } else if ($isLastVerseWord) {
      fadeOut();
    } else {
      wordIndices.nextWord();
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
      isFinished = true;
    }
    layerEl.to({
      duration: Math.PI,
      opacity: 0,
      onFinish: () => {
        setTimeout(() => {
          isReaderEngaged.set(false);
          if ($isGroundZero) {
            dispatch('groundZero');
          } else {
            wordIndices.nextVerse();
          }
        }, 3000);
      }
    });
  }

  function click() {
    if ($isReaderEngaged && !isFinished) {
      nextWord();
    } else {
      verseMapCom.click();
    }
  }
</script>

<div id='verse-explorer'>
  <HeaderMenu isDropDownVisible={ showMenu } />
  <Stage config={{ width: window.innerWidth, height: window.innerHeight }} 
    on:pointerclick={ click } >
    <Layer config={{ visible: showExplorer }} bind:handle={ layerEl }>
      <StreetMap blocksGeoJson={ $blocksForCurrentChannel } 
        projection={ $currentChannelProjection } />
      <Notepad visible={ $isReaderEngaged } />
      <Punctuation on:punctuated={ postPunctuation } />
      <PiWatch isStart={ $isReaderEngaged } isStop={ isFinished } /> 
      <VerseMap 
        revealEllipsis={ isReading }
        bind:this={ verseMapCom } 
      /> 
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