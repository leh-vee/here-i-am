<script>
  import { Text } from "svelte-konva";
  import Konva from 'konva';
  import { verseState } from '../stores/verseState';
  import { screenWidth, screenHeight } from '../stores/base';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();
  
  export let dotIndex = 0;
  export let show = false;
  export let light = false;
  export let isVanishing = false;

  $: fontSize = Math.round($screenWidth / 5);
 
  let text = "   ";
  let dotEl;

  $: if (dotEl !== undefined && dotIndex === 2) {
    const ellipsisRectParams = {
      width: dotEl.getTextWidth(),
      height: dotEl.measureSize().height / 2
    }
    dispatch('ellipsis-rect', ellipsisRectParams)
  }

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
  width: $screenWidth,
  height: $screenHeight,
  align: 'center',
  verticalAlign: 'middle',
  fontSize,
  fontFamily: "Courgette",
  fillEnabled: true,
  fill: 'silver',
  strokeWidth: 0,
  visible: show
  }} bind:handle={ dotEl } 
/>