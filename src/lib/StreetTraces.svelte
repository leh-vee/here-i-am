<script>
  import { Image } from 'svelte-konva';
  import { geoPath } from "d3";
  import { onMount } from 'svelte';

  export let blocks;
  export let projection;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const geoGenerator = geoPath().projection(projection).context(ctx);

  onMount(async () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    ctx.lineWidth = 1;
    ctx.strokeStyle = '#9E9EA1';
  });

  $: {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    geoGenerator({type: 'FeatureCollection', features: blocks.features})
    ctx.stroke();
  }

</script>

<Image config={{ image: canvas }} />