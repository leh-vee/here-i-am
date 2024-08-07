<script>
  import { Rect, Text } from 'svelte-konva';
  import { totalPoints } from '../stores/base';

  const height = 25;
  $: text = `${$totalPoints} pts`;
</script>

<Rect config={{
  x: 0,
  y: 0,
  width: window.innerWidth,
  height,
  fill: 'lightgrey',
  strokeWidth: 0,
  stroke: 'gold'
}} />
<Text config={{
  x: 0,
  y: 0,
  height, 
  width: window.innerWidth,
  align: 'right',
  verticalAlign: 'middle',
  fontSize: 15,
  padding: 10,
  fill: 'black',
  text,
  fontFamily: 'Wellfleet'
}} />