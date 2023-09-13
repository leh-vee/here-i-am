<script>
  import { currentPiSlice, currentVerse, currentVerseIndex, lastPiSlice, isFirstVerseTriad, wordIndices } from './store.js';
  import CityBlockGeoJsonGenerator from './lib/CityBlockGeoJsonGenerator.js';
  import EllipsisPainter from './lib/EllipsisPainter.js';
  import StreetPainter from './lib/StreetPainter.js';
  import VerseNumberIllustrator from './lib/VerseNumberIllustrator.js';
  import CrumbAnimator from './lib/CrumbAnimator.js';
  import Konva from 'konva/lib/Core';
  import Word from './lib/Word.svelte';
  import Controller from './lib/Controller.svelte';
  import Timer from './lib/Timer.svelte';
  import Ilan from './lib/Ilan.js';

  const PROJECTION_SCALE = 2700000;

  const movements = {
    countDown: false,
    alphabetRoad: false,
    poeticContraction: false,
    wordByWord: false,
    elliplitcalCollapse: false, 
    subLinearCrawl: false
  }; 

  const screenProps = {
    width: window.innerWidth,
    height: window.innerHeight,
    frameEl: null,
    canvasEl: null,
    konvaEl: null,
    konvaStage: null
  };

  const konvaLayer = new Konva.Layer();
  const blockGenerator = new CityBlockGeoJsonGenerator();
  let ilan;
  $: if (screenProps.frameEl) { 
    const { konvaEl, width, height } = screenProps;
    screenProps.konvaStage = new Konva.Stage({
      container: konvaEl, width, height
    });
    ilan = new Ilan(screenProps.width, screenProps.height, PROJECTION_SCALE); 
    screenProps.konvaStage.add(konvaLayer);
    movements.elliplitcalCollapse = true; // don't start collapse until the sefirot locations are set
  }

  let ellipsisPainter;
  $: if (movements.elliplitcalCollapse) {
    ellipsisPainter = new EllipsisPainter(konvaLayer);
    ellipsisPainter.animate().then(complete => {
      movements.elliplitcalCollapse = false;
      movements.subLinearCrawl = true;
    });
  }

  $: if (movements.subLinearCrawl) {
    const { canvasEl: el } = screenProps;
    const { coordinates, nodeId } = ilan.sephira($lastPiSlice);
    let channels = ilan.channelsForSephira($lastPiSlice);
    const streetPainter = new StreetPainter(el, coordinates, channels);
    streetPainter.drawBlocksFromNode(nodeId);
    setTimeout(() => {
      streetPainter.clearCanvas();
      ellipsisPainter.clearCanvas();
      movements.subLinearCrawl = false;
      movements.countDown = true;
    }, 15000);
  }

  $: if (movements.countDown) {
    const verseNumberIllustrator = new VerseNumberIllustrator(screenProps.canvasEl);
    verseNumberIllustrator.render($currentPiSlice, $isFirstVerseTriad);
    setTimeout(() => {
      verseNumberIllustrator.clearCanvas();
      movements.countDown = false;
      movements.alphabetRoad = true;
    }, 5000);
  }

  let crumbAnimator;
  $: if (movements.alphabetRoad) {
    const konvaLayer = new Konva.Layer();
    screenProps.konvaStage.add(konvaLayer);
    crumbAnimator = new CrumbAnimator(
      konvaLayer, blockGenerator.blazeTrail(), $currentVerse, $currentVerseIndex);
    crumbAnimator.dropLetterCrumbs().then(complete => {
      movements.alphabetRoad = false;
      movements.poeticContraction = true;
    });
  }

  $: if (movements.poeticContraction) {
    crumbAnimator.gatherLetterCrumbs().then(complete => {
      movements.poeticContraction = false;
      movements.wordByWord = true;
    });
  }

  $: if (movements.wordByWord && $wordIndices) {
    const crumbVerseIndex = crumbAnimator.getVerseIndex();
    let { wordIndex, line } = $wordIndices;
    if ($currentVerseIndex === crumbVerseIndex) {
      crumbAnimator.highlightWordCrumb(wordIndex, line === 'b');
    } else {
      setTimeout(() => {
        movements.wordByWord = false;
        crumbAnimator.clearCanvas();
        movements.elliplitcalCollapse = true;
      }, 0);
    }
  }

</script>

<div class='screen' bind:this={screenProps.frameEl}>
  <div bind:this={screenProps.konvaEl}></div>
  <canvas
    bind:this={screenProps.canvasEl}
    width={screenProps.width}
    height={screenProps.height}
  ></canvas>
  {#if movements.wordByWord}
    <Timer /> 
    <Word />
    <Controller />
  {/if} 
</div>

<style>
  .screen {
    width: 100%;
    height: 100%;
  }

  canvas {
    position: absolute;
    left: 0;
    top: 0;
  }
</style>