import { Circle } from "konva/lib/shapes/Circle";

export default class ChannelMarkers {
  constructor(verse, konvaLayer, channelFeature, projection) {
    this.verse = verse;
    this.layer = konvaLayer;
    this.channel = channelFeature;
    this.projection = projection;
  }

  markSefirah(isStartingPoint=true) {
    const coordsPx = this.#channelCoordsPx()[isStartingPoint ? 0 : 1];
    const marker = sefirahMarker(...coordsPx);
    this.layer.add(marker);
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
      const marker = wordMarker(...markerCoordsPx);
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
}

function sefirahMarker(x, y) {
  return new Circle({ 
    x, y, 
    radius: 5, 
    fill: '#9E9EA1', 
    opacity: 1 
  });
}

function wordMarker(x, y) {
  return new Circle({ 
    x, y, 
    radius: 3, 
    fill: 'black', 
    opacity: 1 
  });
}