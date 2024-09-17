<script>
  // @ts-nocheck
  import { Circle } from 'svelte-konva';
  import { percentOfVerseRead, likePiSlices, isLineA } from '../stores/text';
  import { isReaderEngaged } from '../stores/verseState';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();
  
  export let coordsPx;
  export let isLit = false;
  export let isFromSefirah = true;

  const radius = 5;
  let goldFillEl;

  $: if (isLit && goldFillEl !== undefined) animateOpacity($percentOfVerseRead, $isReaderEngaged);
  
  function animateOpacity(percentRead, isEngaged) {
    const opacity = isFromSefirah ? fromOpacity(percentRead, isEngaged) : toOpacity(percentRead);
    goldFillEl.to({ duration: Math.PI, opacity });
  }

  function fromOpacity(p, isEngaged) {
    let o = 1;
    if (isEngaged) {
      if ($likePiSlices && !$isLineA) {
        o = toOpacity(p);
      } else {
        o = Math.max(1 - p - (Math.PI - 3), 0); 
      }
    }
    return o;
  }

  function toOpacity(p) { 
    return Math.max(p - (Math.PI - 3), 0);
  }

  function incrementWord() {
    if (isFromSefirah) {
      dispatch('previous-word');
    } else {
      dispatch('next-word');
    }
    return true;
  }
</script>

<Circle config={{
  x: coordsPx[0],
  y: coordsPx[1],
  radius,
  fill: 'black',
  stroke: 'silver',
  strokeWidth: 2
}} />
<Circle config={{
  x: coordsPx[0],
  y: coordsPx[1],
  radius,
  fill: 'gold',
  strokeEnabled: false,
  opacity: 0
}} bind:handle={ goldFillEl } />
<Circle config={{ 
  x: coordsPx[0],
  y: coordsPx[1],
  radius: radius * 3,
  fill: 'white',
  opacity: 0
  }} on:pointerclick={ incrementWord }
/>
