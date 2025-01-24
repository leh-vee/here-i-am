<script>
  import { Text } from 'svelte-konva';
  import { wordIndices, punctuationMark, isCaesura, 
    isInBetweenWords } from '../stores/text.js';
  import { screenWidth, screenHeight } from '../stores/base';

  const duration = Math.PI / 2;
  $: fontSize = Math.round($screenHeight / 4);
  let punctuationEl;

  $: if ($isCaesura) animateIn();

  function animateIn() {
    punctuationEl.fillEnabled(true);
    punctuationEl.to({
      duration,
      opacity: 1,
      onFinish: () => { animateOut() }
    });
  }
  
  function animateOut() {
    punctuationEl.to({
      duration,
      opacity: 0,
      onFinish: () => { 
        punctuationEl.fillEnabled(false);
        isCaesura.set(false);
        isInBetweenWords.set(false);
        wordIndices.nextWord();
      }
    });
  }

</script>

<Text config={{
  text: $punctuationMark,
  x: 0,
  y: 0, 
  width: $screenWidth,
  height: $screenHeight,
  align: 'center',
  verticalAlign: 'middle',
  fontSize,
  fill: 'black',
  opacity: 0,
  strokeWidth: 2,
  stroke: 'silver'
}} bind:handle={punctuationEl} />