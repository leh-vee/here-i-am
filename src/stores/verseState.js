import { writable, derived } from 'svelte/store';
import { isInBetweenWords } from './text.js';

export const verseState = writable('');
export const isVerseNumberVisible = writable(false);

export const isCountingDown = derived(
  [verseState], ([$verseState]) => {
    return $verseState === 'counting';
  }
);

export const isRemembering = derived(
  [verseState], ([$verseState]) => {
    return $verseState === 'remember';
  }
);

export const isEllipsisReaveled = derived(
  [verseState], ([$verseState]) => {
    return $verseState === 'ellipsisRevealed';
  }
);


export const isVerseMapReaveled = derived(
  [verseState], ([$verseState]) => {
    return $verseState === 'verseMapReaveled';
  }
);

export const isEllipsisLit = derived(
  [verseState], ([$verseState]) => {
    return $verseState === 'ellipsisLit';
  }
);

export const isReaderEngaged = derived(
  [verseState], ([$verseState]) => {
    return $verseState === 'readerEngaged';
  }
);

export const isFullStop = derived(
  [verseState], ([$verseState]) => {
    return $verseState === 'full-stop';
  }
);

export const isPostVerse = derived(
  [verseState], ([$verseState]) => {
    return $verseState === 'post';
  }
);

export const isMenuVisible = derived(
  [verseState], ([$verseState]) => {
    let isMenuVisible = false;
    if ($verseState === 'ellipsisLit' || $verseState === 'readerEngaged') {
      isMenuVisible = true;
    } 
    return isMenuVisible;
  }
);

export const isNotepadVisible = derived(
  [verseState], ([$verseState]) => {
    let isMenuVisible = false;
    if ($verseState === 'readerEngaged' || $verseState === 'full-stop') {
      isMenuVisible = true;
    } 
    return isMenuVisible;
  }
);

export const isNavigable = derived(
  [isReaderEngaged, isInBetweenWords, isFullStop], 
  ([$isReaderEngaged, $isInBetweenWords, $isFullStop]) => {
    return $isReaderEngaged && !$isInBetweenWords && !$isFullStop;
  }
);