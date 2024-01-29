<script>
  // @ts-nocheck
  import { Circle } from 'svelte-konva';
  import { percentOfVerseRead } from '../stores/text';
  
  export let coordsPx;
  export let isFromSefirah = true;

  let theLightEl;
  let radius = 0;
  
  $: if (isFromSefirah) {
    radius = 5 - (5 * $percentOfVerseRead);
  } else {
    radius = 5 * $percentOfVerseRead;
  }
</script>

<Circle config={{
  x: coordsPx[0],
  y: coordsPx[1],
  radius: 5,
  fill: 'black',
  stroke: 'dimgrey',
  strokeWidth: 2
}} />
<Circle config={{
  x: coordsPx[0],
  y: coordsPx[1],
  fill: 'gold',
  strokeEnabled: false,
  radius
}} bind:handle={theLightEl} />
