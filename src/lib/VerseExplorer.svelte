<script>
  import { Layer } from 'svelte-konva';
  import Punctuation from './Punctuation.svelte';
  import Notepad from './Notepad.svelte';
  import VerseMap from './VerseMap.svelte';
  import SefirahMarker from './SefirahMarker.svelte';
  import StreetTraces from './StreetTraces.svelte';
  import { currentChannelFromSefirahCoordsPx, 
    currentChannelToSefirahCoordsPx, blocksForCurrentChannel } from '../stores/treeOfLife.js';
  import { currentVerseIndex, wordIndices, isPunctuationNext, 
    isCaesura, isEllipsis, isFirstVerseWord, isLastVerseWord } from '../stores/text.js';
  import Ellipsis from './Ellipsis.svelte';

  $: isPreVerseElliptical = $isEllipsis && $isFirstVerseWord;
  $: isPostVerseElliptical = $isEllipsis && $isLastVerseWord;

  $: if (isPreVerseElliptical && $blocksForCurrentChannel) {
    setTimeout(flight, Math.PI * 1000);
  }

  $: if (isPostVerseElliptical) {
    setTimeout(coda, Math.PI * 1000);
  }
  function flight() { isEllipsis.set(false) }
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
</script>

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
        <Notepad />
        <Punctuation on:punctuated={ postPunctuation } />
      {/if}
    {/if}
  {/key}
</Layer>
<div class='controller'>
  <span class='back button' on:click={ previousWord } ></span>
  <span class='forward button' on:click={ nextWord } ></span>
</div>

<style>
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