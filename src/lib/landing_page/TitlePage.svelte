<script>
  import { Circle, Text } from 'svelte-konva';
  import FlippingCoin from './FlippingCoin.svelte';
  import Konva from 'konva';
  import { createEventDispatcher } from 'svelte';
  
  const dispatch = createEventDispatcher();

  export let stopCoinFlipIntro = false;
  let markerEl;
  let isShowTitleButton = false;

  const xCentre = window.innerWidth / 2;
  const yCentre = window.innerHeight / 2;
  const diagonalRadius = Math.hypot(xCentre, yCentre);
  
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

  function showMenu() {
    isTitleVisible = false;
    markerEl.to({
      duration: 1,
      scaleX: -markerEl.scaleX(),
      easing: Konva.Easings.StrongEaseInOut,
      onFinish: () => {
        dispatch('show-menu');
      }
    });
  }
  
  // function showSubtitle() {
  //   titleText = subtitle;
  //   fill = 'dimgrey';
  //   stroke = 'gold';
  //   buttonRadius -= strokeWidth;
  //   fontSize = Math.round(window.innerWidth / 10)
  // } 

  // function irisWipeOut() { 
  //   isTitleVisible = false;
  //   markerEl.to({
  //     duration: Math.PI / 10,
  //     radius: diagonalRadius,
  //     onFinish: () => { dispatch('go') }
  //   });
  // } 

  function showTitleButton() {
    isShowTitleButton = true;
  }
</script>


{#if isShowTitleButton}
  <Circle config={{
    x: xCentre,
    y: yCentre,
    fill: 'black',
    radius: buttonRadius,
    strokeWidth,
    stroke
  }} 
  bind:handle={ markerEl } />
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
    }} on:pointerclick={ showMenu } />
  {/if}
{:else}
  <FlippingCoin radius={ buttonRadius } strokeWidth={ strokeWidth }
    stop={ stopCoinFlipIntro } on:stopped={ showTitleButton } />
{/if}