<script>
  import { Circle } from 'svelte-konva';
  import Konva from 'konva';
  import { createEventDispatcher } from 'svelte';
  
  const dispatch = createEventDispatcher();

  export let radius;
  export let strokeWidth;
  export let stop;
 
  const xCentre = window.innerWidth / 2;
  const yCentre = window.innerHeight / 2;

  let coinEl;

  $: if (coinEl !== undefined) coinHalfFlip();

  function coinHalfFlip() {
    if (stop) {
      dispatch('stopped');
    } else {
      coinQuarterFlipOut(); 
    }
  }

  const quarterFlipDuration = 0.5;
  function coinQuarterFlipOut() {
    const finalScaleX = -coinEl.scaleX();
    coinEl.to({
      duration: quarterFlipDuration,
      scaleX: 0,
      easing: Konva.Easings.StrongEaseIn,
      onFinish: () => {
        coinQuarterFlipIn(finalScaleX);
      }
    })
  }

  function coinQuarterFlipIn(scaleX) {
    coinEl.to({
      duration: quarterFlipDuration,
      scaleX,
      easing: Konva.Easings.StrongEaseOut,
      onFinish: coinHalfFlip
    })
  }
</script>

<Circle config={{
  x: xCentre,
  y: yCentre,
  fill: 'black',
  stroke: 'dimgrey',
  radius,
  strokeWidth
}} bind:handle={ coinEl } />