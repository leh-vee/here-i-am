<script>
  import { Stage, Layer } from 'svelte-konva';
  import Punctuation from './Punctuation.svelte';
  import Notepad from './Notepad.svelte';
  import VerseMap from './VerseMap.svelte';
  import SefirahMarker from './SefirahMarker.svelte';
  import StreetTraces from './StreetTraces.svelte';
  import { currentChannelFromSefirahCoordsPx, blocksForCurrentChannel,
    currentChannelToSefirahCoordsPx } from '../stores/treeOfLife';
  import { currentVerseIndex, wordIndices, isPunctuationNext, 
    isCaesura, isEllipsis, isFirstVerseWord, isLastVerseWord,
    isInBetweenWords, currentWordId } from '../stores/text';
  import Ellipsis from './Ellipsis.svelte';
  import { swipe } from 'svelte-gestures';


  $: isPreVerseElliptical = $isEllipsis && $isFirstVerseWord;
  $: isPostVerseElliptical = $isEllipsis && $isLastVerseWord;
  
  let isInFlight = false;
  $: if (isPreVerseElliptical && $blocksForCurrentChannel) {
    setTimeout(() => {
      isEllipsis.set(false); 
      isInFlight = true;
    }, Math.PI * 1000);
  }
  
  $: if (isInFlight && !$isInBetweenWords) {
    if (!$isLastVerseWord) {
      setTimeout(() => {
        wordIndices.nextWord();
      }, Math.PI * 10);  
    } else {
      isInFlight = false;
    }
  }

  $: if (isPostVerseElliptical) {
    setTimeout(coda, Math.PI * 1000);
  }
  function coda() { wordIndices.nextVerse() }

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
    if ($isInBetweenWords) return null;
    const direction = event.detail.direction;
    if (direction === 'left') {
      nextWord();
    } else {
      previousWord();
    }
  }
</script>

<div id='verse-explorer' use:swipe={{ timeframe: 300, minSwipeDistance: 60 }} 
  on:swipe={(e) => { swiped(e) }}>
  <Stage config={{ width: window.innerWidth, height: window.innerHeight }}>
    <Layer>
      {#key $currentVerseIndex}
        <StreetTraces />  
        {#if $blocksForCurrentChannel}
          <SefirahMarker coordsPx={ $currentChannelFromSefirahCoordsPx } />
          <SefirahMarker coordsPx={ $currentChannelToSefirahCoordsPx } 
            isFromSefirah={false} />
          {#if $isEllipsis}
            <Ellipsis />
          {:else}
            <VerseMap />
            <Notepad inFlight={isInFlight} />
            <Punctuation on:punctuated={ postPunctuation } />
          {/if}
        {/if}
      {/key}
    </Layer>
  </Stage>
</div>
<div class='controller'>
  <span class='back button' on:click={ previousWord } ></span>
  <span class='forward button' on:click={ nextWord } ></span>
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