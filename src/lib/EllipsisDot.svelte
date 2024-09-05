<script>
  import { Text } from "svelte-konva";
  import Konva from 'konva';
  import { isReaderEngaged } from '../stores/base';
  
  export let dotIndex = 0;
  export let show = false;
  export let light = false;
  export let isFade = false;

  let text = "   ";
  let dotEl;
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

  $: if (isFade && dotEl !== undefined) {
    dotEl.to({
      duration: 1,
      fill: 'black',
      fontSize: 0,
      easing: Konva.Easings.EaseOut,
      onFinish: () => { 
        if (dotIndex === 0) isReaderEngaged.set(true);
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
  fontSize: Math.round(window.innerWidth / 8),
  fontFamily: "Courgette",
  fillEnabled: true,
  fill: 'silver',
  strokeWidth: 0,
  visible
}} bind:handle={ dotEl } />