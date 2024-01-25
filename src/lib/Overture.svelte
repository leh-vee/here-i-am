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

  let singularity;
  let singularityContracted = false;
  
  function coolDown(event) {
    singularity = event.detail;
    singularity.to({
      duration: Math.PI,
      radius: 1,
      opacity: 0.5,
      onFinish: () => {
        singularityContracted = true;
        nova();
      }
    });
  }

  function nova() {
    singularity.to({
      duration: Math.PI / 10,
      radius: diagonalRadius,
      opacity: 0,
      onFinish: () => {
        dispatch('goneNova');
      }
    });
  }

</script>

<Layer>
  <EllipticalCollapse on:collapsed={ coolDown } />
  {#if singularityContracted}
    <StreetMap blocksGeoJson={ $ilanBlocks } projection={ $ilanProjection } 
      colour={ 'black' } lineWidth={ 1 } />
  {/if}
</Layer>