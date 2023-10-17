<script>
  import { Stage, Layer } from 'svelte-konva';
  import StreetTraces from './StreetTraces.svelte';
  import SefirahMarker from './SefirahMarker.svelte';
  import LineMarkers from './LineMarkers.svelte';
  import { channelProjections, sefirotPoints } from '../stores/ilan';
  import { currentPiSlice, lastPiSlice, currentVerse } from '../stores/text.js';

  $: projection = $channelProjections[$lastPiSlice][$currentPiSlice]; 
  $: fromSefirah = $sefirotPoints.features[$lastPiSlice];

  const absoluteLineHeightOffset = Math.round(window.innerHeight * 0.02);
</script>

<Stage config={{ width: window.innerWidth, height: window.innerHeight }}>
  <Layer>
    <StreetTraces /> 
    <SefirahMarker coordsPx={projection(fromSefirah.geometry.coordinates)} />
    <LineMarkers words={$currentVerse['a']} yOffset={-absoluteLineHeightOffset} />
    <LineMarkers words={$currentVerse['b']} yOffset={absoluteLineHeightOffset} />
  </Layer>
</Stage>