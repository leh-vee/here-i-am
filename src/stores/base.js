import { writable, derived } from 'svelte/store';
import { currentVerseIndex } from '../stores/text';

export const screenWidth  = writable(undefined);
export const screenHeight  = writable(undefined);

export const isScreenDimensionsStored = derived(
  [screenWidth, screenHeight], ([$screenWidth, $screenHeight]) => {
    return $screenWidth !== undefined && $screenHeight !== undefined;
  }
);

export const tossUpCoordinates = writable(false);

export const isDataInitialized = writable(false);

export const hasTappedEllipsis = writable(false);
export const hasReadAhead = writable(false);
export const hasCompletedVerse = writable(false);
export const isScoreCallout = writable(false);
export const isVerseCallout = writable(false);
export const hasVerseNumberMenuOpened = writable(false);

export const aboutMeText = writable([]); 

export const faqLinesToText = writable([]);
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

export const totalReadingSeconds = derived(
  [millisecsElapsedByVerse], ([$millisecsElapsedByVerse]) => {
    const totalMillisecs = $millisecsElapsedByVerse.reduce((a, c) => a + c, 0)
    return Math.floor(totalMillisecs / 60000);
  }
);
