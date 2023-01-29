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
    this.projection.clipExtent([[0, 0], [this.canvasWidth, this.canvasHeight]]);
    
    this.centrePointLatLng = centreCoordinates;
    this.canvasCentrePoint = this.projection(centreCoordinates);
  } 

  renderGrid() {
    const geoGenerator = d3.geoPath()
      .projection(this.projection)
      .context(this.canvasContext);
    this.canvasContext.beginPath();
    geoGenerator({type: 'FeatureCollection', features: BreadcrumbPainter.BLOCKS_GEO_JSON.features})
    this.canvasContext.stroke();
  }
}