<script>
    import { Circle, Wedge } from 'svelte-konva';
    import { ilanProjection, ilanBlocks, sefirotPoints } from '../stores/treeOfLife';
    import { isVerseNumberVisible } from '../stores/verseState';
    import { currentPiSlice } from '../stores/text';
    import { screenWidth, screenHeight } from '../stores/base'; 
    import StreetMap from './StreetMap.svelte';
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    $: xCentre = $screenWidth / 2;
    $: yCentre = $screenHeight / 2;
    $: diagonalRadius = Math.hypot(xCentre, yCentre);
    $: vesselRadius = Math.round(xCentre * 0.7);

    $: toCoordsGsc = $sefirotPoints.features[$currentPiSlice].geometry.coordinates;
    $: toCoordsPx = $ilanProjection(toCoordsGsc);

    let innerLightEl;
    let searchLightEl;
    let vessel;

    $: if (innerLightEl !== undefined) {
      leaderWipeIn();
      createVessel();
    }

    function leaderWipeIn() {
      isVerseNumberVisible.set(true);
      const toAttrs = {
        duration: Math.PI, 
        angle: 90,
        rotation: 450
      }
      innerLightEl.to({
        ...toAttrs,
        opacity: 0.25
      });
      searchLightEl.to({
        ...toAttrs,
        opacity: 0.5,
        onFinish: () => { 
          leaderWipeOut();
        }
      });
    }

    function leaderWipeOut() {
      const toAttrs = {
        duration: Math.PI, 
        angle: 0,
        rotation: 900,
        opacity: 0
      };
      innerLightEl.to({ ...toAttrs });
      searchLightEl.to({ 
        ...toAttrs,
        onFinish: () => {
          isVerseNumberVisible.set(false);
        } 
      });
    }

    function createVessel() {
      vessel.to({
        duration: Math.PI * 2,
        stroke: 'dimgrey',
        onFinish: () => { 
          mapVesselToSefirah();
        }
      });
    }

    function mapVesselToSefirah() {
      vessel.to({
        duration: Math.PI / 2,
        radius: Math.floor($screenWidth * 0.01),
        strokeWidth: 1,
        x: toCoordsPx[0],
        y: toCoordsPx[1],
        onFinish: () => {
          dispatch('vesselMapped');
        }
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
  colour={ 'black' } />
<Circle config={{
  x: xCentre,
  y: yCentre,
  fill: 'black',
  radius: vesselRadius,
  stroke: 'black',
  strokeWidth: 6
}} bind:handle={ vessel } />
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
