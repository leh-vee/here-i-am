<script>
  import { currentChannelCoordsPx } from '../stores/treeOfLife.js';
  import { currentVerse, currentVerseIndex } from '../stores/text.js';
  import { Group } from 'svelte-konva';
  import WordMarker from './WordMarker.svelte';

  const xMarginPx = Math.round(window.innerWidth * 0.1);
  const yOffsetPx = Math.round(window.innerHeight * 0.02);
  $: nSpacesLineA = $currentVerse['a'].length - 1;
  $: nSpacesLineB = $currentVerse['b'].length - 1;
  $: xLineDeltaPx = $currentChannelCoordsPx[1][0] - $currentChannelCoordsPx[0][0] - xMarginPx * 2;
  $: xSpaceDeltaA = Math.round(xLineDeltaPx / nSpacesLineA);
  $: xSpaceDeltaB = Math.round(xLineDeltaPx / nSpacesLineB);

</script>

<Group config={{ 
  x: xMarginPx + $currentChannelCoordsPx[0][0], 
  y: $currentChannelCoordsPx[0][1]
}}>
  {#each $currentVerse['a'] as _, i}
    <WordMarker x={xSpaceDeltaA * i} y={-yOffsetPx} 
      wordId={`${$currentVerseIndex}-a-${i}`} />
  {/each}
  {#each $currentVerse['b'] as _, i}
    <WordMarker x={xSpaceDeltaB * i} y={yOffsetPx}
      wordId={`${$currentVerseIndex}-b-${i}`} />
  {/each}
</Group>
