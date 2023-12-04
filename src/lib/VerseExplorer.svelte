<script>
  import { Layer } from 'svelte-konva';
  import StreetTraces from './StreetTraces.svelte';
  import SefirahMarker from './SefirahMarker.svelte';
  import VerseNumber from './VerseNumber.svelte';
  import { currentChannelFromSefirahCoordsPx, 
    currentChannelToSefirahCoordsPx } from '../stores/treeOfLife.js';
  import Word from './Word.svelte';
  import LineMarkers from './LineMarkers.svelte';
  import Notepad from './Notepad.svelte';
  import Ilan from './Ilan.svelte';
  import { wordIndices, currentVerse } from '../stores/text.js';

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
  {#if isFromEllipsis }
    <SefirahMarker coordsPx={ $currentChannelFromSefirahCoordsPx } />
  {/if}
  {#if !isCountdown && !isSummary}
    <Notepad />
  {/if}
  <!-- <Word isEllipsis={ isEllipsis } isVisible={!isCountdown && !isSummary} 
    on:coda={codaSequence} on:nextMovement={ () => { currentMovementIndex += 1 } } 
    isFlight={isFlight} /> 
  {#if isFlight || isRecall}
    <LineMarkers words={ $currentVerse['a'] } line={'a'} />
    <LineMarkers words={ $currentVerse['b'] } line={'b'} />
  {/if} -->
  {#if isToEllipsis }
    <SefirahMarker coordsPx={ $currentChannelToSefirahCoordsPx } />
  {/if}
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