<script>
  import { onMount } from 'svelte';
  import { Image } from 'svelte-konva';
  import { geoPath } from "d3";

  export let blocksGeoJson;
  export let projection;
  export let colour = 'dimgrey';
  export let degreesRotation = 0;
  export let scale = 1;

  const xCentre = window.innerWidth / 2;
  const yCentre = window.innerHeight / 2;
  const rotationRadAngle = (degreesRotation * Math.PI) / 180;

  let isMounted = false;
  let canvas = document.createElement('canvas');

  const ctx = canvas.getContext('2d');

  onMount(async () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    ctx.lineWidth = 2;
    ctx.strokeStyle = colour;
    ctx.translate(xCentre, yCentre);
    ctx.rotate(rotationRadAngle);
    ctx.scale(scale, scale);
    ctx.translate(-xCentre, -yCentre);
    isMounted = true;
  });

  $: if (blocksGeoJson && isMounted) renderBlocks();

  function renderBlocks() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let geoGenerator = geoPath().projection(projection).context(ctx);
    ctx.beginPath();
    geoGenerator({type: 'FeatureCollection', features: blocksGeoJson.features })
    ctx.stroke();
    canvas = canvas;
  }

</script>

<Image config={{ image: canvas }} />