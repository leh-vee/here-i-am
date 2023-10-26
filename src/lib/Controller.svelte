<script>
  import { wordIndices, isFirstVerseWord, isLastVerseWord } from '../stores/text.js';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  function next() {
    if ($isLastVerseWord) {
      dispatch('coda');
    } else {
      wordIndices.nextWord();
    }
  }
</script>


<div class='controller'>
  <span class='back button'
    class:disabled="{ $isFirstVerseWord }" 
    on:click={ wordIndices.previousWord } ></span>
  <span class='forward button'
    on:click={ next } ></span>
</div>

<style>
  .controller {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 25%;
    display: flex;
    z-index: 1;
  }

  .controller .button {
    width: 50%;
    text-align: center;
    vertical-align: baseline;
    font-size: 5vw;
  }

</style>