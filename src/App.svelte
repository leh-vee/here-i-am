<script>
  import { currentVerseIndex, currentVerse, lastPiSlice, wordIndices } from './store.js';
  import CityBlockGeoJsonGenerator from './lib/CityBlockGeoJsonGenerator.js';

  const blockGenerator = new CityBlockGeoJsonGenerator();
  $: if (blockGenerator) {
    console.log("Enter verse (at index)", $currentVerseIndex);
    let fromSefirotId = $lastPiSlice;
    let toSefirotId = $currentVerse.piSlice;
    let trail = blockGenerator.blazeTrail(fromSefirotId, toSefirotId);
  }

  $: if ($currentVerseIndex > -1) {
    // const toCrossroadsIndex = $currentVerse.piSlice;
    // const fromCrossRoadsIndex = $lastPiSlice;
    // const trailGeoJson = BlockGeoGenerator.blazeTrail(fromCrossRoadsIndex, toCrossroadsIndex);
    // breadcrumbGeoJson = BreadcrumbGenerator(trailGeoJson, verse);
  }

  const movements = {
    countDown: true,
    alphabetRoad: false,
    poeticContraction: false,
    wordByWord: false,
    ellipsis: false, 
    subLinearCrawl: false
  } 

  const screenProps = {
    width: window.innerWidth,
    height: window.innerHeight,
    canvasEl: null
  };

  // $: if (movements.countDown && screenProps.canvasEl) {
  //   // const verseNumberIllustrator = new VerseNumberIllustrator(screenProps.canvasEl);
  //   verseNumberIllustrator.render($currentVerse.piSlice, $isFirstVerseTriad);
  //   setTimeout(() => {
  //     verseNumberIllustrator.clearCanvas();
  //     movements.countDown = false;
  //     movements.alphabetRoad = true;
  //   }, 1000);
  // }

  $: if (movements.alphabetRoad) {
    const { canvasEl: el } = screenProps;
    debugger;

    // const AlphabetRoadGenerator = new BreadcrumbPainter(intersectionCoordinates);
    // const verseWords = [...$currentVerse.a, ...$currentVerse.b];
    // breadcrumbPainter.renderTrail(verseWords)
  }

  // $: if (screen.konvaEl) {
  //   const { konvaEl: el, width, height } = screen;
  //   const ellipsisPainter = new EllipsisPainter(el, width, height);
  //   ellipsisPainter.animate().then(complete => {
  //     movements.subLinearCrawl = true;
  //   });
  // }

  // $: if (movements.subLinearCrawl && screen.streetCanvasEl) {
  //   const { streetCanvasEl: el } = screen;
  //   const highParkAndHumberside = [ -79.466850201826219, 43.657227646269199 ];
  //   const streetPainter = new StreetPainter(el, highParkAndHumberside);
  //   streetPainter.drawBlocksFromNode(13465772);
  //   verseMovements.alphabetRoad = true;
  // }

</script>

<div class='screen'>
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