<script>
  import { Group } from 'svelte-konva';
  import SefirahMarker from './SefirahMarker.svelte';
  import WordMarker from './WordMarker.svelte';
  import Ellipsis from './Ellipsis.svelte';
  import { currentChannelCoordsPx, currentChannelToSefirahCoordsPx,
    currentChannelFromSefirahCoordsPx } from '../stores/treeOfLife.js';
  import { currentVerse, likePiSlices,
    currentVerseIndex } from '../stores/text.js';
  import { isReaderEngaged, isVerseEllipsisLit } from '../stores/base';

  export let revealEllipsis = false;
  let triggerVerseRun = false;
  let triggerRadiate = false;

  const nMarkersVisible = { a: 0, b: 0 }

  $: if (triggerVerseRun) incrementVisibleMarkers();

  function incrementVisibleMarkers() {
    const plusOne = (line = 'a') => {
      const duration = Math.PI * 100;
      nMarkersVisible[line] += 1;
      if (nMarkersVisible[line] < $currentVerse[line].length) {
        setTimeout(() => { plusOne(line) }, duration);
      } else if (line === 'a') {
        setTimeout(() => { plusOne('b') }, duration);
      } else {
        triggerRadiate = true;
      }
    }
    plusOne();
  } 

  const xMarginPx = Math.round(window.innerWidth * 0.1);
  const yOffsetPx = Math.round(window.innerHeight * 0.03);
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

<SefirahMarker coordsPx={ $currentChannelFromSefirahCoordsPx } 
    isLit={ triggerRadiate } />
{#if !$likePiSlices}
  <SefirahMarker coordsPx={ $currentChannelToSefirahCoordsPx } 
    isFromSefirah={ false } isLit={ true } />
{/if}
<Group config={{ 
  x: lineStartX, 
  y: $currentChannelCoordsPx[0][1]
}}>
  {#each $currentVerse['a'] as _, i}
    <WordMarker x={ xForWordIndexAndLine(i) } y={ -yOffsetPx } 
      wordId={`${$currentVerseIndex}-a-${i}`} 
      isVisible={ i < nMarkersVisible.a } />
  {/each}
  {#each $currentVerse['b'] as _, i}
    <WordMarker x={ xForWordIndexAndLine(i, 'b') } y={yOffsetPx}
      wordId={`${$currentVerseIndex}-b-${i}`} 
      isVisible={ i < nMarkersVisible.b } />
  {/each}
</Group>
<Ellipsis
  reveal={ revealEllipsis }
  on:revealed={ () => { triggerVerseRun = true } }
  light={ triggerRadiate }
  on:lit={ () => { isVerseEllipsisLit.set(true) } }
/>