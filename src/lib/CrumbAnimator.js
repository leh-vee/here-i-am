// @ts-nocheck
import * as d3 from 'd3';
import { Circle } from "konva/lib/shapes/Circle";

export default class CrumbAnimator {

  static DOT_ATTRS = {
    opacity: 1, 
    colour: 'black'
  }

  constructor(konvaLayer, trailGeoJson, verse, verseIndex) {
    this.layer = konvaLayer;
    this.layerScale = 3;
    this.layer.scale({x: this.layerScale, y: this.layerScale });

    this.projection = d3.geoMercator().fitSize(
      [this.layer.width(), this.layer.height()], 
      { "type": "FeatureCollection", "features": trailGeoJson }
    );
    this.trail = trailGeoJson;
    this.verse = verse;
    this.verseIndex = verseIndex;
    this.letterFeatures = this.getLetterCanvasFeatures();
  }

  getLetterCanvasFeatures() {
    const letterFeatures = [];
    const verseWords = [...this.verse.a, ...this.verse.b];
    verseWords.forEach((word, wordIndex) => {
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

  centrePointOnStage(coordinates) {
    const scale = this.layerScale;
    const { x: xDeltaFromOrigin, y: yDeltaFromOrigin } = this.layer.position();
    const xFrom = (this.layer.width() / 2) - xDeltaFromOrigin; 
    const yFrom = (this.layer.height() / 2) - yDeltaFromOrigin; 
    const { x: xTo, y: yTo } = coordinates; 
    const xMoveBy = (xFrom - (xTo * scale)); 
    const yMoveBy = (yFrom - (yTo * scale));  
    this.layer.move({ x: xMoveBy, y: yMoveBy });
    return true;
  }

  renderTrail() {
    return new Promise(resolve => {
      const nCrumbsTotal = this.letterFeatures.length;
      let nCrumbsToDrop = nCrumbsTotal;
      
      const dropCrumb = () => {
        let alphaCrumb = this.letterFeatures[nCrumbsTotal - nCrumbsToDrop];
        const [ xCoordLong, yCoordLong ] = alphaCrumb.canvasCoordinates;
        const { wordIndex } = alphaCrumb;
        let xCoord = Math.round(xCoordLong);
        let yCoord = Math.round(yCoordLong);
        const newMarker = this.createLetterCrumbMarker(wordIndex, xCoord, yCoord);
        this.layer.add(newMarker);
        nCrumbsToDrop--;
        if (nCrumbsToDrop > 0) {
          setTimeout(() => { 
            dropCrumb();
            this.centrePointOnStage({ x: xCoord, y: yCoord });
          }, 1000);
        } else {
          resolve(true);
        }
      }
      dropCrumb();
    });
  }

  getWordCanvasFeaturesForLine(lineIndex='a') {
    const line = this.verse[lineIndex];
    
    let yOffset = 25 / this.layerScale;
    let wordIndexOffset = 0;
    if (lineIndex === 'b') {
      yOffset = yOffset * 2;
      wordIndexOffset = this.verse.a.length;
    }

    const { x: xDeltaFromOrigin, y: yDeltaFromOrigin } = this.layer.position();
    const yCentreCoord = ((this.layer.height() / 2) - yDeltaFromOrigin) / this.layerScale;
    const yCoord = yCentreCoord + yOffset;
    
    const xLeftMargin = -xDeltaFromOrigin / this.layerScale; 
    const nWords = line.length;
    const xDelta = (this.layer.width() / this.layerScale) / nWords;
    const xOffset = xDelta / 2;

    const wordFeatures = [];    
    
    line.forEach((word, wordIndex) => {
      let xCoord = xLeftMargin + (xDelta * wordIndex) + xOffset;
      let wordFeature = {
        word,
        wordIndex: wordIndex + wordIndexOffset,
        lineIndex,
        canvasCoordinates: [xCoord, yCoord],
        nLettersContracted: 0
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
    return new Promise(resolve => {
      const wordFeatures = this.getWordCanvasFeatures();
      const letterCrumbMarkers = this.layer.children;
      const nLettersTotal = letterCrumbMarkers.length;
      let nLettersContractedTotal = 0;
      letterCrumbMarkers.forEach(letterCrumb => {
        let wordIndex = Number(letterCrumb.attrs.name);
        let toWordFeature = wordFeatures.find(f => f.wordIndex === wordIndex);
        let [ xToCoord, yToCoord ] = toWordFeature.canvasCoordinates;
        letterCrumb.to({
          x: xToCoord,
          y: yToCoord,
          duration: Math.floor(Math.random() * 2),
          onFinish: () => {
            toWordFeature.nLettersContracted++;
            if (toWordFeature.nLettersContracted > 1) {
              letterCrumb.destroy();
            } else {
              letterCrumb.setAttrs({
                id: letterCrumb.name(), // id becomes the index of the word in the verse
                name: toWordFeature.word
              });
            }
            nLettersContractedTotal++;
            if (nLettersContractedTotal === nLettersTotal) {
              resolve(true);
            } 
          }
        })
      });
    });
  }

  highlightWordCrumb(wordIndex, isLineB) {
    let index = wordIndex;
    if (isLineB) {
      const nWordsLineA = this.verse.a.length;
      index += nWordsLineA;
    } 
    const wordCrumb = this.layer.findOne(`#${index}`);
    this.layer.children.forEach(crumb => { 
      crumb.radius(2 / this.layerScale);
    });
    wordCrumb.radius(4 / this.layerScale);
  }

  createLetterCrumbMarker(wordIndex, x, y, radius=2) {
    const scaledRadius = radius / this.layerScale;
    const { colour: fill, opacity } = CrumbAnimator.DOT_ATTRS
    const newMarker = new Circle(
      { name: String(wordIndex), x, y, radius: scaledRadius, fill, opacity }
    );
    return newMarker;
  }

  getVerseIndex() {
    return this.verseIndex;
  }

  clearCanvas() {
    this.layer.destroyChildren();
  }
}