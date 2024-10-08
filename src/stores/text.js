import { writable, derived } from 'svelte/store';
import { fetchPoemText } from '../api/client.js';
import { serializePoem } from '../utils/textJson.js';

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
    goToVerseIndex: (i) => update(() => {
      return {
        verseIndex: i,
        line: 'a',
        wordIndex: 0 
      }
    }),
    goToWord: (line, wordIndex) => update(({verseIndex}) => {
      return {
        verseIndex,
        line,
        wordIndex 
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
export const isCaesura = writable(false);
export const isInBetweenWords = writable(false)

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

export const isLineA = derived(
  [wordIndices], ([$wordIndices]) => {
    return $wordIndices.line === 'a';
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
    let piSlice = "3"; // hard code first slice in case store is called before poem is loaded (refactor)
    const { verseIndex } = $wordIndices;
    if (verseIndex > 0) {
      piSlice = poem[verseIndex].piSlice;
    }
    return piSlice;
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

export const likePiSlices = derived(
  [lastPiSlice, currentPiSlice], 
  ([$lastPiSlice, $currentPiSlice]) => {
    return $lastPiSlice === $currentPiSlice;
  }
);

export const isGroundZero = derived(
  [currentPiSlice], ([$currentPiSlice]) => {
    return $currentPiSlice === "0";
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
    let isFirstTriad = false;
    if ($wordIndices.verseIndex < 3) isFirstTriad = true;
    return isFirstTriad;
  }
);

export const currentPiSliceRomanized = derived(
  [currentPiSlice, isFirstVerseTriad], 
  ([$currentPiSlice, $isFirstVerseTriad]) => {
    let verseNumber;
    if ($isFirstVerseTriad) {
      let romanNumeral = 'I';
      for (let i = 1; i < Number($currentPiSlice); i++) { romanNumeral += 'I' };
      verseNumber = romanNumeral;
    } else {
      verseNumber = String($currentPiSlice);
    }
    return verseNumber;
  }
)

export const isFirstVerse = derived(
  [wordIndices], ([$wordIndices]) => {
    let isFirstVerse = false;
    if ($wordIndices.verseIndex === 0) isFirstVerse = true;
    return isFirstVerse;
  }
);

export const percentOfVerseRead = derived(
  [nVerseWords, wordIndices], ([$nVerseWords, $wordIndices]) => {
    const { verseIndex, line, wordIndex } = $wordIndices;
    let nWordsRead = wordIndex;
    if (line === 'b') nWordsRead += poem[verseIndex]['a'].length;
    const percent = nWordsRead / $nVerseWords;
    return percent.toPrecision(2);
  }
);