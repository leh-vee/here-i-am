<script>
  import { Line, Circle, Ring } from 'svelte-konva';
  import { tick } from 'svelte';
  import { ilanProjection, ilanBlocks, sefirotPoints, 
    isBlocksForCurrentChannelFetched } from '../stores/treeOfLife.js';
  import { lastPiSlice, currentPiSlice, likePiSlices } from '../stores/text.js';
  import { screenWidth, screenHeight } from '../stores/base';
  import StreetMap from './StreetMap.svelte';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();
  const diagonalLength = Math.hypot($screenHeight, $screenWidth);
  const chargeDuration = Math.PI / 2;
  
  const sefirahAttrs = {
    radius: 3,
    opacity: 1,
    stroke: 'dimgrey',
    strokeWidth: 1
  };
  let fromSefirahEl;
  let toSefirahEl;
  let newPathwayEl;
  let newPathwayCoordinates = [0, 0, 0, 0];
  let iris;

  $: fromCoordsGsc = $sefirotPoints.features[$lastPiSlice].geometry.coordinates;
  $: fromCoordsPx = $ilanProjection(fromCoordsGsc);
  $: toSefirahIndex = $likePiSlices ? 0 : $currentPiSlice;
  $: toCoordsGsc = $sefirotPoints.features[toSefirahIndex].geometry.coordinates;
  $: toCoordsPx = $ilanProjection(toCoordsGsc);
  
  $: irisCoordsX = $likePiSlices ? fromCoordsPx[0] : toCoordsPx[0];
  $: irisCoordsY = $likePiSlices ? fromCoordsPx[1] : toCoordsPx[1];

  let isReadyToSendCharge = false;

  $: if (fromSefirahEl !== undefined) {
    iris.to({
      duration: Math.PI / 2,
      innerRadius: diagonalLength,
      onFinish: () => {
        isReadyToSendCharge = true;
      }
    });
  }

  $: if (isReadyToSendCharge && $isBlocksForCurrentChannelFetched) sendCharge();

  async function sendCharge() {
    let endCoords = [...fromCoordsPx, ...toCoordsPx];
    newPathwayCoordinates = [...fromCoordsPx, ...fromCoordsPx];
    await tick();
    fromSefirahEl.to({
      duration: chargeDuration,
      fill: 'black'
    });
    newPathwayEl.to({
      points: endCoords,
      opacity: 1,
      duration: chargeDuration,
      onFinish: receiveCharge
    });
  }

  function receiveCharge() {
    let sefirahEl = toSefirahEl;
    let endCoords = [...toCoordsPx, ...toCoordsPx];
    if ($likePiSlices) {
      sefirahEl = fromSefirahEl;
      endCoords = [...fromCoordsPx, ...fromCoordsPx];
    }
    sefirahEl.to({
      fill: 'gold',
      duration: chargeDuration
    });
    newPathwayEl.to({
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
  fill: 'gold',
  ...sefirahAttrs
}} bind:handle={fromSefirahEl} />
<Circle config={{
  x: toCoordsPx[0],
  y: toCoordsPx[1],
  fill: 'black',
  ...sefirahAttrs
}} bind:handle={toSefirahEl} />
<Ring config={{
  x: irisCoordsX,
  y: irisCoordsY,
  innerRadius: 4,
  outerRadius: diagonalLength,
  fill: 'black'
}} bind:handle={iris} />
<Line config={{
  points: newPathwayCoordinates,
  stroke: 'gold',
  strokeWidth: 2,
  opacity: 0,
  lineCap: 'round'
}} bind:handle={newPathwayEl} />
