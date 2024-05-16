<script>
  import { Layer, Circle, Text } from 'svelte-konva';
  import { sefirotPoints } from '../stores/treeOfLife.js';
  import { fetchBlocksForProjection } from '../api/client.js';
  import { projectionForLandingPage } from '../utils/projections.js';
  import StreetMap from './StreetMap.svelte';
  import { createEventDispatcher } from 'svelte';
  
  const dispatch = createEventDispatcher();

  const screenPx = {
    width: window.innerWidth,
    height: window.innerHeight
  }
  
  let projection, blocks;
  $: if ($sefirotPoints) {
    setMapData();
  }

  async function setMapData() {
    projection = projectionForLandingPage($sefirotPoints, screenPx);
    blocks = await fetchBlocksForProjection(projection, screenPx);
  }

  const xCentre = window.innerWidth / 2;
  const yCentre = window.innerHeight / 2;
  const diagonalRadius = Math.hypot(xCentre, yCentre);
  
  let button;
  let buttonRadius = Math.round(xCentre * 0.7);
  let stroke = 'dimgrey';
  let strokeWidth = 6;
  let fill = 'gold';
  let fontSize = Math.round(window.innerWidth / 5);
  const fontFamily = "Love Ya Like A Sister";

  const title = "Here\nI Am";
  const subtitle = "Our\nFallen\nGang";
  let titleText = title;
  let isTitleVisible = true;
  let isTitleFontLoaded = false;

  document.fonts.ready.then((fontFaceSet) => {
    const fontFaces = [...fontFaceSet];
    const loveYaFontFaces = fontFaces.filter(f => f.family === fontFamily);
    Promise.all(loveYaFontFaces.map(ff => ff.load())).then(() => { 
      isTitleFontLoaded = true;
    });
  });
  
  function btnPressed() {
    titleText = subtitle;
    fill = 'dimgrey';
    stroke = 'gold';
    buttonRadius -= strokeWidth;
    fontSize = Math.round(window.innerWidth / 10)
  } 

  function btnDepressed() { 
    isTitleVisible = false;
    button.to({
      duration: Math.PI / 10,
      radius: diagonalRadius,
      onFinish: () => { dispatch('go') }
    });
  } 

</script>

<Layer>
  {#if projection && blocks}
    <StreetMap blocksGeoJson= { blocks } 
      projection={ projection } colour='white' />
    <Circle config={{
      x: xCentre,
      y: yCentre,
      fill: 'black',
      radius: buttonRadius,
      strokeWidth,
      stroke
    }} 
    bind:handle={ button } />
    {#if isTitleVisible && isTitleFontLoaded} 
      <Text config={{
        x: 0,
        y: 0,
        width: window.innerWidth,
        height: window.innerHeight,
        align: 'center',
        verticalAlign: 'middle',
        text: titleText,
        fontFamily,
        fontSize,
        fill
      }} />
      <Circle config={{
        x: xCentre,
        y: yCentre,
        opacity: 0,
        radius: buttonRadius + strokeWidth,
        strokeEnabled: false
      }} 
        on:pointerdown={ btnPressed }
        on:pointerup={ btnDepressed }
      />
    {/if}
  {/if}
</Layer>