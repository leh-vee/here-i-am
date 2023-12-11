<script>
  import { Circle } from 'svelte-konva';
  import { currentWordId, isLineBreak, isCaesura } from '../stores/text.js';
 
  export let x;
  export let y;
  export let wordId;

  $: isCurrentWord = wordId === $currentWordId;

  let markerEl; 
  let isRead = false;

  let isExpanded = false;
  
  $: duration = $isLineBreak ? Math.PI / 2 : Math.PI / 10;
  
  $: if (isCurrentWord && markerEl) {
    expandMarker();
  } else if (markerEl) {
    contractMarker();
  }

  $: if ($isCaesura && markerEl.radius() === 5) {
    contractMarker();
  }

  function expandMarker() {
    if (!isExpanded) {
      isRead = true;
      markerEl.to({
        duration,
        radius: 5,
        fill: 'gold',
        onFinish: () => { isExpanded = true }
      });
    }
  }

  function contractMarker() {
    if (isExpanded) {
      markerEl.to({
        duration,
        radius: 3,
        fill: 'dimgrey',
        onFinish: () => { isExpanded = false }
      });
    }
  }

</script>

<Circle config={{ 
  x, y, 
  radius: 3,
  visible: isRead, 
  fill: 'dimgrey'
}} bind:handle={markerEl} />