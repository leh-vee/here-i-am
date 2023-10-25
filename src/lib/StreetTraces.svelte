<script>
  // @ts-nocheck
  import { onMount } from 'svelte';
  import { Image } from 'svelte-konva';
  import { geoPath } from "d3";
  import { currentPiSlice, lastPiSlice, currentVerseIndex } from '../stores/text.js';
  import { currentChannelProjection, blocksForCurrentChannel, channelBlocks } from '../stores/ilan.js';
  import { fetchBlocksWithinRadius } from '../api/client.js';
  import distance from "@turf/distance";

  let canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  onMount(async () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    ctx.lineWidth = 1;
    ctx.strokeStyle = 'gray';
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
      channelBlocks.setForIndices($lastPiSlice, $currentPiSlice, blocks);
    });
    return true;
  }

</script>

<Image config={{ image: canvas }} />