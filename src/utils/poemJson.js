const piCountDown = '32114159265358979323846264338327950';

export async function serializePoem(poemLines) {
  const poemJson = piCountDown.split('').map((piSlice, i) => {
    const lineIndex = i * 2;
    const verse = {
      piSlice: piSlice,
      a: poemLines[lineIndex].split(' '),
      b: poemLines[lineIndex + 1].split(' ')
    }
    return verse;
  });
  return poemJson;
}