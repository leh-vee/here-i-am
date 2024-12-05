const piCountDown = '32114159265358979323846264338327950';
const punctuationRegEx = /([^\w\s'])/g;

export function serializeCountDown(romanized=true) {
  let countDown = piCountDown.split('');
  if (romanized) {
    countDown[0] = "III";
    countDown[1] = "II";
    countDown[2] = "I";
  }
  return countDown;
}

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

export function serializeCouplets(lines) {
  const coupletsJson = [];
  const nCouplets = lines.length / 2;
  for (let i = 0; i < nCouplets; i++) {
    const aLine = lines[i * 2];
    const bLine = lines[i * 2 + 1];
    const couplet = { a: aLine, b: bLine };
    coupletsJson.push(couplet);
  }
  return coupletsJson;
}

export function serializeFaqText(lines) {
  const faqJson = [];
  const nQuestions = lines.length / 2; 
  for (let i = 0; i < nQuestions; i++) {
    const question = lines[i * 2];
    const answer = lines[i * 2 + 1];
    const qa = { q: question, a: answer };
    faqJson.push(qa);
  }
  const finalQuestion = { q: "...", a: "" };
  faqJson.push(finalQuestion);
  
  return faqJson;
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