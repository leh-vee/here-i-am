<script>
  import { Layer } from 'svelte-konva';
  import { currentVerseIndex } from '../stores/text.js';
  import CountdownLeader from './CountdownLeader.svelte';
  import Pathways from './Pathways.svelte';
  import VerseExplorer from './VerseExplorer.svelte';
  
  let aPrioriLayerEl;
  let isMurmuring = false;
  let isBlazing = false;
  let isRemembering = false;

  $: if (aPrioriLayerEl !== undefined) {
    console.log('countdown cycle for verse at index', $currentVerseIndex);
    isRemembering = false;
    aPrioriLayerEl.opacity(1);
    setTimeout(() => {
      isMurmuring = true;
    }, Math.PI * 1000);
  }

  function blaze() {
    isMurmuring = false;
    isBlazing = true;
  }

  function remember() {
    isRemembering = true;
    aPrioriLayerEl.to({
      duration: Math.PI,
      opacity: 0,
      onFinish: () => {
        isBlazing = false;
      }
    });
  }

</script>

<Layer config={{ opacity: 1 }} bind:handle={ aPrioriLayerEl } >
  {#if isMurmuring}
    <CountdownLeader on:vesselMapped={ blaze } />
  {:else if isBlazing} 
    <Pathways on:blazed={ remember } />
  {/if}
</Layer>
<VerseExplorer isReading={ isRemembering } on:groundZero />