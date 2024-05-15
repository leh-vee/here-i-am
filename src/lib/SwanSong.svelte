<script>
  import { Layer } from 'svelte-konva';
  import EllipticalCollapse from './EllipticalCollapse.svelte';
  import StreetPainter from './StreetPainter';
  import { groundZeroBlocks, groundZeroProjection, 
    sefirotPoints, groundZeroRotationBlocks } from '../stores/treeOfLife.js';
  import StreetMap from './StreetMap.svelte';

  let crawlLayer;
  let singularity;
  let isFallingDown = false;
  let nStepsDown = 0;

  $: baseScale = $groundZeroProjection.scale();
  $: projectionScaled = $groundZeroProjection.scale(baseScale + nStepsDown**3)
  $: opacity = (300 - nStepsDown) / 300;

  function channeledLight(event) {
    singularity = event.detail;
    const crawlLayerCanvas = crawlLayer.getCanvas();
    const crawler = new StreetPainter(crawlLayerCanvas, 
      $groundZeroProjection, $groundZeroBlocks);
    const groundZeroSefirahId = $sefirotPoints.features[0].id;
    setTimeout(() => {
      crawler.drawBlocksFromNode(groundZeroSefirahId).then(orphanedBlocks => {
        console.log('all blocks have been drawn but for...', orphanedBlocks);
        theFall();
      });
    }, 200);
  }

  function theFall() {
    isFallingDown = true;
    const totalStepsDown = 300;
    const stepDown = () => {
      nStepsDown += 1;
      if (nStepsDown < totalStepsDown) {
        setTimeout(stepDown, Math.max(100 - nStepsDown, 0));
      } else {
        setTimeout(() => {
          singularity.destroy();
        }, Math.PI * 1000);
      }
    }
    stepDown();
  }

</script>

<Layer bind:handle={ crawlLayer } >
  {#if isFallingDown }
    {#key nStepsDown}
      <StreetMap blocksGeoJson={ $groundZeroRotationBlocks } 
        colour={ 'gold' } lineWidth={ 1 }
        projection={ projectionScaled } 
        opacity={ opacity } degreesRotation={ -nStepsDown } />
    {/key}
  {/if}
  <EllipticalCollapse implodeOnFinale={ false }
    on:collapsed={ channeledLight } />
</Layer>