const piCountDown = '32114159265358979323846264338327950';

export async function serializePoem(poemLines) {
  const poemJson = piCountDown.split('').map((piSlice, i) => {
    const lineIndex = i * 2;
    const verse = {
      piSlice: piSlice,
      a: encodePunctuation(poemLines[lineIndex]),
      b: encodePunctuation(poemLines[lineIndex + 1])
    }
    return verse;
  });
  return poemJson;
}

function encodePunctuation(lineStr) {
  const encodedLine = [];
  const rawLine = lineStr.split(' ');
  const punctuationRegEx = /([^\w\s'])/g;
  rawLine.forEach(chars => {
    const wordPuncSplit = chars.split(punctuationRegEx).filter(str => str !== '');
    wordPuncSplit.forEach(chars => {
      const isPunctuation = chars.search(punctuationRegEx) === 0;
      const encodedChars = isPunctuation ? chars.charCodeAt() : chars;
      encodedLine.push(encodedChars);  
    });
  });
  return encodedLine;
}