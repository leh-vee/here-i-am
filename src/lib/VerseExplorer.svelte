<script>
  import { Stage, Layer } from 'svelte-konva';
  import StreetTraces from './StreetTraces.svelte';
  import SefirahMarker from './SefirahMarker.svelte';
  import LineMarkers from './LineMarkers.svelte';
  import { currentChannelFromSefirahCoordsPx, 
    currentChannelToSefirahCoordsPx } from '../stores/ilan';
  import Controller from './Controller.svelte';
  import Word from './Word.svelte';
</script>

<Controller />
<Stage config={{ width: window.innerWidth, height: window.innerHeight }}>
  <Layer>
    <StreetTraces /> 
    <SefirahMarker coordsPx={ $currentChannelFromSefirahCoordsPx } />
    <Word />
    <LineMarkers />
    <LineMarkers line={'b'} />
    <SefirahMarker coordsPx={ $currentChannelToSefirahCoordsPx } />
  </Layer>
</Stage>