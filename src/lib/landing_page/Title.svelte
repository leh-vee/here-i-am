<script>
  import { Text } from 'svelte-konva';

  const title = "Here\nI Am";
  const fontFamily = "Love Ya Like A Sister";
  const fontSize = Math.round(window.innerHeight / 9);
  const fill = 'gold';

  // const subtitle = "Our\nFallen\nGang";
  // function showSubtitle() {
  //   titleText = subtitle;
  //   fill = 'dimgrey';
  //   stroke = 'gold';
  //   buttonRadius -= strokeWidth;
  //   fontSize = Math.round(window.innerWidth / 10)
  // } 

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
    width: window.innerWidth,
    height: window.innerHeight,
    align: 'center',
    verticalAlign: 'middle',
    text: title,
    fontFamily,
    fontSize,
    fill
  }} />
{/if}