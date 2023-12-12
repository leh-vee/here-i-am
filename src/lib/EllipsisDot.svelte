<script>
  import { Text } from "svelte-konva";
  import { isFirstVerseWord } from '../stores/text.js';
  
  export let dotIndex = 0;
  const palette = ['red', 'yellow', 'green'];
  $: colors = $isFirstVerseWord ? palette : [...palette].reverse();
  $: fill = colors[dotIndex];
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
  strokeWidth: 0
}} />