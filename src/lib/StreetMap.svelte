<script>
  import { onMount } from 'svelte';
  import { Image } from 'svelte-konva';
  import { geoPath } from "d3";

  export let blocksGeoJson;
  export let projection;
  export let colour = 'dimgrey';
  export let lineWidth = 2;

  let isMounted = false;
  let canvas = document.createElement('canvas');
  
  const ctx = canvas.getContext('2d');

  onMount(async () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = colour;
    isMounted = true;
  });

  $: if (blocksGeoJson && isMounted) renderBlocks();

  function renderBlocks() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    console.log('updating street traces...');
    let geoGenerator = geoPath().projection(projection).context(ctx);
    ctx.beginPath();
    geoGenerator({type: 'FeatureCollection', features: blocksGeoJson.features })
    ctx.stroke();
    canvas = canvas;
  }

</script>

<Image config={{ image: canvas }} />