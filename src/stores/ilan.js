// @ts-nocheck
import { writable } from 'svelte/store';
import { fetchSefirot, fetchBlocksWithinRadius } from '../api/client.js';
import { channelFeatures } from '../lib/utils/geoJson.js';
import { projectionsForChannels } from '../lib/utils/projections.js';
import { tenByTenArray } from '../lib/utils/base.js';

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
  sefirotPoints: undefined,
  channelLines: undefined,
}

export async function setIlanData(screenPx) {
  data.sefirotPoints = await fetchSefirot();
  data.channelLines = channelFeatures(data.sefirotPoints);
  channelProjections.set(projectionsForChannels(data.channelLines, screenPx));
}