<script>
  import { Layer } from 'svelte-konva';
  import Punctuation from './Punctuation.svelte';
  import Notepad from './Notepad.svelte';
  import VerseMap from './VerseMap.svelte';
  import SefirahMarker from './SefirahMarker.svelte';
  import StreetTraces from './StreetTraces.svelte';
  import { currentChannelFromSefirahCoordsPx, 
    currentChannelToSefirahCoordsPx } from '../stores/treeOfLife.js';
  import { currentVerseIndex, wordIndices, isPunctuationNext, 
    isCaesura, isEllipsis, isFirstVerseWord, isLastVerseWord } from '../stores/text.js';

  $: isPreVerseElliptical = $isEllipsis && $isFirstVerseWord;
  $: isPostVerseElliptical = $isEllipsis && $isLastVerseWord;
  
  $: if (isPreVerseElliptical) flight();
  $: if (isPostVerseElliptical) coda();

  function flight() {
    setTimeout(() => { isEllipsis.set(false) }, Math.PI * 1000);
  } 
  
  function coda() {
    setTimeout(() => { wordIndices.nextVerse() }, Math.PI * 1000);
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
</script>

<Layer>
  {#key $currentVerseIndex}
    <StreetTraces />
    {#if isPreVerseElliptical}
      <SefirahMarker coordsPx={ $currentChannelFromSefirahCoordsPx } />
    {:else if isPostVerseElliptical}
      <SefirahMarker coordsPx={ $currentChannelToSefirahCoordsPx } />
    {:else if !$isEllipsis}
      <VerseMap />
      <Notepad />
      <Punctuation on:punctuated={ postPunctuation } /> 
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