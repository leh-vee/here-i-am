<script>
  import { Circle } from 'svelte-konva';

  export let coordsPx;
  export let fillColour = 'dimgray';
  export let radius = 3;
</script>

<Circle config={{
    x: coordsPx[0],
    y: coordsPx[1],
    radius,
    fill: fillColour,
  }}
/>
