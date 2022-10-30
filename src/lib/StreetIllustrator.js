// @ts-nocheck
import * as d3 from 'd3';

const blocksGeoJson = await d3.json("junction-and-environs-centreline.geojson");

export default class StreetIllustrator {

  static BLOCKS_GEO_JSON = blocksGeoJson;

  constructor(canvasEl, centrePoint) {
    this.ctx = canvasEl.getContext('2d');

    this.canvasWidth = canvasEl.width;
    this.canvasHeight = canvasEl.height;

    this.projection = d3.geoMercator();
    this.projection.translate([canvasEl.width / 2, canvasEl.height / 2])
    this.adjustScale();
    this.projection.center(centrePoint);
    this.projection.clipExtent(this.clipExtentBounds());

    this.centrePointLatLng = centrePoint;
    this.canvasCentrePoint = this.projection(centrePoint);
  }

  renderSpiralBySteps(remainingSteps = 1000) {
    this.adjustScale(100000);
    this.ctx.translate(...this.canvasCentrePoint);
    this.ctx.rotate(29 * Math.PI / 180); 
    this.ctx.translate(-this.canvasCentrePoint[0], -this.canvasCentrePoint[1]);
    this.renderGrid();

    if (remainingSteps > 0) {
      setTimeout(() => {
        this.renderSpiralBySteps(remainingSteps - 1);
      }, 1);
    } 
  }

  renderGrid() {
    const geoGenerator = d3.geoPath()
      .projection(this.projection)
      .context(this.ctx);
    this.ctx.beginPath();
    geoGenerator({type: 'FeatureCollection', features: StreetIllustrator.BLOCKS_GEO_JSON.features})
    this.ctx.stroke();
  }

  blockDrawnIds = [];

  drawBlocksFromNode(nodeId) {
    const blocks = StreetIllustrator.getBlocksAtNode(nodeId);
    blocks.forEach(block => {
      this.drawBlock(block, nodeId);
    });
  }

  drawBlock(blockFeature, startNodeId) {
    const blockProps = blockFeature.properties;
    
    if (this.blockDrawnIds.includes(blockProps.id)) return null;
  
    let lineCoordinates = blockFeature.geometry.coordinates;
    const drawBackwards = startNodeId === blockProps.to_node_id;
    let endNodeId = blockProps.to_node_id;
  
    if (drawBackwards) {
      const lineCoordinatesCopy = [...lineCoordinates];
      lineCoordinates = [...lineCoordinatesCopy.reverse()];
      endNodeId = blockProps.from_node_id;
    }
  
    const blockAnimeProps = {
      id: blockProps.id,
      coordinates: lineCoordinates,
      endNodeId: endNodeId
    }
  
    this.animateBlockLine(blockAnimeProps)
  
    this.blockDrawnIds.push(blockProps.id);
  }

  animateBlockLine(blockAnimeProps, pointIndex = 0) {
    const lineCoordinates = blockAnimeProps.coordinates;
    const linesCount = lineCoordinates.length - 1;
    const isLastLineInBlock = pointIndex === linesCount - 1;
  
    const fromPoint = this.projection(lineCoordinates[pointIndex]);
    const toPoint = this.projection(lineCoordinates[pointIndex + 1]);
 
    if (fromPoint[0] < 0 || fromPoint[0] > 390 || fromPoint[1] < 0 || fromPoint[1] > 844) {
      return null;
    }
    const xDelta = toPoint[0] - fromPoint[0];
    const yDelta = toPoint[1] - fromPoint[1];
    
    const lineLength = Math.sqrt(xDelta ** 2 + yDelta ** 2);
    const segmentLength = 1;
    const segmentPercentOfLineLength = segmentLength / lineLength;
  
    const xSegmentDelta = xDelta * segmentPercentOfLineLength;
    const ySegmentDelta = yDelta * segmentPercentOfLineLength; 
  
    const totalFrames = Math.ceil(lineLength / segmentLength);
  
    let frameIndex = 0;
  
    const drawSegment = () => {
      const isFinalFrame = frameIndex === totalFrames - 1;
  
      const segmentStartPoint = [
        fromPoint[0] + (xSegmentDelta * frameIndex),
        fromPoint[1] + (ySegmentDelta * frameIndex)
      ];
  
      let segmentEndPoint;
      if (isFinalFrame) {
        segmentEndPoint = toPoint;
      } else {
        segmentEndPoint = [
          segmentStartPoint[0] + xSegmentDelta,
          segmentStartPoint[1] + ySegmentDelta
        ]
      }
  
      this.ctx.beginPath();
      this.ctx.moveTo(...segmentStartPoint);
      this.ctx.lineTo(...segmentEndPoint);
      this.ctx.stroke();
  
      if (isFinalFrame) {
        if (isLastLineInBlock) {
          this.drawBlocksFromNode(blockAnimeProps.endNodeId);
        } else {
          this.animateBlockLine(blockAnimeProps, pointIndex + 1);
        }
        return true;
      } else {
        frameIndex = frameIndex + 1;
      }
      
      requestAnimationFrame(drawSegment)
    }
  
    drawSegment();
  }

  static getBlocksAtNode(nodeId) {
    const blocks = this.BLOCKS_GEO_JSON.features.filter(block => {
      const blockProps = block.properties;
      return blockProps.from_node_id === nodeId || blockProps.to_node_id === nodeId;
    })
    return blocks;
  }

  clipExtentBounds() {
    const canvasWidthHeightDelta = this.canvasHeight - this.canvasWidth;
    const x0 = -canvasWidthHeightDelta;
    const y0 = 0;
    const x1 = this.canvasHeight;
    const y1 = this.canvasHeight;
    return [[x0, y0],[x1, y1]];
  }

  static DEFAULT_SCALE_FACTOR = 2700000;

  adjustScale(adjustment = 0) {
    let newScale = StreetIllustrator.DEFAULT_SCALE_FACTOR;
    if (adjustment != 0) newScale = this.projection.scale() + adjustment;
    this.projection.scale(newScale);
  }
}