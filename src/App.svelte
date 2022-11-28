<script>
  import { onMount } from 'svelte';
  import { wordIndices, currentWord, showVortex } from './store.js';
  import WordIllustrator from './lib/WordIllustrator.js';
  import StreetIllustrator from './lib/StreetIllustrator.js';

  let readerEl;
  let readerDimensions;
  let canvasEl;
  let ctx;

  let wordIllustrator;

  onMount(async () => {
    readerDimensions = readerEl.getBoundingClientRect();
	});

  $: if (canvasEl) {
    ctx = canvasEl.getContext('2d');
    wordIllustrator = new WordIllustrator(ctx);
  } 

  $: if ($showVortex) {
    const highParkAndHumberside = [ -79.466850201826219, 43.657227646269199 ];
    const vortexIllustrator = new StreetIllustrator(ctx, highParkAndHumberside);
    vortexIllustrator.drawBlocksFromNode(13465772);
    setTimeout(() => {
      vortexIllustrator.renderSpiralBySteps();
    }, 10000);
  } else if (wordIllustrator && $currentWord) {
    wordIllustrator.wordDrop($currentWord);
  }

  // function animateEllipsis(currentStep = 1, stepCount = 3) {
  //   if (currentStep <= stepCount) {
  //     setTimeout(() => {
  //       wordIndices.nextWord()
  //       animateEllipsis(currentStep + 1)
  //     }, 5000)
  //   } else {
  //     ellipsisMode.set(false);
  //   }
  // }

</script>

<div class='reader' bind:this={readerEl}>
  <div class='word-control previous' on:click={ wordIndices.previousWord }></div>
  <div class='word-control next' on:click={ wordIndices.nextWord }></div>
  {#if readerDimensions}
    <canvas
      bind:this={canvasEl}
      width={readerDimensions.width}
      height={readerDimensions.height}
    ></canvas>
  {/if}
</div>

<style>
  .reader {
    width: 100%;
    height: 100%;
    display: flex;
		flex-direction: column;
    text-align: center;
  }

  .word-control {
    position: absolute;
    height: 100%;
    width: 50%;
    font-size: 50px;
  }

  .next {
    right: 0;
  }
</style>