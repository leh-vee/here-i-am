<script>
  import { Stage, Layer } from 'svelte-konva';
  import StreetTraces from './StreetTraces.svelte';
  import SefirahMarker from './SefirahMarker.svelte';
  import LineMarkers from './LineMarkers.svelte';
  import { currentChannelFromSefirahCoordsPx, 
    currentChannelToSefirahCoordsPx } from '../stores/ilan';
</script>

<Stage config={{ width: window.innerWidth, height: window.innerHeight }}>
  <Layer>
    <StreetTraces /> 
    <SefirahMarker coordsPx={ $currentChannelFromSefirahCoordsPx } />
    <LineMarkers />
    <LineMarkers isLineA={false} />
    <SefirahMarker coordsPx={ $currentChannelToSefirahCoordsPx } />
  </Layer>
</Stage>