import { writable, derived } from 'svelte/store';
import { fetchLinesOfPoem } from '../api/client.js';

const piCountDown = '32114159265358979323846264338327950';
async function serializePoem() {
  const lines = await fetchLinesOfPoem();
  const poem = piCountDown.split('').map((piSlice, i) => {
    const lineIndex = i * 2;
    const verse = {
      piSlice: piSlice,
      a: lines[lineIndex].split(' '),
      b: lines[lineIndex + 1].split(' ')
    }
    return verse;
  });
  return poem;
}
const poem = await serializePoem();

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
      if (verseIndex < poem.length - 1) {
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

      const isEndOfTheLine = wordIndex == poem[verseIndex][line].length - 1;
      const isLineA = line == 'a';
      const isLastVerse = verseIndex == poem.length - 1

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

      if (!isStartOfTheLine) {
        prevWordIndex -= 1;
      } else if (isLineB) {
        prevLine = 'a';
        prevWordIndex = poem[verseIndex][prevLine].length - 1;
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

export const currentWord = derived(
  [wordIndices], ([$wordIndices]) => {
    const { verseIndex, line, wordIndex } = $wordIndices;
    return poem[verseIndex][line][wordIndex];
  }
);

export const nextWord = derived(
  [wordIndices], ([$wordIndices]) => {
    const { verseIndex, line, wordIndex } = $wordIndices;
    
    const isEndOfTheLine = wordIndex == poem[verseIndex][line].length - 1;
    const isLineA = line == 'a';

    let nextWord = null;
    
    if (!isEndOfTheLine) {
      nextWord = poem[verseIndex][line][wordIndex + 1];
    } else if (isLineA) {
      nextWord = poem[verseIndex]['b'][0];
    } 

    return nextWord;
  }
);

export const previousWord = derived(
  [wordIndices], ([$wordIndices]) => {
    const { verseIndex, line, wordIndex } = $wordIndices;

    const isStartOfTheLine = wordIndex == 0;
    const isLineB = line == 'b';

    let previousWord = null;

    if (!isStartOfTheLine) {
      previousWord = poem[verseIndex][line][wordIndex - 1];
    } else if (isLineB) {
      previousWord = poem[verseIndex]['a'][0];
    }

    return previousWord;
  }
);

export const currentVerse = derived(
  [wordIndices], ([$wordIndices]) => {
    const { verseIndex } = $wordIndices;
    return poem[verseIndex];
  } 
);

export const currentVerseIndex = derived(
  [wordIndices], ([$wordIndices]) => {
    return $wordIndices.verseIndex;
  } 
);

export const nVerseWords = derived(
  [currentVerse], ([$currentVerse]) => {
    return $currentVerse['a'].length + $currentVerse['b'].length;
  }
);

export const percentVerseRead = derived(
  [nVerseWords, wordIndices], ([$nVerseWords, $wordIndices]) => {
    let nWordsRead = 0;
    if ($wordIndices.line === 'b') {
      nWordsRead = nWordsRead + poem[$wordIndices.verseIndex]['a'].length;
    }
    nWordsRead = nWordsRead + $wordIndices.wordIndex;
    return nWordsRead / $nVerseWords;
  }
);

export const isFirstVerseTriad = derived(
  [wordIndices], ([$wordIndices]) => {
    let isFirstVerse = false;
    if ($wordIndices.verseIndex < 3) isFirstVerse = true;
    return isFirstVerse;
  }
);

export const isFirstVerseWord = derived(
  [wordIndices], ([$wordIndices]) => {
    let isFirstVerseWord = false;
    let { wordIndex, line } = $wordIndices; 
    if (wordIndex === 0 && line === 'a') isFirstVerseWord = true;
    return isFirstVerseWord;
  }
);

export const isLastWordInLineA = derived(
  [wordIndices], ([$wordIndices]) => {
    let isLastWordInLineA = false;
    let { wordIndex, line, verseIndex } = $wordIndices; 
    if (line === 'a' && poem[verseIndex][line].length === wordIndex + 1) isLastWordInLineA = true;
    return isLastWordInLineA;
  }
);

export const currentPiSlice = derived(
  [wordIndices], ([$wordIndices]) => {
    return poem[$wordIndices.verseIndex].piSlice;
  }
);

export const lastPiSlice = derived(
  [wordIndices], ([$wordIndices]) => {
    let piSlice = "0";
    const { verseIndex } = $wordIndices;
    if (verseIndex > 0) {
      piSlice = poem[verseIndex - 1].piSlice;
    }
    return piSlice; 
  }
);

export const currentPiSlicesMatch = derived(
  [lastPiSlice, currentPiSlice],
  ([$lastPiSlice, $currentPiSlice]) => {
    return $lastPiSlice === $currentPiSlice;
  }
);

export const isLastVerseWord = derived(
  [wordIndices], ([$wordIndices]) => {
    const { verseIndex, line, wordIndex } = $wordIndices;
    const nWords = poem[verseIndex][line].length;
    let isLastVerseWord = false;
    if (line === 'b' && wordIndex === nWords - 1) {
      isLastVerseWord = true;
    }
    return isLastVerseWord;
  }
);