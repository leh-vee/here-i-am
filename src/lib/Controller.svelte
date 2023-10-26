<script>
  import { wordIndices, isFirstVerseWord } from '../stores/text.js';
</script>


<div class='controller'>
  <span class='back button'
    class:disabled="{ $isFirstVerseWord }" 
    on:click={ wordIndices.previousWord } ></span>
  <span class='forward button'
    on:click={ wordIndices.nextWord } ></span>
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