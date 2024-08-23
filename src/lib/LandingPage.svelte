<script>
  import { Stage, Layer, Ring, Circle, Text } from 'svelte-konva';
  import Konva from 'konva';
  import Title from './landing_page/Title.svelte';
  import Number from './landing_page/Number.svelte';
  import IntroCouplet from './landing_page/IntroCouplet.svelte';
  import MapTiles from './MapTiles.svelte';
  import { createEventDispatcher } from 'svelte';
  
  const dispatch = createEventDispatcher();

  const coordFixtures = [
    [-79.386788067996605, 43.670226390504098],
    [-79.497769710547999, 43.750492139210003],
    [-79.306775909005395, 43.705856672084899],
    [-79.466850201826205, 43.657227646269199]
  ];

  const height = window.innerHeight;
  const width = window.innerWidth;
  const yCentre = height / 2;
  const xCentre = width / 2;
  const diagonalRadius = Math.hypot(xCentre, yCentre);
  const coinRadius = Math.round((width / 2) * 0.8);
  const strokeWidth = 6;
  const markerRadius = 2;
  const goButtonRaidus = coinRadius / 2;

  let coinEl, coinOverflowEl, irisEl, markerEl;
  let isHeads = false;
  let isTails = false;

  let isTileMapLoading = true; 
  let isClosedCoin = false;
  let isGoButton = false;

  let coordIndex = 0;
  $: countdownNumber = 3 - coordIndex;
  $: groundZeroCoordsGcs = coordFixtures[coordIndex];
  $: isFinalLocation = coordIndex === 3;

  $: if (coinEl !== undefined) almostThereFlip();

  function almostThereFlip() {
    let nTotalFlips = 0;
    const flip = async () => { 
      nTotalFlips += 1;
      await flipCoin();
      if (isTileMapLoading || nTotalFlips < 3) {
        flip();
      } else {
        retractCoinOverflow();
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

  async function click() {
    const pointerPosition =  coinEl.getRelativePointerPosition();
    const ppPxDistanceFromCentre = Math.hypot(pointerPosition.x, pointerPosition.y);
    const isCoinClick = ppPxDistanceFromCentre < coinRadius - strokeWidth;
    if (isCoinClick) {
      if (isHeads) {
        isHeads = false;
        await flipCoin();
        openCoinTransition();
      } else if (isGoButton) {
        irisIn();
      }
    } 
  }

  function postIntroReveal() {
    if (isFinalLocation) {
      showGoButton();
    } else {
      closeCoinTransition();
    }
  }

  function showGoButton() {
    markerEl.to({
      duration: Math.PI / 10,
      radius: goButtonRaidus,
      easing: Konva.Easings.EaseIn,
      onFinish: () => {
        isGoButton = true;
      }
    })
  }

  function closeCoinTransition() {
    const duration = Math.PI / 10;
    markerEl.to({
      duration,
      radius: coinRadius,
      easing: Konva.Easings.EaseOut,
      onFinish: () => {
        isClosedCoin = true;
        setTimeout(() => {
          isClosedCoin = false;
          coinEl.innerRadius(0);
          markerEl.radius(0);
          isTails = false;
          coinOverflowEl.innerRadius(0);
          getNewGroundZeroCoords()
        }, Math.PI * 1000);
      }
    });
  }

  function retractCoinOverflow() {
    coinOverflowEl.to({
      duration: Math.PI / 10,
      innerRadius: diagonalRadius,
      easing: Konva.Easings.EaseOut
    });
  }

  function getNewGroundZeroCoords() {
    coordIndex += 1;
    isTileMapLoading = true;
    almostThereFlip();
  }

  function openCoinTransition() {
    const duration = Math.PI / 10;
    coinOverflowEl.innerRadius(coinRadius).outerRadius(coinRadius);
    const coinOlverflow = () => {
      coinOverflowEl.to({
        duration,
        outerRadius: diagonalRadius, 
        easing: Konva.Easings.EaseOut,
        onFinish: () => {
          isTails = true,
          markerEl.to({
            duration: Math.PI,
            radius: markerRadius
          });
        }
      });
    }
    coinEl.to({
      duration,
      innerRadius: coinRadius,
      easing: Konva.Easings.EaseIn,
      onFinish: () => { coinOlverflow() }
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

<MapTiles centreCoordsGcs={ groundZeroCoordsGcs } 
  on:loaded={ () => { isTileMapLoading = false } } />
<div id='landing-page'>
  <Stage config={{ width, height }} on:pointerclick={ click }>
    <Layer>
      <Ring config={{
        x: xCentre,
        y: yCentre,
        outerRadius: diagonalRadius,
        innerRadius: 0,
        fill: 'gold',
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
      <Circle config={{
        x: xCentre,
        y: yCentre,
        radius: 0,
        fill: 'black'
      }} bind:handle={ markerEl } />
      {#if isHeads}
        <Title />
      {/if}
      <IntroCouplet visible={ isTails } on:revealed={ postIntroReveal } />
      <Text config={{
        x: 0,
        y: 0,
        width: window.innerWidth,
        height: window.innerHeight,
        align: 'center',
        verticalAlign: 'middle',
        fontFamily: "Courier New",
        text: 'GO',
        fontSize: goButtonRaidus,
        visible: isGoButton,
        fill: 'lightgrey'
      }} />
      <Ring config={{
        x: xCentre,
        y: yCentre,
        fill: 'gold',
        outerRadius: diagonalRadius,
        innerRadius: diagonalRadius,
        strokeEnabled: false
      }} bind:handle={ irisEl } />
    </Layer>
  </Stage>
  <Number isVisible={ isClosedCoin } number={ countdownNumber } /> 
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