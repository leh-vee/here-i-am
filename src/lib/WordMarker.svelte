<script>
  import { Circle } from 'svelte-konva';
  import { currentWordId, isLineBreak, isCaesura, wordIndices } from '../stores/text';
  import { isReaderEngaged, isNavigable } from '../stores/verseState.js';
  import { hasReadAhead } from '../stores/base';
  
  export let x;
  export let y;
  export let wordId;
  export let isVisible = false;

  const markerRadius = 3;
  const markerColour = 'silver';
  const expandMarkerRadius = 5;
  let markerEl;
  $: isCurrentWord = wordId === $currentWordId;
  
  $: duration = $isLineBreak ? Math.PI / 2 : Math.PI / 10;
  
  $: if ($isReaderEngaged && isCurrentWord && markerEl) {
    expandMarker();
  } else if (markerEl) {
    contractMarker();
  }

  $: if ($isCaesura && markerEl.radius() === expandMarkerRadius) {
    contractMarker();
  }

  function expandMarker() {
    if (markerEl.radius() < expandMarkerRadius) {
      markerEl.to({
        duration,
        radius: expandMarkerRadius,
        fill: 'gold'
      });
    }
  }

  function contractMarker() {
    if (markerEl.radius() > markerRadius) {
      markerEl.to({
        duration,
        radius: markerRadius,
        fill: markerColour
      });
    }
  }

  function goToWord() {
    if ($isNavigable && !isCurrentWord) {
      const wordIdArr = wordId.split('-');
      const line = wordIdArr[1];
      const wordIndex = parseInt(wordIdArr[2]);
      wordIndices.goToWord(line, wordIndex);
      if (!$hasReadAhead) $hasReadAhead = true;
    }
  }

</script>

<Circle config={{ 
  x, y, 
  radius: markerRadius,
  visible: isVisible, 
  fill: markerColour,
  }} bind:handle={markerEl} 
/>

<Circle config={{ 
  x, y, 
  radius: expandMarkerRadius * 3,
  visible: isVisible, 
  fill: 'white',
  opacity: 0
  }} on:pointerclick={ goToWord }
/>