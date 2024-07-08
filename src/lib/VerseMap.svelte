<script>
  import { currentChannelCoordsPx } from '../stores/treeOfLife.js';
  import { currentVerse, currentVerseIndex, likePiSlices } from '../stores/text.js';
  import { Group } from 'svelte-konva';
  import WordMarker from './WordMarker.svelte';

  export let onTheRun = false;

  const nWordsVisible = { a: 0, b: 0 }
  $: if (onTheRun) incrementVisibleWords();

  function incrementVisibleWords() {
    const plusOne = (line = 'a') => {
      const duration = Math.PI * 100;
      nWordsVisible[line] += 1;
      if (nWordsVisible[line] < $currentVerse[line].length) {
        setTimeout(() => { plusOne(line) }, duration);
      } else if (line === 'a') {
        setTimeout(() => { plusOne('b') }, duration);
      }
    }
    plusOne();
  } 

  const xMarginPx = Math.round(window.innerWidth * 0.1);
  const yOffsetPx = Math.round(window.innerHeight * 0.02);
  $: nSpacesLineA = $currentVerse['a'].length - 1;
  $: nSpacesLineB = $currentVerse['b'].length - 1;
  $: xLineDeltaPx = $currentChannelCoordsPx[1][0] - $currentChannelCoordsPx[0][0] - xMarginPx * 2;
  $: xSpaceDeltaA = xLineDeltaPx / nSpacesLineA;
  $: xSpaceDeltaB = xLineDeltaPx / nSpacesLineB;
  $: lineStartX = Math.round(xMarginPx + $currentChannelCoordsPx[0][0]);
  $: lineEndX = Math.round($currentChannelCoordsPx[1][0] - xMarginPx);

  function xForWordIndexAndLine(index, line='a') {
    const nWordsInLine = $currentVerse[line].length;
    const isLineB = line === 'b';
    const delta = isLineB ? xSpaceDeltaB : xSpaceDeltaA;
    let x = Math.round(delta * index);
    if (index === nWordsInLine - 1) x = lineEndX - lineStartX;
    if ($likePiSlices && isLineB) x = xLineDeltaPx - x;
    return x;
  }

</script>

<Group config={{ 
  x: lineStartX, 
  y: $currentChannelCoordsPx[0][1]
}}>
  {#each $currentVerse['a'] as _, i}
    <WordMarker x={ xForWordIndexAndLine(i) } y={ -yOffsetPx } 
      wordId={`${$currentVerseIndex}-a-${i}`} 
      isVisible={ i < nWordsVisible.a } />
  {/each}
  {#each $currentVerse['b'] as _, i}
    <WordMarker x={ xForWordIndexAndLine(i, 'b') } y={yOffsetPx}
      wordId={`${$currentVerseIndex}-b-${i}`} 
      isVisible={ i < nWordsVisible.b } />
  {/each}
</Group>
