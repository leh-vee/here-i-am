<script>
  import { Layer } from 'svelte-konva';
  import VerseNumber from './VerseNumber.svelte';
  import { currentVerseIndex, wordIndices } from '../stores/text.js';
  import Ilan from './Ilan.svelte';
  import VerseExplorer from './VerseExplorer.svelte';

  let showNewPathway = true;
  let showVerseNumber = false;
  $: isReading = !showNewPathway && !showVerseNumber;

  $: {
    console.log('countdown cycle for verse at index...', $currentVerseIndex);
    showNewPathway = true;
  }

  function postPathway() {
    showNewPathway = false;
    showVerseNumber = true;
    setTimeout(() => {
      showVerseNumber = false;
    }, Math.PI * 1000);
  }


</script>

<Layer config={{ visible: showNewPathway }}>
  <Ilan go={ showNewPathway } on:blazed={ postPathway } />
</Layer>
<Layer config={{ visible: showVerseNumber }} >
  <VerseNumber />
</Layer>
<VerseExplorer isReading={ isReading } />