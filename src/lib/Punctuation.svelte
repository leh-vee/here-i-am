<script>
  import { Text } from 'svelte-konva';
  import { createEventDispatcher } from 'svelte';
  import { punctuationMark, isPunctuation } from '../stores/text.js';

  let punctuationEl;
  const dispatch = createEventDispatcher();
  const duration = Math.PI / 2

  $: if ($isPunctuation) animateIn();

  function animateIn() {
    punctuationEl.to({
      duration,
      strokeWidth: 2,
      onFinish: () => { animateOut() }
    });
  }

  function animateOut() {
    punctuationEl.to({
      duration,
      strokeWidth: 0,
      onFinish: () => { dispatch("punctuated"); }
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
  fontSize: window.innerHeight / 1.334,
  fillEnabled: false,
  stroke: 'dimgrey',
  strokeWidth: 0
}} bind:handle={punctuationEl} />