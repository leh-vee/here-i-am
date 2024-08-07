<script>
  import { Rect, Text } from 'svelte-konva';
  import { totalPoints } from '../stores/base';

  export let reveal = false;
  export let hide = false;
  let textEl, rectEl;

  const height = 25;
  let y = -height;
  const duration = Math.PI / 10;

  $: text = `${$totalPoints} pts`;
  
  $: if (reveal) {
    const newY = 0;
    rectEl.to({ duration, y: newY });
    textEl.to({ 
      duration, 
      y: newY,
      onFinish: () => { y = newY }
    });
  }

  $: if (hide) {
    const newY = -height;
    rectEl.to({ duration, y: newY });
    textEl.to({ 
      duration, 
      y: newY,
      onFinish: () => { y = newY }
    });
  }

  const fontFamily = "digital";
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
  strokeWidth: 0
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