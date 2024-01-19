<script>
  import { Line, Circle, Wedge, Layer, Text, Arc } from 'svelte-konva';
  import { tick } from 'svelte';
  import Konva from 'konva';
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
  let iris;
  const chargeDuration = Math.PI / 2;
  const diagonalRadius = Math.hypot(xCentre, yCentre);
  $: verseNumber = String($currentPiSlice);

  $: fromCoordsGsc = $sefirotPoints.features[$lastPiSlice].geometry.coordinates;
  $: fromCoordsPx = $ilanProjection(fromCoordsGsc);
  $: toCoordsGsc = $sefirotPoints.features[$currentPiSlice].geometry.coordinates;
  $: toCoordsPx = $ilanProjection(toCoordsGsc);

  $: isVerseIndex = Number.isInteger($currentVerseIndex);

  $: isFirstVerse = isVerseIndex && $currentVerseIndex === 0;

  $: if (isVerseIndex && newPathway && go) {
    nova();
  }

  function nova() {
    wedge.to({
      duration: isFirstVerse ? Math.PI / 10 : 0,
      radius: diagonalRadius,
      opacity: 0
    });
    iris.to({
      duration: isFirstVerse ? Math.PI / 5 : 0,
      easing: Konva.Easings.EaseOut,
      innerRadius: diagonalRadius,
      onFinish: () => { leaderWipe() }
    });
  } 

  function leaderWipe() {
    wedge.angle(0);
    wedge.rotation(-90);
    wedge.opacity(0);
    wedge.radius(initialToSefirahRadius - 3); 
    verseNumberText.visible(true);
    wedge.to({
      duration: Math.PI, 
      angle: 90,
      rotation: 450,
      opacity: 0.5,
      onFinish: () => { 
        leaderWipeOut();
      }
    });
  }

  function leaderWipeOut() {
    wedge.to({
      duration: Math.PI, 
      angle: 0,
      rotation: 900,
      opacity: 0,
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
  <Arc config={{
    x: xCentre, 
    y: yCentre,
    angle: 360,
    rotation: -90,
    innerRadius: initialToSefirahRadius,
    outerRadius: diagonalRadius,
    fill: 'black',
    visible: isFirstVerse
  }} bind:handle={iris} />
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
    strokeWidth: 6
  }} bind:handle={toSefirah} />
  <Wedge config={{
    x: xCentre,
    y: yCentre,
    radius: 1,
    angle: 360,
    rotation: -90, 
    fill: 'gold',
    strokeEnabled: false,
    opacity: 1
  }} bind:handle={wedge} />
  <Text config={{
    x: 0,
    y: 0,
    text: verseNumber,
    width: window.innerWidth,
    height: window.innerHeight / 1.5,
    align: 'center',
    verticalAlign: 'bottom',
    fontSize: 200,
    fill: 'black',
    strokeEnabled: false, 
    visible: false
  }} bind:handle={verseNumberText} />
</Layer>
