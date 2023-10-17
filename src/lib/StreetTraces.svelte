<script>
  // @ts-nocheck
  import { onMount } from 'svelte';
  import { Image } from 'svelte-konva';
  import { geoPath } from "d3";
  import { currentPiSlice, lastPiSlice, currentVerseIndex } from '../stores/text.js';
  import { channelProjections, channelBlocks } from '../stores/ilan.js';
  import { fetchBlocksWithinRadius } from '../api/client.js';
  import distance from "@turf/distance";

  let canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  onMount(async () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    ctx.lineWidth = 1;
    ctx.strokeStyle = '#9E9EA1';
  });

  const data = {};

  $: {
    console.log('drawing street traces for verse', $currentVerseIndex);
    loadStoreData();
  }

  function loadStoreData() {
    data.projection = $channelProjections[$lastPiSlice][$currentPiSlice];
    data.blocks = $channelBlocks[$lastPiSlice][currentPiSlice];
    if (data.blocks === undefined) {
      fetchBlocksForProjection(data.projection);
    } else {
      drawStreetTraces(data.projection, data.blocks.features);
    }
  }

  function fetchBlocksForProjection(projection) {
    const pCentre = projection.center();
    const pRadius = distance(pCentre, projection.invert([0,0]));
    fetchBlocksWithinRadius(pCentre, pRadius).then(blocks => {
      data.blocks = blocks;
      drawStreetTraces(data.projection, data.blocks.features);
      console.log('blocks for current channel projection fetched');
      channelBlocks.setForIndices($lastPiSlice, $currentPiSlice, blocks);
    });
    return true;
  }

  function drawStreetTraces(projection, features) {
    console.log('updating street traces...');
    let geoGenerator = geoPath().projection(projection).context(ctx);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    geoGenerator({type: 'FeatureCollection', features })
    ctx.stroke();
    canvas = canvas;
  }

</script>

<Image config={{ image: canvas }} />