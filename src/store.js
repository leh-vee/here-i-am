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
      let nextLine = line;
      let nextVerseIndex = verseIndex;

      const isEndOfTheLine = wordIndex == POEM_PARSED[verseIndex][line].length - 1;
      const isLineA = line == 'a';
      const isLastVerse = verseIndex == POEM_PARSED.length - 1

      if (!isEndOfTheLine) {
        nextWordIndex += 1;
      } else if (isLineA) {
        nextLine = 'b';
        nextWordIndex = 0;
      } else if (!isLastVerse) {
        nextVerseIndex += 1;
        nextLine = 'a';
        nextWordIndex = 0;
      }

      return {
        verseIndex: nextVerseIndex,
        line: nextLine,
        wordIndex: nextWordIndex
      }
    }),
    previousWord: () => update(({verseIndex, line, wordIndex}) => {
      let prevWordIndex = wordIndex;
      let prevLine = line;
      let prevVerseIndex = verseIndex;

      const isStartOfTheLine = wordIndex == 0;
      const isLineB = line == 'b';
      const isFirstVerse = verseIndex == 0

      if (!isStartOfTheLine) {
        prevWordIndex -= 1;
      } else if (isLineB) {
        prevLine = 'a';
        prevWordIndex = POEM_PARSED[verseIndex][prevLine].length - 1;
      } else if (!isFirstVerse) {
        prevVerseIndex -= 1;
        prevLine = 'b';
        prevWordIndex = POEM_PARSED[prevVerseIndex][prevLine].length - 1;
      }

      return {
        verseIndex: prevVerseIndex,
        line: prevLine,
        wordIndex: prevWordIndex
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

export const currentVerseIndex = derived([wordIndices], (
  [$wordIndices]) => {
    return $wordIndices.verseIndex;
  } 
);

export const isFirstVerseTriad = derived([wordIndices], (
  [$wordIndices]) => {
    let isFirstVerse = false;
    if ($wordIndices.verseIndex < 3) isFirstVerse = true;
    return isFirstVerse;
  }
);

export const currentPiSlice = derived([poem, wordIndices], (
  [$poem, $wordIndices]) => {
    return $poem[$wordIndices.verseIndex].piSlice;
  }
);

export const lastPiSlice = derived([poem, wordIndices], (
  [$poem, $wordIndices]) => {
    let piSlice = 0;
    const { verseIndex } = $wordIndices;
    if (verseIndex > 0) {
      piSlice = $poem[verseIndex - 1].piSlice;
    }
    return piSlice; 
  }
);

export const isEllipsisWord = derived([wordIndices], (
  [$wordIndices]) => {
    let isFirstWord = false;
    if ($wordIndices.line === 'a' && $wordIndices.wordIndex < 3) {
      isFirstWord = true;
    }
    return isFirstWord;
  }
);

export const isLastVerseWord = derived([poem, wordIndices], (
  [$poem, $wordIndices]) => {
    const { verseIndex, line, wordIndex } = $wordIndices;
    const nWords = $poem[verseIndex][line].length;
    let isLastVerseWord = false;
    if (line === 'b' && wordIndex === nWords - 1) {
      isLastVerseWord = true;
    }
    return isLastVerseWord;
  }
);

function createCountdown() {
	const { subscribe, set, update } = writable(0);

	return {
		subscribe,
		increment: () => update(n => n + 3),
		decrement: () => update(n => n - 1),
		reset: () => set(3)
	};
}

export const countdown = createCountdown();