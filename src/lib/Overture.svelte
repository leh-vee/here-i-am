<script>
  import { Layer, Circle } from 'svelte-konva';  

  const ellipsisStopAttrs = {
    radius: 5,
    opacity: 0.3,  
    fill: '#9E9EA1'
  }

  const ellipsisStopDelta = ellipsisStopAttrs.radius * 3;
  const yCentre = window.innerHeight / 2;
  const xCentre = window.innerWidth / 2;

  const ellipsisStops = new Array(3);

  $: if (ellipsisStops[0]) {
    const t = Math.PI / 10;
    const fadeIn = (index) => {
      ellipsisStops[index].to({
        opacity: 1,
        duration: t,
        onFinish: () => { fadeOut(index) }
      });
    }

    const fadeOut = (index) => {
      ellipsisStops[index].to({
        opacity: ellipsisStopAttrs.opacity,
        duration: t,
        onFinish: () => {
          if (index < ellipsisStops.length - 1) {
            fadeIn(index + 1);
          } else {
            fadeIn(0);
          }
        }
      });
    }
    fadeIn(0);
  }
  
</script>

<Layer>
  <Circle config={{ 
    x: xCentre - ellipsisStopDelta,
    y: yCentre,
    ...ellipsisStopAttrs
  }} bind:handle={ellipsisStops[0]} />
  <Circle config={{ 
    x: xCentre,
    y: yCentre,
    ...ellipsisStopAttrs
  }} bind:handle={ellipsisStops[1]} />
  <Circle config={{ 
    x: xCentre + ellipsisStopDelta,
    y: yCentre,
    ...ellipsisStopAttrs
  }} bind:handle={ellipsisStops[2]} />
</Layer>
