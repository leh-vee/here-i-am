<script>
  import { onMount } from 'svelte';
  import { currentWord, ellipsisMode } from '../store.js';
  import * as d3 from 'd3';
  
  export let canvasWidth; 
  export let canvasHeight;
  
  const INITIAL_FONT_SIZE = 4000;
  const MAX_FONT_DOWN_STEP = 100;
  let fontSize = INITIAL_FONT_SIZE;
  let canvas;
  let ctx = null;

  $: word = ($ellipsisMode ? "." : $currentWord);

  $: onWordTransition($currentWord)
  
  function onWordTransition(newWord) {
    if (ctx !== null) {
      fontSize = INITIAL_FONT_SIZE;
      stepDown();
    }
  }

  function stepDown() {
    ctx.font = `${fontSize}px EB Garamond`;
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.fillText(word, canvasWidth / 2, canvasHeight / 2);
    
    if (fontSize > 70) {
      const nextStepSize =  Math.round(MAX_FONT_DOWN_STEP * d3.easeSinOut(fontSize / INITIAL_FONT_SIZE));
      fontSize -= nextStepSize;
      requestAnimationFrame(stepDown);
    }
  }

  onMount(async () => {
		ctx = canvas.getContext('2d');
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle'
    stepDown();
	});
</script>


<canvas
  bind:this={canvas}
  width={canvasWidth}
  height={canvasHeight}
></canvas>