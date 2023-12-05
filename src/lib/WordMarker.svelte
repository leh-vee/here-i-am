<script>
  import { Circle } from 'svelte-konva';
  import { currentWordId, isLineBreak } from '../stores/text.js';
 
  export let x;
  export let y;
  export let wordId;

  $: isCurrentWord = wordId === $currentWordId;

  let markerEl; 
  let isRead = false;
  
  $: duration = $isLineBreak ? Math.PI / 2 : Math.PI / 10;
  
  $: if (isCurrentWord && markerEl) {
    isRead = true;
    markerEl.to({
      duration,
      radius: 5,
      fill: 'gold'
    });
  } else if (markerEl) {
    markerEl.to({
      duration,
      radius: 3,
      fill: 'dimgrey'
    });
  }

</script>

<Circle config={{ 
  x, y, 
  radius: 3,
  visible: isRead, 
  fill: 'dimgrey'
}} bind:handle={markerEl} />