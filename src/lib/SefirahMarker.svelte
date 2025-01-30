<script>
  // @ts-nocheck
  import { Circle } from 'svelte-konva';
  import { percentOfVerseRead, likePiSlices, isLineA } from '../stores/text';
  import { isReaderEngaged, isFullStop, isVerseMapReaveled } from '../stores/verseState';
  import { screenWidth } from '../stores/base';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();
  
  export let coordsPx;
  export let isFromSefirah = true;

  $: radius = Math.floor($screenWidth * 0.015);
  const piFractions = Math.PI - 3;
  let goldFillEl;
  
  $: isToSefriah = !isFromSefirah;

  $: if (isFromSefirah && $isVerseMapReaveled) fadeFillToOpacity(1, Math.PI);
  $: if (isToSefriah && $isFullStop) fadeFillToOpacity(1);
  
  $: if ($isReaderEngaged && $percentOfVerseRead) {
    if (isFromSefirah) {
      if ($likePiSlices && !$isLineA) {
        fadeFillToOpacity($percentOfVerseRead);
      } else {
        fadeFillToOpacity(Math.min(1 - $percentOfVerseRead, 0.95));
      }
    } else {
      fadeFillToOpacity(Math.max($percentOfVerseRead, 0.05));
    }
  }

  function fadeFillToOpacity(opacity, duration = piFractions) {
    goldFillEl.to({ duration, opacity });
  }

  function incrementWord() {
    if (isFromSefirah && !$likePiSlices) {
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
  radius: radius * 4,
  fill: 'white',
  opacity: 0
  }} on:pointerclick={ incrementWord }
/>
