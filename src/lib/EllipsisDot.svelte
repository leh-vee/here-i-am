<script>
  import { Text } from "svelte-konva";
  
  export let dotIndex = 0;
  export let visible = false;
  export let light = false;

  let text = "   ";
  let dotEl;

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

</script>

<Text config={{
  text,
  width: window.innerWidth,
  height: window.innerHeight,
  align: 'center',
  verticalAlign: 'middle',
  fontSize: Math.round(window.innerWidth / 5),
  fontFamily: "Courgette",
  fillEnabled: true,
  fill: 'dimgrey',
  strokeWidth: 0,
  visible
}} bind:handle={ dotEl } />