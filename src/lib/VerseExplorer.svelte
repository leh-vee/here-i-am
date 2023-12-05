<script>
  import Notepad from './Notepad.svelte';
  import VerseMap from './VerseMap.svelte';
  import SefirahMarker from './SefirahMarker.svelte';
  import StreetTraces from './StreetTraces.svelte';
  import { currentChannelFromSefirahCoordsPx, 
    currentChannelToSefirahCoordsPx } from '../stores/treeOfLife.js';
  import { currentVerseIndex, wordIndices } from '../stores/text.js';
</script>

{#key $currentVerseIndex}
  <StreetTraces />
  <Notepad /> 
  <SefirahMarker coordsPx={ $currentChannelFromSefirahCoordsPx } />
  <VerseMap />
  <SefirahMarker coordsPx={ $currentChannelToSefirahCoordsPx } />
{/key}
<div class='controller'>
  <span class='back button'
    on:click={ wordIndices.previousWord } ></span>
  <span class='forward button'
    on:click={ wordIndices.nextWord } ></span>
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