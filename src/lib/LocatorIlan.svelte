<script>
  import { onMount } from 'svelte';
  import { Image, Rect, Circle } from 'svelte-konva';
  import { geoPath } from "d3";
  import { fetchBlocksForProjection } from '../api/client.js';
  import { projectionForIlan } from '../lib/utils/projections.js';
  import { sefirotPoints } from '../stores/ilan.js';
  import { currentFromSefirahCoordsGcs } from '../stores/ilan';

  let canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const ratio = 6;

  $: w = window.innerWidth;  
  $: h = window.innerHeight;  
  $: ilanWidth = w / ratio;
  $: ilanHeight = h / ratio;
  $: locatorPx = { width: ilanWidth, height: ilanHeight };
  $: margin = Math.max(w, h) / 40;
  $: ilanX = w - ilanWidth - margin;
  $: ilanY = margin;

  let markerCoordinatesPx;

  onMount(async () => {
    canvas.width = ilanWidth;
    canvas.height = ilanHeight;

    ctx.lineWidth = 1;
    ctx.strokeStyle = 'black';

    const projection = await projectionForIlan($sefirotPoints, locatorPx);
    const blocks = await fetchBlocksForProjection(projection, locatorPx);
    console.log('ilan locator map data loaded');

    markerCoordinatesPx = projection($currentFromSefirahCoordsGcs);

    let geoGenerator = geoPath().projection(projection).context(ctx);
    ctx.beginPath();
    geoGenerator({type: 'FeatureCollection', features: blocks.features })
    ctx.stroke();
    canvas = canvas;
  });

</script>

<Rect config={{ 
  x: ilanX, 
  y: ilanY, 
  width: ilanWidth, 
  height: ilanHeight,
  stroke: 'black',
  strokeWidth: 1,
  fill: 'white'
}} />
<Image config={{ 
  image: canvas,
  x: ilanX, 
  y: ilanY, 
  width: ilanWidth, 
  height: ilanHeight
}} />
{#if markerCoordinatesPx}
  <Circle config={{
      x: ilanX + markerCoordinatesPx[0],
      y: ilanY + markerCoordinatesPx[1],
      radius: 3,
      fill: 'black'
    }}
  />
{/if}