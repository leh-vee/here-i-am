<script>
  import { Stage, Layer } from 'svelte-konva';
  import StreetTraces from './StreetTraces.svelte';
  import SefirahMarker from './SefirahMarker.svelte';
  import LineMarkers from './LineMarkers.svelte';
  import VerseNumber from './VerseNumber.svelte';
  import { currentChannelFromSefirahCoordsPx, 
    currentChannelToSefirahCoordsPx } from '../stores/ilan';
  import Controller from './Controller.svelte';
  import Word from './Word.svelte';
  import { currentVerseIndex, nVerseWords, wordIndices } from '../stores/text.js';

  let isCountingDown = true;
  let isAutoScanningVerse = false; 

  $: {
    console.log('countdown for verse', $currentVerseIndex);
    isCountingDown = true;
    setTimeout(() => {
      isCountingDown = false;
      setTimeout(() => { scanVerse() }, 1000);
    }, Math.PI * 1000);
  }

  function scanVerse() {
    isAutoScanningVerse = true;
    const piSecondsInMilliseconds = Math.PI * 1000;
    const t = piSecondsInMilliseconds / $nVerseWords;
    const totalScans = $nVerseWords - 1;
    let nWordsScanned = 0;
    const scanNextWord = () => {
      wordIndices.nextWord();
      nWordsScanned += 1;
      if (nWordsScanned < totalScans) {
        setTimeout(() => { scanNextWord() }, t);
      } else {
        isAutoScanningVerse = false;
      }
    }
    scanNextWord()
  }
</script>

{#if !isCountingDown && !isAutoScanningVerse}
  <Controller />
{/if}
<Stage config={{ width: window.innerWidth, height: window.innerHeight }}>
  <Layer config={{ visible: isCountingDown }} >
    <VerseNumber />
  </Layer>
  <Layer config={{ visible: !isCountingDown }} >
    <StreetTraces /> 
    <SefirahMarker coordsPx={ $currentChannelFromSefirahCoordsPx } />
    <Word />
    <LineMarkers />
    <LineMarkers line={'b'} />
    <SefirahMarker coordsPx={ $currentChannelToSefirahCoordsPx } />
  </Layer>
</Stage>