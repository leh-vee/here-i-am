<script>
  import { Stage, Layer, Ring, Circle, Text } from 'svelte-konva';
  import Konva from 'konva';
  import Title from './landing_page/Title.svelte';
  import MapTiles from './MapTiles.svelte';
  import { createEventDispatcher } from 'svelte';
  import { fetchArtistStatements } from '../api/client.js';
  import { serializeCouplets } from '../utils/textJson.js';
  
  const dispatch = createEventDispatcher();

  let artistStatements, artistStatementIndex, artistStatement;
  fetchArtistStatements().then(lines => { 
    artistStatements = serializeCouplets(lines);
    artistStatementIndex = 0;
  });

  $: if (artistStatementIndex !== undefined) {
    artistStatement = artistStatements[artistStatementIndex];
  } 

  function cycleArtistStatement() {
    if (artistStatementIndex === artistStatements.length - 1) {
      artistStatementIndex = 0; 
    } else {
      artistStatementIndex += 1;
    }
  }

  const coordFixtures = [
    [-79.466850201826205, 43.657227646269199],
    [-79.327115097415998, 43.6919267876238], 
    [-79.541550900447305, 43.607307180951203],
    [-79.413797673100703, 43.641680243166597],
    [-79.500562196484097, 43.696934074491899],
    [-79.441953787130998, 43.691966449116798],
    [-79.460826261873095, 43.693347307108603]
  ];

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
    fontSize: Math.round(width / 30),
    fill: 'black'
  }

  let coinEl, coinOverflowEl, irisEl, markerEl;
  let isHeads = false;
  let isTails = false;
  let isFlipping;

  let isTileMapLoading = true; 

  $: if (coinEl !== undefined) { almostThereFlip() };

  function almostThereFlip() {
    let nTotalFlips = 0;
    isFlipping = true;
    const flip = async () => { 
      nTotalFlips += 1;
      await flipCoin();
      if (isTileMapLoading || nTotalFlips < 3) {
        flip();
      } else {
        retractCoinOverflow();
        isHeads = true;
        isFlipping = false;
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

  let timeoutToFlip = null;
  $: if (isTails) {
    timeoutToFlip = setTimeout(closeCoinTransition, Math.PI * 1000);
  }

  function closeCoinTransition() {
    const duration = Math.PI / 10;
    markerEl.to({
      duration,
      radius: coinRadius,
      easing: Konva.Easings.EaseOut,
      onFinish: () => {
        coinEl.innerRadius(0);
        markerEl.radius(markerRadius);
        isTails = false;
        coinOverflowEl.innerRadius(0);
        cycleArtistStatement();
        getNewGroundZeroCoords()
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
    if (coordIndex < coordFixtures.length - 1) {
      coordIndex += 1;
    } else {
      coordIndex = 0;
    }
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
        fill: 'lightgrey',
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
        visible: !isHeads
      }} bind:handle={ markerEl } />
      {#if isHeads}
        <Title />
      {:else if isTails}
        <Text config={{
          y: 0,
          height: window.innerHeight / 3,
          align: 'center',
          verticalAlign: 'middle',
          text: `...${artistStatement.a}`,
          ...questionTextAttrs
        }} />
        <Text config={{
          y: window.innerHeight - window.innerHeight / 3,
          height: window.innerHeight / 3,
          align: 'center',
          verticalAlign: 'middle',
          text: artistStatement.b,
          ...questionTextAttrs
        }} />
      {/if}
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