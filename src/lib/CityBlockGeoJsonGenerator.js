// @ts-nocheck
import * as d3 from 'd3';

const toronto = await d3.json("toronto-centreline-simple.geojson");
const junction = await d3.json("junction-and-environs-centreline.geojson");

export default class CityBlockGeoJsonGenerator {
  constructor(treeOfLifeNodes) {
    this.K = CityBlockGeoJsonGenerator;
    this.treeOfLifeNodes = this.treeOfLifeNodes;
  } 

  blazeTrail(fromSefirotId, toSefirotId) {
    const mockTrailNodeIds = this.K.mockTrailsByEndNode[toSefirotId];
    const streetTrail = this.routeFromNodeIds(mockTrailNodeIds);
    const blockTrail = this.K.splitMultiLineFeatures(streetTrail);
    const trail = this.K.computeLineLengths(blockTrail);
    return trail;
  }

  routeFromNodeIds(ids) {
    const route = [];
    const nNodes = ids.length;
    for (let i = 0; i < nNodes - 1; i++) {
      let fromNodeId = ids[i];
      let toNodeId = ids[i + 1];
      let reverseCoords = false;
      let block = toronto.features.find(block => {
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
      route.push(blockCopy);
    }
    return route;
  }

  static computeLineLengths(geoJson) {
    let totalLength = 0;
    geoJson.forEach(line => {
      let lineLength = d3.geoLength(line);
      line.properties.lengthRad = lineLength;
      totalLength += lineLength;
      line.properties.totalLengthRad = totalLength; 
    }); 
    return geoJson;
  }

  static splitMultiLineFeatures(geoJson) {
    const splitGeoJson = [];
    geoJson.forEach(block => {
      const nCoordinates = block.geometry.coordinates.length;
      if (nCoordinates > 2) {
        const blockCoordinates = block.geometry.coordinates;
        for (let index = 0; index < nCoordinates - 1; index++) {
          let blockCopy = structuredClone(block);
          blockCopy.geometry.coordinates = [blockCoordinates[index], blockCoordinates[index + 1]];
          blockCopy.properties.name += ` block ${index + 1} of ${nCoordinates - 1}`
          splitGeoJson.push(blockCopy);
        }
      } else {
        splitGeoJson.push(block);
      }
    });
    return splitGeoJson;
  }

  static mockTrailsByEndNode = {
    3: [13465772, 13465819, 14014866, 14014867, 13465516, 13465393, 13465270, 13465233, 14014771, 13465171, 13464799, 13464852, 13464919, 30078787, 14045485, 13464434, 13464445, 14015188, 20120193, 13464312, 20120199, 14015159, 13464315, 13464314]
    // 3: [14672870, 14020747, 13465205, 13465149, 14015268, 14044934, 14020651, 14045808, 14045962, 14020651, 13464610, 13464565, 30105823, 30105826, 13464450, 20120212, 20120204, 20120199, 14015159, 13464315, 13464314]
  }
}
 
// blazeRandomTrail(aNodeId, bNodeId) {
//   const C = TrailBlazer;
//   const trail = [];
//   let nodeId = startingNodeId;
//   while (nodeId !== null) {
//     let paths = C.getBlocksAtNode(nodeId)
//     let possiblePaths = paths.filter(possibleBlock => {
//       let isNotTraveled = trail.every(trailBlock => {
//         return trailBlock.properties.id != possibleBlock.properties.id;
//       });
//       return isNotTraveled;
//     }); 
//     let nPossiblePaths = possiblePaths.length;
//     if (nPossiblePaths > 0) {
//       let chosenPath = structuredClone(possiblePaths[C.getRandomInt(nPossiblePaths - 1)]);
//       if (chosenPath.properties.from_node_id === nodeId) {
//         nodeId = chosenPath.properties.to_node_id;
//       } else {
//         chosenPath.geometry.coordinates.reverse();
//         nodeId = chosenPath.properties.from_node_id;
//       }
//       trail.push(chosenPath);
//     } else {
//       nodeId = null;
//     }
//   }
//   return trail;
// }

// static getBlocksAtNode(nodeId) {
//   const blocks = this.BLOCKS_GEO_JSON.features.filter(block => {
//     const blockProps = block.properties;
//     return blockProps.from_node_id === nodeId || blockProps.to_node_id === nodeId;
//   })
//   return blocks;
// }

// static getRandomInt(max) {
//   let rando = Math.floor(Math.random() * (max + 1));
//   return rando;
// }