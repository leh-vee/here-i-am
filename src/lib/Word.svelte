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
  fontSize: 60,
  fontFamily: 'EB Garamond',
  fillEnabled: true,
  fill: '#9E9EA1',
  stroke: 'black',
  strokeWidth: 1
}} />
