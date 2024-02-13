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
  let singularity;

  $: baseProjectionScale = $groundZeroProjection.scale();

  function channeledLight(event) {
    singularity = event.detail;
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
      if (nSnaps < 300) {
        setTimeout(addSnap, Math.max(100 - nSnaps, 0));
      } else {
        setTimeout(() => {
          singularity.destroy();
        }, Math.PI * 1000);
      }
    }
    addSnap();
  }

  function opacityForIndex(i) {
    let o = (300 - i) / 300;
    return o;
  } 

</script>

<Layer bind:handle={ crawlLayer } >
  {#if inVertigo }
    {#each vertigoSnaps.slice(-1) as snapIndex (snapIndex)}
      <StreetMap blocksGeoJson={ $groundZeroRotationBlocks } 
        projection={ $groundZeroProjection.scale(baseProjectionScale + snapIndex**3) } 
        colour={ 'gold' }
        lineWidth={ 1 }
        opacity={ opacityForIndex(snapIndex) }
        degreesRotation={ snapIndex } />
    {/each}
  {/if}
  <EllipticalCollapse on:collapsed={ channeledLight } />
</Layer>