<script>
  import { Stage, Layer } from 'svelte-konva';
  import StreetTraces from './StreetTraces.svelte';
  import SefirahMarker from './SefirahMarker.svelte';
  import LineMarkers from './LineMarkers.svelte';
  import VerseNumber from './VerseNumber.svelte';
  import { currentChannelFromSefirahCoordsPx, 
    currentChannelToSefirahCoordsPx, blocksForCurrentChannel } from '../stores/ilan';
  import Controller from './Controller.svelte';
  import Word from './Word.svelte';
  import { currentVerseIndex, nVerseWords, wordIndices } from '../stores/text.js';

  let showCountdown = true;
  let showControls = false; 

  $: {
    console.log('countdown for verse', $currentVerseIndex);
    showControls = false;
    showCountdown = true;
    setTimeout(() => { showCountdown = false }, Math.PI * 1000);
  }

  $: showExplorer = !showCountdown && $blocksForCurrentChannel !== undefined;

  $: if (showExplorer) setTimeout(scanVerse, 1000);

  function scanVerse() {
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
        showControls = true;
      }
    }
    scanNextWord();
  }

</script>

{#if showControls }
  <Controller />
{/if}
<Stage config={{ width: window.innerWidth, height: window.innerHeight }}>
  <Layer config={{ visible: !showExplorer }} >
    <VerseNumber />
  </Layer>
  <Layer config={{ visible: showExplorer }} >
    <StreetTraces /> 
    <SefirahMarker coordsPx={ $currentChannelFromSefirahCoordsPx } />
    <Word />
    <LineMarkers />
    <LineMarkers line={'b'} />
    <SefirahMarker coordsPx={ $currentChannelToSefirahCoordsPx } />
  </Layer>
</Stage>