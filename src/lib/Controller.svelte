<script>
    import { wordIndices, isFirstVerseWord } from '../stores/text.js';
</script>

<div class='controller'>
  <span class='back button'
    class:disabled="{ $isFirstVerseWord }" 
    on:click={ wordIndices.previousWord } >&#9756;</span>
  <span class='forward button'
    on:click={ wordIndices.nextWord } >&#9758;</span>
</div>

<style>
  .controller {
    position: absolute;
    bottom: 0;
    height: 35%;
    width: 100%;
    display: flex;
    z-index: 1;
  }

  .disabled {
    opacity: 0.5;
  }

  .controller .button {
    width: 50vw;
    height: 50vw;
    text-align: center;
    vertical-align: baseline;
    font-size: 40vw;
    border-radius: 50%;
  }

</style>