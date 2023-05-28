<script>
  import { currentVerseIndex, currentVerse, lastPiSlice, isFirstVerseTriad } from './store.js';
  import TreeOfLifeJsonGenerator from './lib/TreeOfLifeJsonGenerator.js';
  import CityBlockGeoJsonGenerator from './lib/CityBlockGeoJsonGenerator.js';
  import EllipsisPainter from './lib/EllipsisPainter.js';
  import StreetPainter from './lib/StreetPainter.js';
  import VerseNumberIllustrator from './lib/VerseNumberIllustrator.js';
  import CrumbAnimator from './lib/CrumbAnimator.js';
  import Konva from 'konva/lib/Core';

  const currentLocation = null;
  const treeOfLife = new TreeOfLifeJsonGenerator(currentLocation);
  const blockGenerator = new CityBlockGeoJsonGenerator(treeOfLife);

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

  const stateOfEscape = {
    fromSefirot: null,
    toSefirot: null,
    trail: null
  }

  $: if (blockGenerator && screenProps.frameEl) { 
    const { konvaEl, width, height } = screenProps;
    screenProps.konvaStage = new Konva.Stage({
      container: konvaEl, width, height
    });
    movements.elliplitcalCollapse = true;
    console.info("Enter verse", $currentVerseIndex);
    const fromSefirotId = $lastPiSlice;
    const toSefirotId = $currentVerse.piSlice;
    stateOfEscape.fromSefirot = treeOfLife.getSefirotByIndex(fromSefirotId);
    stateOfEscape.toSefirot = treeOfLife.getSefirotByIndex(toSefirotId);
    stateOfEscape.trail = blockGenerator.blazeTrail(fromSefirotId, toSefirotId);
  }

  let ellipsisPainter;
  $: if (movements.elliplitcalCollapse && screenProps.konvaEl) {
    const konvaLayer = new Konva.Layer();
    screenProps.konvaStage.add(konvaLayer);
    ellipsisPainter = new EllipsisPainter(konvaLayer);
    ellipsisPainter.animate().then(complete => {
      movements.elliplitcalCollapse = false;
      movements.subLinearCrawl = true;
    });
  }

  $: if (movements.subLinearCrawl && screenProps.canvasEl) {
    const { canvasEl: el } = screenProps;
    const { coordinates, nodeId } = stateOfEscape.fromSefirot;
    const streetPainter = new StreetPainter(el, coordinates);
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
    verseNumberIllustrator.render($currentVerse.piSlice, $isFirstVerseTriad);
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
    const { toSefirot, trail } = stateOfEscape;
    crumbAnimator = new CrumbAnimator(
      konvaLayer, toSefirot.coordinates, trail, $currentVerse);
    crumbAnimator.renderTrail().then(complete => {
      movements.alphabetRoad = false;
      movements.poeticContraction = true;
    });
  }

  $: if (movements.poeticContraction) {
    crumbAnimator.contract().then(complete => {
      movements.poeticContraction = false;
      movements.wordByWord = true;
    });
  }

  $: if (movements.wordByWord) {
    console.log('Word by word...')
  }

</script>

<div class='screen' bind:this={screenProps.frameEl}>
  <div bind:this={screenProps.konvaEl}></div>
  <canvas
    bind:this={screenProps.canvasEl}
    width={screenProps.width}
    height={screenProps.height}
  ></canvas>
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