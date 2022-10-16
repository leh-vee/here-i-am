// @ts-nocheck
import * as d3 from 'd3';

const blocksGeoJson = await d3.json("/toronto-centreline-simple.geojson");

export default class StreetIllustrator {

  static BLOCKS_GEO_JSON = blocksGeoJson;
  static SCALE = 2700000;

  constructor(canvasEl, centrePoint) {
    this.ctx = canvasEl.getContext('2d');

    this.projection = d3.geoMercator();
    this.projection.translate([canvasEl.width / 2, canvasEl.height / 2])
    this.projection.scale(StreetIllustrator.SCALE);
    this.projection.center(centrePoint);
    this.projection.clipExtent([[0,0], [canvasEl.width, canvasEl.height]]);
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

    console.log('from point:', fromPoint)
 
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
}