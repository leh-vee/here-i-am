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
    isEllipsis, isFirstVerseWord, isLastVerseWord, isInBetweenWords, 
    currentPiSlice, lastPiSlice, likePiSlices, isGroundZero } from '../stores/text.js';
  import Ellipsis from './Ellipsis.svelte';
  import { fetchBlocksWithinRadius } from '../api/client.js';
  import distance from "@turf/distance";
  import { createEventDispatcher } from 'svelte';

  export let isReading = false;
  
  const dispatch = createEventDispatcher();
  
  let isInFlight = false;
  let mapWatchGroupEl;
  let sefirahsGroupEl;

  $: isPreVerseElliptical = $isEllipsis && $isFirstVerseWord;
  $: isPostVerseElliptical = $isEllipsis && $isLastVerseWord;
  
  $: if ($blocksForCurrentChannel === undefined) fetchBlocksForProjection();

  let isControllable = false;
  $: if (isPreVerseElliptical) isControllable = false;
  $: if ($isLastVerseWord && isInFlight && !$isInBetweenWords) isControllable = true;

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

  function postElliptical() {
    if (isPreVerseElliptical) {
      isEllipsis.set(false); 
      isInFlight = true;
    } else if ($isGroundZero) {
      dispatch('groundZero');
    } else {
      wordIndices.nextVerse();
    }
  }
  
  $: if (isInFlight && !$isInBetweenWords) {
    if (!$isLastVerseWord) {
      setTimeout(() => {
        wordIndices.nextWord();
      }, Math.PI * 10);  
    }
  }

  function nextWord() {
    if (!$isEllipsis) {
      if ($isPunctuationNext) {
        isCaesura.set(true);
      } else if ($isLastVerseWord) {
        isEllipsis.set(true);
      } else {
        wordIndices.nextWord();
      }
    }
  }

  function previousWord() {
    if (!$isEllipsis) {
      wordIndices.previousWord();
    }
  }
  
  function postPunctuation() {
    isCaesura.set(false);
    wordIndices.nextWord();
  }

  function proceed(direction) {
    const isWindowOfIntervention = $isLastVerseWord && isInFlight;
    if (isWindowOfIntervention) isInFlight = false;
    if ($isInBetweenWords || isInFlight) return null;
    if (direction === 'forward') {
      nextWord();
    } else {
      previousWord();
    }
  }

  $: if (isPostVerseElliptical) fadeOutGroupEls();

  function fadeOutGroupEls() {
    mapWatchGroupEl.to({
      duration: Math.PI,
      opacity: 0,
      onFinish: () => {
        setTimeout(() => {
          mapWatchGroupEl.opacity(1);
          sefirahsGroupEl.opacity(1);
        }, 3000);
      }
    });
    sefirahsGroupEl.to({
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
        <Group bind:handle={ mapWatchGroupEl }>
          <StreetMap blocksGeoJson={ $blocksForCurrentChannel } 
            projection={ $currentChannelProjection } />
        </Group>
        <PiWatch inFlight={ isInFlight }/>  
        {#if $blocksForCurrentChannel}
          <Group bind:handle={ sefirahsGroupEl }>
            <SefirahMarker coordsPx={ $currentChannelFromSefirahCoordsPx } />
            <SefirahMarker coordsPx={ $currentChannelToSefirahCoordsPx } 
              isFromSefirah={ false } />
          </Group>
          {#if $isEllipsis && isReading}
            <Ellipsis on:go={ postElliptical } />
          {:else}
            <VerseMap />
            <Notepad inFlight={ isInFlight } />
            <Punctuation on:punctuated={ postPunctuation } />
            <Button isBackBtn={true} isDisabled={!isControllable} 
              on:back={() => { proceed('backward') }} />
            <Button isBackBtn={false} isDisabled={!isControllable}
              on:forward={() => { proceed('forward') }} />
          {/if}
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