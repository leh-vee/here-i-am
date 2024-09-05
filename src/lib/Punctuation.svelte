<script>
  import { Text } from 'svelte-konva';
  import { createEventDispatcher } from 'svelte';
  import { punctuationMark, isCaesura } from '../stores/text.js';

  let punctuationEl;
  const dispatch = createEventDispatcher();
  const duration = Math.PI / 2;
  const fontSize = Math.round(window.innerWidth / 6);

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
        dispatch('punctuated') 
      }
    });
  }

</script>

<Text config={{
  text: $punctuationMark,
  x: 0,
  y: 0, 
  width: window.innerWidth,
  height: window.innerHeight,
  align: 'center',
  verticalAlign: 'middle',
  fontSize,
  fill: 'black',
  opacity: 0,
  strokeWidth: 1,
  stroke: 'silver'
}} bind:handle={punctuationEl} />