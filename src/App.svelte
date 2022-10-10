<script>
  import { onMount } from 'svelte';
  import Word from "./lib/Word.svelte";
  import VertigoMap from './lib/VertigoMap.svelte';
  import VerseMap from "./lib/VerseMap.svelte";
  import { wordIndices, ellipsisMode } from './store.js';

  let el;
  let elDimensions;

  onMount(async () => {
		ellipsisMode.set(true);

    elDimensions = el.getBoundingClientRect();
    inVertigo = true;
	});

  function animateEllipsis(currentStep = 1, stepCount = 3) {
    if (currentStep <= stepCount) {
      setTimeout(() => {
        wordIndices.nextWord()
        animateEllipsis(currentStep + 1)
      }, 1000)
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

<div class='reader' bind:this={el}>  
    {#if inVertigo}
      <VertigoMap mapWidth={elDimensions.width} mapHeight={elDimensions.height} />
    {:else}
      <div class='word-control previous' on:click={ () => {shiftWord(false)} }></div>
      <div class='word-control next' on:click={ () => {shiftWord()} }></div>
      <div class='magnifier'>
        <Word />
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
    height: 80%;
    height: 100px;
  }
</style>