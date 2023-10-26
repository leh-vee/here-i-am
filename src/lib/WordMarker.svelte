<script>
  import { Circle } from 'svelte-konva';
  import { wordIndices } from '../stores/text.js';

  export let word;
  export let line;
  export let wordIndexInLine; 
  export let x;
  export let y;
  
  $: isCurrentLine = line === $wordIndices['line'];
  $: isCurrentWord = isCurrentLine && $wordIndices.wordIndex === wordIndexInLine;
  
  let hasBeenCurrentWord = isCurrentWord;
  $: if (isCurrentWord) hasBeenCurrentWord = true;

  $: fill = isCurrentWord ? 'black' : 'dimgray';
  $: visible = (isCurrentWord || hasBeenCurrentWord) ? true : false;
  $: radius = isCurrentWord ? 5 : 3;
  
</script>

<Circle config={{ x, y, name: word, radius, visible, fill }} />