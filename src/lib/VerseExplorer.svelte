<script>
  import { Stage, Layer, Group } from 'svelte-konva';
  import Punctuation from './Punctuation.svelte';
  import Notepad from './Notepad.svelte';
  import VerseMap from './VerseMap.svelte';
  import StreetMap from './StreetMap.svelte';
  import PiWatch from './PiWatch.svelte';
  import DropDownMenu from './DropDownMenu.svelte';
  import { isReaderEngaged, isVerseEllipsisLit } from '../stores/base';
  import { channelBlocks, blocksForCurrentChannel, 
    currentChannelProjection } from '../stores/treeOfLife';
  import { wordIndices, isPunctuationNext, isGroundZero,
    isLastVerseWord, isInBetweenWords, isCaesura,
    currentPiSlice, lastPiSlice, likePiSlices } from '../stores/text';
  import { fetchBlocksWithinRadius } from '../api/client.js';
  import distance from "@turf/distance";
  import { createEventDispatcher } from 'svelte';
  
  const dispatch = createEventDispatcher();

  export let isReading = false;
  let isFinished = false;
  let isFetchingBlocks = false;
  let fadeGroupEl;
  let verseMapCom;
  
  $: if ($blocksForCurrentChannel === undefined && !isFetchingBlocks) {
    isFetchingBlocks = true;
    fetchBlocksForProjection();
  } 

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
    fadeGroupEl.to({
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
  <DropDownMenu />
  <Stage config={{ width: window.innerWidth, height: window.innerHeight, 
    visible: isReading }} on:pointerclick={ click } >
    <Layer>
      {#if $blocksForCurrentChannel}
        <Group bind:handle={ fadeGroupEl }>
          <StreetMap blocksGeoJson={ $blocksForCurrentChannel } 
            projection={ $currentChannelProjection } />
          <VerseMap 
            revealEllipsis={ isReading }
            bind:this={ verseMapCom } 
          />
          <Notepad visible={ $isReaderEngaged } />
        </Group>
        <PiWatch isStart={ $isReaderEngaged } isStop={ isFinished } />  
        <Punctuation on:punctuated={ postPunctuation } />
      {/if}
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