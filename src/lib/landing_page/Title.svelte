<script>
  import { Text } from 'svelte-konva';
  import { screenWidth, screenHeight } from '../../stores/base';

  const title = "Here\nI Am";
  const fontFamily = "Love Ya Like A Sister";
  const fontSize = Math.round($screenWidth / 4.5);
  const fill = 'gold';

  let isTitleFontLoaded = false;

  document.fonts.ready.then((fontFaceSet) => {
    const fontFaces = [...fontFaceSet];
    const loveYaFontFaces = fontFaces.filter(f => f.family === fontFamily);
    Promise.all(loveYaFontFaces.map(ff => ff.load())).then(() => { 
      isTitleFontLoaded = true;
    });
  });
</script>

{#if isTitleFontLoaded}
  <Text config={{
    x: 0,
    y: 0,
    width: $screenWidth,
    height: $screenHeight,
    align: 'center',
    verticalAlign: 'middle',
    text: title,
    fontFamily,
    fontSize,
    fill
  }} />
{/if}