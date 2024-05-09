<script>
  import { Layer } from 'svelte-konva';
  import EllipticalCollapse from './EllipticalCollapse.svelte';
  import StreetMap from './StreetMap.svelte';
  import { ilanProjection, ilanBlocks } from '../stores/treeOfLife.js';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();
  const xCentre = window.innerWidth / 2;
  const yCentre = window.innerHeight / 2;
  const diagonalRadius = Math.hypot(xCentre, yCentre);

  let ellipsisCollapsed = false;

  function nova(event) {
    ellipsisCollapsed = true;
    const singularity = event.detail;
    singularity.to({
      duration: Math.PI / 10,
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