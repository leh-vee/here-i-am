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
      console.log("possible paths", possiblePaths);
      let nPossiblePaths = possiblePaths.length;
      console.log("n", nPossiblePaths);
      if (nPossiblePaths > 0) {
        const chosenPath = possiblePaths[C.getRandomInt(nPossiblePaths - 1)];
        trail.push(chosenPath);
        if (chosenPath.properties.from_node_id === nodeId) {
          nodeId = chosenPath.properties.to_node_id;
        } else {
          nodeId = chosenPath.properties.from_node_id;
        }
      } else {
        nodeId = null;
      }
      console.log("trail", trail);
    }
    return trail;
  }

  renderTrail() {
    const geoGenerator = d3.geoPath()
      .projection(this.projection)
      .context(this.canvasContext);
    this.canvasContext.setLineDash([1, 5]);
    this.canvasContext.lineWidth = 5;
    this.canvasContext.beginPath();
    const trail = this.blazeTrail(13464314);
    geoGenerator({type: 'FeatureCollection', features: trail})
    this.canvasContext.stroke();
  }

  renderGrid() {
    const geoGenerator = d3.geoPath()
      .projection(this.projection)
      .context(this.canvasContext);
    this.canvasContext.strokeStyle = 'purple';
    this.canvasContext.setLineDash([]);
    this.canvasContext.lineWidth = 1;
    this.canvasContext.beginPath();
    const trail = this.blazeTrail(13464314);
    geoGenerator({type: 'FeatureCollection', features: BreadcrumbPainter.BLOCKS_GEO_JSON.features})
    this.canvasContext.stroke();
  }

  static getBlocksAtNode(nodeId) {
    const blocks = this.BLOCKS_GEO_JSON.features.filter(block => {
      const blockProps = block.properties;
      return blockProps.from_node_id === nodeId || blockProps.to_node_id === nodeId;
    })
    return blocks;
  }

  static getRandomInt(max) {
    let rando = Math.floor(Math.random() * (max + 1));
    console.log('rando', rando);
    return rando;
  }
}