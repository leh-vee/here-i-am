<script>
  import { Layer } from 'svelte-konva';
  import StreetTraces from './StreetTraces.svelte';
  import SefirahMarker from './SefirahMarker.svelte';
  import VerseNumber from './VerseNumber.svelte';
  import { currentChannelFromSefirahCoordsPx, 
    currentChannelToSefirahCoordsPx } from '../stores/treeOfLife.js';
  import Notepad from './Notepad.svelte';
  import VerseMap from './VerseMap.svelte';
  import Ilan from './Ilan.svelte';
  import { wordIndices, currentVerseIndex } from '../stores/text.js';

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
  <StreetTraces />
  <!-- {#if isFromEllipsis }
    <SefirahMarker coordsPx={ $currentChannelFromSefirahCoordsPx } />
  {/if} -->
  {#if !isCountdown && !isSummary}
    {#key $currentVerseIndex}
      <Notepad /> 
      <SefirahMarker coordsPx={ $currentChannelFromSefirahCoordsPx } />
      <VerseMap />
      <SefirahMarker coordsPx={ $currentChannelToSefirahCoordsPx } />
    {/key}
  {/if}
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