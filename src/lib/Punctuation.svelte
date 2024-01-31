<script>
  import { Text } from 'svelte-konva';
  import { createEventDispatcher } from 'svelte';
  import { punctuationMark, isCaesura } from '../stores/text.js';

  let punctuationEl;
  const dispatch = createEventDispatcher();
  const duration = Math.PI / 2

  $: if ($isCaesura) animateIn();

  function animateIn() {
    punctuationEl.fillEnabled(true);
    punctuationEl.to({
      duration,
      fill: 'dimgrey',
      strokeWidth: 2,
      onFinish: () => { animateOut() }
    });
  }
  
  function animateOut() {
    punctuationEl.to({
      duration,
      strokeWidth: 0,
      fill: 'black',
      onFinish: () => { 
        punctuationEl.fillEnabled(false);
        dispatch('punctuated') 
      }
    });
  }

</script>

<Text config={{
  text: $punctuationMark,
  y: 0, 
  width: window.innerWidth,
  height: window.innerHeight,
  align: 'center',
  verticalAlign: 'middle',
  fontSize: Math.round(window.innerWidth / 9),
  fillEnabled: false,
  fill: 'black',
  stroke: 'dimgrey',
  strokeWidth: 0
}} bind:handle={punctuationEl} />