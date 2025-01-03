import { writable, derived } from 'svelte/store';

export const isDataInitialized = writable(false);

export const faqLineIndex = writable(0);

export const nPiesScored = writable(0);
export const millisecsElapsedByVerse = writable([]); 
export const totalPoints = derived(
  [millisecsElapsedByVerse], ([$millisecsElapsedByVerse]) => {
    const totalMillisecs = $millisecsElapsedByVerse.reduce((a, c) => a + c, 0)
    return Math.floor(totalMillisecs / 60000);
  }
);