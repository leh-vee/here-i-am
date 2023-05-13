// @ts-nocheck
import * as d3 from 'd3';
import { Circle } from "konva/lib/shapes/Circle";

export default class CrumbAnimator {

  static DOT_ATTRS = {
    radius: 2,
    opacity: 1, 
    colour: 'black'
  }

  static SCALE_FACTOR = 2700000;

  constructor(konvaLayer, centreCoordinates, trailGeoJson, verse) {
    this.layer = konvaLayer;

    this.projection = d3.geoMercator();
    this.projection.translate([this.layer.width() / 2, this.layer.height() / 2])
    this.projection.scale(CrumbAnimator.SCALE_FACTOR);
    this.projection.center(centreCoordinates);

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
      let radianDistanceTravelled = (index + 1) * radDistanceBetweenLetters;
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
    console.log('letter features', letterFeatures);
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
      const newMarker = this.createMarker(alphaCrumb.letter, xCoord, yCoord);
      this.layer.add(newMarker);
      nCrumbsToDrop--;
      if (nCrumbsToDrop > 0) setTimeout(() => { dropCrumb() }, 50);
    }
    dropCrumb();
  }

  createMarker(id, x, y) {
    const { radius, colour: fill, opacity } = CrumbAnimator.DOT_ATTRS
    const newMarker = new Circle(
      { name: 'marker', id, x, y, radius, fill, opacity }
    );
    return newMarker;
  }
}