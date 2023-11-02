<script>
  import { onMount } from 'svelte';
  import { Image, Rect } from 'svelte-konva';
  import { geoPath } from "d3";
  import { fetchBlocksForProjection } from '../api/client.js';
  import { projectionForIlan } from '../lib/utils/projections.js';
  import { sefirotPoints } from '../stores/ilan.js';

  let canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  $: w = window.innerWidth;  
  $: h = window.innerHeight;  
  $: ilanWidth = w / 4;
  $: ilanHeight = h / 4;
  $: locatorPx = { width: ilanWidth, height: ilanHeight };
  $: margin = Math.max(w, h) / 75;
  $: ilanX = w - ilanWidth - margin;
  $: ilanY = h - ilanHeight - margin;

  onMount(async () => {
    canvas.width = ilanWidth;
    canvas.height = ilanHeight;

    ctx.lineWidth = 1;
    ctx.strokeStyle = 'black';

    const projection = await projectionForIlan($sefirotPoints, locatorPx);
    const blocks = await fetchBlocksForProjection(projection, locatorPx);
    console.log('ilan locator map data loaded');

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
  fill: 'white',
  strokeWidth: 1
}} />
<Image config={{ 
  image: canvas,
  x: ilanX, 
  y: ilanY, 
  width: ilanWidth, 
  height: ilanHeight
}} />