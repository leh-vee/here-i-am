<script>
  import { Stage, Layer, Group } from 'svelte-konva';
  import Punctuation from './Punctuation.svelte';
  import Notepad from './Notepad.svelte';
  import VerseMap from './VerseMap.svelte';
  import StreetMap from './StreetMap.svelte';
  import PiWatch from './PiWatch.svelte';
  import Ellipsis from './Ellipsis.svelte';
  import { channelBlocks, blocksForCurrentChannel, 
    currentChannelProjection } from '../stores/treeOfLife';
  import { currentVerseIndex, wordIndices, isPunctuationNext,  
    isLastVerseWord, isInBetweenWords, isCaesura, isGroundZero,
    currentPiSlice, lastPiSlice, likePiSlices } from '../stores/text.js';
  import { fetchBlocksWithinRadius } from '../api/client.js';
  import distance from "@turf/distance";
  import { createEventDispatcher } from 'svelte';
  
  const dispatch = createEventDispatcher();

  export let isReading = false;
  let stopWatch = false;
  let isEllipsis = true;
  let lightEllipsis = false;
  let isEllipsisLit = false;
  let isVerseRun = false;
  let showButtons = false;
  let showNotepad = false;

  $: {
    console.log('explorer at verse index', $currentVerseIndex);
    isEllipsis = true;
  }

  let streetMapContainerEl;
  let markerGroupEls;
  
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
    } else if (isEllipsis) {
      isEllipsis = false;
      showNotepad = true;
    } else if ($isLastVerseWord) {
      stopWatch = true;
      showNotepad = false;
      showButtons = false;
      fadeMapEls();
    } else {
      wordIndices.nextWord();
    }
  }
  
  function postPunctuation() {
    isCaesura.set(false);
    wordIndices.nextWord();
  }

  function fadeMapEls() {
    streetMapContainerEl.to({
      duration: Math.PI,
      opacity: 0,
      onFinish: () => {
        setTimeout(() => {
          streetMapContainerEl.opacity(1);
          markerGroupEls.opacity(1);
          if ($isGroundZero) {
            dispatch('groundZero');
          } else {
            wordIndices.nextVerse();
          }
        }, 3000);
      }
    });
    markerGroupEls.to({
      duration: Math.PI,
      opacity: 0
    });
  }

  function click() {
    if (showNotepad) nextWord();
  }
</script>

<div id='verse-explorer'>
  <Stage config={{ width: window.innerWidth, height: window.innerHeight, 
    visible: isReading }} on:pointerclick={ click } >
    <Layer>
      {#if $blocksForCurrentChannel}
        <Group bind:handle={ streetMapContainerEl }>
          <StreetMap blocksGeoJson={ $blocksForCurrentChannel } 
            projection={ $currentChannelProjection } />
        </Group>
        <PiWatch isStart={ !isEllipsis } isStop={ stopWatch } />  
        <Group bind:handle={ markerGroupEls }>
          <VerseMap 
            onTheRun={ isVerseRun } 
            on:visible={ () => {  lightEllipsis = true } } 
          />
        </Group>
        <Notepad visible={ showNotepad } />
        <Punctuation on:punctuated={ postPunctuation } />
        <Ellipsis
          visible={ isEllipsis }
          reveal={ isReading }
          on:revealed={ () => { isVerseRun = true } }
          light={ lightEllipsis }
          on:faded={ () => { showNotepad = true }}
        />
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