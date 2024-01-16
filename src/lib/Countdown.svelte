<script>
  import { currentVerseIndex } from '../stores/text.js';
  import Pathways from './Pathways.svelte';
  import VerseExplorer from './VerseExplorer.svelte';

  let showNewPathway;

  $: {
    console.log('countdown cycle for verse at index...', $currentVerseIndex);
    showNewPathway = true;
  }

  function postPathway() {
    showNewPathway = false;
  }
</script>

{#if showNewPathway}
  <Pathways go={ showNewPathway } on:blazed={ postPathway } />
{/if}
<VerseExplorer isReading={ !showNewPathway } />