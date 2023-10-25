<script>
  import { Circle } from 'svelte-konva';
  import { wordIndices, currentVerseIndex } from '../stores/text.js';

  export let word;
  export let line;
  export let wordIndexInLine; 
  export let x;
  export let y;
  
  $: isCurrentLine = line === $wordIndices['line'];
  $: isCurrentWord = isCurrentLine && $wordIndices.wordIndex === wordIndexInLine;
  
  let hasBeenCurrentWord = isCurrentWord;
  $: if (isCurrentWord) hasBeenCurrentWord = true;
  
  let markerRadius = 0;
  let fillColour = 'dimgray';
  $: {
    if (isCurrentWord) {
      markerRadius = 5;
      fillColour = 'dimgray';
    } else if (hasBeenCurrentWord) {
      markerRadius = 3;
      fillColour = 'dimgray';
    }
  }
  
</script>

<Circle config={{
  x, y, name: word, 
  fill: fillColour, 
  radius: markerRadius
}} />