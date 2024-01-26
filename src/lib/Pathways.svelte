<script>
  import { Line, Circle, Ring } from 'svelte-konva';
  import { tick } from 'svelte';
  import { ilanProjection, ilanBlocks, sefirotPoints } from '../stores/treeOfLife.js';
  import { lastPiSlice, currentPiSlice } from '../stores/text.js';
  import { createEventDispatcher } from 'svelte';
  import StreetMap from './StreetMap.svelte';

  const dispatch = createEventDispatcher();
  const diagonalLength = Math.hypot(window.innerHeight, window.innerWidth);
  const chargeDuration = Math.PI / 2;
  
  let fromSefirah;
  let toSefirah;
  let newPathway;
  let newPathwayCoordinates = [0, 0, 0, 0];
  let iris;

  $: fromCoordsGsc = $sefirotPoints.features[$lastPiSlice].geometry.coordinates;
  $: fromCoordsPx = $ilanProjection(fromCoordsGsc);
  $: toCoordsGsc = $sefirotPoints.features[$currentPiSlice].geometry.coordinates;
  $: toCoordsPx = $ilanProjection(toCoordsGsc);

  $: if (toSefirah !== undefined) {
    iris.to({
      duration: Math.PI / 2,
      innerRadius: diagonalLength,
      onFinish: sendCharge
    });
  }

  async function sendCharge() {
    let endCoords = [...fromCoordsPx, ...toCoordsPx];
    newPathwayCoordinates = [...fromCoordsPx, ...fromCoordsPx];
    await tick();
    fromSefirah.to({
      duration: chargeDuration,
      radius: 0,
      opacity: 0
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
      fill: 'gold',
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
<Ring config={{
  x: toCoordsPx[0],
  y: toCoordsPx[1],
  innerRadius: 4,
  outerRadius: diagonalLength,
  fill: 'black'
}} bind:handle={iris} />
<Circle config={{
  x: toCoordsPx[0],
  y: toCoordsPx[1],
  fill: 'black',
  radius: 3,
  opacity: 1,
  stroke: 'dimgrey',
  strokeWidth: 1
}} bind:handle={toSefirah} />
