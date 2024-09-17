import { writable, derived } from 'svelte/store';
import { isInBetweenWords } from './text.js';

export const verseState = writable('');
export const isVerseNumberVisible = writable(false);

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

export const isNavigable = derived(
  [isReaderEngaged, isInBetweenWords, isFinished], 
  ([$isReaderEngaged, $isInBetweenWords, $isFinished]) => {
    return $isReaderEngaged && !$isInBetweenWords && !$isFinished;
  }
);