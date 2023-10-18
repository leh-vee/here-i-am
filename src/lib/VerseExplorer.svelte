<script>
  import { Stage, Layer } from 'svelte-konva';
  import StreetTraces from './StreetTraces.svelte';
  import SefirahMarker from './SefirahMarker.svelte';
  import LineMarkers from './LineMarkers.svelte';
  import { channelProjections, sefirotPoints } from '../stores/ilan';
  import { currentPiSlice, lastPiSlice } from '../stores/text.js';

  $: projection = $channelProjections[$lastPiSlice][$currentPiSlice]; 
  $: fromSefirah = $sefirotPoints.features[$lastPiSlice];
</script>

<Stage config={{ width: window.innerWidth, height: window.innerHeight }}>
  <Layer>
    <StreetTraces /> 
    <SefirahMarker coordsPx={projection(fromSefirah.geometry.coordinates)} />
    <LineMarkers />
    <LineMarkers isLineA={false} />
  </Layer>
</Stage>