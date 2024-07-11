<script>
  import { Stage, Layer, Group } from 'svelte-konva';
  import Punctuation from './Punctuation.svelte';
  import Notepad from './Notepad.svelte';
  import VerseMap from './VerseMap.svelte';
  import StreetMap from './StreetMap.svelte';
  import PiWatch from './PiWatch.svelte';
  import { channelBlocks, blocksForCurrentChannel, 
    currentChannelProjection } from '../stores/treeOfLife';
  import { wordIndices, isPunctuationNext, isGroundZero,
    isLastVerseWord, isInBetweenWords, isCaesura,
    currentPiSlice, lastPiSlice, likePiSlices } from '../stores/text.js';
  import { fetchBlocksWithinRadius } from '../api/client.js';
  import distance from "@turf/distance";
  import { createEventDispatcher } from 'svelte';
  
  const dispatch = createEventDispatcher();

  export let isReading = false;
  let isEngaged = false;
  let fadeGroupEl;
  let verseMapCom;
  
  $: if ($blocksForCurrentChannel === undefined) fetchBlocksForProjection();

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
    if ($isInBetweenWords) return null;
    if ($isPunctuationNext) {
      isCaesura.set(true);
    } else if ($isLastVerseWord) {
      isEngaged = false;
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
    fadeGroupEl.to({
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

  function click() {
    if (isEngaged) {
      nextWord();
    } else {
      verseMapCom.click();
    }
  }
</script>

<div id='verse-explorer'>
  <Stage config={{ width: window.innerWidth, height: window.innerHeight, 
    visible: isReading }} on:pointerclick={ click } >
    <Layer>
      {#if $blocksForCurrentChannel}
        <Group bind:handle={ fadeGroupEl }>
          <StreetMap blocksGeoJson={ $blocksForCurrentChannel } 
            projection={ $currentChannelProjection } />
          <VerseMap 
            revealEllipsis={ isReading }
            on:ellipsisFaded={ () => { isEngaged = true } }
            bind:this={ verseMapCom } 
          />
          <Notepad visible={ isEngaged } />
        </Group>
        <PiWatch isStart={ isEngaged } isStop={ !isEngaged } />  
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