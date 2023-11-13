// @ts-nocheck
import * as d3 from 'd3';

export default class StreetPainter {

  constructor(canvasEl, projection, blocks) {
    this.blocks = blocks;
    this.projection = projection;

    this.canvasContext = canvasEl.getContext('2d');
    this.canvasContext.lineWidth = 1;
    this.canvasContext.strokeStyle = '#9E9EA1';

    this.canvasWidth = this.canvasContext.canvas.clientWidth;
    this.canvasHeight = this.canvasContext.canvas.client = projection
  }

  blockDrawnIds = [];

  drawBlocksFromNode(nodeId) {
    const blocks = this.getBlocksAtNode(nodeId);
    blocks.forEach(block => {
      this.drawBlock(block, nodeId);
    });
  }

  drawBlock(blockFeature, startNodeId) {
    const blockProps = blockFeature.properties;
    
    if (this.blockDrawnIds.includes(blockFeature.id)) return null;
  
    let lineCoordinates = blockFeature.geometry.coordinates;
    const drawBackwards = startNodeId === blockProps.to_street_node_id;
    let endNodeId = blockProps.to_street_node_id;
  
    if (drawBackwards) {
      const lineCoordinatesCopy = [...lineCoordinates];
      lineCoordinates = [...lineCoordinatesCopy.reverse()];
      endNodeId = blockProps.from_street_node_id;
    }
  
    const blockAnimeProps = {
      id: blockFeature.id,
      coordinates: lineCoordinates,
      endNodeId: endNodeId
    }
  
    this.animateBlockLine(blockAnimeProps)
  
    this.blockDrawnIds.push(blockFeature.id);
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

  getBlocksAtNode(nodeId) {
    const blocks = this.blocks.features.filter(block => {
      const blockProps = block.properties;
      return blockProps.from_street_node_id === nodeId || blockProps.to_street_node_id === nodeId;
    })
    return blocks;
  }
}