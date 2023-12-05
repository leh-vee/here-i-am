<script>
  import { Circle } from 'svelte-konva';
  import { currentWordId } from '../stores/text.js';
 
  export let x;
  export let y;
  export let wordId;

  let marker; 
  
  $: isCurrentWord = wordId === $currentWordId;
  $: radius = isCurrentWord ? 5 : 3;
  $: fill = isCurrentWord ? 'gold' : 'dimgrey';
  
  let isRead = false;
  $: if (isCurrentWord) isRead = true;
  
</script>

<Circle config={{ 
  x, y, 
  radius, 
  visible: isRead, 
  fill,
}} bind:handle={marker} />