import { writable, derived } from 'svelte/store';
import { currentVerseIndex } from '../stores/text';

export const isDataInitialized = writable(false);

export const isVerseNumberMenuOpened = writable(false);
export const hasVerseNumberMenuOpened = writable(false);

export const isVerseCallout = writable(false);
export const isScoreCallout = writable(false);

export const faqLineIndex = writable(0);

export const nPiesScored = writable(0);

export const millisecsElapsedByVerse = writable([]); 

export const millisecsElapsedForCurrentVerse = derived(
  [millisecsElapsedByVerse, currentVerseIndex], 
  ([$millisecsElapsedByVerse, $currentVerseIndex]) => {
    let millisecs = 0;
    if ($millisecsElapsedByVerse[$currentVerseIndex] !== undefined) {
      millisecs = $millisecsElapsedByVerse[$currentVerseIndex];
    }
    return millisecs;
  }
);

export const totalPoints = derived(
  [millisecsElapsedByVerse], ([$millisecsElapsedByVerse]) => {
    const totalMillisecs = $millisecsElapsedByVerse.reduce((a, c) => a + c, 0)
    return Math.floor(totalMillisecs / 60000);
  }
);
