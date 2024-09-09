<script>
  import { Text } from "svelte-konva";
  import Konva from 'konva';
  import { verseState, isReaderEngaged } from '../stores/base';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();
  
  export let dotIndex = 0;
  export let show = false;
  export let light = false;
  export let isVanishing = false;

  const fontSize = Math.round(window.innerHeight / 10);
 
  let text = "   ";
  let dotEl;

  $: if (dotEl !== undefined && dotIndex === 2) {
    const ellipsisRectParams = {
      width: dotEl.getTextWidth(),
      height: dotEl.measureSize().height / 2
    }
    dispatch('ellipsis-rect', ellipsisRectParams)
  }

  $: visible = show && !$isReaderEngaged;

  $: {
    let ellipsisArray = [" ", " ", " "];
    ellipsisArray[dotIndex] = ".";
    text = ellipsisArray.join('');
  }

  $: if (light && dotEl !== undefined) {
    dotEl.to({ 
      duration: 1,
      fill: 'gold'
    });
  }

  $: if (isVanishing && dotEl !== undefined) vanishAnime();

  function vanishAnime() {
    dotEl.to({
      duration: 1,
      fill: 'black',
      fontSize: 0,
      easing: Konva.Easings.EaseOut,
      onFinish: () => { 
        if (dotIndex === 0) verseState.set('readerEngaged');
      }
    });
  }
 
</script>

<Text config={{
  text,
  width: window.innerWidth,
  height: window.innerHeight,
  align: 'center',
  verticalAlign: 'middle',
  fontSize,
  fontFamily: "Courgette",
  fillEnabled: true,
  fill: 'silver',
  strokeWidth: 0,
  visible
  }} bind:handle={ dotEl } 
/>