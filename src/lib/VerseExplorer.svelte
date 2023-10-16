<script>
  import { Stage, Layer, Rect } from 'svelte-konva';
  import StreetTraces from './StreetTraces.svelte';

  export let blocks;
  export let projection;
</script>

<Stage config={{ width: window.innerWidth, height: window.innerHeight }}>
  <Layer>
    <StreetTraces blocks={blocks} projection={projection} /> 
  </Layer>
</Stage>