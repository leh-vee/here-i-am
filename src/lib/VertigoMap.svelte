<script>
  import { onMount } from 'svelte';
  import * as d3 from 'd3';

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
    mercProjection.scale(2000000);
    const highParkAndHumberside = [ -79.466850201826219, 43.657227646269199 ];
    mercProjection.center(highParkAndHumberside);
    // mercProjection.clipExtent([
    //   mercProjection([-79.48359489440918, 43.669113317468934]),
    //   mercProjection([-79.4578456878662, 43.64949133795468])
    // ]);

    d3.json("/toronto-centreline-simple.geojson").then(blocks => {
      ctx.beginPath();
      geoGenerator({type: 'FeatureCollection', features: blocks.features})
      ctx.stroke();
    });
	});

</script>

<canvas
  bind:this={canvas}
  width={mapWidth}
  height={mapHeight}
></canvas>