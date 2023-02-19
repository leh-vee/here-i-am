// @ts-nocheck
import * as d3 from 'd3';

const blocksGeoJson = await d3.json("toronto-centreline-simple.geojson");

export default class BreadcrumbPainter {

  static BLOCKS_GEO_JSON = blocksGeoJson;
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

  blazeTrail(startingNodeId) {
    const C = BreadcrumbPainter;
    const trail = [];
    let nodeId = startingNodeId;
    while (nodeId !== null) {
      let paths = C.getBlocksAtNode(nodeId)
      let possiblePaths = paths.filter(possibleBlock => {
        let isNotTraveled = trail.every(trailBlock => {
          return trailBlock.properties.id != possibleBlock.properties.id;
        });
        return isNotTraveled;
      }); 
      let nPossiblePaths = possiblePaths.length;
      if (nPossiblePaths > 0) {
        let chosenPath = structuredClone(possiblePaths[C.getRandomInt(nPossiblePaths - 1)]);
        if (chosenPath.properties.from_node_id === nodeId) {
          nodeId = chosenPath.properties.to_node_id;
        } else {
          chosenPath.geometry.coordinates.reverse();
          nodeId = chosenPath.properties.from_node_id;
        }
        trail.push(chosenPath);
      } else {
        nodeId = null;
      }
    }
    // return C.trailFromNodeIds([13464314, 13464315, 14015159, 20120199, 20120204, 20120212, 13464450, 30105826, 30105823, 13464565, 13464610, 14020651, 14045962, 14045808, 14020651, 14044934, 14015268, 13465149, 13465205, 14020747, 14672870]);
    return trail;
  }

  getTrailGeoJson() {
    const trail = this.blazeTrail(13465772);
    const atomicTrail = [];
    let totalLength = 0;
    trail.forEach(block => {
      const nCoordinates = block.geometry.coordinates.length;
      if (nCoordinates > 2) {
        const blockCoordinates = block.geometry.coordinates;
        for (let index = 0; index < nCoordinates - 1; index++) {
          let blockCopy = structuredClone(block);
          blockCopy.geometry.coordinates = [blockCoordinates[index], blockCoordinates[index + 1]];
          blockCopy.properties.name += ` block ${index + 1} of ${nCoordinates - 1}`;
          let length = this.geoGenerator.measure(blockCopy);
          blockCopy.properties.length = this.geoGenerator.measure(blockCopy);
          totalLength += length;
          blockCopy.properties.totalLength = totalLength;
          atomicTrail.push(blockCopy);
        }
      } else {
        let length = this.geoGenerator.measure(block);
        block.properties.length = length;
        totalLength += length;
        block.properties.totalLength = totalLength; 
        atomicTrail.push(block);
      }
    });
    return atomicTrail;
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
    const trailGeoJson = this.getTrailGeoJson();
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

  renderGrid() {
    this.canvasContext.strokeStyle = 'purple';
    this.canvasContext.setLineDash([]);
    this.canvasContext.lineWidth = 1;
    this.canvasContext.beginPath();
    this.geoGenerator({type: 'FeatureCollection', features: BreadcrumbPainter.BLOCKS_GEO_JSON.features})
    this.canvasContext.stroke();
  }

  static getBlocksAtNode(nodeId) {
    const blocks = this.BLOCKS_GEO_JSON.features.filter(block => {
      const blockProps = block.properties;
      return blockProps.from_node_id === nodeId || blockProps.to_node_id === nodeId;
    })
    return blocks;
  }

  static trailFromNodeIds(ids) {
    const trail = [];
    const nNodes = ids.length;
    for (let i = 0; i < nNodes - 1; i++) {
      let fromNodeId = ids[i];
      let toNodeId = ids[i + 1];
      let reverseCoords = false;
      let block = this.BLOCKS_GEO_JSON.features.find(block => {
        let bProps = block.properties;
        let found = false;
        if (bProps.from_node_id === fromNodeId && bProps.to_node_id === toNodeId) {
          found = true;
        } else if (bProps.from_node_id === toNodeId && bProps.to_node_id === fromNodeId) {
          found = true;
          reverseCoords = true;
        }
        return found;
      });
      let blockCopy = structuredClone(block);
      if (reverseCoords) blockCopy.geometry.coordinates.reverse();
      trail.push(blockCopy);
    }
    return trail;
  }

  static getRandomInt(max) {
    let rando = Math.floor(Math.random() * (max + 1));
    return rando;
  }
}