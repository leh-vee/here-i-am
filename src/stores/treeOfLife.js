// @ts-nocheck
import { writable, derived } from 'svelte/store';
import { tenByTenArray } from '../lib/utils/base.js';
import { lastPiSlice, currentPiSlice } from './text.js';

export const groundZeroProjection = writable(undefined);
export const groundZeroBlocks = writable(undefined);

export const ilanProjection = writable(undefined);
export const ilanBlocks = writable(undefined);

export const sefirotPoints = writable(undefined);
export const channelLines = writable(undefined);
export const channelProjections = writable(undefined);

function createChannelBlocksStore() {
  const { subscribe, update } = writable(tenByTenArray());

  return {
    subscribe,
    setForIndices: (fromIndex, toIndex, blocks) => update((channelBlocks) => {
      channelBlocks[fromIndex][toIndex] = blocks;
      return channelBlocks;
    })
  };
}
export const channelBlocks = createChannelBlocksStore();

export const currentChannelProjection = derived(
  [channelProjections, lastPiSlice, currentPiSlice], 
  ([$channelProjections, $lastPiSlice, $currentPiSlice]) => {
    let projection;
    if ($lastPiSlice !== $currentPiSlice) {
      projection = $channelProjections[$lastPiSlice][$currentPiSlice];
    } else if ($lastPiSlice !== 0) {
      projection = $channelProjections[$lastPiSlice][0];
    }
    return projection;
  }
);

export const blocksForCurrentChannel = derived(
  [channelBlocks, lastPiSlice, currentPiSlice], 
  ([$channelBlocks, $lastPiSlice, $currentPiSlice]) => {
    let blocks;
    if ($lastPiSlice !== $currentPiSlice) {
      blocks = $channelBlocks[$lastPiSlice][$currentPiSlice];
    } else if ($lastPiSlice !== 0) {
      blocks = $channelBlocks[$lastPiSlice][0];
    }
    return blocks;
  }
);

export const currentChannelLine = derived(
  [channelLines, lastPiSlice, currentPiSlice], 
  ([$channelLines, $lastPiSlice, $currentPiSlice]) => {
    let line;
    if ($lastPiSlice !== $currentPiSlice) {
      line = $channelLines[$lastPiSlice].features[$currentPiSlice];
    } else if ($lastPiSlice !== 0) {
      line = $channelLines[$lastPiSlice].features[0];
    }
    return line;
  }
);

export const currentChannelCoordsPx = derived(
  [currentChannelProjection, currentChannelLine], 
  ([$currentChannelProjection, $currentChannelLine]) => {
    const chCoordsGsc = $currentChannelLine.geometry.coordinates;
    const chCoordsPx = chCoordsGsc.map(cGsc => {
      const coordsPx = $currentChannelProjection(cGsc);
      const roundCoordsPx = coordsPx.map(coord => Math.round(coord));
      return roundCoordsPx;
    });
    return chCoordsPx;
  }
);

export const currentFromSefirahCoordsGcs = derived(
  [sefirotPoints, lastPiSlice],
  ([$sefirotPoints, $lastPiSlice]) => {
    const fromSefirah = $sefirotPoints.features[$lastPiSlice];
    return fromSefirah.geometry.coordinates;
  }
);

export const currentChannelFromSefirahCoordsPx = derived(
  [currentChannelProjection, sefirotPoints, lastPiSlice], 
  ([$currentChannelProjection, $sefirotPoints, $lastPiSlice]) => {
    const fromSefirah = $sefirotPoints.features[$lastPiSlice];
    const fromSefirahCoordsGcs = fromSefirah.geometry.coordinates;
    return $currentChannelProjection(fromSefirahCoordsGcs);
  }
);

export const currentChannelToSefirahCoordsPx = derived(
  [currentChannelProjection, sefirotPoints, currentPiSlice], 
  ([$currentChannelProjection, $sefirotPoints, $currentPiSlice]) => {
    const fromSefirah = $sefirotPoints.features[$currentPiSlice];
    const fromSefirahCoordsGcs = fromSefirah.geometry.coordinates;
    return $currentChannelProjection(fromSefirahCoordsGcs);
  }
);