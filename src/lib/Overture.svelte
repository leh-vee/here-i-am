<script>
  import { Layer } from 'svelte-konva';
  import EllipticalCollapse from './EllipticalCollapse.svelte';
  import StreetMap from './StreetMap.svelte';
  import { ilanProjection, ilanBlocks } from '../stores/treeOfLife.js';
  import { screenWidth, screenHeight } from '../stores/base';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();
  $: xCentre = $screenWidth / 2;
  $: yCentre = $screenHeight / 2;
  $: diagonalRadius = Math.hypot(xCentre, yCentre);

  let ellipsisCollapsed = false;

  function nova(event) {
    ellipsisCollapsed = true;
    const singularity = event.detail;
    singularity.to({
      duration: 0.3,
      radius: diagonalRadius,
      fill: 'black',
      onFinish: () => {
        dispatch('goneNova');
      }
    });
  }

</script>

<Layer>
  <EllipticalCollapse on:collapsed={ nova } />
  {#if ellipsisCollapsed}
    <StreetMap blocksGeoJson={ $ilanBlocks } projection={ $ilanProjection } 
      colour={ 'black' } />
  {/if}
</Layer>