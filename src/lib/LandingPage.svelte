<script>
  import { Stage, Layer, Ring, Circle, Text } from 'svelte-konva';
  import Konva from 'konva';
  import Title from './landing_page/Title.svelte';
  import MapTiles from './MapTiles.svelte';
  import { createEventDispatcher } from 'svelte';
  
  const dispatch = createEventDispatcher();

  const groundZeroCoordsGcs = [-79.466850201826205, 43.657227646269199];

  const height = window.innerHeight;
  const width = window.innerWidth;
  const yCentre = height / 2;
  const xCentre = width / 2;
  const diagonalRadius = Math.hypot(xCentre, yCentre);

  const coinRadius = Math.round((height / 2) * 0.4);
  const strokeWidth = 6;

  const questionTextAttrs = {
    fontFamily: "Verdana, Geneva, Tahoma, sans-serif",
    fontSize: Math.round(width / 12),
    fill: 'black'
  }

  let coinEl, coinOverflowEl, irisEl;
  let isHeads = false;
  let isTails = false;

  let isTileMapLoading = true; 

  $: if (coinEl !== undefined) { introFlip() };

  function introFlip() {
    let nTotalFlips = 0;
    const flip = async () => { 
      nTotalFlips += 1;
      await flipCoin();
      if (isTileMapLoading || nTotalFlips < 3) {
        flip();
      } else {
        isHeads = true;
      }
    }
    flip();
  }
  
  function flipCoin() {
    return new Promise((resolve) => {
      coinEl.to({
        duration: 1,
        scaleX: -coinEl.scaleX(),
        easing: Konva.Easings.StrongEaseInOut,
        onFinish: () => { 
          resolve(true);
        } 
      });
    });
  }

  function mapTilesLoaded() { isTileMapLoading = false }

  async function click() {
    const pointerPosition =  coinEl.getRelativePointerPosition();
    const ppPxDistanceFromCentre = Math.hypot(pointerPosition.x, pointerPosition.y);
    const isCoinClick = ppPxDistanceFromCentre < coinRadius - strokeWidth;
    if (isCoinClick) {
      if (isHeads) {
        isHeads = false;
        await flipCoin();
        openCoinTransition();
      } else if (isTails) {
        irisIn();
      }
    } 
  }

  function openCoinTransition() {
    const duration = Math.PI / 10;
    const openIris = () => {
      coinOverflowEl.to({
        duration,
        innerRadius: diagonalRadius,
        opacity: 1, 
        fill: 'gold',
        easing: Konva.Easings.EaseOut,
        onFinish: () => { isTails = true }
      });
    }
    coinEl.to({
      duration,
      innerRadius: coinRadius,
      easing: Konva.Easings.EaseIn,
      onFinish: () => { openIris() }
    });
  }

  function irisIn() {
    irisEl.to({
      duration: 1,
      easing: Konva.Easings.EaseIn,
      innerRadius: 0,
      fill: 'black',
      onFinish: () => { dispatch('go') } 
    });
  }

</script>

<MapTiles centreCoordsGcs={ groundZeroCoordsGcs } on:loaded={ mapTilesLoaded } />
<div id='landing-page'>
  <Stage config={{ width, height }} on:pointerclick={ click }>
    <Layer>
      <Ring config={{
        x: xCentre,
        y: yCentre,
        outerRadius: coinRadius,
        innerRadius: coinRadius,
        fill: 'black',
        opacity: 0,
        strokeEnabled: false
      }} bind:handle={ coinOverflowEl } />
      <Ring config={{
        x: xCentre,
        y: yCentre,
        outerRadius: coinRadius,
        innerRadius: 0,
        fill: 'black',
        strokeWidth,
        stroke: 'dimgrey'
      }} bind:handle={ coinEl } />
      <Ring config={{
        x: xCentre,
        y: yCentre,
        fill: 'gold',
        outerRadius: diagonalRadius,
        innerRadius: diagonalRadius,
        strokeEnabled: false
      }} bind:handle={ irisEl } />
      {#if isHeads}
        <Title />
      {:else if isTails}
        <Circle config={{
          x: xCentre,
          y: yCentre,
          radius: Math.PI,
          fill: 'black'
        }} />
        <Text config={{
          x: 0,
          y: 0,
          width,
          height: window.innerHeight / 3,
          align: 'center',
          verticalAlign: 'middle',
          text: '...an intersection in a city of intersections, destined at a crossroads',
          ...questionTextAttrs
        }} />
        <Text config={{
          x: 0,
          y: (window.innerHeight / 3) * 2,
          width,
          height: window.innerHeight / 3,
          align: 'center',
          verticalAlign: 'middle',
          text: '...a countdown that never ends, until it does',
          ...questionTextAttrs
        }} />
      {/if}
    </Layer>
  </Stage> 
</div> 

<style>
  #landing-page {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
</style>