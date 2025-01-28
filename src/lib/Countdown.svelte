<script>
  import { Layer } from 'svelte-konva';
  import { currentVerseIndex } from '../stores/text';
  import { verseState } from '../stores/verseState';
  import { channelBlocks, currentChannelProjection,
    isBlocksForCurrentChannelFetched } from '../stores/treeOfLife';
  import { currentPiSlice, lastPiSlice, likePiSlices } from '../stores/text';
  import CountdownLeader from './CountdownLeader.svelte';
  import Pathways from './Pathways.svelte';
  import VerseExplorer from './VerseExplorer.svelte';
  import { fetchBlocksWithinRadius } from '../api/client.js';
  import distance from "@turf/distance";

  let aPrioriLayerEl;
  let isMurmuring = false;
  let isBlazing = false;
  let isRemembering = false;
  
  $: if (aPrioriLayerEl !== undefined && $currentVerseIndex >= 0) {
    verseState.set('counting'); 
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
    verseState.set('remember');
    aPrioriLayerEl.to({
      duration: Math.PI,
      opacity: 0,
      onFinish: () => {
        isBlazing = false;
      }
    });
  }

  $: if (!$isBlocksForCurrentChannelFetched) fetchBlocksForCurrentProjection();

  function fetchBlocksForCurrentProjection() {
    const pCentre = $currentChannelProjection.center();
    const pRadius = distance(pCentre, $currentChannelProjection.invert([0,0]));
    fetchBlocksWithinRadius(pCentre, pRadius).then(blocks => {
      if (!$likePiSlices) {
        channelBlocks.setForIndices($lastPiSlice, $currentPiSlice, blocks);
      // @ts-ignore
      } else if ($lastPiSlice !== 0) {
        channelBlocks.setForIndices($lastPiSlice, 0, blocks);
      }
    });
  }

</script>

<Layer config={{ opacity: 1 }} bind:handle={ aPrioriLayerEl } >
  {#if isMurmuring}
    <CountdownLeader on:vesselMapped={ blaze } on:showVerseNumber on:hideVerseNumber />
  {:else if isBlazing} 
    <Pathways on:blazed={ remember } />
  {/if}
</Layer>
{#key $currentVerseIndex}
  <VerseExplorer on:groundZero />
{/key}