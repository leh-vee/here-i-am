<script>
  // @ts-nocheck
  import { Circle } from 'svelte-konva';
  import { percentOfVerseRead } from '../stores/text';
  import { isReaderEngaged } from '../stores/base';
  
  export let coordsPx;
  export let isLit = false;
  export let isFromSefirah = true;

  let theLightEl;

  $: if (isLit && theLightEl !== undefined) animateOpacity($percentOfVerseRead, $isReaderEngaged);
  
  function animateOpacity(percentRead, isEngaged) {
    const opacity = isFromSefirah ? fromOpacity(percentRead, isEngaged) : toOpacity(percentRead);
    console.log(opacity);
    theLightEl.to({ duration: Math.PI, opacity });
  }

  function fromOpacity(p, isEngaged) {
    let o = 1;
    if (isEngaged) o = Math.max(1 - p - (Math.PI - 3), 0); 
    return o;
  }

  function toOpacity(p) { 
    return Math.max(p - (Math.PI - 3), 0);
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
