<script>
  import { Stage, Layer, Circle, Text } from 'svelte-konva';
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
    console.log('button pressed');
    titleText = subtitle;
    fill = 'dimgrey';
    stroke = 'gold';
    fontSize = Math.round(window.innerWidth / 10)
  } 

  function btnDepressed() { 
    console.log('button depressed');
    isTitleVisible = false;
    button.to({
      duration: Math.PI / 10,
      radius: diagonalRadius,
      onFinish: () => { dispatch('go') }
    });
  } 
</script>

<div id='landing-page'>
  <Stage config={{ width: window.innerWidth, height: window.innerHeight }}>
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
  </Stage>
</div>

<style>
  div#landing-page {
    width: 100%;
    height: 100%;
    background-image: url("/toronto-lines.png");
    background-size: cover;
  }

  /* #title-wrapper {
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    user-select: none;
  }

  .title {
    font-family: 'Love Ya Like A Sister';
    font-size: 8lvh;
    color: gold;
    font-weight: bold;
    text-decoration: none;z-index: 2;
  } */

  /* .sub.title {
    font-size: 4lvh;
    color: dimgrey;
  } */
  
  /* button#go {
    background: black;
    text-align: center;
    width: calc( var(--diameter) * 1px );
    height: calc( var(--diameter) * 1px );
    border-radius: 100%;
    display: inline-flex;
    flex-direction: column;
    flex-grow: 0;
    justify-content: center;
    align-items: center;
    transition:
    width calc( var(--transDuration) * 1s) ease-in,
    height calc( var(--transDuration) * 1s) ease-in;
    user-select: none;
    --webkit-touch-callout: none;
    --webkit-tap-highlight-color: rgba(0,0,0,0);
  }
</style>