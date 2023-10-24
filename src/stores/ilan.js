// @ts-nocheck
import { writable, derived } from 'svelte/store';
import { tenByTenArray } from '../lib/utils/base.js';
import { lastPiSlice, currentPiSlice } from '../stores/text';

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
    return $channelProjections[$lastPiSlice][$currentPiSlice];
  }
);

export const blocksForCurrentChannel = derived(
  [channelBlocks, lastPiSlice, currentPiSlice], 
  ([$channelBlocks, $lastPiSlice, $currentPiSlice]) => {
    return $channelBlocks[$lastPiSlice][$currentPiSlice];
  }
);

export const currentChannelLine = derived(
  [channelLines, lastPiSlice, currentPiSlice], 
  ([$channelLines, $lastPiSlice, $currentPiSlice]) => {
    return $channelLines[$lastPiSlice].features[$currentPiSlice];
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