import { writable, derived } from 'svelte/store';

export const isDataInitialized = writable(false);
export const isVerseNumberVisible = writable(false);

export const nPiesScored = writable(0);
export const millisecsElapsedByVerse = writable([]); 
export const totalPoints = derived(
  [millisecsElapsedByVerse], ([$millisecsElapsedByVerse]) => {
    const totalMillisecs = $millisecsElapsedByVerse.reduce((a, c) => a + c, 0)
    return Math.floor(totalMillisecs / 60000);
  }
);

// verse state stores

export const verseState = writable('');

export const isReaderEngaged = derived(
  [verseState], ([$verseState]) => {
    return $verseState === 'readerEngaged';
  }
)

export const isMenuVisible = derived(
  [verseState], ([$verseState]) => {
    let isMenuVisible = false;
    if ($verseState === 'ellipsisLit' || $verseState === 'readerEngaged') {
      isMenuVisible = true;
    } 
    return isMenuVisible;
  }
);


export const isStartSefirah = derived(
  [verseState], ([$verseState]) => {
    let isStartSefirah = false;
    if ($verseState !== 'finished' && $verseState !== 'readerEngaged') {
      isStartSefirah = true;
    } 
    return isStartSefirah;
  }
);

export const isEllipsisReaveled = derived(
  [verseState], ([$verseState]) => {
    return $verseState === 'ellipsisRevealed';
  }
);

export const isEllipsisLit = derived(
  [verseState], ([$verseState]) => {
    return $verseState === 'ellipsisLit';
  }
);

export const isFinished = derived(
  [verseState], ([$verseState]) => {
    return $verseState === 'finished';
  }
);

export const isVerseMapReaveled = derived(
  [verseState], ([$verseState]) => {
    return $verseState === 'verseMapReaveled';
  }
);

export const isExploring = derived(
  [verseState], ([$verseState]) => {
    return $verseState === 'exploring';
  }
);

export const isCountingDown = derived(
  [verseState], ([$verseState]) => {
    return $verseState === 'counting';
  }
);