<script>
  import { Text } from "svelte-konva";
  
  export let dotIndex = 0;
  export let visible;
  export let fill;
  let text = "   ";

  $: {
    let ellipsisArray = [" ", " ", " "];
    ellipsisArray[dotIndex] = ".";
    text = ellipsisArray.join(''); 
  }

</script>

<Text config={{
  text,
  width: window.innerWidth,
  height: window.innerHeight,
  align: 'center',
  verticalAlign: 'middle',
  fontSize: Math.round(window.innerWidth / 5),
  fontFamily: 'Courgette',
  fillEnabled: true,
  fill,
  strokeWidth: 0,
  visible
}} />