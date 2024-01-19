<script>
    import { Circle, Text, Wedge } from 'svelte-konva';
    import { ilanProjection, ilanBlocks } from '../stores/treeOfLife.js';
    import { currentPiSlice } from '../stores/text.js';
    import StreetMap from './StreetMap.svelte';
    import { onMount } from 'svelte';

    const xCentre = window.innerWidth / 2;
    const yCentre = window.innerHeight / 2;
    const diagonalRadius = Math.hypot(xCentre, yCentre);
    const vesselRadius = Math.round(xCentre * 0.7);

    let innerLightEl;
    let searchLightEl;

    $: verseNumber = String($currentPiSlice);

    onMount(async () => {
      leaderWipeIn();
    });

    function leaderWipeIn() {
      innerLightEl.to({
        duration: Math.PI, 
        angle: 90,
        rotation: 450,
        opacity: 0.25
      });
      searchLightEl.to({
        duration: Math.PI, 
        angle: 90,
        rotation: 450,
        opacity: 0.5,
        onFinish: () => { 
          leaderWipeOut();
        }
      });
    }

    function leaderWipeOut() {
      innerLightEl.to({
        duration: Math.PI, 
        angle: 0,
        rotation: 900,
        opacity: 0
      });
      searchLightEl.to({
        duration: Math.PI, 
        angle: 0,
        rotation: 900,
        opacity: 0
      });
    }
    
</script>

<Wedge config={{
  x: xCentre,
  y: yCentre,
  radius: diagonalRadius,
  angle: 0,
  rotation: -90, 
  fill: 'gold',
  strokeEnabled: false,
  opacity: 0
}} bind:handle={ searchLightEl } />
<StreetMap blocksGeoJson={ $ilanBlocks } projection={ $ilanProjection } 
  colour={ 'black' } lineWidth={ 1 } />
<Circle config={{
  x: xCentre,
  y: yCentre,
  fill: 'black',
  radius: vesselRadius,
  stroke: 'black',
  strokeWidth: 6
}} />
<Wedge config={{
  x: xCentre,
  y: yCentre,
  radius: vesselRadius - 3,
  angle: 0,
  rotation: -90, 
  fill: 'gold',
  strokeEnabled: false,
  opacity: 0
}} bind:handle={ innerLightEl } />
<Text config={{
  x: 0,
  y: 0,
  text: verseNumber,
  width: window.innerWidth,
  height: window.innerHeight / 1.5,
  align: 'center',
  verticalAlign: 'bottom',
  fontFamily: 'monospace',
  fontSize: 200,
  fill: 'black',
  strokeEnabled: false
}} />
