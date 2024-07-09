<script>
  // @ts-nocheck
  import { Circle } from 'svelte-konva';
  import { percentOfVerseRead } from '../stores/text';
  
  export let coordsPx;
  export let isLit = false;
  export let isFromSefirah = true;

  let theLightEl;

  $: if (isLit && theLightEl !== undefined) animateOpacity($percentOfVerseRead);
  
  function animateOpacity(percentRead) {
    const opacity = isFromSefirah ? 1 - percentRead : Math.max(percentRead - (Math.PI - 3), 0);
    theLightEl.to({ duration: Math.PI, opacity });
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
  opacity: 0,
  radius: 5
}} bind:handle={ theLightEl } />
