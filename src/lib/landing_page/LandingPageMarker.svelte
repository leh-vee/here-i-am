<script>
  import { Stage, Layer, Ring } from 'svelte-konva';
  import Konva from 'konva';
  import Title from './Title.svelte';
  import { createEventDispatcher } from 'svelte';
  
  const dispatch = createEventDispatcher();

  const yCentre = window.innerHeight / 2;
  const xCentre = window.innerWidth / 2;
  const diagonalRadius = Math.hypot(xCentre, yCentre);

  const radius = Math.round((window.innerHeight / 2) * 0.4);
  const stroke = 'dimgrey';
  const strokeWidth = 6;

  let markerEl;
  let isMarkerInverted = false;

  export let flip = true;
  let isFlipping = false;
  let showTitle = true;

  $: if (flip && markerEl !== undefined) flipMarker();

  function flipMarker() {
    isFlipping = true;
    markerEl.to({
      duration: 1,
      scaleX: -markerEl.scaleX(),
      easing: Konva.Easings.StrongEaseInOut,
      onFinish: () => { 
        if (flip) {
          flipMarker();
        } else {
          isFlipping = false;
        }
      }
    });
  }

  function click() {
    const pointerPosition =  markerEl.getRelativePointerPosition();
    const ppPxDistanceFromCentre = Math.hypot(pointerPosition.x, pointerPosition.y);
    const isMarkerClick = ppPxDistanceFromCentre < radius - strokeWidth;
    if (isMarkerClick) {
      if (isMarkerInverted) {
        dispatch('go');
      } else {
        turnInsideOut();
        isMarkerInverted = true;
      }
    } 
  }

  function turnInsideOut() {
    showTitle = false;
    markerEl.to({
      duration: Math.PI / 10,
      easing: Konva.Easings.EaseOut,
      fill: 'gold',
      innerRadius: diagonalRadius + strokeWidth,
      onFinish: () => { dispatch('inverted') }
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
      outerRadius: radius,
      innerRadius: 0,
      strokeWidth,
      stroke
    }} bind:handle={ markerEl } />
    {#if !isFlipping && showTitle}
      <Title />
    {/if}
  </Layer>
</Stage>

