<script>
  import { tick } from 'svelte';
  import { Image, Circle } from 'svelte-konva';
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

  let marker;
  let markerCoordinates = [0,0];

  $: if (marker) {
    console.log('ilan dash for verse with index', $currentVerseIndex);
    const fromCoordsGsc = $sefirotPoints.features[$lastPiSlice].geometry.coordinates;
    const toCoordsGsc = $sefirotPoints.features[$currentPiSlice].geometry.coordinates;
    const fromCoordsPx = $ilanProjection(fromCoordsGsc);
    const toCoordsPx = $ilanProjection(toCoordsGsc);

    markerCoordinates = fromCoordsPx;
    dash(toCoordsPx);
    
  }
  
  async function dash(toCoords) {
    await tick();
    marker.to({
      x: toCoords[0],
      y: toCoords[1],
      duration: 3
    });
  }
</script>

<Image config={{ image: canvas }} />
<Circle config={{
    x: markerCoordinates[0],
    y: markerCoordinates[1],
    radius: 5,
    fill: 'black'
  }}
  bind:handle={marker}
/>
