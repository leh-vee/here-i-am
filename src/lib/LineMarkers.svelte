<script>
  import { Circle } from 'svelte-konva';
  import { currentVerse, currentPiSlice, lastPiSlice } from '../stores/text';
  import { channelLines, channelProjections } from '../stores/ilan';

  export let words;
  export let yOffset;

  const marginWidth = Math.round(window.innerWidth * 0.1);

  $: projection = $channelProjections[$lastPiSlice][$currentPiSlice];
  $: channelFeature = $channelLines[$lastPiSlice].features[$currentPiSlice];
  $: chCoordsGsc = channelFeature.geometry.coordinates;
  $: chCoordsPx = chCoordsGsc.map(cGsc => { 
    const coordsPx = projection(cGsc);
    const roundCoordsPx = coordsPx.map(coord => Math.round(coord));
    return roundCoordsPx;
  });

  $: lineCoordsPx = [
    [
      chCoordsPx[0][0] + marginWidth,
      chCoordsPx[0][1] + yOffset
    ],
    [
      chCoordsPx[1][0] - marginWidth,
      chCoordsPx[1][1] + yOffset
    ]
  ]

  $: xLineDeltaPx = lineCoordsPx[1][0] - lineCoordsPx[0][0];
  $: xCoordDelta = Math.round(xLineDeltaPx / (words.length - 1));
  $: yCoordPx = lineCoordsPx[0][1];
</script>

{#each words as word, i}
  <Circle config={{
    x: lineCoordsPx[0][0] + xCoordDelta * i,
    y: yCoordPx,
    radius: 3,
    fill: 'black',
  }} />
{/each}



