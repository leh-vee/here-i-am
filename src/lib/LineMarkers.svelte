<script>
  import { Circle } from 'svelte-konva';
  import { currentChannelCoordsPx } from '../stores/ilan';
  import { currentVerse, wordIndices } from '../stores/text.js';

  export let line = 'a';

  const yOffsetAbsolute = Math.round(window.innerHeight * 0.02);
  const isLineA = line === 'a';
  const yLineOffsetPx = isLineA ? -yOffsetAbsolute : yOffsetAbsolute;
  const xLineBufferPx = Math.round(window.innerWidth * 0.1);
  
  $: words = $currentVerse[line];
  
  $: lineCoordsPx = [
    [
      $currentChannelCoordsPx[0][0] + xLineBufferPx,
      $currentChannelCoordsPx[0][1] + yLineOffsetPx
    ],
    [
      $currentChannelCoordsPx[1][0] - xLineBufferPx,
      $currentChannelCoordsPx[1][1] + yLineOffsetPx
    ]
  ]
  
  $: xLineDeltaPx = lineCoordsPx[1][0] - lineCoordsPx[0][0];
  $: xCoordDelta = Math.round(xLineDeltaPx / (words.length - 1));
  $: yCoordPx = lineCoordsPx[0][1];

  $: isCurrentLine = line === $wordIndices['line'];

  function markerRadius(wordIndex) {
    const isCurrentWord = isCurrentLine && $wordIndices.wordIndex === wordIndex;
    return isCurrentWord ? 5 : 3;
  }
  
</script>

{#each words as word, i}
  <Circle config={{
    name: word,
    x: lineCoordsPx[0][0] + xCoordDelta * i,
    y: yCoordPx,
    radius: markerRadius(i),
    fill: 'black',
  }} />
{/each}



