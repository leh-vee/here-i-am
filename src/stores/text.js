import { writable, derived } from 'svelte/store';
import { fetchPoemText } from '../api/client.js';
import { serializePoem } from '../utils/poemJson.js';

let poem;
fetchPoemText().then(async lines => { 
  poem = await serializePoem(lines);
});

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

      let isBreak = false;

      const isEndOfTheLine = wordIndex == poem[verseIndex][line].length - 1;
      const isLineA = line == 'a';
      const isLastVerse = verseIndex == poem.length - 1

      if (!isEndOfTheLine) {
        nextWordIndex += 1;
      } else if (isLineA) {
        nextLine = 'b';
        nextWordIndex = 0;
        isBreak = true;
      } else if (!isLastVerse) {
        nextVerseIndex += 1;
        nextLine = 'a';
        nextWordIndex = 0;
      }
      isLineBreak.set(isBreak);
      
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

      let isBreak = false;

      const isStartOfTheLine = wordIndex == 0;
      const isLineB = line == 'b';

      if (!isStartOfTheLine) {
        prevWordIndex -= 1;
      } else if (isLineB) {
        prevLine = 'a';
        isBreak = true;
        prevWordIndex = poem[verseIndex][prevLine].length - 1;
      }

      isLineBreak.set(isBreak);
      
      return {
        verseIndex: prevVerseIndex,
        line: prevLine,
        wordIndex: prevWordIndex
      }
    })
  }
}
export const wordIndices = createWordIndicesStore();

export const isLineBreak = writable(false);

export const currentWord = derived(
  [wordIndices], ([$wordIndices]) => {
    const { verseIndex, line, wordIndex } = $wordIndices;
    return poem[verseIndex][line][wordIndex];
  }
);

export const currentWordId = derived(
  [wordIndices], ([$wordIndices]) => {
    const { verseIndex, line, wordIndex } = $wordIndices;
    return `${verseIndex}-${line}-${wordIndex}`;
  }
);

export const isPunctuationNext = derived(
  [wordIndices], ([$wordIndices]) => {
    const { verseIndex, line, wordIndex } = $wordIndices;
    const mark = poem[verseIndex]['punctuation'][line][wordIndex];
    return mark !== undefined;
  }
);

export const punctuationMark = derived(
  [wordIndices, isPunctuationNext], ([$wordIndices, $isPunctuationNext]) => {
    const { verseIndex, line, wordIndex } = $wordIndices;
    const pM = $isPunctuationNext ? poem[verseIndex]['punctuation'][line][wordIndex] : ""; 
    return pM;
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

export const isFirstVerseTriad = derived(
  [wordIndices], ([$wordIndices]) => {
    let isFirstVerse = false;
    if ($wordIndices.verseIndex < 3) isFirstVerse = true;
    return isFirstVerse;
  }
);