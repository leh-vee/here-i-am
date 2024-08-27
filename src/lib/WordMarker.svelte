<script>
  import { Circle } from 'svelte-konva';
  import { currentWordId, isLineBreak, isCaesura, 
    wordIndices } from '../stores/text.js';
  import { isReaderEngaged } from '../stores/base';
  
  export let x;
  export let y;
  export let wordId;
  export let isVisible = false;

  let markerEl; 
  $: isCurrentWord = wordId === $currentWordId;
  
  $: duration = $isLineBreak ? Math.PI / 2 : Math.PI / 10;
  
  $: if ($isReaderEngaged && isCurrentWord && markerEl) {
    expandMarker();
  } else if (markerEl) {
    contractMarker();
  }

  $: if ($isCaesura && markerEl.radius() === 5) {
    contractMarker();
  }

  function expandMarker() {
    if (markerEl.radius() < 5) {
      markerEl.to({
        duration,
        radius: 5,
        fill: 'gold'
      });
    }
  }

  function contractMarker() {
    if (markerEl.radius() > 3) {
      markerEl.to({
        duration,
        radius: 3,
        fill: 'dimgrey'
      });
    }
  }

  function goToWord() {
    if (!isCurrentWord) {
      const wordIdArr = wordId.split('-');
      const line = wordIdArr[1];
      const wordIndex = parseInt(wordIdArr[2]);
      wordIndices.goToWord(line, wordIndex);
    }
  }

</script>

<Circle config={{ 
  x, y, 
  radius: 3,
  visible: isVisible, 
  fill: 'dimgrey'
  }} bind:handle={markerEl} 
  on:pointerclick={ goToWord }
/>