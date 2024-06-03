<script>
  import { Ring, Text } from 'svelte-konva';
  import StreetMap from '../StreetMap.svelte';
  import { createEventDispatcher } from 'svelte';
  
  const dispatch = createEventDispatcher();

  export let projection;
  export let blocks;

  const xCentre = window.innerWidth / 2;
  const yCentre = window.innerHeight / 2;
  const diagonalLength = Math.hypot(window.innerHeight, window.innerWidth);

  function initiatePoem() {
    dispatch('go');
  }
</script>

<StreetMap projection={ projection } blocksGeoJson={ blocks } />
<Ring config={{
  x: xCentre,
  y: yCentre,
  innerRadius: Math.round(xCentre * 0.7),
  outerRadius: diagonalLength,
  strokeWidth: 6,
  stroke: 'dimgrey',
  fill: 'black'
}} />
<Text config={{
  x: 0,
  y: window.innerHeight - window.innerHeight / 3,
  width: window.innerWidth,
  height: window.innerHeight / 3,
  align: 'center',
  verticalAlign: 'middle',
  text: 'GO',
  fill: 'gold'
}} on:pointerclick={ initiatePoem } />
