<script>
  import { Stage, Layer, Group } from 'svelte-konva';
  import Punctuation from './Punctuation.svelte';
  import Notepad from './Notepad.svelte';
  import VerseMap from './VerseMap.svelte';
  import SefirahMarker from './SefirahMarker.svelte';
  import StreetMap from './StreetMap.svelte';
  import PiWatch from './PiWatch.svelte';
  import Button from './Button.svelte';
  import { currentChannelFromSefirahCoordsPx, blocksForCurrentChannel,
    currentChannelToSefirahCoordsPx, currentChannelProjection, 
    channelBlocks } from '../stores/treeOfLife';
  import { currentVerseIndex, wordIndices, isPunctuationNext, isCaesura, 
    isFirstVerseWord, isLastVerseWord, isInBetweenWords, 
    currentPiSlice, lastPiSlice, likePiSlices, isGroundZero } from '../stores/text.js';
  import Ellipsis from './Ellipsis.svelte';
  import { fetchBlocksWithinRadius } from '../api/client.js';
  import distance from "@turf/distance";
  import { createEventDispatcher } from 'svelte';
  
  const dispatch = createEventDispatcher();

  export let isReading = false;
  let stopWatch = false;
  let isEllipsis = true;
  let isVerseRun = false;
  let lightEllipsis = false;
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

  function proceed(direction) {
    if ($isInBetweenWords) return null;
    if (direction === 'forward') {
      nextWord();
    } else {
      wordIndices.previousWord();
    }
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
</script>

<div id='verse-explorer'>
  <Stage config={{ width: window.innerWidth, height: window.innerHeight, 
    visible: isReading }} >
    <Layer>
      {#key $currentVerseIndex}
        <Group bind:handle={ streetMapContainerEl }>
          <StreetMap blocksGeoJson={ $blocksForCurrentChannel } 
            projection={ $currentChannelProjection } />
        </Group>
        <PiWatch isStart={ !isEllipsis } isStop={ stopWatch } />  
        {#if $blocksForCurrentChannel}
          <Group bind:handle={ markerGroupEls }>
            <SefirahMarker coordsPx={ $currentChannelFromSefirahCoordsPx } 
              isLit={ lightEllipsis } />
            <SefirahMarker coordsPx={ $currentChannelToSefirahCoordsPx } 
              isFromSefirah={ false } isLit={ true } />
            <VerseMap onTheRun={ isVerseRun } on:visible={ () => {  lightEllipsis = true } } />
          </Group>
          <Ellipsis
            visible={ isEllipsis }
            reveal={ isReading }
            light={ lightEllipsis } 
            on:revealed={ () => { isVerseRun = true } } 
            on:lit={ () => { showButtons = true } } 
          />
          <Notepad visible={ showNotepad } />
          <Punctuation on:punctuated={ postPunctuation } />
          <Button
            isBackBtn={true} 
            isDisabled={ $isFirstVerseWord } 
            visible={ showButtons } 
            on:back={() => { proceed('backward') }} />
          <Button
            isBackBtn={false} 
            visible={ showButtons }
            on:forward={() => { proceed('forward') }} />
        {/if}
      {/key}
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