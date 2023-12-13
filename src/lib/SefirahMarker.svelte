<script>
  import { Circle } from 'svelte-konva';
  import { percentOfVerseRead, isEllipsis, isLastVerseWord } from '../stores/text';
  
  export let coordsPx;
  export let isFromSefirah = true;

  let fill = isFromSefirah ? 'gold' : 'dimgrey'; 
  let markerEl;
  
  $: percentRead = Number($percentOfVerseRead);

  const duration = Math.PI / 2;

  $: if (isFromSefirah && !$isEllipsis && markerEl) {
    markerEl.to({ 
      duration, fill: 'dimgrey',
      onFinish: () => { fill = 'dimgrey' } 
    });
  }

  $: if (!isFromSefirah && $isEllipsis && $isLastVerseWord) {
    markerEl.to({ 
      duration, fill: 'gold',
      onFinish: () => { fill = 'gold' }
    });
  }
  
  let radius = 0;
  
  $: if (isFromSefirah) {
    radius = 5 - (5 * percentRead);
  } else {
    radius = 5 * percentRead;
  }
</script>

<Circle config={{
  x: coordsPx[0],
  y: coordsPx[1],
  radius,
  fill
}} bind:handle={markerEl} />
