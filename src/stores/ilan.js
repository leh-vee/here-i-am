// @ts-nocheck
import { writable } from 'svelte/store';
import { fetchSefirot, fetchBlocksWithinRadius } from '../api/client.js';
import { channelFeatures } from '../lib/utils/geoJson.js';
import { projectionsForChannels } from '../lib/utils/projections.js';
import { tenByTenArray } from '../lib/utils/base.js';

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

const data = {
  channelLines: undefined,
}

export async function setIlanData(screenPx) {
  const sefirotGeoJson = await fetchSefirot();
  sefirotPoints.set(sefirotGeoJson);
  const channelLinesGeoJson = channelFeatures(sefirotGeoJson);
  channelLines.set(channelLinesGeoJson);
  channelProjections.set(projectionsForChannels(channelLinesGeoJson, screenPx));
}