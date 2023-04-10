<script>
  import { currentVerseIndex, currentVerse, lastPiSlice, isFirstVerseTriad } from './store.js';
  import TreeOfLifeJsonGenerator from './lib/TreeOfLifeJsonGenerator.js';
  import CityBlockGeoJsonGenerator from './lib/CityBlockGeoJsonGenerator.js';
  import EllipsisPainter from './lib/EllipsisPainter.js';
  import StreetPainter from './lib/StreetPainter.js';
  import VerseNumberIllustrator from './lib/VerseNumberIllustrator.js';

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
    konvaEl: null,
    canvasEl: null
  };

  const stateOfEscape = {
    fromSefirot: null,
    toSefirot: null 
  }

  $: if (blockGenerator && screenProps.frameEl) { 
    movements.elliplitcalCollapse = true; 
    console.log("Enter verse", $currentVerseIndex);
    stateOfEscape.fromSefirot = treeOfLife.getSefirotByIndex($lastPiSlice);
    stateOfEscape.toSefirot = treeOfLife.getSefirotByIndex($currentVerse.piSlice);
  }

  let ellipsisPainter;
  $: if (movements.elliplitcalCollapse && screenProps.konvaEl) {
    const { konvaEl: el, width, height } = screenProps;
    ellipsisPainter = new EllipsisPainter(el, width, height);
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

  // $: if (blockGenerator) {
  //   let trail = blockGenerator.blazeTrail(fromSefirotId, toSefirotId);
  // }

  // $: if (movements.alphabetRoad) {
    // const { canvasEl: el } = screenProps;
    // const AlphabetRoadGenerator = new BreadcrumbPainter(intersectionCoordinates);
    // const verseWords = [...$currentVerse.a, ...$currentVerse.b];
    // breadcrumbPainter.renderTrail(verseWords)
  // }

</script>

<div class='screen' bind:this={screenProps.frameEl}>
  <div bind:this={screenProps.konvaEl}></div>
  <canvas
    bind:this={screenProps.canvasEl}
    width={screenProps.width}
    height={screenProps.height}
  ></canvas>
</div>

<!-- div class='screen'>
  <div class='breadcrumb layer' bind:this={screen.konvaEl}></div>
  <canvas
    class='street layer'
    bind:this={screen.streetCanvasEl}
    width={screen.width}
    height={screen.height}
  ></canvas>
  <canvas
    class='trail layer'
    bind:this={screen.trailCanvasEl}
    width={screen.width}
    height={screen.height}
  ></canvas>
</div -->

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