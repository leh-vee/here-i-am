<script>
  import { wordIndices, isFirstVerseWord } from '../stores/text.js';
</script>


<div class='controller'>
  <span class='back button'
    class:disabled="{ $isFirstVerseWord }" 
    on:click={ wordIndices.previousWord } >&#8406;</span>
  <span class='forward button'
    on:click={ wordIndices.nextWord } >&#8407;</span>
</div>

<style>
  .controller {
    position: absolute;
    bottom: 0;
    width: 100%;
    display: flex;
    z-index: 1;
  }

  .disabled {
    opacity: 0.5;
  }

  .controller .button {
    width: 50%;
    text-align: center;
    vertical-align: baseline;
    font-size: 5vw;
  }

</style>