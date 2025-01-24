<script>
  import EllipsisDot from "./EllipsisDot.svelte";
  import { verseState, isVerseMapReaveled, isRemembering, isEllipsisLit } from '../stores/verseState';
  import { hasTappedEllipsis, screenWidth, screenHeight } from "../stores/base";
  import { Rect } from "svelte-konva";

  const piFractionSecs = (Math.PI - 3) * 1000;
  const showDots = [false, false, false];
  const lightDots = [false, false, false]; 
  $: hitAreaX = $screenWidth / 2;
  $: hitAreaY = $screenHeight / 2;
  let hitAreaWidth = 0;
  let hitAreaHeight = 0;

  let vanishAway = false;
  
  function setHitBoxParams(e) {
    const params = e.detail;
    hitAreaWidth = params.width;
    hitAreaHeight = params.height;
    hitAreaY += params.height / 2.5;
  }

  $: if ($isRemembering) setTimeout(slowReveal, piFractionSecs);

  function slowReveal() {
    const nDots = showDots.length;
    const revealDot = (i) => {
      showDots[i] = true;
      if (i < nDots - 1) {
        setTimeout(() => { revealDot(i + 1) }, 1000);
      } else { 
        setTimeout(() => { verseState.set('ellipsisRevealed') }, piFractionSecs);
      }
    }
    revealDot(0);
  }  

  $: if ($isVerseMapReaveled) setTimeout(slowLight, piFractionSecs);

  function slowLight() {
    const nDotsToLight = lightDots.length;
    const lightDot = (i) => {
      lightDots[i] = true;
      if (i < nDotsToLight - 1) {
        setTimeout(() => { lightDot(i + 1) }, 1000);
      } else { 
        setTimeout(() => { verseState.set('ellipsisLit') }, 1000);
      }
    }
    lightDot(0);
  }

  function click() {
    if ($isEllipsisLit) {
      vanishAway = true;
      if (!$hasTappedEllipsis) $hasTappedEllipsis = true;
    } 
  }

</script>

{#each showDots as showDot, i (i)}
  <EllipsisDot 
    dotIndex={i} 
    show={ showDot }
    light={ lightDots[i] }
    isVanishing={ vanishAway }
    on:ellipsis-rect={ setHitBoxParams }
  />
{/each}

<Rect config={{ 
  x: hitAreaX, 
  y: hitAreaY,
  offsetX: hitAreaWidth / 2,
  offsetY: hitAreaHeight / 2, 
  width: hitAreaWidth,
  height: hitAreaHeight,
  fill: 'white',
  opacity: 0
}} on:pointerclick={ click } />