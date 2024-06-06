<script>
  import { Stage, Layer, Ring, Circle } from 'svelte-konva';
  import Konva from 'konva';
  import Title from './Title.svelte';
  import { createEventDispatcher } from 'svelte';
  
  const dispatch = createEventDispatcher();

  const yCentre = window.innerHeight / 2;
  const xCentre = window.innerWidth / 2;
  const diagonalRadius = Math.hypot(xCentre, yCentre);

  const markerRadius = Math.round((window.innerHeight / 2) * 0.4);
  const stroke = 'dimgrey';
  const strokeWidth = 6;

  let markerEl, irisEl;
  let isMarkerInverted = false;

  export let stopFlipping = false;
  let isFlipping = true;

  $: showTitle = !isFlipping && !isMarkerInverted;

  $: if (markerEl !== undefined) flipMarker();

  function flipMarker() {
    markerEl.to({
      duration: 1,
      scaleX: -markerEl.scaleX(),
      easing: Konva.Easings.StrongEaseInOut,
      onFinish: () => { 
        if (stopFlipping) {
          isFlipping = false;
        } else {
          flipMarker();
        }
      }
    });
  }

  function click() {
    const pointerPosition =  markerEl.getRelativePointerPosition();
    const ppPxDistanceFromCentre = Math.hypot(pointerPosition.x, pointerPosition.y);
    const isMarkerClick = ppPxDistanceFromCentre < markerRadius - strokeWidth;
    if (isMarkerClick) {
      if (isMarkerInverted) {
        irisIn();
      } else {
        isMarkerInverted = true;
        turnInsideOut();
      }
    } 
  }

  function turnInsideOut() {
    markerEl.to({
      duration: Math.PI / 10,
      easing: Konva.Easings.EaseOut,
      fill: 'gold',
      innerRadius: diagonalRadius + strokeWidth,
      onFinish: () => { dispatch('inverted') }
    });
  }

  function irisIn() {
    irisEl.to({
      duration: 1,
      easing: Konva.Easings.EaseIn,
      innerRadius: 0,
      fill: 'black',
      onFinish: () => { dispatch('go') } 
    });
  }
</script>

<Stage config={{ 
  width: window.innerWidth, 
  height: window.innerHeight
  }} on:pointerclick={ click }>
  <Layer>
    <Ring config={{
      x: xCentre,
      y: yCentre,
      fill: 'black',
      outerRadius: markerRadius,
      innerRadius: 0,
      strokeWidth,
      stroke
    }} bind:handle={ markerEl } />
    {#if showTitle}
      <Title />
    {:else if isMarkerInverted}
      <Circle config={{
        x: xCentre,
        y: yCentre,
        radius: 2,
        fill: 'black'
      }} />
      <Ring config={{
        x: xCentre,
        y: yCentre,
        fill: 'gold',
        outerRadius: diagonalRadius,
        innerRadius: diagonalRadius,
        strokeEnabled: false
      }} bind:handle={ irisEl } />
    {/if}
  </Layer>
</Stage>

