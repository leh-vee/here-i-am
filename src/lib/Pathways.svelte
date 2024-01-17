<script>
  import { Line, Circle, Wedge, Layer, Text } from 'svelte-konva';
  import { tick } from 'svelte';
  import { ilanProjection, ilanBlocks, sefirotPoints } from '../stores/treeOfLife.js';
  import { currentVerseIndex, lastPiSlice, currentPiSlice } from '../stores/text.js';
  import { createEventDispatcher } from 'svelte';
  import StreetMap from './StreetMap.svelte';

  const dispatch = createEventDispatcher();
  const xCentre = window.innerWidth / 2;
  const yCentre = window.innerHeight / 2;
  
  export let go = false;
  let newPathway;
  let fromSefirah;
  let toSefirah;
  let newPathwayCoordinates = [0, 0, 0, 0];
  let wedge;
  let verseNumberText;
  const chargeDuration = Math.PI / 2;
  $: verseNumber = String($currentPiSlice);

  $: fromCoordsGsc = $sefirotPoints.features[$lastPiSlice].geometry.coordinates;
  $: fromCoordsPx = $ilanProjection(fromCoordsGsc);
  $: toCoordsGsc = $sefirotPoints.features[$currentPiSlice].geometry.coordinates;
  $: toCoordsPx = $ilanProjection(toCoordsGsc);

  $: isVerseIndex = Number.isInteger($currentVerseIndex);

  $: if (isVerseIndex && newPathway && go) {
    setTimeout(() => {
      leaderWipe();
    }, 1000);
  } 

  function leaderWipe() {
    wedge.to({
      duration: Math.PI / 2, 
      angle: 360,
      onFinish: () => { 
        wedge.destroy();
        verseNumberText.destroy();
        setHole();
      }
    });
  }

  function setHole() {
    toSefirah.to({
      duration: Math.PI / 2,
      radius: 3,
      strokeWidth: 1,
      x: toCoordsPx[0],
      y: toCoordsPx[1],
      onFinish: () => {
        sendCharge();
      }
    });
  }

  async function sendCharge() {
    let endCoords = [...fromCoordsPx, ...toCoordsPx];
    newPathwayCoordinates = [...fromCoordsPx, ...fromCoordsPx];
    await tick();
    fromSefirah.to({
      radius: 0,
      opacity: 0,
      duration: chargeDuration
    });
    newPathway.to({
      points: endCoords,
      opacity: 1,
      duration: chargeDuration,
      onFinish: receiveCharge
    });
  }

  function receiveCharge() {
    toSefirah.to({
      fill: 'gold',
      duration: chargeDuration
    });
    const endCoords = [...toCoordsPx, ...toCoordsPx];
    newPathway.to({
      points: endCoords,
      opacity: 0,
      duration: chargeDuration,
      onFinish: () => {
        dispatch('blazed');
      }
    });
  }

  const initialToSefirahRadius = Math.round(xCentre * 0.7);
</script>

<Layer>
  <StreetMap blocksGeoJson= { $ilanBlocks } projection={ $ilanProjection } />
  <Circle config={{
    x: fromCoordsPx[0],
    y: fromCoordsPx[1],
    radius: 0,
    opacity: 1,
    fill: 'gold'
  }} bind:handle={fromSefirah} />
  <Line config={{
    points: newPathwayCoordinates,
    stroke: 'gold',
    strokeWidth: 2,
    opacity: 0,
    lineCap: 'round'
  }} bind:handle={newPathway} />
  <Circle config={{
    x: xCentre,
    y: yCentre,
    fill: 'black',
    radius: initialToSefirahRadius,
    opacity: 1,
    stroke: 'dimgrey',
    strokeWidth: 5
  }} bind:handle={toSefirah} />
  <Text config={{
    x: 0,
    y: 0,
    text: verseNumber,
    width: window.innerWidth,
    height: window.innerHeight / 1.5,
    align: 'center',
    verticalAlign: 'bottom',
    fontSize: 200,
    fillEnabled: false,
    fill: 'grey',
    stroke: 'dimgrey',
    strokeWidth: 4
  }} bind:handle={verseNumberText} />
  <Wedge config={{
    x: xCentre,
    y: yCentre,
    radius: initialToSefirahRadius - 5,
    angle: 0,
    rotation: -90, 
    fill: 'gold',
    strokeEnabled: false,
    opacity: 0.5
  }} bind:handle={wedge} />
</Layer>
