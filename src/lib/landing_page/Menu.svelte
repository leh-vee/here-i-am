<script>
  import { Ring, Text } from 'svelte-konva';
  import StreetMap from '../StreetMap.svelte';
  import Konva from 'konva';
  import { createEventDispatcher } from 'svelte';
  
  const dispatch = createEventDispatcher();

  export let projection;
  export let blocks;

  const xCentre = window.innerWidth / 2;
  const yCentre = window.innerHeight / 2;
  const diagonalLength = Math.hypot(window.innerHeight, window.innerWidth);

  let markerRingEl;
  let isShowOptions = false;

  $: if (markerRingEl !== undefined) {
    markerRingEl.to({
      duration: 3,
      outerRadius: diagonalLength,
      fill: 'gold',
      easing: Konva.Easings.EaseOut,
      onFinish: () => {
        isShowOptions = true;
      }
    });
  }

  function initiatePoem() {
    dispatch('go');
  }
</script>

<StreetMap projection={ projection } blocksGeoJson={ blocks }  />
<Ring config={{
  x: xCentre,
  y: yCentre,
  innerRadius: Math.round(xCentre * 0.7),
  outerRadius: 0,
  strokeWidth: 6,
  stroke: 'dimgrey',
  fill: 'black'
}} bind:handle={ markerRingEl } />
{#if isShowOptions}
  <Text config={{
    x: 0,
    y: 70,
    width: window.innerWidth,
    height: window.innerHeight / 3,
    align: 'center',
    text: 'Where Am I?',
    fill: 'black',
    fontSize: 22,
    textDecoration: 'underline'
  }} />
  <Text config={{
    x: 0,
    y: 102,
    width: window.innerWidth,
    height: window.innerHeight / 3,
    align: 'center',
    text: 'What Is This?',
    fill: 'black',
    fontSize: 22,
    textDecoration: 'underline'
  }} />
  <Text config={{
    x: 0,
    y: window.innerHeight - window.innerHeight / 3,
    width: window.innerWidth,
    height: window.innerHeight / 3,
    align: 'center',
    verticalAlign: 'middle',
    text: 'GO',
    fill: 'black'
  }} on:pointerclick={ initiatePoem } />
{/if}