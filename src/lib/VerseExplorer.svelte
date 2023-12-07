<script>
  import { Layer } from 'svelte-konva';
  import Punctuation from './Punctuation.svelte';
  import Notepad from './Notepad.svelte';
  import VerseMap from './VerseMap.svelte';
  import SefirahMarker from './SefirahMarker.svelte';
  import StreetTraces from './StreetTraces.svelte';
  import { currentChannelFromSefirahCoordsPx, 
    currentChannelToSefirahCoordsPx } from '../stores/treeOfLife.js';
  import { currentVerseIndex, wordIndices, isPunctuationNext } from '../stores/text.js';

  let animatePunctuation = false;

  function read() {
    if ($isPunctuationNext) {
      animatePunctuation = true;
    } else {
      wordIndices.nextWord();
    }
  }
  
  function postPunctuation() {
    animatePunctuation = false;
    wordIndices.nextWord();
  }
</script>

<Layer>
  {#key $currentVerseIndex}
    <StreetTraces />
    <SefirahMarker coordsPx={ $currentChannelFromSefirahCoordsPx } />
    <SefirahMarker coordsPx={ $currentChannelToSefirahCoordsPx } />
    <VerseMap />
    <Notepad />
    <Punctuation animate={animatePunctuation} on:punctuated={ postPunctuation } /> 
  {/key}
</Layer>
<div class='controller'>
  <span class='back button' on:click={ wordIndices.previousWord } ></span>
  <span class='forward button' on:click={ read } ></span>
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