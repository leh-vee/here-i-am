<script>
  import { Text } from 'svelte-konva';

  export let currentWord;
</script>

<Text config={{
  text: currentWord,
  width: window.innerWidth,
  height: window.innerHeight,
  align: 'center',
  verticalAlign: 'middle',
  fontSize: 80,
  fontFamily: 'Reenie Beanie',
  fillEnabled: true,
  fill: 'white',
  strokeWidth: 0
}} />
