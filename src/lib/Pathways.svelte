<script>
  import { tick } from 'svelte';
  import { Line, Circle, Ring } from 'svelte-konva';
  import { ilanProjection, ilanBlocks, sefirotPoints } from '../stores/treeOfLife.js';
  import { currentVerseIndex, lastPiSlice, currentPiSlice } from '../stores/text.js';
  import { createEventDispatcher } from 'svelte';
  import StreetMap from './StreetMap.svelte';

  const dispatch = createEventDispatcher();

  const circumradius = Math.hypot(window.innerWidth, window.innerHeight); 
  
  export let go = false;
  let newPathway;
  let fromSefirah;
  let toSefirah;
  let iris;
  let newPathwayCoordinates = [0, 0, 0, 0];
  const chargeDuration = Math.PI / 2;

  $: fromCoordsGsc = $sefirotPoints.features[$lastPiSlice].geometry.coordinates;
  $: fromCoordsPx = $ilanProjection(fromCoordsGsc);
  $: toCoordsGsc = $sefirotPoints.features[$currentPiSlice].geometry.coordinates;
  $: toCoordsPx = $ilanProjection(toCoordsGsc);

  $: isVerseIndex = Number.isInteger($currentVerseIndex);
  $: isFirstVerse = $currentVerseIndex === 0;

  $: if (isVerseIndex && newPathway && go) { 
    if (isFirstVerse) {
      inIris();
    } else {
      sendCharge();
    }
  } 

  function inIris() {
    fromSefirah.to({
      duration: 0,
      fill: 'dimgrey'
    });
    iris.to({
      duration: Math.PI,
      innerRadius: 3,
      onFinish: () => {
        iris.to({
          duration: Math.PI,
          innerRadius: circumradius
        });
        fromSefirah.to({
          duration: Math.PI,
          fill: 'gold',
          onFinish: () => { sendCharge() }
        });
      }
    });
  }

  async function sendCharge() {
    let endCoords = [...fromCoordsPx, ...toCoordsPx];
    newPathwayCoordinates = [...fromCoordsPx, ...fromCoordsPx];
    await tick();
    fromSefirah.to({
      radius: 0,
      opacity: 0,
      duration: chargeDuration
    });
    newPathway.to({
      points: endCoords,
      opacity: 1,
      duration: chargeDuration,
      onFinish: receiveCharge
    });
  }

  function receiveCharge() {
    toSefirah.to({
      radius: 3,
      opacity: 1,
      duration: chargeDuration
    });
    const endCoords = [...toCoordsPx, ...toCoordsPx];
    newPathway.to({
      points: endCoords,
      opacity: 0,
      duration: chargeDuration,
      onFinish: () => {
        dispatch('blazed');
      }
    });
  }
</script>

<StreetMap blocksGeoJson= { $ilanBlocks } projection={ $ilanProjection } />
<Circle config={{
  x: fromCoordsPx[0],
  y: fromCoordsPx[1],
  radius: 3,
  opacity: 1,
  fill: 'gold'
}} bind:handle={fromSefirah} />
<Line config={{
  points: newPathwayCoordinates,
  stroke: 'gold',
  strokeWidth: 2,
  opacity: 0,
  lineCap: 'round'
}} bind:handle={newPathway} />
<Circle config={{
  x: toCoordsPx[0],
  y: toCoordsPx[1],
  fill: 'gold',
  radius: 0,
  opacity: 0
}} bind:handle={toSefirah} />
{#if isFirstVerse}
  <Ring config={{ 
    x: fromCoordsPx[0],
    y: fromCoordsPx[1],
    innerRadius: 0,
    outerRadius: circumradius,
    fill: 'black',
    strokeEnabled: false
  }} bind:handle={iris} />
{/if}
