<script>
  import { Layer } from 'svelte-konva';
  import EllipticalCollapse from './EllipticalCollapse.svelte';
  import StreetPainter from './StreetPainter';
  import { groundZeroBlocks, groundZeroProjection, sefirotPoints } from '../stores/treeOfLife.js';

  let crawlLayer;

  function channeledLight() {
    const crawlLayerCanvas = crawlLayer.getCanvas();
    const crawler = new StreetPainter(crawlLayerCanvas, $groundZeroProjection, $groundZeroBlocks);
    const groundZeroSefirahId = $sefirotPoints.features[0].id;
    setTimeout(() => {
      crawler.drawBlocksFromNode(groundZeroSefirahId).then(orphanedBlocks => {
        console.log('all blocks have been drawn but for...', orphanedBlocks);
        vertigo()
      });
    }, 200);
  }

  function vertigo() {
    console.log('vertigo');
  }

</script>

<Layer bind:handle={ crawlLayer } >
  <EllipticalCollapse on:collapsed={ channeledLight } />
</Layer>