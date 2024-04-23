<script>
  import { Layer, Circle, Text } from 'svelte-konva';
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  const xCentre = window.innerWidth / 2;
  const yCentre = window.innerHeight / 2;
  const buttonRadius = Math.round(xCentre * 0.7);
  const diagonalRadius = Math.hypot(xCentre, yCentre);

  let button;
  let stroke = 'dimgrey';
  let fill = 'gold';
  let fontSize = Math.round(window.innerWidth / 5);

  const title = "Here\nI Am";
  const subtitle = "Our\nFallen\nGang";
  let titleText = title;
  let isTitleVisible = true;
  let isTitleFontLoaded = false;
  
  document.fonts.load("12px Love Ya Like A Sister", "a").then(() =>{
    isTitleFontLoaded = true;
  });
  
  function btnPressed() {
    titleText = subtitle;
    fill = 'dimgrey';
    stroke = 'gold';
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
  <Circle config={{
    x: xCentre,
    y: yCentre,
    fill: 'black',
    radius: buttonRadius,
    strokeWidth: 6,
    stroke
  }} 
  on:pointerdown={ btnPressed }
  on:pointerup={ btnDepressed }
  bind:handle={ button } />
  {#if isTitleFontLoaded && isTitleVisible} 
    <Text config={{
      x: 0,
      y: 0,
      width: window.innerWidth,
      height: window.innerHeight,
      align: 'center',
      verticalAlign: 'middle',
      text: titleText,
      fontFamily: 'Love Ya Like A Sister',
      fontSize,
      fill
    }} 
    on:pointerdown={ btnPressed }
    on:pointerup={ btnDepressed }
    />
  {/if}
</Layer>