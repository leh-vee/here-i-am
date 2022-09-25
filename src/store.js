import { readable, writable, derived } from 'svelte/store';
import { POEM_PARSED } from './data/poem';

const poem = readable(POEM_PARSED);

function createWordIndicesStore() {
  const { subscribe, update } = writable(
    {
      verseIndex: 0,
      line: 'a',
      wordIndex: 0
    }
  );

  return {
    subscribe,
    nextVerse: () => update(({verseIndex, line, wordIndex}) => {
      let nextVerseIndex = verseIndex;
      let nextLine = line;
      let nextWordIndex = wordIndex;
      if (verseIndex < POEM_PARSED.length - 1) {
        nextVerseIndex = nextVerseIndex + 1;
        nextLine = 'a';
        nextWordIndex = 0;
      } 
      return {
        verseIndex: nextVerseIndex,
        line: nextLine,
        wordIndex: nextWordIndex
      }
    }),
    nextLine: () => update(({verseIndex, line, wordIndex}) => {
      let nextLine = line;
      let nextWordIndex = wordIndex;
      if (line === 'a') {
        nextLine = 'b';
        nextWordIndex = 0;
      }
      return {
        verseIndex,
        line: nextLine,
        wordIndex: nextWordIndex
      }
    }),
    nextWord: () => update(({verseIndex, line, wordIndex}) => {
      let nextWordIndex = wordIndex;
      if (wordIndex < POEM_PARSED[verseIndex][line].length - 1) {
        nextWordIndex = nextWordIndex + 1;
      }
      return {
        verseIndex,
        line,
        wordIndex: nextWordIndex
      }
    })
  }
}
export const wordIndices = createWordIndicesStore();

export const currentWord = derived([poem, wordIndices], (
  [$poem, $wordIndices]) => {
    const { verseIndex, line, wordIndex } = $wordIndices;
    return $poem[verseIndex][line][wordIndex];
  }
);

export const currentVerse = derived([poem, wordIndices], (
  [$poem, $wordIndices]) => {
    const { verseIndex } = $wordIndices;
    return $poem[verseIndex];
  } 
);