<script>
  import { Layer } from 'svelte-konva';
  import StreetTraces from './StreetTraces.svelte';
  import SefirahMarker from './SefirahMarker.svelte';
  import LineMarkers from './LineMarkers.svelte';
  import VerseNumber from './VerseNumber.svelte';
  import { currentChannelFromSefirahCoordsPx, 
    currentChannelToSefirahCoordsPx } from '../stores/treeOfLife.js';
  import Controller from './Controller.svelte';
  import Word from './Word.svelte';
  import Ilan from './Ilan.svelte';
  import { nVerseWords, wordIndices, currentVerse } from '../stores/text.js';

  const movements = ['summary', 'countdown', 'fromEllipsis', 'flight', 'recall', 'toEllipsis'];
  let currentMovementIndex = 0;
  const piTime = Math.PI * 1000;

  $: currentMovement = movements[currentMovementIndex];

  $: isSummary = currentMovement === 'summary';
  $: isCountdown = currentMovement === 'countdown';
  $: isFromEllipsis = currentMovement === 'fromEllipsis';
  $: isFlight = currentMovement === 'flight';
  $: isRecall = currentMovement === 'recall';
  $: isToEllipsis = currentMovement === 'toEllipsis';
  $: isEllipsis = isFromEllipsis || isToEllipsis;
  
  $: if (isCountdown) startMovementTimer();
  $: if (isSummary) startMovementTimer(piTime);
  $: if (isFromEllipsis) startMovementTimer();
  $: if (isFlight) scanVerse();

  function startMovementTimer(t=piTime) {
    setTimeout(() => { currentMovementIndex += 1 }, t);
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
<Layer config={{ visible: isCountdown }} >
  <VerseNumber />
</Layer>
<Layer config={{ visible: isSummary }}>
  <Ilan go={ isSummary } />
</Layer>
<Layer config={{ visible: !isCountdown && !isSummary }} >
  <StreetTraces />
  {#if isFromEllipsis }
    <SefirahMarker coordsPx={ $currentChannelFromSefirahCoordsPx } />
  {/if}
  <Word isEllipsis={ isEllipsis } isVisible={!isCountdown && !isSummary} on:coda={codaSequence} />
  {#if isFlight || isRecall}
    <LineMarkers words={ $currentVerse['a'] } line={'a'} />
    <LineMarkers words={ $currentVerse['b'] } line={'b'} />
  {/if}
  {#if isToEllipsis }
    <SefirahMarker coordsPx={ $currentChannelToSefirahCoordsPx } />
  {/if}
</Layer>