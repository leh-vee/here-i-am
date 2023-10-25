<script>
  import { Stage, Layer } from 'svelte-konva';
  import StreetTraces from './StreetTraces.svelte';
  import SefirahMarker from './SefirahMarker.svelte';
  import LineMarkers from './LineMarkers.svelte';
  import VerseNumber from './VerseNumber.svelte';
  import { currentChannelFromSefirahCoordsPx, 
    currentChannelToSefirahCoordsPx, 
    blocksForCurrentChannel } from '../stores/ilan';
  import Controller from './Controller.svelte';
  import Word from './Word.svelte';
  import { currentVerseIndex, nVerseWords, wordIndices, currentWord } from '../stores/text.js';

  const movements = ['countdown', 'ellipsis', 'flight', 'recall'];
  let currentMovementIndex;
  const piTime = Math.PI * 1000;

  function startMovementTimer() {
    setTimeout(() => { currentMovementIndex += 1 }, piTime);
  }

  $: isMapRendered = $blocksForCurrentChannel !== undefined;
  
  $: {
    console.log('starting movement cascade for verse at index', $currentVerseIndex);
    currentMovementIndex = 0;
  }

  $: currentMovement = movements[currentMovementIndex];

  $: isCountdown = currentMovement === 'countdown';
  $: isEllipsis = currentMovement === 'ellipsis';
  $: isFlight = currentMovement === 'flight';
  $: isRecall = currentMovement === 'recall';
  
  $: if (isCountdown && isMapRendered) startMovementTimer();
  $: if (isEllipsis) startMovementTimer();
  $: if (isFlight) scanVerse();

  function scanVerse() {
    const t = piTime / $nVerseWords;
    const totalScans = $nVerseWords - 1;
    let nWordsScanned = 0;
    const scanNextWord = () => {
      setTimeout(() => { 
        wordIndices.nextWord();
        nWordsScanned += 1;
        if (nWordsScanned < totalScans) {
          scanNextWord();
        } else {
          currentMovementIndex += 1;
        }
      }, t);
    }
    scanNextWord();
  }

</script>

{#if isRecall }
  <Controller />
{/if}
<Stage config={{ width: window.innerWidth, height: window.innerHeight }}>
  <Layer config={{ visible: isCountdown }} >
    <VerseNumber />
  </Layer>
  <Layer config={{ visible: !isCountdown }} >
    <StreetTraces /> 
    {#if isEllipsis}
      <SefirahMarker coordsPx={ $currentChannelFromSefirahCoordsPx } />
    {/if}
    <Word currentWord={ isEllipsis ? '...' : $currentWord } />
    {#if isFlight || isRecall}
      {#key currentVerseIndex}
        <LineMarkers />
        <LineMarkers line={'b'} />
      {/key}
    {/if}
    <!-- <SefirahMarker coordsPx={ $currentChannelToSefirahCoordsPx } /> -->
  </Layer>
</Stage>