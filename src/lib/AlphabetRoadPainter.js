// @ts-nocheck
import { routeFromNodeIds } from './CityBlockGeoJsonGenerator';
// import { getAlphabetTrail } from './BreadcrumbDropper'; 
import * as d3 from 'd3';

export default class BreadcrumbPainter {

  static SCALE_FACTOR = 2700000;

  constructor(canvasEl, centreCoordinates) {
    this.canvasContext = canvasEl.getContext('2d');
    this.canvasContext.lineWidth = 1;

    this.canvasWidth = this.canvasContext.canvas.clientWidth;
    this.canvasHeight = this.canvasContext.canvas.clientHeight; 

    this.projection = d3.geoMercator();
    this.projection.translate([this.canvasWidth / 2, this.canvasHeight / 2])
    this.projection.scale(BreadcrumbPainter.SCALE_FACTOR);
    this.projection.center(centreCoordinates);

    this.geoGenerator = d3.geoPath()
      .projection(this.projection)
      .context(this.canvasContext);
    
    this.centrePointLatLng = centreCoordinates;
    this.canvasCentrePoint = this.projection(centreCoordinates);
  }

  getLetterCanvasFeatures(words, trailGeoJson) {
    const letterFeatures = [];
    const trail = trailGeoJson;
    words.forEach((word, wordIndex) => {
      let letters = word.split('');
      letters.forEach((letter, letterIndex) => {
        let letterFeature = {
          word,
          wordIndex,
          letter,
          letterIndex,
          canvasCoordinates:  [100, 200]
        };
        letterFeatures.push(letterFeature);
      });
    });
    const nLetters = letterFeatures.length;
    // this should be a getter after the constructor creates the trail
    const pxTrailLength = trailGeoJson[trailGeoJson.length - 1].properties.totalLength;
    const pxDeltaBetweenLetters = pxTrailLength / nLetters;
    letterFeatures.forEach((letterFeature, index) => {
      let pxDistanceTravelled = index * pxDeltaBetweenLetters;
      let letterBlock = trailGeoJson.find(block => {
        let { totalLength } = block.properties;
        return pxDistanceTravelled <= totalLength;   
      });
      let pxTrailDistanceAtBlocksEnds = letterBlock.properties.totalLength;
      let pxBlockLength = letterBlock.properties.length;
      let pxBlockRemainder = pxTrailDistanceAtBlocksEnds - pxDistanceTravelled; 
      let percentBlockRemainder = pxBlockRemainder / pxBlockLength;
      let [pointA, pointB] = letterBlock.geometry.coordinates; 
      let interpolator = d3.geoInterpolate(pointA, pointB);
      let letterPointGeoCoords = interpolator(1 - percentBlockRemainder);
      letterFeature.geometry = {
        type: "Point",
        coordinates: letterPointGeoCoords
      }
      letterFeature.canvasCoordinates = this.projection(letterPointGeoCoords);
    });
    console.log('letter canvas features', letterFeatures); 
    return letterFeatures;
  }

  renderTrail(verseWords) {
    const C = BreadcrumbPainter;
    const routeGeoJson = routeFromNodeIds(C.TRAILS_AS_NODE_IDS[3]);
    this.cacheBlockLengths(routeGeoJson);

      // let breadcrumbdropper = new BreadcrumbDropper(trailGeoJson, verse);
      // breadcrumbDroppper.getAlphabetTrail();
    const letterFeatures = this.getLetterCanvasFeatures(verseWords, trailGeoJson);
    const nCrumbsTotal = letterFeatures.length;
    let nCrumbsToDrop = nCrumbsTotal;
    
    const dropCrumb = () => {
      let alphaCrumb = letterFeatures[nCrumbsTotal - nCrumbsToDrop];
      let xCoord = Math.round(alphaCrumb.canvasCoordinates[0]);
      let yCoord = Math.round(alphaCrumb.canvasCoordinates[1]);
      this.canvasContext.beginPath();
      this.canvasContext.arc(xCoord, yCoord, 2, 0, 2 * Math.PI);
      this.canvasContext.fill();
      nCrumbsToDrop--;
      if (nCrumbsToDrop > 1) setTimeout(() => { dropCrumb() }, 50);
    }
    dropCrumb();
  }

  cacheBlockLengths(blocksGeoJson) {
    let routeLengthPx = 0;
    blocksGeoJson.forEach(block => {
      let blockLengthPx = this.geoGenerator.measure(block);
      block.properties.blockLengthPx = blockLengthPx;
      routeLengthPx += blockLengthPx;
      block.properties.routeLengthPx = routeLengthPx; 
    });
    return blocksGeoJson;
  }

  // renderGrid() {
  //   this.canvasContext.strokeStyle = 'purple';
  //   this.canvasContext.setLineDash([]);
  //   this.canvasContext.lineWidth = 1;
  //   this.canvasContext.beginPath();
  //   this.geoGenerator({type: 'FeatureCollection', features: BreadcrumbPainter.BLOCKS_GEO_JSON.features})
  //   this.canvasContext.stroke();
  // }
}