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
  import { nVerseWords, wordIndices, currentWord, currentVerse } from '../stores/text.js';

  const movements = ['countdown', 'fromEllipsis', 'flight', 'recall', 'toEllipsis'];
  let currentMovementIndex = 0;
  const piTime = Math.PI * 1000;

  $: isMapRendered = $blocksForCurrentChannel !== undefined;
  $: currentMovement = movements[currentMovementIndex];

  $: isCountdown = currentMovement === 'countdown';
  $: isFromEllipsis = currentMovement === 'fromEllipsis';
  $: isFlight = currentMovement === 'flight';
  $: isRecall = currentMovement === 'recall';
  $: isToEllipsis = currentMovement === 'toEllipsis';
  $: isEllipsis = isFromEllipsis || isToEllipsis;
  
  $: if (isCountdown && isMapRendered) startMovementTimer();
  $: if (isFromEllipsis) startMovementTimer();
  $: if (isFlight) scanVerse();

  function startMovementTimer() {
    setTimeout(() => { currentMovementIndex += 1 }, piTime);
  }

  function scanVerse() {
    const nScans = $nVerseWords - 1;
    const t = piTime / nScans;
    let nWordsScanned = 0;
    const scanNextWord = () => {
      setTimeout(() => { 
        wordIndices.nextWord();
        nWordsScanned += 1;
        if (nWordsScanned < nScans) {
          scanNextWord();
        } else {
          currentMovementIndex += 1;
        }
      }, t);
    }
    scanNextWord();
  }

  function codaSequence() {
    currentMovementIndex += 1;
    setTimeout(() => {
      wordIndices.nextVerse();
      currentMovementIndex = 0;
    }, piTime);
  }

</script>

{#if isRecall}
  <Controller on:coda={codaSequence} />
{/if}
<Stage config={{ width: window.innerWidth, height: window.innerHeight }}>
  <Layer config={{ visible: isCountdown }} >
    <VerseNumber />
  </Layer>
  <Layer config={{ visible: !isCountdown }} >
    <StreetTraces /> 
    {#if isFromEllipsis }
      <SefirahMarker coordsPx={ $currentChannelFromSefirahCoordsPx } />
    {/if}
    <Word currentWord={ isEllipsis ? '...' : $currentWord } />
    {#if isFlight || isRecall}
      <LineMarkers words={ $currentVerse['a'] } line={'a'} />
      <LineMarkers words={ $currentVerse['b'] } line={'b'} />
    {/if}
    {#if isToEllipsis }
      <SefirahMarker coordsPx={ $currentChannelToSefirahCoordsPx } />
    {/if}
  </Layer>
</Stage>