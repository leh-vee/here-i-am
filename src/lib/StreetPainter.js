// @ts-nocheck
import * as d3 from 'd3';

const blocksGeoJson = await d3.json("junction-and-environs-centreline.geojson");

export default class StreetPainter {

  static BLOCKS_GEO_JSON = blocksGeoJson;

  constructor(canvasEl, centreCoordinates, degreesRotation=0) {
    this.canvasContext = canvasEl.getContext('2d');
    this.canvasContext.lineWidth = 1;
    this.canvasContext.strokeStyle = '#9E9EA1';

    this.canvasWidth = this.canvasContext.canvas.clientWidth;
    this.canvasHeight = this.canvasContext.canvas.clientHeight; 

    this.projection = d3.geoMercator();
    this.projection.translate([this.canvasWidth / 2, this.canvasHeight / 2])
    this.adjustScale();
    this.projection.center(centreCoordinates);
    this.projection.clipExtent(this.clipExtentBounds());
    
    this.centrePointLatLng = centreCoordinates;
    this.canvasCentrePoint = this.projection(centreCoordinates);
    this.rotateCanvas(degreesRotation);

    this.totalSpiralSteps = null;
  }

  renderSpiralBySteps(remainingSteps = 400) {
    this.adjustScale(40000);
    this.rotateCanvas(25);
    this.renderGrid();

    if (this.totalSpiralSteps === null) this.totalSpiralSteps = remainingSteps;
    const totalSteps = this.totalSpiralSteps;
    const remainingStepsPercent = remainingSteps / totalSteps;

    const maxDelay = 300;
    const nextStepDelay = maxDelay * d3.easeExpIn(remainingStepsPercent); 

    if (remainingSteps > 0) {
      setTimeout(() => {
        this.renderSpiralBySteps(remainingSteps - 1);
      }, nextStepDelay);
    } 
  }

  renderGrid() {
    const geoGenerator = d3.geoPath()
      .projection(this.projection)
      .context(this.canvasContext);
    this.canvasContext.beginPath();
    geoGenerator({type: 'FeatureCollection', features: StreetPainter.BLOCKS_GEO_JSON.features})
    this.canvasContext.stroke();
  }

  blockDrawnIds = [];

  drawBlocksFromNode(nodeId) {
    const blocks = StreetPainter.getBlocksAtNode(nodeId);
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
 
    if (fromPoint[0] < 0 || fromPoint[0] > this.canvasWidth || fromPoint[1] < 0 || fromPoint[1] > this.canvasHeight) {
      return null;
    }
    const xDelta = toPoint[0] - fromPoint[0];
    const yDelta = toPoint[1] - fromPoint[1];
    
    const lineLength = Math.sqrt(xDelta ** 2 + yDelta ** 2);;
    const drawSpeed = d3.easeQuadIn(1 - this.blockDrawnIds.length / 200);
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
  
      this.canvasContext.beginPath();
      this.canvasContext.moveTo(...segmentStartPoint);
      this.canvasContext.lineTo(...segmentEndPoint);
      this.canvasContext.stroke();
  
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
    let newScale = StreetPainter.DEFAULT_SCALE_FACTOR;
    if (adjustment != 0) newScale = this.projection.scale() + adjustment;
    this.projection.scale(newScale);
  }

  rotateCanvas(degrees, fulcrum = this.canvasCentrePoint) {
    const fulcrumX = fulcrum[0];
    const fulcrumY = fulcrum[1];
    this.canvasContext.translate(fulcrumX, fulcrumY);
    this.canvasContext.rotate(degrees * Math.PI / 180); 
    this.canvasContext.translate(-fulcrumX, -fulcrumY);
  }
  
  clearCanvas() {
    this.canvasContext.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
  }
}