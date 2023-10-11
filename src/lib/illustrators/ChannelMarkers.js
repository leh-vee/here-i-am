import { Circle } from "konva/lib/shapes/Circle";

export default class ChannelMarkers {
  constructor(verse, konvaLayer, channelFeature, projection) {
    this.verse = verse;
    this.layer = konvaLayer;
    this.channel = channelFeature;
    this.projection = projection;
  }

  static #fromSefirahMarkerId = 'fromSefirah';
  static #toSefirahMarkerId = 'toSefirah';

  markSefirah(isFromSefirah=true) {
    const k = ChannelMarkers;
    const coordsPx = this.#channelCoordsPx()[isFromSefirah ? 0 : 1];
    const marker = this.#sefirahMarker(...coordsPx);
    this.layer.add(marker);
    marker.id(isFromSefirah ? k.#fromSefirahMarkerId : k.#toSefirahMarkerId );
    return true;
  }

  removeFromSefirahMarker() {
    const k = ChannelMarkers;
    const marker = this.layer.findOne(`#${k.#fromSefirahMarkerId}`);
    marker.destroy();
    return true;
  }

  markVerseWords() {
    this.#markWordsForLine('a');
    this.#markWordsForLine('b');
  }

  #markWordsForLine(line='a') {
    const isLineA = line === 'a';
    const lineCoordsPx = this.#lineCoordsPx(isLineA);
    const words = this.verse[line];
    const nWords = words.length;
    const xLineDeltaPx = lineCoordsPx[1][0] - lineCoordsPx[0][0];
    const xWordDeltaPx = Math.round(xLineDeltaPx / (nWords - 1));
    const yCoordPx = isLineA ? lineCoordsPx[0][1] : lineCoordsPx[1][1];

    const tBetweenMarks = 300;
    let nMarked = 0;
    const mark = () => {
      const markerCoordsPx = [
        lineCoordsPx[0][0] + xWordDeltaPx * nMarked,
        yCoordPx
      ]
      const marker = this.#wordMarker(...markerCoordsPx);
      this.layer.add(marker);
      nMarked += 1;
      if (nMarked < nWords) setTimeout(() => mark(), tBetweenMarks);
    }
    mark();
  }

  #lineCoordsPx(isLineA=true) {
    const chCoordsPx = this.#channelCoordsPx();
    const xBufferPx = this.#xLineBufferPx();
    const absoluteOffset = this.#yLineOffsetPx();
    const yOffset = isLineA ? -absoluteOffset : absoluteOffset;  
    const lineCoordsPx = [
      [
        chCoordsPx[0][0] + xBufferPx,
        chCoordsPx[0][1] + yOffset
      ],
      [
        chCoordsPx[1][0] - xBufferPx,
        chCoordsPx[1][1] + yOffset
      ]
    ]
    return lineCoordsPx;
  }

  #channelCoordsPx() {
    const coordsGsc = this.channel.geometry.coordinates;
    const coordsPx = coordsGsc.map(c => this.projection(c));
    const roundedCoordsPx = coordsPx.map(coords => {
      return coords.map(coord => Math.round(coord));
    })
    return roundedCoordsPx;
  }

  #xLineBufferPx() {
    return Math.round(this.layer.width() * 0.1);
  }

  #yLineOffsetPx() {
    return Math.round(this.layer.height() * 0.02);
  }

  #sefirahMarker(x, y) {
    const markerAttrs = { 
      x, y, 
      radius: 5, 
      fill: '#9E9EA1', 
      opacity: 1 
    };
    const marker = new Circle(markerAttrs);
    return marker;
  }
  
  #wordMarker(x, y) {
    const markerAttrs = { 
      x, y, 
      radius: 3, 
      fill: 'black', 
      opacity: 1 
    };
    const marker = new Circle(markerAttrs);
    return marker;
  }
}