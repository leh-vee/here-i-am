<script>
  import { Layer } from 'svelte-konva';
  import EllipticalCollapse from './EllipticalCollapse.svelte';
  import StreetPainter from './StreetPainter';
  import { groundZeroBlocks, groundZeroProjection, 
    sefirotPoints, groundZeroRotationBlocks } from '../stores/treeOfLife.js';
  import StreetMap from './StreetMap.svelte';

  let vertigoSnaps = [];
  let crawlLayer;
  let inVertigo = false;

  function channeledLight() {
    const crawlLayerCanvas = crawlLayer.getCanvas();
    const crawler = new StreetPainter(crawlLayerCanvas, 
      $groundZeroProjection, $groundZeroBlocks);
    const groundZeroSefirahId = $sefirotPoints.features[0].id;
    setTimeout(() => {
      crawler.drawBlocksFromNode(groundZeroSefirahId).then(orphanedBlocks => {
        console.log('all blocks have been drawn but for...', orphanedBlocks);
        vertigo();
      });
    }, 200);
  }

  function vertigo() {
    inVertigo = true;
    const addSnap = () => {
      const nSnaps = vertigoSnaps.length;
      vertigoSnaps.push(nSnaps);
      vertigoSnaps = vertigoSnaps; // trigger Svelte reactivity
      if (nSnaps < 10000) {
        setTimeout(addSnap, Math.max(100 - (nSnaps * 0.1), 0));
      }  
    }
    addSnap();
  }

</script>

<Layer bind:handle={ crawlLayer } >
  {#if inVertigo }
    {#each vertigoSnaps.slice(-10) as snapIndex (snapIndex)}
      <StreetMap blocksGeoJson={ $groundZeroRotationBlocks } 
        projection={ $groundZeroProjection } colour={ 'gold' }
        degreesRotation={ snapIndex * 37 } scale={ 1 + (snapIndex * 0.01) }/>
    {/each}
  {/if}
  <EllipticalCollapse on:collapsed={ channeledLight } />
</Layer>