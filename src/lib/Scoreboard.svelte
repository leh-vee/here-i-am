<script>
  import { Rect, Text, Group } from 'svelte-konva';
  import { totalPoints } from '../stores/base';

  // export let reveal = false;
  // export let hide = false;
  let scoreboardEl;

  const height = 25;
  const duration = 0.5;
  let y =  -height;

  $: text = `${$totalPoints} MIN READ`;
  
  // $: if (reveal) {
  //   const newY = 0;
  //   scoreboardEl.to({ 
  //     duration, 
  //     y: newY,
  //     onFinish: () => { y = newY }
  //   });
  // }

  // $: if (hide) {
  //   const newY = -height;
  //   scoreboardEl.to({ 
  //     duration, 
  //     y: newY,
  //     onFinish: () => { y = newY }
  //   });
  // }
</script>

<Group config={{ x: 0, y: 0 }} bind:handle={ scoreboardEl }>
  <Rect config={{
    width: window.innerWidth,
    height,
    fill: 'black',
    stroke: 'dimgrey',
    strokeWidth: 2
  }} />
  <Text config={{
    height, 
    width: window.innerWidth,
    align: 'left',
    verticalAlign: 'middle',
    fontSize: 15,
    padding: 10,
    fill: 'lightgrey',
    text,
    fontFamily: 'Arial'
  }} />
  <Text config={{
    height,
    y: -2,
    width: window.innerWidth,
    fontSize: 20,
    padding: 10,
    align: 'right',
    verticalAlign: 'middle',
    opacity: 0.5,
    fillEnabled: true,
    text: "🥧🥧🥧"
  }} />
</Group>