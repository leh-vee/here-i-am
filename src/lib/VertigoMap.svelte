<script>
  import { onMount } from 'svelte';
  import StreetIllustrator from './StreetIllustrator.js';

  export let mapWidth; 
  export let mapHeight;

  let canvas;

  onMount(async () => {
    const highParkAndHumberside = [ -79.466850201826219, 43.657227646269199 ];
    const illustrator = new StreetIllustrator(canvas, highParkAndHumberside);
    illustrator.renderGrid();
    // illustrator.drawBlocksFromNode(13465772);
	});

</script>

<canvas
  bind:this={canvas}
  width={mapWidth}
  height={mapHeight}
></canvas>