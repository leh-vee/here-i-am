// @ts-nocheck
import * as d3 from 'd3';

export default class CrumbAnimator {

  static SCALE_FACTOR = 2700000;

  constructor(canvasEl, centreCoordinates, trailGeoJson, verse) {
    this.canvasContext = canvasEl.getContext('2d');
    this.canvasContext.lineWidth = 1;

    this.canvasWidth = this.canvasContext.canvas.clientWidth;
    this.canvasHeight = this.canvasContext.canvas.clientHeight; 

    this.projection = d3.geoMercator();
    this.projection.translate([this.canvasWidth / 2, this.canvasHeight / 2])
    this.projection.scale(CrumbAnimator.SCALE_FACTOR);
    this.projection.center(centreCoordinates);

    this.geoGenerator = d3.geoPath()
      .projection(this.projection)
      .context(this.canvasContext);
    
    this.centrePointLatLng = centreCoordinates;
    this.canvasCentrePoint = this.projection(centreCoordinates);

    this.trail = trailGeoJson;
    this.words = [...verse.a, ...verse.b];
  }

  getLetterCanvasFeatures() {
    const letterFeatures = [];
    this.words.forEach((word, wordIndex) => {
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
    const radianTrailLength = this.trail[this.trail.length - 1].properties.totalLengthRad;
    const radDistanceBetweenLetters = radianTrailLength / nLetters;
    letterFeatures.forEach((letterFeature, index) => {
      let radianDistanceTravelled = index * radDistanceBetweenLetters;
      let letterBlock = this.trail.find(block => {
        let { totalLengthRad } = block.properties;
        return radianDistanceTravelled <= totalLengthRad;   
      });
      let radTrailDistanceAtBlocksEnds = letterBlock.properties.totalLengthRad;
      let radBlockLength = letterBlock.properties.lengthRad;
      let radBlockRemainder = radTrailDistanceAtBlocksEnds - radianDistanceTravelled; 
      let percentBlockRemainder = radBlockRemainder / radBlockLength;
      let [pointA, pointB] = letterBlock.geometry.coordinates; 
      let interpolator = d3.geoInterpolate(pointA, pointB);
      let letterPointGeoCoords = interpolator(1 - percentBlockRemainder);
      letterFeature.geometry = {
        type: "Point",
        coordinates: letterPointGeoCoords
      }
      letterFeature.canvasCoordinates = this.projection(letterPointGeoCoords);
    });
    return letterFeatures;
  }

  renderTrail() {
    const letterFeatures = this.getLetterCanvasFeatures();
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
}