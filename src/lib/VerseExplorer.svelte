<script>
  import { Stage, Layer, Group } from 'svelte-konva';
  import Punctuation from './Punctuation.svelte';
  import Notepad from './Notepad.svelte';
  import VerseMap from './VerseMap.svelte';
  import SefirahMarker from './SefirahMarker.svelte';
  import StreetMap from './StreetMap.svelte';
  import Stopwatch from './PiWatch.svelte';
  import { currentChannelFromSefirahCoordsPx, blocksForCurrentChannel,
    currentChannelToSefirahCoordsPx, currentChannelProjection, 
    channelBlocks } from '../stores/treeOfLife';
  import { currentVerseIndex, wordIndices, isPunctuationNext, 
    isCaesura, isEllipsis, isFirstVerseWord, isLastVerseWord,
    isInBetweenWords } from '../stores/text';
  import Ellipsis from './Ellipsis.svelte';
  import { swipe } from 'svelte-gestures';
  import { fetchBlocksWithinRadius } from '../api/client.js';
  import distance from "@turf/distance";
  import { currentPiSlice, lastPiSlice } from '../stores/text.js';

  export let isReading = false;
  let isInFlight = false;
  let mapWatchGroupEl;
  let sefirahsGroupEl;

  $: isPreVerseElliptical = $isEllipsis && $isFirstVerseWord;
  $: isPostVerseElliptical = $isEllipsis && $isLastVerseWord;
  
  $: if ($blocksForCurrentChannel === undefined) fetchBlocksForProjection();

  function fetchBlocksForProjection() {
    const pCentre = $currentChannelProjection.center();
    const pRadius = distance(pCentre, $currentChannelProjection.invert([0,0]));
    fetchBlocksWithinRadius(pCentre, pRadius).then(blocks => {
      console.log('blocks for current channel projection fetched');
      if ($lastPiSlice !== $currentPiSlice) {
        channelBlocks.setForIndices($lastPiSlice, $currentPiSlice, blocks);
      } else if (Number($lastPiSlice) !== 0) {
        channelBlocks.setForIndices($lastPiSlice, 0, blocks);
      }
    });
    return true;
  }

  function postElliptical() {
    if (isPreVerseElliptical) {
      isEllipsis.set(false); 
      isInFlight = true;
    } else {
      wordIndices.nextVerse();
    }
  }
  
  $: if (isInFlight && !$isInBetweenWords) {
    if (!$isLastVerseWord) {
      setTimeout(() => {
        wordIndices.nextWord();
      }, Math.PI * 10);  
    } else {
      setTimeout(() => {
        if (isInFlight) {
          isEllipsis.set(true);
          isInFlight = false;
        }
      }, Math.PI * 1000);
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

  function swiped(event) {
    if ($isLastVerseWord && isInFlight) isInFlight = false;
    if ($isInBetweenWords) return null;
    const direction = event.detail.direction;
    if (direction === 'left') {
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

<div id='verse-explorer' use:swipe={{ timeframe: 300, minSwipeDistance: 60 }} 
  on:swipe={(e) => { swiped(e) }}>
  <Stage config={{ width: window.innerWidth, height: window.innerHeight, 
    visible: isReading }} >
    <Layer>
      {#key $currentVerseIndex}
        <Group bind:handle={ mapWatchGroupEl }>
          <StreetMap blocksGeoJson={ $blocksForCurrentChannel } 
            projection={ $currentChannelProjection } />
        </Group>
        <Stopwatch inFlight={ isInFlight }/>  
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
          {/if}
        {/if}
      {/key}
    </Layer>
  </Stage>
</div>
<div class='controller'>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <span class='back button' on:click={ () => { swiped({ detail: { direction: 'right' } }) } } ></span>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <span class='forward button' on:click={ () => { swiped({ detail: { direction: 'left' } }) } } ></span>
</div>

<style>
  #verse-explorer {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }

  .controller {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 25%;
    display: flex;
    z-index: 1;
  }

  .controller .button {
    width: 50%;
    text-align: center;
    vertical-align: baseline;
    font-size: 5vw;
  }
</style>