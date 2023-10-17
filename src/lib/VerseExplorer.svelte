<script>
  import { Stage, Layer, Rect } from 'svelte-konva';
  import StreetTraces from './StreetTraces.svelte';

</script>

<Stage config={{ width: window.innerWidth, height: window.innerHeight }}>
  <Layer>
    <StreetTraces /> 
  </Layer>
</Stage>