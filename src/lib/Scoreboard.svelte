<script>
  import { Rect, Text } from 'svelte-konva';
  import { totalPoints } from '../stores/base';

  export let reveal = false;
  export let hide = false;
  let textEl, rectEl;

  const height = 25;
  let y =  -height;

  $: text = `${$totalPoints} pts`;
  
  $: if (reveal) {
    const duration = Math.PI;
    const newY = 0;
    rectEl.to({ duration, y: newY });
    textEl.to({ 
      duration, 
      y: newY,
      onFinish: () => { y = newY }
    });
  }

  $: if (hide) {
    const duration = Math.PI / 10;
    const newY = -height;
    rectEl.to({ duration, y: newY });
    textEl.to({ 
      duration, 
      y: newY,
      onFinish: () => { y = newY }
    });
  }

  const fontFamily = 'Courier New';
  let isFontLoaded = false;
  document.fonts.ready.then((fontFaceSet) => {
    const fontFaces = [...fontFaceSet];
    const fontFamilyFaces = fontFaces.filter(f => f.family === fontFamily);
    Promise.all(fontFamilyFaces.map(ff => ff.load())).then(() => { 
      isFontLoaded = true;
    });
  });
</script>

<Rect config={{
  x: 0,
  y,
  width: window.innerWidth,
  height,
  fill: 'white',
  storke: 'white',
  strokeWidth: 1,
  shadowColor: 'gold',
  shadowOffsetY: 1,
  shadowOpacity: 1,
  shadowBlur: 5
}} bind:handle={ rectEl } />
{#if isFontLoaded}
  <Text config={{
    x: 0,
    y,
    height, 
    width: window.innerWidth,
    align: 'right',
    verticalAlign: 'middle',
    fontSize: 15,
    padding: 10,
    fill: 'black',
    text,
    fontFamily
  }} bind:handle={ textEl } />
{/if}

<!-- <style>
  p {
    font-family: 'Courier New', Courier, monospace;
  }
</style> -->