<script>
  import { Image } from 'svelte-konva';
  import { geoPath } from "d3";
  import { ilanProjection, ilanBlocks } from '../stores/ilan.js';

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
</script>

<Image config={{ image: canvas }} />