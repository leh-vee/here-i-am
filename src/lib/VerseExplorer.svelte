<script>
  import { Stage, Layer } from 'svelte-konva';
  import StreetTraces from './StreetTraces.svelte';
  import SefirahMarker from './SefirahMarker.svelte';
  import { channelProjections, sefirotPoints } from '../stores/ilan';
  import { currentPiSlice, lastPiSlice } from '../stores/text.js';

  $: currentProjection = $channelProjections[$lastPiSlice][$currentPiSlice]; 
  $: fromSefirah = $sefirotPoints.features[$lastPiSlice];

</script>

<Stage config={{ width: window.innerWidth, height: window.innerHeight }}>
  <Layer>
    <StreetTraces /> 
    <SefirahMarker coordsPx={currentProjection(fromSefirah.geometry.coordinates)} />
  </Layer>
</Stage>