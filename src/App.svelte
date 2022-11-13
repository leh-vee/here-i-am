<script>
  import { onMount } from 'svelte';
  import Word from "./lib/Word.svelte";
  import VertigoMap from './lib/VertigoMap.svelte';
  import VerseMap from "./lib/VerseMap.svelte";
  import { wordIndices, ellipsisMode } from './store.js';

  let readerEl;
  let readerDimensions = null;

  onMount(async () => {
		ellipsisMode.set(true);
    readerDimensions = readerEl.getBoundingClientRect();
    inVertigo = false;
	});

  function animateEllipsis(currentStep = 1, stepCount = 3) {
    if (currentStep <= stepCount) {
      setTimeout(() => {
        wordIndices.nextWord()
        animateEllipsis(currentStep + 1)
      }, 5000)
    } else {
      ellipsisMode.set(false);
    }
  }

  function shiftWord(next=true) {
    if (!$ellipsisMode) {
      if (next) {
        wordIndices.nextWord();
      } else {
        wordIndices.previousWord();
      }
    } 
  }

  $: if ($ellipsisMode) {
		animateEllipsis();
	}

  let inVertigo = false;
</script>

<div class='reader' bind:this={readerEl}>
  {#if inVertigo}
    <VertigoMap mapWidth={readerDimensions.width} mapHeight={readerDimensions.height} />
  {:else}
    <div class='word-control previous' on:click={ () => {shiftWord(false)} }></div>
    <div class='word-control next' on:click={ () => {shiftWord()} }></div>
    
    <div class='magnifier'>
      {#if readerDimensions !== null}  
        <Word canvasWidth={readerDimensions.width} canvasHeight={readerDimensions.height} />
      {/if}
    </div>
    <div class='verse-map'>
      <VerseMap />
    </div>
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
  
  .magnifier {
    flex-grow: 1;
  } 

  .verse-map {
    margin: 10px auto;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
  }
</style>