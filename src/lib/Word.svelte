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
  fontSize: 90,
  fontFamily: 'Alexross-Regular, Reenie Beanie',
  fillEnabled: true,
  fill: 'gold',
  strokeWidth: 0
}} />
