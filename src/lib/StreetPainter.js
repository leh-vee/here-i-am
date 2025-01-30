export default class StreetPainter {

  constructor(canvasEl, projection, blocks) {
    this.blocks = blocks;
    this.nTotalBlocks = this.blocks.features.length;
    this.projection = projection;

    this.canvasContext = canvasEl.getContext('2d');
    this.canvasContext.lineWidth = 1;
    this.canvasContext.strokeStyle = 'gold';

    this.canvasWidth = this.canvasContext.canvas.clientWidth;
    this.canvasHeight = this.canvasContext.canvas.client = projection;
  }

  drawnBlockIds = [];

  percentDrawn() {
    const nDrawnBlocks = this.drawnBlockIds.length;
    return nDrawnBlocks / this.nTotalBlocks;
  }

  undrawnBlocks() {
    const undrawn = this.blocks.features.filter(block => {
      return !this.drawnBlockIds.includes(block.id);
    });
    return undrawn;
  }

  getUndrawnBlocksAtNode(nodeId) {
    const blocks = this.undrawnBlocks().filter(block => {
      const blockProps = block.properties;
      return blockProps.from_street_node_id === nodeId || blockProps.to_street_node_id === nodeId;
    });
    return blocks;
  }

  async drawBlocksFromNode(nodeId) {
    return new Promise(async (resolve) => {
      const blocks = this.getUndrawnBlocksAtNode(nodeId);
      const allDrawPromises = [];
      blocks.forEach(async block => {
        const drawPromise = new Promise(async (resolve) => {
          this.drawnBlockIds.push(block.id);
          const drawnBlockProps = await this.drawBlock(block, nodeId);
          await this.drawBlocksFromNode(drawnBlockProps.endNodeId);
          resolve(true);
        });
        allDrawPromises.push(drawPromise);
      });
      await Promise.all(allDrawPromises);
      resolve(this.undrawnBlocks());
    });
  }

  async drawBlock(block, startNodeId) {
    const blockProps = block.properties;
    let blockCoords = [...block.geometry.coordinates];
    let endNodeId = blockProps.to_street_node_id;
    if (startNodeId === endNodeId) {
      blockCoords = blockCoords.reverse();
      endNodeId = blockProps.from_street_node_id;
    }
    const nPointsInLine = blockCoords.length - 1;
    const blockDrawSpeed = Math.max(0.5, 1 - this.percentDrawn());
    let startPointIndex = 0;
    return new Promise(async (resolve) => {
      while (startPointIndex < nPointsInLine) {
        let vectorCoords = [blockCoords[startPointIndex], blockCoords[startPointIndex + 1]];
        await this.animateVector(vectorCoords, blockDrawSpeed);
        startPointIndex+= 1;
      }
      resolve({ id: block.id, endNodeId });
    });
  }

  animateVector(coords, segmentLength) {
    return new Promise((resolve) => {
    
      const fromPoint = this.projection(coords[0]);
      const toPoint = this.projection(coords[1]);
   
      const xDelta = toPoint[0] - fromPoint[0];
      const yDelta = toPoint[1] - fromPoint[1];
      
      const lineLength = Math.sqrt(xDelta ** 2 + yDelta ** 2);
      
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
          resolve(true);
        } else {
          frameIndex = frameIndex + 1;
          requestAnimationFrame(drawSegment);
        }
      }
      drawSegment();
    });
  }
}