<script>
  import { currentPiSlicesMatch } from '../stores/text.js';
  import { currentChannelCoordsPx } from '../stores/treeOfLife.js';
  import WordMarker from './WordMarker.svelte';

  export let words;
  export let line = 'a';

  const yOffsetAbsolute = Math.round(window.innerHeight * 0.02);
  const isLineA = line === 'a';
  const yLineOffsetPx = isLineA ? -yOffsetAbsolute : yOffsetAbsolute;
  const xLineBufferPx = Math.round(window.innerWidth * 0.1);
  
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
  $: rightToLeft = $currentPiSlicesMatch && !isLineA;

  function xCoordPxForIndex(i) {
    let xCoordPx;
    if (rightToLeft) {
      xCoordPx = lineCoordsPx[1][0] - xCoordDelta * i;
    } else {
      xCoordPx = lineCoordsPx[0][0] + xCoordDelta * i;    
    }
    return xCoordPx;
  }
  
</script>

{#each words as word, i}
  <WordMarker
    word={word} 
    line={line}
    wordIndexInLine={i}
    x={xCoordPxForIndex(i)}
    y={yCoordPx}
  />
{/each}



