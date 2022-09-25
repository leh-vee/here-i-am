<script>
  import { currentVerse, wordIndices } from '../store.js';

  export let verseLine;

  $: currentLine = $wordIndices.line;
  $: currentWordIndex = $wordIndices.wordIndex;
</script>

<div class='line'>
  {#each $currentVerse[verseLine] as word, i}
    <span
      class:selected="{currentLine == verseLine && currentWordIndex == i}" 
      class='marker'>
    </span>
  {/each}
</div>

<style>
  .marker {
    background-color: black;
    opacity: 0.3;
    border-radius: 50%;
    display: inline-block;
    margin: 0 4px;
    height: 10px;
    width: 10px;
  }

  .marker.selected {
    opacity: 0.7;
  }
</style>