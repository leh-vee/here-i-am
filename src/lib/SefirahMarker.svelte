<script>
  import { Circle } from 'svelte-konva';

  export let coordsPx;
  export let radius = 5;
</script>

<Circle config={{
    x: coordsPx[0],
    y: coordsPx[1],
    radius,
    fill: 'black'
  }}
/>
