<script>
  import { Text } from 'svelte-konva';
  import { currentWord } from '../stores/text.js';
</script>

<Text config={{
  text: $currentWord,
  width: window.innerWidth,
  height: window.innerHeight,
  align: 'center',
  verticalAlign: 'middle',
  fontSize: 60,
  fillEnabled: true,
  fill: '#9E9EA1',
  stroke: 'black',
  strokeWidth: 1
}} />
