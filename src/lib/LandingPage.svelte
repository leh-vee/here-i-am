<script>
  import { Stage, Layer, Ring, Circle, Text, Image } from 'svelte-konva';
  import Konva from 'konva';
  import Title from './landing_page/Title.svelte';
  import MapTiles from './MapTiles.svelte';
  import { createEventDispatcher } from 'svelte';
  
  const dispatch = createEventDispatcher();

  const coordFixtures = [
    [-79.466850201826205, 43.657227646269199],
    [-79.327115097415998, 43.6919267876238], 
    [-79.541550900447305, 43.607307180951203],
    [-79.413797673100703, 43.641680243166597],
    [-79.500562196484097, 43.696934074491899],
    [-79.441953787130998, 43.691966449116798],
    [-79.460826261873095, 43.693347307108603]
  ];

  let autoFlipTimeout;

  let coordIndex = 0;
  $: groundZeroCoordsGcs = coordFixtures[coordIndex];

  const height = window.innerHeight;
  const width = window.innerWidth;
  const yCentre = height / 2;
  const xCentre = width / 2;
  const diagonalRadius = Math.hypot(xCentre, yCentre);

  const coinRadius = Math.round((height / 2) * 0.4);
  const strokeWidth = 6;

  const markerRadius = 2;

  const questionTextAttrs = {
    x: 5,
    width: width - 5,
    fontFamily: "Verdana, Geneva, Tahoma, sans-serif",
    fontSize: Math.round(width / 23),
    fill: 'black'
  }

  let coinEl, coinOverflowEl, irisEl, markerEl;
  let isHeads = false;
  let isTails = false;

  let isTileMapLoading = true; 

  $: if (coinEl !== undefined) { almostThereFlip() };

  let image = null;
  $: if (coinEl !== undefined) {
      const img = document.createElement("img");
      img.src = "https://lh6.ggpht.com/tu1t59ovtBhIUglagJ0fAXGvuFpVzn330fzbVQcDnxnEJ68he_dQ_R50Qb67VNtQhLg";
      img.onload = () => {
          image = img;
      };
  };

  function almostThereFlip() {
    let nTotalFlips = 0;
    const flip = async () => { 
      nTotalFlips += 1;
      await flipCoin();
      if (isTileMapLoading || nTotalFlips < 3) {
        flip();
      } else {
        retractFlow();
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
        clearTimeout(autoFlipTimeout);
        irisIn();
      }
    } 
  }

  function closeCoinTransition() {
    const duration = Math.PI / 10;
    markerEl.to({
      duration,
      radius: coinRadius,
      easing: Konva.Easings.EaseIn,
      onFinish: () => {
        coinEl.innerRadius(0);
        markerEl.radius(markerRadius);
        isTails = false;
        coinOverflowEl.innerRadius(0);
        getNewGroundZeroCoords()
      }
    });
  }

  function retractFlow() {
    coinOverflowEl.to({
      duration: Math.PI / 7,
      innerRadius: coinRadius,
      outerRadius: coinRadius,
      fill: 'black',
      easing: Konva.Easings.EaseOut
    });
  }

  function getNewGroundZeroCoords() {
    if (coordIndex < coordFixtures.length - 1) {
      coordIndex += 1;
    } else {
      coordIndex = 0;
    }
    almostThereFlip();
  }

  function openCoinTransition() {
    const duration = Math.PI / 10;
    const coinOlverflow = () => {
      coinOverflowEl.to({
        duration,
        outerRadius: diagonalRadius, 
        fill: 'gold',
        easing: Konva.Easings.EaseOut,
        onFinish: () => { isTails = true }
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

<MapTiles centreCoordsGcs={ groundZeroCoordsGcs } on:loaded={ mapTilesLoaded } />
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
        radius: markerRadius,
        fill: 'black',
        visible: isTails
      }} bind:handle={ markerEl } />
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
        <Text config={{
          y: 0,
          height: window.innerHeight / 3,
          align: 'center',
          verticalAlign: 'middle',
          text: '...an intersection in a city of \n intersections, destined at a crossroads',
          ...questionTextAttrs
        }} />
        <Text config={{
          y: (window.innerHeight / 3) * 2,
          height: window.innerHeight / 3,
          align: 'center',
          verticalAlign: 'middle',
          text: '...a countdown that never ends, until \n suddenly it does',
          ...questionTextAttrs
        }} />
        <Image config={{ 
          x: (window.innerWidth / 2) - 30,
          y: window.innerHeight - 70,
          width: 60,
          height: 60,
          image 
        }} on:pointerclick={ closeCoinTransition } /> 
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