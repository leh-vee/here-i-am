<script>
  import { Circle } from 'svelte-konva';
  import Konva from 'konva';
  import { isDataInitialized, screenWidth, screenHeight } from '../stores/base';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  const radius = 5;
  
  let isCollapsed = false;
  let isCountdownComplete = false;

  const ellipsisStopAttrs = {
    radius,
    opacity: Math.PI / 10,  
    fill: 'black',
    strokeEnabled: false
  }

  const ellipsisStopDelta = ellipsisStopAttrs.radius * 3;
  $: yCentre = $screenHeight / 2;
  $: xCentre = $screenWidth / 2;

  const ellipsisStops = new Array(3);

  $: if (ellipsisStops[0]) {
    fadeInEllipsis()
    incomingTextAnime();
  }

  $: if (isCountdownComplete && $isDataInitialized) {
    collapseAnime();
  }

  function fadeInEllipsis() {
    ellipsisStops.forEach((stop, i) => {
      stop.to({
        duration: Math.PI,
        fill: 'dimgrey'
      });
    });
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
    }, 10000);
  }

  function collapseAnime() {
    const animeAttrs = {
      x: xCentre,
      duration: 2,
      easing: Konva.Easings.StrongEaseIn
    }
    ellipsisStops[0].to(animeAttrs);
    ellipsisStops[2].to({
      ...animeAttrs,
      onFinish: () => {
        isCollapsed = true;
        singularityFinale();
      }
    });
  }

  function singularityFinale() {
    ellipsisStops.forEach((stop, i) => {
      if (i === 1) {
        stop.to({
          duration: 1,
          fill: 'gold',
          onFinish: () => {
            dispatch('collapsed', ellipsisStops[1]);
          }
        });
      } else {
        stop.hide();
      }
    });
  }
</script>

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