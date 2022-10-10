<script>
  import { onMount } from 'svelte';
  import * as d3 from 'd3';
  import CentrelineAnimator from './CentrelineAnimator.js';

  export let mapWidth; 
  export let mapHeight;

  let canvas;

  onMount(async () => {
    const mercProjection = d3.geoMercator();
    const ctx = canvas.getContext('2d');

    const geoGenerator = d3.geoPath()
      .projection(mercProjection)
      .context(ctx);

    mercProjection.translate([mapWidth / 2, mapHeight / 2])
    mercProjection.scale(2700000);
    const highParkAndHumberside = [ -79.466850201826219, 43.657227646269199 ];
    mercProjection.center(highParkAndHumberside);
    
    mercProjection.clipExtent([[0,0], [mapWidth, mapHeight]]);

    d3.json("/toronto-centreline-simple.geojson").then(blocks => {
      CentrelineAnimator.blocksGeoJson = blocks;
      let animator = new CentrelineAnimator(ctx, mercProjection);
      animator.drawAllBlocks(geoGenerator);
      // animator.drawBlocksFromNode(13465772);
      // ctx.beginPath();
      // geoGenerator({type: 'FeatureCollection', features: blocks.features})
      // ctx.stroke();
    });
	});

</script>

<canvas
  bind:this={canvas}
  width={mapWidth}
  height={mapHeight}
></canvas>