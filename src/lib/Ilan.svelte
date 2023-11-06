<script>
  import { tick } from 'svelte';
  import { Image, Line } from 'svelte-konva';
  import { geoPath } from "d3";
  import { ilanProjection, ilanBlocks, sefirotPoints } from '../stores/treeOfLife.js';
  import { currentVerseIndex, lastPiSlice, currentPiSlice } from '../stores/text.js';


  const canvas = document.createElement('canvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const ctx = canvas.getContext('2d');
  ctx.lineWidth = 1;
  ctx.strokeStyle = 'black';

  const geoGenerator = geoPath().projection($ilanProjection).context(ctx);
  ctx.beginPath();
  geoGenerator({type: 'FeatureCollection', features: $ilanBlocks.features })
  ctx.stroke();

  let vector;
  let vectorCoordinates = [0,0, 0, 0];
  let fromCoordsPx;
  let toCoordsPx;

  $: if (vector) {
    console.log('drawing vector for verse with index', $currentVerseIndex);
    const fromCoordsGsc = $sefirotPoints.features[$lastPiSlice].geometry.coordinates;
    const toCoordsGsc = $sefirotPoints.features[$currentPiSlice].geometry.coordinates;
    fromCoordsPx = $ilanProjection(fromCoordsGsc);
    toCoordsPx = $ilanProjection(toCoordsGsc);
    dash();
  }
  
  async function dash() {
    vectorCoordinates = [...fromCoordsPx, ...fromCoordsPx];
    await tick();
    vector.to({
      points: [...fromCoordsPx, ...toCoordsPx],
      duration: Math.PI
    });
  }
</script>

<Image config={{ image: canvas }} />
<Line config={{
    points: vectorCoordinates,
    stroke: 'black',
    strokeWidth: 3,
    lineCap: 'round'
  }}
  bind:handle={vector}
/>

