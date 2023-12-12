<script>
  import { onMount } from 'svelte';
  import { Image } from 'svelte-konva';
  import { geoPath } from "d3";
  import { currentPiSlice, lastPiSlice } from '../stores/text.js';
  import { currentChannelProjection, blocksForCurrentChannel, 
    channelBlocks } from '../stores/treeOfLife.js';
  import { fetchBlocksWithinRadius } from '../api/client.js';
  import distance from "@turf/distance";

  let canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  onMount(async () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    ctx.lineWidth = 2;
    ctx.strokeStyle = 'grey';
  });

  $: if ($blocksForCurrentChannel === undefined) {
    fetchBlocksForProjection();
  } else {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    console.log('updating street traces...');
    let geoGenerator = geoPath().projection($currentChannelProjection).context(ctx);
    ctx.beginPath();
    geoGenerator({type: 'FeatureCollection', features: $blocksForCurrentChannel.features })
    ctx.stroke();
    canvas = canvas;
  }

  function fetchBlocksForProjection() {
    const pCentre = $currentChannelProjection.center();
    const pRadius = distance(pCentre, $currentChannelProjection.invert([0,0]));
    fetchBlocksWithinRadius(pCentre, pRadius).then(blocks => {
      console.log('blocks for current channel projection fetched');
      if ($lastPiSlice !== $currentPiSlice) {
        channelBlocks.setForIndices($lastPiSlice, $currentPiSlice, blocks);
      } else if (Number($lastPiSlice) !== 0) {
        channelBlocks.setForIndices($lastPiSlice, 0, blocks);
      }
    });
    return true;
  }

</script>

<Image config={{ image: canvas }} />