const piCountDown = '32114159265358979323846264338327950';
const punctuationRegEx = /([^\w\s'])/g;

export async function serializePoem(poemLines) {
  const poemJson = [];
  piCountDown.split('').forEach((piSlice, i) => {
    const lineIndex = i * 2;
    const aLine = poemLines[lineIndex];
    const bLine = poemLines[lineIndex + 1];
    const verse = {
      piSlice: piSlice,
      a: splitWordsStripPunctuation(aLine),
      b: splitWordsStripPunctuation(bLine),
      punctuation: {
        a: mapPunctuationForLine(aLine),
        b: mapPunctuationForLine(bLine)
      }
    }
    poemJson.push(verse);
  });
  return poemJson;
}

function splitWordsStripPunctuation(str) {
  const strWithoutPunctuation = str.replaceAll(punctuationRegEx, '');
  const words = strWithoutPunctuation.split(' ');
  return words.filter(word => word !== '');
}

function mapPunctuationForLine(lineStr) {
  const map = {};
  const splitLine = lineStr.split(punctuationRegEx);
  const nPunctuationMarks = splitLine.length / 2 - 1;
  let lastWordIndex = -1;
  for (let i = 0;  i < nPunctuationMarks; i++) {
    const index = i*2;
    const wordsBeforeMark = splitLine[index].trim().split(' ');
    const punctuationMark = splitLine[index+1];
    lastWordIndex += wordsBeforeMark.length;
    map[lastWordIndex] = punctuationMark;
  }
  return map;
}