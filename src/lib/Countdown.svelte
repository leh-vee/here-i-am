<script>
  import { Layer } from 'svelte-konva';
  import VerseNumber from './VerseNumber.svelte';
  import Ilan from './Ilan.svelte';
  import { wordIndices } from '../stores/text.js';
  import VerseExplorer from './VerseExplorer.svelte';

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

  function startMovementTimer(t=piTime) {
    setTimeout(() => { currentMovementIndex += 1 }, t);
  }

  function codaSequence() {
    currentMovementIndex += 1;
    setTimeout(() => {
      wordIndices.nextVerse();
      currentMovementIndex = 0;
    }, piTime);
  }

</script>

<Layer config={{ visible: isCountdown }} >
  <VerseNumber />
</Layer>
<Layer config={{ visible: isSummary }}>
  <Ilan go={ isSummary } />
</Layer>
<Layer config={{ visible: !isCountdown && !isSummary }} >
  <VerseExplorer />
  <!-- <Word isEllipsis={ isEllipsis } isVisible={!isCountdown && !isSummary} 
    on:coda={codaSequence} on:nextMovement={ () => { currentMovementIndex += 1 } } 
    isFlight={isFlight} /> 
  {#if isFlight || isRecall}
    // VerseMap
  {/if}
  {#if isToEllipsis }
    <SefirahMarker coordsPx={ $currentChannelToSefirahCoordsPx } />
  {/if} -->
</Layer>