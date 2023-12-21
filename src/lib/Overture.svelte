<script>
  import { Layer, Circle, Ring } from 'svelte-konva';
  import Konva from 'konva';
  import StreetPainter from './StreetPainter.js';
  import { sefirotPoints } from '../stores/treeOfLife.js';
  import { groundZeroBlocks, groundZeroProjection } from '../stores/treeOfLife.js';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  export let startCollapse = true;
  let isCollapsed = false;
  let isCountdownComplete = false;

  const ellipsisStopAttrs = {
    radius: 5,
    opacity: Math.PI / 10,  
    fill: 'dimgrey'
  }

  const ellipsisStopDelta = ellipsisStopAttrs.radius * 3;
  const yCentre = window.innerHeight / 2;
  const xCentre = window.innerWidth / 2;
  const circumradius = Math.hypot(xCentre, yCentre); 

  const ellipsisStops = new Array(3);

  let iris;

  $: if (ellipsisStops[0]) {
    incomingTextAnime();
  }

  $: if (isCountdownComplete && startCollapse) {
    collapseAnime();
  }
  
  function incomingTextAnime() {
    const t = Math.PI / 10;
    const fadeIn = (index) => {
      ellipsisStops[index].to({
        opacity: 1,
        duration: t,
        onFinish: () => {
          if (!isCollapsed) { fadeOut(index) };
        }
      });
    }

    const fadeOut = (index) => {
      ellipsisStops[index].to({
        opacity: ellipsisStopAttrs.opacity,
        duration: t,
        onFinish: () => {
          if (index < ellipsisStops.length - 1) {
            fadeIn(index + 1);
          } else {
            fadeIn(0);
          }
        }
      });
    }
    fadeIn(0);
    setTimeout(() => { 
      isCountdownComplete = true;
    }, Math.PI * 1000);
  }

  function collapseAnime() {
    const animeAttrs = {
      x: xCentre,
      duration: Math.PI,
      easing: Konva.Easings.StrongEaseIn
    }
    ellipsisStops[0].to(animeAttrs);
    ellipsisStops[2].to({
      ...animeAttrs,
      onFinish: () => { 
        ellipsisStops.forEach((stop, i) => {
          if (i === 0) {
            stop.to({
              duration: Math.PI / 10,
              opacity: 1,
              fill: 'gold',
              onFinish: () => { isCollapsed = true }
            });
          } else {
            stop.hide();
          }
        });
      }
    });
  }

  let crawlLayer;

  $: if (isCollapsed) {
    const crawlLayerCanvas = crawlLayer.getCanvas();
    const crawler = new StreetPainter(crawlLayerCanvas, $groundZeroProjection, $groundZeroBlocks);
    const groundZeroSefirahId = $sefirotPoints.features[0].id;
    crawler.drawBlocksFromNode(groundZeroSefirahId).then(orphanedBlocks => {
      console.log('all blocks have been drawn but for...', orphanedBlocks);
      fadeRaysOut();
    });
  } 

  function fadeRaysOut() {
    iris.to({
      duration: Math.PI,
      opacity: 1,
      onFinish: () => { goNova() }
    });
  }

  function goNova() {
    iris.to({
      duration: Math.PI,
      innerRadius: 0,
      onFinish: () => {
        dispatch('allBlocksCrawled');
      }
    });
  }

</script>

<Layer>
  <Circle config={{ 
    x: xCentre - ellipsisStopDelta,
    y: yCentre,
    ...ellipsisStopAttrs
  }} bind:handle={ellipsisStops[0]} />
  <Circle config={{ 
    x: xCentre,
    y: yCentre,
    ...ellipsisStopAttrs
  }} bind:handle={ellipsisStops[1]} />
  <Circle config={{ 
    x: xCentre + ellipsisStopDelta,
    y: yCentre,
    ...ellipsisStopAttrs
  }} bind:handle={ellipsisStops[2]} />
</Layer>
<Layer bind:handle={crawlLayer} />
<Layer>
  <Ring config={{ 
    x: xCentre,
    y: yCentre,
    innerRadius: ellipsisStopAttrs.radius,
    outerRadius: circumradius,
    fill: 'black',
    strokeEnabled: false,
    opacity: 0
  }} bind:handle={iris} />
</Layer>
