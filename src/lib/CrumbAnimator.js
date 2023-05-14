// @ts-nocheck
import * as d3 from 'd3';
import { Circle } from "konva/lib/shapes/Circle";

export default class CrumbAnimator {

  static DOT_ATTRS = {
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
    this.verse = verse;
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
    return new Promise(resolve => {
      const letterFeatures = this.getLetterCanvasFeatures();
      const nCrumbsTotal = letterFeatures.length;
      let nCrumbsToDrop = nCrumbsTotal;
      
      const dropCrumb = () => {
        let alphaCrumb = letterFeatures[nCrumbsTotal - nCrumbsToDrop];
        const [ xCoordLong, yCoordLong ] = alphaCrumb.canvasCoordinates;
        const { wordIndex } = alphaCrumb;
        let xCoord = Math.round(xCoordLong);
        let yCoord = Math.round(yCoordLong);
        const newMarker = this.createLetterCrumbMarker(wordIndex, xCoord, yCoord);
        this.layer.add(newMarker);
        nCrumbsToDrop--;
        if (nCrumbsToDrop > 0) {
          setTimeout(() => { dropCrumb() }, 50);
        } else {
          resolve(true);
        }
      }
      dropCrumb();
    });
  }

  getWordCanvasFeaturesForLine(lineIndex='a') {
    const line = this.verse[lineIndex];
    
    let yOffset = 25;
    let wordIndexOffset = 0;
    if (lineIndex === 'b') {
      yOffset = yOffset * 2;
      wordIndexOffset = this.verse.a.length;
    }
    
    const yCentre = this.layer.height() / 2;
    const yCoord = yCentre + yOffset;

    const nWords = line.length;
    const xDelta = this.layer.width() / nWords;
    const xOffset = xDelta / 2;

    const wordFeatures = [];    
    
    line.forEach((word, wordIndex) => {
      let xCoord = (xDelta * wordIndex) + xOffset;
      let wordFeature = {
        word,
        wordIndex: wordIndex + wordIndexOffset,
        lineIndex,
        canvasCoordinates: [xCoord, yCoord]
      }
      wordFeatures.push(wordFeature);
    });
    return wordFeatures;
  }

  getWordCanvasFeatures() {
    const aLineWordFeatures = this.getWordCanvasFeaturesForLine();
    const bLineWordFeatures = this.getWordCanvasFeaturesForLine('b');
    const features = [...aLineWordFeatures, ...bLineWordFeatures];
    console.log('word features', features);
    return features;
  }

  contract() {
    const wordFeatures = this.getWordCanvasFeatures();
    this.layer.children.forEach(circle => {
      let wordIndex = Number(circle.attrs.name);
      let toWordFeature = wordFeatures.find(f => f.wordIndex === wordIndex);
      let [ xToCoord, yToCoord ] = toWordFeature.canvasCoordinates;
      circle.to({
        x: xToCoord,
        y: yToCoord,
        duration: 10
      })
    });
  }

  createLetterCrumbMarker(wordIndex, x, y, radius=2) {
    const { colour: fill, opacity } = CrumbAnimator.DOT_ATTRS
    const newMarker = new Circle(
      { name: String(wordIndex), x, y, radius, fill, opacity }
    );
    return newMarker;
  }
}