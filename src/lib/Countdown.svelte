<script>
  import { Layer } from 'svelte-konva';
  import { currentVerseIndex } from '../stores/text.js';
  import CountdownLeader from './CountdownLeader.svelte';
  import Pathways from './Pathways.svelte';
  import VerseExplorer from './VerseExplorer.svelte';

  let movementIndex = 0;

  $: {
    console.log('countdown cycle for verse at index...', $currentVerseIndex);
    movementIndex = 0;
  }

  function nextMovement() {
    movementIndex += 1;
  }

</script>

<Layer>
  {#if movementIndex === 0}
    <CountdownLeader on:vesselMapped={ nextMovement } />
  {:else if movementIndex === 1} 
    <Pathways on:blazed={ nextMovement } />
  {/if}
</Layer>
<VerseExplorer isReading={ movementIndex === 2 } />