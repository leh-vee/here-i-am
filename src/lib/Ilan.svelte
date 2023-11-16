<script>
  import { tick } from 'svelte';
  import { Image, Line, Layer, Circle } from 'svelte-konva';
  import { geoPath } from "d3";
  import { ilanProjection, ilanBlocks, sefirotPoints } from '../stores/treeOfLife.js';
  import { currentVerseIndex, lastPiSlice, currentPiSlice } from '../stores/text.js';
  import { onMount } from 'svelte';

  const canvas = document.createElement('canvas');

  onMount(async () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const ctx = canvas.getContext('2d');
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'gray';

    const geoGenerator = geoPath().projection($ilanProjection).context(ctx);
    ctx.beginPath();
    geoGenerator({type: 'FeatureCollection', features: $ilanBlocks.features })
    ctx.stroke();
  });

  let newPathway;
  let fromSefirah;
  let toSefirah;
  let newPathwayCoordinates = [0, 0, 0, 0];
  const chargeDuration = Math.PI / 10;

  $: fromCoordsGsc = $sefirotPoints.features[$lastPiSlice].geometry.coordinates;
  $: fromCoordsPx = $ilanProjection(fromCoordsGsc);
  $: toCoordsGsc = $sefirotPoints.features[$currentPiSlice].geometry.coordinates;
  $: toCoordsPx = $ilanProjection(toCoordsGsc);

  $: if (Number.isInteger($currentVerseIndex) && newPathway) sendCharge();

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
      duration: chargeDuration
    });
  }
</script>

<Layer>
  <Image config={{ image: canvas }} />
  <Circle config={{
    x: fromCoordsPx[0],
    y: fromCoordsPx[1],
    radius: 3,
    fill: 'black'
  }}
  bind:handle={fromSefirah} 
  />
  <Line config={{
    points: newPathwayCoordinates,
    stroke: 'black',
    strokeWidth: 2,
    opacity: 0,
    lineCap: 'round'
  }}
  bind:handle={newPathway}
  />
  <Circle config={{
    x: toCoordsPx[0],
    y: toCoordsPx[1],
    fill: 'black',
    radius: 0,
    opacity: 0
  }}
  bind:handle={toSefirah} 
  />
</Layer>