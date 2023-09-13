// @ts-nocheck
import { fetchSefirot, fetchChannels } from '../api/interface.js';
import * as d3 from 'd3';

export default class Ilan {
  constructor(screenWidth, screenHeight, projectionScale) {
    
    this.screenWidth = screenWidth;
    this.screenHeight = screenHeight;

    this.channels = Array(10);

    this.projection = d3.geoMercator();
    this.projection.translate([screenWidth / 2, screenHeight / 2]);
    this.projection.scale(projectionScale);
    
    fetchSefirot().then(sefirotJson => {
      this.sefirot = this.parseSefirotJson(sefirotJson);
      for (let i = 0; i < 10; i++) {
        let areaCoords = this.screenCoordsForSefira(this.sefirot[i]);
        fetchChannels(areaCoords).then(channelsJson => {
          this.channels[i] = JSON.parse(channelsJson);
        });
      };
    }) 
  } 

  sephira(sephiraIndex) {
    return this.sefirot[sephiraIndex];
  }

  channelsForSephira(sephiraIndex) {
    return this.channels[sephiraIndex];
  }

  parseSefirotJson(json) {
    const features = JSON.parse(json).features;
    const sefirot = features.map(feature => {
      return {
        coordinates: feature.geometry.coordinates,
        nodeId: feature.id
      }
    });
    return sefirot;
  }

  screenCoordsForSefira(sefira) {
    this.projection.center(sefira.coordinates);
    const minCoords = this.projection.invert([0, 0]);
    const maxCoords = this.projection.invert([this.screenWidth, this.screenHeight]);
    const coords = [...minCoords, ...maxCoords];
    return coords;
  } 
}