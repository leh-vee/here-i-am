<script>
  import { Circle } from 'svelte-konva';

  export let coordsPx;
</script>

<Circle config={{
    x: coordsPx[0],
    y: coordsPx[1],
    radius: 5,
    fill: '#9E9EA1',
  }}
/>
