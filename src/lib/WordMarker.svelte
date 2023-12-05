<script>
  import { Circle } from 'svelte-konva';
  import { currentWordId } from '../stores/text.js';
 
  export let x;
  export let y;
  export let wordId;

  let markerEl; 
  let isRead = false;
  
  $: isCurrentWord = wordId === $currentWordId;
  
  const duration = Math.PI / 10;
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