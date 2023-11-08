<script>
    import { Layer, Circle } from 'svelte-konva';  

    const ellipsisStopAttrs = {
      radius: 5,
      opacity: 0.4,  
      fill: '#9E9EA1'
    }

    const ellipsisStopDelta = ellipsisStopAttrs.radius * 3;
    const yCentre = window.innerHeight / 2;
    const xCentre = window.innerWidth / 2;
</script>

<Layer>
  <Circle config={{ 
    x: xCentre - ellipsisStopDelta,
    y: yCentre,
    ...ellipsisStopAttrs
  }} />
  <Circle config={{ 
    x: xCentre,
    y: yCentre,
    ...ellipsisStopAttrs
  }} />
  <Circle config={{ 
    x: xCentre + ellipsisStopDelta,
    y: yCentre,
    ...ellipsisStopAttrs
  }} />
</Layer>
