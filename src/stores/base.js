import { writable, derived } from 'svelte/store';

export const isDataInitialized = writable(false);
export const isVerseNumberVisible = writable(false);
export const isReaderEngaged = writable(false);

export const nPiesScored = writable(0);
export const millisecsElapsedByVerse = writable([]); 
export const totalMillisecondsElapsed = derived(
  [millisecsElapsedByVerse], ([$millisecsElapsedByVerse]) => {
    return $millisecsElapsedByVerse.reduce((a, c) => a + c, 0)
  }
);